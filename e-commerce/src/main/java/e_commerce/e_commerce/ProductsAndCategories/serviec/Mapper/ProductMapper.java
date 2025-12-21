package e_commerce.e_commerce.ProductsAndCategories.serviec.Mapper;

import e_commerce.e_commerce.ProductsAndCategories.DTO.ProductDto;
import e_commerce.e_commerce.ProductsAndCategories.DTO.productImageDto;
import e_commerce.e_commerce.ProductsAndCategories.Entities.CategoryEntity;
import e_commerce.e_commerce.ProductsAndCategories.Entities.ProductEntity;
import e_commerce.e_commerce.ProductsAndCategories.Entities.Product_imagesEntity;
import e_commerce.e_commerce.ProductsAndCategories.Repositories.CategoryRepository;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProductMapper {
    @Autowired
    CategoryRepository categoryRepository;
      @Autowired
    ProductImageMapper productImageMapper;

    public ProductEntity convertToEntity(ProductDto dto) {

//        CategoryEntity categoryEntity =categoryRepository.findById(dto.getId()).orElse(null);
        CategoryEntity categoryEntity = null;
        if (dto.getCategoryId() != null) {
            categoryEntity = categoryRepository.findById(dto.getCategoryId()).orElse(null);
        }
        return  ProductEntity.builder()
                .id(dto.getId())
                .name(dto.getName())
                .description(dto.getDescription())
                .created_At(dto.getCreated_At())
                .updated_At(dto.getUpdated_At())
                .priceBefore(dto.getPriceBefore())
                .priceAfter(dto.getPriceAfter())
                .stock_quantity(dto.getStock_quantity())
                .category(categoryEntity)
                .build();

    }
    public ProductDto convertToDto(ProductEntity entity) {
        Long categoryId = null;
        if (entity.getCategory() != null) {
            categoryId = entity.getCategory().getId();
        }
                List<productImageDto> productImageDtos = new ArrayList<>();
        if (entity.getProductImages() != null && !entity.getProductImages().isEmpty()) {
            System.out.println("...");
            for (Product_imagesEntity imageEntity : entity.getProductImages()) {
                productImageDtos.add(productImageMapper.convertToDto(imageEntity));
            }
        }
        return  ProductDto.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .created_At(entity.getCreated_At())
                .updated_At(entity.getUpdated_At())
                .priceBefore(entity.getPriceBefore())
                .priceAfter(entity.getPriceAfter())
                .stock_quantity(entity.getStock_quantity())
                .categoryId(categoryId)
                .productImages(productImageDtos)
                .build();

    }
}
