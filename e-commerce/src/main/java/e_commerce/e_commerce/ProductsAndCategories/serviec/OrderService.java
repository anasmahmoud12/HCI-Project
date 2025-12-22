package e_commerce.e_commerce.ProductsAndCategories.serviec;

import e_commerce.e_commerce.ProductsAndCategories.DTO.OrderDto;
import e_commerce.e_commerce.ProductsAndCategories.Entities.OrderEntity;
import e_commerce.e_commerce.ProductsAndCategories.Entities.OrderItemEntity;
import e_commerce.e_commerce.ProductsAndCategories.Entities.ProductEntity;
import e_commerce.e_commerce.ProductsAndCategories.Repositories.OrderRepository;
import e_commerce.e_commerce.ProductsAndCategories.Repositories.PaymentRepository;
import e_commerce.e_commerce.ProductsAndCategories.Repositories.ProductRepository;
import e_commerce.e_commerce.ProductsAndCategories.serviec.Mapper.OrderMapper;
import e_commerce.e_commerce.utils.Entities.User;
import e_commerce.e_commerce.utils.Repasitories.UserRepository;
//import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PaymentRepository paymentRepository;

    @Transactional
    public OrderEntity createOrder(Long userId, OrderDto orderDto) {
        // 1. Validate user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // 2. Create order entity using mapper
        OrderEntity order = OrderMapper.toEntity(orderDto, user);

        // 3. Validate products and create order items
        List<OrderItemEntity> orderItems = new ArrayList<>();
        double calculatedTotal = 0.0;

        for (OrderDto.OrderItemRequest itemRequest : orderDto.getItems()) {
            // Get product from database
            ProductEntity product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found with id: " + itemRequest.getProductId()));

            // Check stock availability
            if (product.getStock_quantity() < itemRequest.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName() +
                        ". Available: " + product.getStock_quantity() +
                        ", Requested: " + itemRequest.getQuantity());
            }

            // Update product stock
            product.setStock_quantity(product.getStock_quantity() - itemRequest.getQuantity());
            productRepository.save(product);

            // Create order item using mapper
            OrderItemEntity orderItem = OrderMapper.toOrderItemEntity(itemRequest, product, order);
            orderItems.add(orderItem);

            // Add to calculated total
            calculatedTotal += itemRequest.getTotalPrice();
        }

        // 4. Set order items and validate total price
        order.setOrderItems(orderItems);

        // Optional: Validate frontend total matches calculated total
        if (Math.abs(calculatedTotal - orderDto.getTotalPriceOfOrder()) > 0.01) {
            throw new RuntimeException("Total price mismatch. Calculated: " + calculatedTotal +
                    ", Received: " + orderDto.getTotalPriceOfOrder());
        }

        order.setTotalPrice(calculatedTotal);

        // 5. Save order
        if ("COD".equalsIgnoreCase(orderDto.getPayment())) {
            order.setPaymentStatus("PENDING");
            order.setStatus("PENDING_PAYMENT");
        } else if ("PAYPAL".equalsIgnoreCase(orderDto.getPayment())) {
            order.setPaymentStatus("PENDING");
            order.setStatus("PENDING_PAYMENT");
        } else {
            order.setPaymentStatus("PENDING");
            order.setStatus("PENDING");
        }
        return orderRepository.save(order);
    }
    @Transactional
    public OrderEntity updateOrderPaymentStatus(Long orderId, String paymentId, String payerId, boolean isSuccess) {
        OrderEntity order = getOrderById(orderId);

        if (isSuccess) {
            order.setPaymentStatus("COMPLETED");
            order.setStatus("PROCESSING");
            order.setPaymentId(paymentId);
            order.setPayerId(payerId);
            order.setPaymentDate(LocalDateTime.now());

            // No need to restore stock here since it was already reserved
        } else {
            order.setPaymentStatus("FAILED");
            order.setStatus("PAYMENT_FAILED");

            // Restore product stock if payment failed
            restoreStock(order);
        }

        return orderRepository.save(order);
    }
    private void restoreStock(OrderEntity order) {
        for (OrderItemEntity orderItem : order.getOrderItems()) {
            ProductEntity product = orderItem.getProduct();
            product.setStock_quantity(product.getStock_quantity() + orderItem.getQuantity());
            productRepository.save(product);
        }
    }

    // Get all orders for a user
    @Transactional(readOnly = true)

    public List<OrderEntity> getUserOrders(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        return orderRepository.findByUserOrderByCreatedAtDesc(user);
    }

    // Get single order by ID (with user validation)
    @Transactional(readOnly = true)

    public OrderEntity getOrderById(Long orderId, Long userId) {
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
System.out.println("aaa");
        System.out.println(userId);
        System.out.println(orderId);
        // Validate that the order belongs to the user
        if (!order.getUser().getId().equals(userId)) {
            System.out.println("---");
            throw new RuntimeException("Unauthorized access to order");
        }

        return order;
    }
    @Transactional(readOnly = true)

    public OrderEntity getOrderById(Long orderId) {
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
        return order;
    }


    // Cancel order (change status)
    @Transactional
    public OrderEntity cancelOrder(Long orderId, Long userId) {
        OrderEntity order = getOrderById(orderId, userId);

        // Only allow cancellation if order is still pending
        if (!"PENDING".equals(order.getStatus())&& !"PENDING_PAYMENT".equals(order.getStatus())) {
            throw new RuntimeException("Cannot cancel order with status: " + order.getStatus());
        }

        // Restore product stock
        for (OrderItemEntity orderItem : order.getOrderItems()) {
            ProductEntity product = orderItem.getProduct();
            product.setStock_quantity(product.getStock_quantity() + orderItem.getQuantity());
            productRepository.save(product);
        }

        order.setStatus("CANCELLED");
        order.setPaymentStatus("CANCELLED");

        return orderRepository.save(order);
    }

    @Transactional
    public List<OrderEntity> getAllOrdersAdmin() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public OrderEntity updateOrderStatus(Long orderId, String status) {
        OrderEntity order = getOrderById(orderId);
//
//        // Validate status
//        validateOrderStatus(status);
//
//        // Update status
//        order.setStatus(status);
//
//        // If status is COMPLETED and payment was COD, mark payment as completed
//        if ("COMPLETED".equals(status) && "COD".equalsIgnoreCase(order.getPaymentMethod())) {
//            order.setPaymentStatus("COMPLETED");
//            order.setPaymentDate(LocalDateTime.now());
//        }
//
//        return orderRepository.save(order);
        validateOrderStatus(status);

        // Check if order can be updated (prevent updating completed/cancelled orders)
        if ("COMPLETED".equals(order.getStatus()) || "CANCELLED".equals(order.getStatus())) {
            throw new RuntimeException("Cannot update order with status: " + order.getStatus());
        }

        // Update status
        order.setStatus(status);

        // If status is COMPLETED and payment was COD, mark payment as completed
        if ("COMPLETED".equals(status) && "COD".equalsIgnoreCase(order.getPaymentMethod())) {
            order.setPaymentStatus("COMPLETED");
            order.setPaymentDate(LocalDateTime.now());
        }

        // If status is CANCELLED, restore stock and update payment status
        if ("CANCELLED".equals(status)) {
            restoreStock(order);
            order.setPaymentStatus("CANCELLED");
        }

        // If status is DELIVERED, automatically mark as COMPLETED
        if ("DELIVERED".equals(status)) {
            order.setStatus("COMPLETED");
            if ("COD".equalsIgnoreCase(order.getPaymentMethod())) {
                order.setPaymentStatus("COMPLETED");
                order.setPaymentDate(LocalDateTime.now());
            }
        }

        return orderRepository.save(order);
    }

    private void validateOrderStatus(String status) {
        List<String> validStatuses = Arrays.asList(
                "PENDING", "PENDING_PAYMENT", "PROCESSING", "SHIPPED",
                "DELIVERED", "COMPLETED", "CANCELLED", "PAYMENT_FAILED"
        );

        if (!validStatuses.contains(status.toUpperCase())) {
            throw new RuntimeException("Invalid order status: " + status);
        }
    }
    @Transactional
    public void deleteOrder(Long orderId) {
        OrderEntity order = getOrderById(orderId);

        if (!"CANCELLED".equals(order.getStatus())) {
            throw new RuntimeException("Can only delete cancelled orders");
        }

        orderRepository.delete(order);
    }


}