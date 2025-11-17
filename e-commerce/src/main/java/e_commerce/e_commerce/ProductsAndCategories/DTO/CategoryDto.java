package e_commerce.e_commerce.ProductsAndCategories.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CategoryDto {
    private  Long id;
    private String name;
    private  String description;
    private LocalDateTime created_At;
    private LocalDateTime Update_At;
    private List<ProductDto> products;
}
