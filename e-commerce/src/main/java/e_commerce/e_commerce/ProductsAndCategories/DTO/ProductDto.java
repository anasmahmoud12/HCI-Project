package e_commerce.e_commerce.ProductsAndCategories.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductDto {
    private  Long id;
    private String name;
    private  String description;

    private LocalDateTime created_At;
    private LocalDateTime updated_At;

    private double price ;
    private  int quantity;
    private byte[]img;
//this as those not entities
//    we put here id

    private Long categoryId;
}
