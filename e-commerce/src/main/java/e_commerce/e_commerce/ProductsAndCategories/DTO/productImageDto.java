package e_commerce.e_commerce.ProductsAndCategories.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class productImageDto {
    private  Long id;
    private byte[]img;
    private Boolean is_primary;
    private Long display_order;
    private  Long productid;
}