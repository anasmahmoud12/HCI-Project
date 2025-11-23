package e_commerce.e_commerce.ProductsAndCategories.DTO;

import lombok.Data;
import java.util.List;

@Data
public class OrderDto {

    private Long addressId; //address for shipment
    private String paymentMethod;
    private List<OrderItemRequest> items;

    @Data
    public static class OrderItemRequest {
        private Long productId;
        private Integer quantity;
        private String color;
        private Integer size;
    }

}
