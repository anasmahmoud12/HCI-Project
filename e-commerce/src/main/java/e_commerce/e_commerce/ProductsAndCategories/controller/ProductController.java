package e_commerce.e_commerce.ProductsAndCategories.controller;

import e_commerce.e_commerce.ProductsAndCategories.DTO.ProductDto;
import e_commerce.e_commerce.ProductsAndCategories.serviec.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin("*")
public class ProductController {

private ProductService productService;

@PostMapping
    public ResponseEntity<ProductDto> addProduct(@RequestBody ProductDto productDto){
    return ResponseEntity.status(HttpStatus.ACCEPTED).body(productService.addProduct(productDto));
}
@PutMapping
public ResponseEntity<ProductDto> updateProduct(@RequestBody ProductDto productDto){
    return ResponseEntity.status(HttpStatus.ACCEPTED).body(productService.updateProduct(productDto));
}

@DeleteMapping("/{id}")
    public  ResponseEntity<String> deleteById(@PathVariable Long id){
    return ResponseEntity.status(HttpStatus.ACCEPTED).body("make delation successful");
}

@GetMapping
    public ResponseEntity<List<ProductDto>> getProducts(){
    return ResponseEntity.status(HttpStatus.ACCEPTED).body(productService.getAllProducts());
}

@GetMapping("/category/{category}")
public ResponseEntity<List<ProductDto>>  getByCategory(@PathVariable Long categoryId) {
    return ResponseEntity.status(HttpStatus.ACCEPTED).body(productService.getProductsByCategory(categoryId));

}

@GetMapping("/{id}")
    public  ResponseEntity<ProductDto> getOne(@PathVariable Long id){
    return ResponseEntity.status(HttpStatus.ACCEPTED).body(productService.getProduct(id));

}


}
