package e_commerce.e_commerce.ProductsAndCategories.controller;

import e_commerce.e_commerce.ProductsAndCategories.DTO.CategoryDto;
import e_commerce.e_commerce.ProductsAndCategories.serviec.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin("*")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    // Create category
    @PostMapping
    public ResponseEntity<CategoryDto> createCategory(@RequestBody CategoryDto categoryDto) {
        CategoryDto createdCategory = categoryService.addCategory(categoryDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCategory);
    }

    // Update category
    @PutMapping("/{id}")
    public ResponseEntity<CategoryDto> updateCategory(@PathVariable Long id, @RequestBody CategoryDto categoryDto) {
        CategoryDto updatedCategory = categoryService.updateCatagory(id, categoryDto);
        return ResponseEntity.ok(updatedCategory);
    }

    // Delete category
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCategory(@PathVariable Long id) {
        categoryService.deleteById(id);
        return ResponseEntity.ok("Category deleted successfully");
    }

    // Get all categories
    @GetMapping
    public ResponseEntity<List<CategoryDto>> getAllCategories() {
        List<CategoryDto> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    // Get single category
    @GetMapping("/{id}")
    public ResponseEntity<CategoryDto> getCategory(@PathVariable Long id) {
        CategoryDto category = categoryService.getCategory(id);
        return ResponseEntity.ok(category);
    }
}