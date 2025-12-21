package e_commerce.e_commerce.ProductsAndCategories.DTO;

// SearchResultDto.java

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SearchResultDto {
    private String query;
    private List<ProductDto> products;
    private List<CategoryDto> categories;
}