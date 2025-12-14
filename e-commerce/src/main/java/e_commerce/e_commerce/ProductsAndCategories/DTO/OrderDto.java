package e_commerce.e_commerce.ProductsAndCategories.DTO;

import java.util.List;

import lombok.Data;

@Data
public class OrderDto {

    private Long addressId; //address for shipment we make the user selcet form its old address 
    private String paymentMethod;
    private List<OrderItemRequest> items;

    @Data
    public static class OrderItemRequest {
        private Long productId;
        private Integer quantity;
        private double priceOfOne;
        private String color;
        private Integer size;
        private double totalPrice;
    }

}
