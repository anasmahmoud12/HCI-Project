package e_commerce.e_commerce.ProductsAndCategories.controller;

import e_commerce.e_commerce.ProductsAndCategories.DTO.CategoryDto;
import e_commerce.e_commerce.ProductsAndCategories.serviec.CategoryService;
import e_commerce.e_commerce.ProductsAndCategories.serviec.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*")
public class CategoryController {

    @Autowired
    private SearchService searchService;

    @Autowired
    private CategoryService categoryService;

    // Create category
//    @PostMapping
//    public ResponseEntity<CategoryDto> createCategory(@RequestBody CategoryDto categoryDto) {
//        CategoryDto createdCategory = categoryService.addCategory(categoryDto);
//        return ResponseEntity.status(HttpStatus.CREATED).body(createdCategory);
//    }
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CategoryDto> createCategory(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("isactive") Boolean isactive,
            @RequestParam(value = "image", required = false) MultipartFile image) throws IOException {
System.out.println("jhsjhjhsdhj");
        // Build DTO
        CategoryDto categoryDto = CategoryDto.builder()
                .name(name)
                .description(description)
                .isactive(isactive)
                .build();

        // Convert image to bytes HERE and set in DTO
        if (image != null && !image.isEmpty()) {
            categoryDto.setImg(image.getBytes());  // Convert to bytes HERE
        }

        // Pass DTO with image bytes to service
        CategoryDto createdCategory = categoryService.addCategory(categoryDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCategory);
    }

    // Update category
//    @PutMapping("/{id}")
//    public ResponseEntity<CategoryDto> updateCategory(@PathVariable Long id, @RequestBody CategoryDto categoryDto) {
//        CategoryDto updatedCategory = categoryService.updateCatagory(id, categoryDto);
//        return ResponseEntity.ok(updatedCategory);
//    }
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CategoryDto> updateCategory(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("isactive") Boolean isactive,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "removeImage", required = false, defaultValue = "false") boolean removeImage) throws IOException {

        System.out.println("Updating category with ID: " + id);

        // Build DTO
        CategoryDto categoryDto = CategoryDto.builder()
                .name(name)
                .description(description)
                .isactive(isactive)
                .build();

        // Handle image
        if (removeImage) {
            System.out.println("jkjjhj");
            // Set image bytes to null to indicate removal
            categoryDto.setImg(null);
        } else if (image != null && !image.isEmpty()) {
            // Convert new image to bytes
            System.out.println("jjdfggdf");
            categoryDto.setImg(image.getBytes());
        }
        // If no new image and not removing, the service will keep existing image

        // Pass DTO to service
        CategoryDto updatedCategory = categoryService.updateCategory(id, categoryDto , removeImage);
        return ResponseEntity.ok(updatedCategory);
    }
    // Delete category

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        try {
            categoryService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
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

    /**
     * Search categories
     * GET /api/categories/search?q=electronics
     */
    @GetMapping("/search")
    public ResponseEntity<List<CategoryDto>> searchCategories(
            @RequestParam(value = "q", required = false) String query) {
        List<CategoryDto> categories = searchService.searchCategories(query);
        return ResponseEntity.ok(categories);
    }
    
}