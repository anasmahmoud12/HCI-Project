package e_commerce.e_commerce.ProductsAndCategories.serviec;

import e_commerce.e_commerce.ProductsAndCategories.Entities.CategoryEntity;
import e_commerce.e_commerce.ProductsAndCategories.DTO.CategoryDto;
import e_commerce.e_commerce.ProductsAndCategories.Repositories.CategoryRepository;
import e_commerce.e_commerce.ProductsAndCategories.serviec.Mapper.CategoryMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

//any update on list of products of catagory be in products not here
//we donot make catagory with list of products then we add
@Service
public class CategoryService  {
    @Autowired
    private CategoryRepository catagoryRepository;
    @Autowired
   private CategoryMapper categoryMapper;

 public     CategoryDto addCategory(CategoryDto catagory){
 CategoryEntity categoryEntity=categoryMapper.convertToEntity(catagory);
categoryEntity=catagoryRepository.save(categoryEntity);
catagory.setId(categoryEntity.getId());

        return catagory;
    }

    public CategoryDto updateCatagory(Long id ,CategoryDto update){
        CategoryEntity c =catagoryRepository.findById(id).orElse(null);
        if(c!=null){
           c= categoryMapper.convertToEntity(update);
           c.setUpdate_At(LocalDateTime.now());
           update.setUpdate_At(LocalDateTime.now());
            catagoryRepository.save(c);

        }
        return update;
    }

public  void   deleteById(Long id){
     catagoryRepository.deleteById(id);
}

public List<CategoryDto> getAllCategories(){
     List<CategoryEntity> categoryEntities=catagoryRepository.findAll();
//what this waring
     List<CategoryDto> categoryDtos =new ArrayList<CategoryDto>() ;
     for (CategoryEntity c:categoryEntities){
         CategoryDto dto=categoryMapper.convertToDto(c);
         categoryDtos.add(dto);
     }
     return categoryDtos;
}

public  CategoryDto getCategory(Long categoryId){
//     this waring
     return categoryMapper.convertToDto(catagoryRepository.findById(categoryId).orElse(null));
}



}
