package e_commerce.e_commerce.ProductsAndCategories.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderResponseDTO {
    private Long id;
    private String orderNumber;
    private BigDecimal totalPrice;
    private String status;
    private LocalDateTime createdAt;
    private List<OrderItemResponseDTO> orderItems;
    private UserBasicDTO user;
private String payment;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class OrderItemResponseDTO {
        private Long id;
        private Integer quantity;
        private BigDecimal price;
        private BigDecimal totalPrice;
        private ProductBasicDTO product;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class ProductBasicDTO {
        private Long id;
        private String name;
        private String description;
        private Double priceBefore;
        private Double priceAfter;
        // Add image URL if you have it
        // private String imageUrl;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class UserBasicDTO {
        private Long id;
        private String firstName;
        private String email;
    }
}