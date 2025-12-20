package e_commerce.e_commerce.ProductsAndCategories.serviec;

import e_commerce.e_commerce.ProductsAndCategories.Entities.CategoryEntity;
import e_commerce.e_commerce.ProductsAndCategories.DTO.CategoryDto;
import e_commerce.e_commerce.ProductsAndCategories.Repositories.CategoryRepository;
import e_commerce.e_commerce.ProductsAndCategories.serviec.Mapper.CategoryMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

//any update on list of products of catagory be in products not here
//we donot make catagory with list of products then we add
@Service
@Transactional

public class CategoryService {
    @Autowired
    private CategoryRepository catagoryRepository;
    @Autowired
    private CategoryMapper categoryMapper;

    //    public CategoryDto addCategory(CategoryDto catagory) {
//        CategoryEntity categoryEntity = categoryMapper.convertToEntity(catagory);
//        categoryEntity = catagoryRepository.save(categoryEntity);
//        catagory.setId(categoryEntity.getId());
//
//        return catagory;
//    }
    public CategoryDto addCategory(CategoryDto categoryDto) {
        CategoryEntity categoryEntity = categoryMapper.convertToEntity(categoryDto);

        // Set timestamps
        if (categoryEntity.getCreated_At() == null) {
            categoryEntity.setCreated_At(LocalDateTime.now());
        }
        categoryEntity.setUpdate_At(LocalDateTime.now());

        // Save
        categoryEntity = catagoryRepository.save(categoryEntity);

        // Return DTO with ID
        return categoryMapper.convertToDto(categoryEntity);
    }

    //    public CategoryDto updateCatagory(Long id, CategoryDto update) {
//        CategoryEntity c = catagoryRepository.findById(id).orElse(null);
//        if (c != null) {
//            c = categoryMapper.convertToEntity(update);
//            c.setUpdate_At(LocalDateTime.now());
//            update.setUpdate_At(LocalDateTime.now());
//            catagoryRepository.save(c);
//
//        }
//        return update;
//    }
    public CategoryDto updateCategory(Long id, CategoryDto updateDto, boolean remove_img) {
        // Find existing category
        CategoryEntity existingCategory = catagoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));

        // Update basic fields
        existingCategory.setName(updateDto.getName());
        existingCategory.setDescription(updateDto.getDescription());
        existingCategory.setIsactive(updateDto.getIsactive());

        // Handle image
        if (updateDto.getImg() != null) {
            // If img is null in DTO, remove the image
            existingCategory.setImg(updateDto.getImg());
        } else if (remove_img) {
            // If img has bytes, update with new image
            existingCategory.setImg(null);
        }


        // If img is not provided in DTO (empty), keep existing image

        // Update timestamp
        existingCategory.setUpdate_At(LocalDateTime.now());

        // Save
        existingCategory = catagoryRepository.save(existingCategory);

        // Return DTO
        return categoryMapper.convertToDto(existingCategory);
    }

    public void deleteById(Long id) {
        if (!catagoryRepository.existsById(id)) {
            throw new RuntimeException("Category not found with id: " + id);
        }
        catagoryRepository.deleteById(id);
    }

    public List<CategoryDto> getAllCategories() {
        List<CategoryEntity> categoryEntities = catagoryRepository.findAll();
//what this waring
        List<CategoryDto> categoryDtos = new ArrayList<CategoryDto>();
        for (CategoryEntity c : categoryEntities) {
            CategoryDto dto = categoryMapper.convertToDto(c);
            categoryDtos.add(dto);
        }
        return categoryDtos;
    }

    public CategoryDto getCategory(Long categoryId) {
//     this waring
        return categoryMapper.convertToDto(catagoryRepository.findById(categoryId).orElse(null));
    }


}
