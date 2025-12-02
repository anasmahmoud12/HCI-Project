package e_commerce.e_commerce.ProductsAndCategories.serviec.Mapper;

import e_commerce.e_commerce.ProductsAndCategories.DTO.productImageDto;
import e_commerce.e_commerce.ProductsAndCategories.Entities.Product_imagesEntity;
import e_commerce.e_commerce.ProductsAndCategories.Entities.ProductEntity;
import e_commerce.e_commerce.ProductsAndCategories.Repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProductImageMapper {

    @Autowired
    private ProductRepository productRepository;

    public Product_imagesEntity convertToEntity(productImageDto dto) {
        return Product_imagesEntity.builder()
                .id(dto.getId())
                .img(dto.getImg())
                .is_primary(dto.getIs_primary())
                .display_order(dto.getDisplay_order())
                .build();
    }

    public productImageDto convertToDto(Product_imagesEntity entity) {
        Long productId = null;
        if (entity.getProduct() != null) {
            productId = entity.getProduct().getId();
        }

        return productImageDto.builder()
                .id(entity.getId())
                .img(entity.getImg())
                .is_primary(entity.getIs_primary())
                .display_order(entity.getDisplay_order())
                .productid(productId)
                .build();
    }
}