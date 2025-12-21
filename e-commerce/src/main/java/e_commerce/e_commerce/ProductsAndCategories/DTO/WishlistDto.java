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
public class WishlistDto {
    private Long id;
    private Long userId;
    private ProductDto product;
    private LocalDateTime addedAt;
}