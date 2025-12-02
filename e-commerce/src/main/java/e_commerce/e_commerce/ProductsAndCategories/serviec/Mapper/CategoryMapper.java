package e_commerce.e_commerce.ProductsAndCategories.serviec.Mapper;

import e_commerce.e_commerce.ProductsAndCategories.Entities.CategoryEntity;
import e_commerce.e_commerce.ProductsAndCategories.DTO.CategoryDto;
import e_commerce.e_commerce.ProductsAndCategories.Repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class CategoryMapper {
    @Autowired
    CategoryRepository categoryRepository;
    public  CategoryEntity convertToEntity(CategoryDto dto){
        return CategoryEntity.builder()
                .id(dto.getId())
                .name(dto.getName())
                .description(dto.getDescription())
                .isactive(dto.getIsactive())
                .img(dto.getImg())
                .created_At(dto.getCreated_At() != null ? dto.getCreated_At() : LocalDateTime.now())
                .update_At(dto.getUpdate_At())
                .build();
    }


    public  CategoryDto convertToDto(CategoryEntity entity){
        return CategoryDto.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .isactive(entity.getIsactive())
                .img(entity.getImg())
                .created_At(entity.getCreated_At())
                .Update_At(entity.getUpdate_At())
                .build();
    }

}
