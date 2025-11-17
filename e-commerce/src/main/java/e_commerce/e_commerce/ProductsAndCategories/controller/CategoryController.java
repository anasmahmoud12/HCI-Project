package e_commerce.e_commerce.ProductsAndCategories.controller;


import e_commerce.e_commerce.ProductsAndCategories.DTO.CategoryDto;
import e_commerce.e_commerce.ProductsAndCategories.serviec.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
//each metheod here as this api
@RequestMapping("/api/categories")
//front end reques
@CrossOrigin("*")
public class CategoryController {
@Autowired

    private CategoryService categoryService;
//    no path add to the above
//    post to creat
@PostMapping
    public ResponseEntity<CategoryDto>  addCategory(@RequestBody CategoryDto categoryDto){
    return ResponseEntity
            .status(HttpStatus.CREATED) // 201 Created
            .body(categoryService.addCategory(categoryDto));
}

//path varible mean the same name in pathe take the value
//    to update
   @PutMapping("/{id}")
public  ResponseEntity<CategoryDto>  updateCategory(@RequestBody CategoryDto categoryDto,@PathVariable Long id){
    return ResponseEntity.status(HttpStatus.ACCEPTED).body(categoryService.updateCatagory(id,categoryDto)) ;
}

    @DeleteMapping("/{id}")
    public ResponseEntity<String>delete(@PathVariable Long id){
    categoryService.deleteById(id);
    return ResponseEntity.status(HttpStatus.ACCEPTED).body("deleted successfully");
    }


    @GetMapping
    public ResponseEntity<List<CategoryDto>> getAllCategories(){

    return ResponseEntity.status(HttpStatus.ACCEPTED).body(categoryService.getAllCategories()) ;
    }

@ GetMapping("/{id}")
public ResponseEntity<CategoryDto> getById(@PathVariable Long id ){
    return ResponseEntity.status(HttpStatus.ACCEPTED).body(categoryService.getCategory(id));
}


}
