package e_commerce.e_commerce.ProductsAndCategories.serviec.Mapper;

import e_commerce.e_commerce.ProductsAndCategories.DTO.ProductDto;
import e_commerce.e_commerce.ProductsAndCategories.Entities.CategoryEntity;
import e_commerce.e_commerce.ProductsAndCategories.Entities.ProductEntity;
import e_commerce.e_commerce.ProductsAndCategories.Repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProductMapper {
    @Autowired
    CategoryRepository categoryRepository;
    public ProductEntity convertToEntity(ProductDto dto) {

        CategoryEntity categoryEntity =categoryRepository.findById(dto.getId()).orElse(null);

        return  ProductEntity.builder()
                .id(dto.getId())
                .name(dto.getName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .img(dto.getImg())
                .quantity(dto.getQuantity())
                .updated_At(dto.getUpdated_At())
                .category(categoryEntity )
                .build();

    }
    public ProductDto convertToDto(ProductEntity entity) {

        return  ProductDto.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .price(entity.getPrice())
                .img(entity.getImg())
                .quantity(entity.getQuantity())
                .updated_At(entity.getUpdated_At())
                .categoryId( entity.getId() )
                .build();

    }
}
