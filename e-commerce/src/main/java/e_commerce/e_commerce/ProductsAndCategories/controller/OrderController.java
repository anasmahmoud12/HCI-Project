package e_commerce.e_commerce.ProductsAndCategories.controller;

import e_commerce.e_commerce.ProductsAndCategories.DTO.OrderDto;
import e_commerce.e_commerce.ProductsAndCategories.DTO.OrderResponseDTO;
import e_commerce.e_commerce.ProductsAndCategories.Entities.OrderEntity;
import e_commerce.e_commerce.ProductsAndCategories.serviec.Mapper.OrderMapper;
import e_commerce.e_commerce.ProductsAndCategories.serviec.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // Place new order
    @PostMapping("/{userId}")
    public ResponseEntity<?> placeOrder(
            @PathVariable Long userId,
            @RequestBody OrderDto orderRequest) {

        try {
            OrderEntity newOrder = orderService.createOrder(userId, orderRequest);
            OrderResponseDTO responseDto = OrderMapper.toResponseDto(newOrder);
            return ResponseEntity.ok(responseDto);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get all orders for a user - NOW RETURNS FULL PRODUCT DETAILS
    @GetMapping("/user/{userId}")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getUserOrders(@PathVariable Long userId) {
        try {
            List<OrderEntity> orders = orderService.getUserOrders(userId);
            List<OrderResponseDTO> orderDtos = orders.stream()
                    .map(OrderMapper::toResponseDto)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(orderDtos);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get single order by ID - NOW RETURNS FULL PRODUCT DETAILS
    @GetMapping("/{orderId}/user/{userId}")
    public ResponseEntity<?> getOrderById(
            @PathVariable Long orderId,
            @PathVariable Long userId) {
        try {
            OrderEntity order = orderService.getOrderById(orderId, userId);
            OrderResponseDTO orderDto = OrderMapper.toResponseDto(order);
            return ResponseEntity.ok(orderDto);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

       @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<?> getAllOrdersAdmin() {
        try {
            List<OrderEntity> orders = orderService.getAllOrdersAdmin();
            List<OrderResponseDTO> orderDtos = orders.stream()
                    .map(OrderMapper::toResponseDto)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(orderDtos);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    // Cancel an order
    @PutMapping("/{orderId}/cancel/user/{userId}")
    public ResponseEntity<?> cancelOrder(
            @PathVariable Long orderId,
            @PathVariable Long userId) {
        try {
            OrderEntity cancelledOrder = orderService.cancelOrder(orderId, userId);
            OrderResponseDTO orderDto = OrderMapper.toResponseDto(cancelledOrder);
            return ResponseEntity.ok(orderDto);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}