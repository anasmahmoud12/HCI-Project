package e_commerce.e_commerce.ProductsAndCategories.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

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
    private Boolean isactive ;

    private MultipartFile imageFile;
    private byte[]img;

    private LocalDateTime created_At;
    private LocalDateTime Update_At;
    private List<ProductDto> products;
        private Integer productCount;

}
