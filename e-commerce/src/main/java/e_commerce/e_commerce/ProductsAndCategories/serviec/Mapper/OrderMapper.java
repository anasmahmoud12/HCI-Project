package e_commerce.e_commerce.ProductsAndCategories.serviec.Mapper;

import e_commerce.e_commerce.ProductsAndCategories.DTO.OrderDto;
import e_commerce.e_commerce.ProductsAndCategories.DTO.OrderResponseDTO;
import e_commerce.e_commerce.ProductsAndCategories.Entities.OrderEntity;
import e_commerce.e_commerce.ProductsAndCategories.Entities.OrderItemEntity;
import e_commerce.e_commerce.ProductsAndCategories.Entities.ProductEntity;
import e_commerce.e_commerce.utils.Entities.User;
import lombok.experimental.UtilityClass;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@UtilityClass
public class OrderMapper {

    public OrderEntity toEntity(OrderDto orderDto, User user) {
        return OrderEntity.builder()
                .user(user)
                .status(orderDto.getStatus() != null ? orderDto.getStatus() : "PENDING")
                .totalPrice(orderDto.getTotalPriceOfOrder())
                .createdAt(LocalDateTime.now())
                .orderNumber(generateOrderNumber())
                .payment(orderDto.getPayment())
                .build();
    }

    public OrderItemEntity toOrderItemEntity(OrderDto.OrderItemRequest itemRequest,
                                             ProductEntity product,
                                             OrderEntity order) {
        return OrderItemEntity.builder()
                .product(product)
                .quantity(itemRequest.getQuantity())
                .price(itemRequest.getPriceOfOne())
                .totalPrice(itemRequest.getTotalPrice())
                .order(order)
                .build();
    }

    public OrderDto toDto(OrderEntity order) {
        OrderDto dto = new OrderDto();
        dto.setStatus(order.getStatus());
        dto.setTotalPriceOfOrder(order.getTotalPrice());

        order.getOrderItems().forEach(orderItem -> {
            OrderDto.OrderItemRequest itemDto = new OrderDto.OrderItemRequest();
            itemDto.setProductId(orderItem.getProduct().getId());
            itemDto.setQuantity(orderItem.getQuantity());
            itemDto.setPriceOfOne(orderItem.getPrice());
            itemDto.setTotalPrice(orderItem.getTotalPrice());
            dto.getItems().add(itemDto);
        });

        return dto;
    }

    // NEW METHOD: Convert to detailed response DTO with full product information
    public OrderResponseDTO toResponseDto(OrderEntity order) {
        return OrderResponseDTO.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .totalPrice(BigDecimal.valueOf(order.getTotalPrice()))
                .status(order.getStatus())
                .createdAt(order.getCreatedAt())
                .orderItems(mapOrderItems(order.getOrderItems()))
                .user(mapUser(order.getUser()))
                .payment(order.getPayment())
                .build();
    }

    private List<OrderResponseDTO.OrderItemResponseDTO> mapOrderItems(List<OrderItemEntity> orderItems) {
        if (orderItems == null) {
            return new ArrayList<>();
        }

        return orderItems.stream()
                .map(item -> OrderResponseDTO.OrderItemResponseDTO.builder()
                        .id(item.getId())
                        .quantity(item.getQuantity())
                        .price(BigDecimal.valueOf(item.getPrice()))
                        .totalPrice(BigDecimal.valueOf(item.getTotalPrice()))
                        .product(mapProduct(item.getProduct()))
                        .build())
                .collect(Collectors.toList());
    }

    private OrderResponseDTO.ProductBasicDTO mapProduct(ProductEntity product) {
        return OrderResponseDTO.ProductBasicDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .priceBefore(product.getPriceBefore())
                .priceAfter(product.getPriceAfter())
                .build();
    }

    private OrderResponseDTO.UserBasicDTO mapUser(User user) {
        return OrderResponseDTO.UserBasicDTO.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .email(user.getEmail())
                .build();
    }

    private String generateOrderNumber() {
        return "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}