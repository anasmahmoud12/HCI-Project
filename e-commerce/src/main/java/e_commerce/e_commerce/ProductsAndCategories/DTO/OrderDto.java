package e_commerce.e_commerce.ProductsAndCategories.DTO;

import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
public class OrderDto {

    private String status; // when taken from frontend it by default pending
    private List<OrderItemRequest> items = new ArrayList<>(); // Initialize the list
    private double totalPriceOfOrder;

    @Data
    public static class OrderItemRequest {
        private Long productId;
        private Integer quantity;
        private double priceOfOne;
        private double totalPrice;
    }
}