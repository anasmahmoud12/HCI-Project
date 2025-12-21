package e_commerce.e_commerce.ProductsAndCategories.serviec;

import e_commerce.e_commerce.ProductsAndCategories.DTO.OrderDto;
import e_commerce.e_commerce.ProductsAndCategories.Entities.OrderEntity;
import e_commerce.e_commerce.ProductsAndCategories.Entities.OrderItemEntity;
import e_commerce.e_commerce.ProductsAndCategories.Entities.ProductEntity;
import e_commerce.e_commerce.ProductsAndCategories.Repositories.OrderRepository;
import e_commerce.e_commerce.ProductsAndCategories.Repositories.ProductRepository;
import e_commerce.e_commerce.ProductsAndCategories.serviec.Mapper.OrderMapper;
import e_commerce.e_commerce.utils.Entities.User;
import e_commerce.e_commerce.utils.Repasitories.UserRepository;
//import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        return orderRepository.save(order);
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

        // Validate that the order belongs to the user
        if (!order.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to order");
        }

        return order;
    }

    // Cancel order (change status)
    @Transactional
    public OrderEntity cancelOrder(Long orderId, Long userId) {
        OrderEntity order = getOrderById(orderId, userId);

        // Only allow cancellation if order is still pending
        if (!"PENDING".equals(order.getStatus())) {
            throw new RuntimeException("Cannot cancel order with status: " + order.getStatus());
        }

        // Restore product stock
        for (OrderItemEntity orderItem : order.getOrderItems()) {
            ProductEntity product = orderItem.getProduct();
            product.setStock_quantity(product.getStock_quantity() + orderItem.getQuantity());
            productRepository.save(product);
        }

        order.setStatus("CANCELLED");
        return orderRepository.save(order);
    }
    
    @Transactional
    public List<OrderEntity> getAllOrdersAdmin() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }
    @Transactional
    public OrderEntity updateOrderStatus(Long orderId, String status) {
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

        // Validate status
        validateOrderStatus(status);

        // Update status
        order.setStatus(status);

        return orderRepository.save(order);
    }

    private void validateOrderStatus(String status) {
        List<String> validStatuses = Arrays.asList(
                "PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "COMPLETED", "CANCELLED"
        );

        if (!validStatuses.contains(status.toUpperCase())) {
            throw new RuntimeException("Invalid order status: " + status);
        }
    }
}