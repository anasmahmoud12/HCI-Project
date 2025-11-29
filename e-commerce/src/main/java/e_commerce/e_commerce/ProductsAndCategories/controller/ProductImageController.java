package e_commerce.e_commerce.ProductsAndCategories.controller;

import e_commerce.e_commerce.ProductsAndCategories.DTO.productImageDto;
import e_commerce.e_commerce.ProductsAndCategories.serviec.ProductImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/products/{productId}/images")
@CrossOrigin("*")
public class ProductImageController {

    @Autowired
    private ProductImageService productImageService;

    // Upload image (most important - for adding product images)
    @PostMapping("/upload")
    public ResponseEntity<productImageDto> uploadImage(
            @PathVariable Long productId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "isPrimary", defaultValue = "false") Boolean isPrimary) {
        try {
            productImageDto imageDto = productImageDto.builder()
                    .img(file.getBytes())
                    .is_primary(isPrimary)
                    .display_order(0L) // Default order
                    .build();

            productImageDto savedImage = productImageService.addImageToProduct(productId, imageDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedImage);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // Get all images for a product
    @GetMapping
    public ResponseEntity<List<productImageDto>> getProductImages(@PathVariable Long productId) {
        List<productImageDto> images = productImageService.getAllImagesForProduct(productId);
        return ResponseEntity.ok(images);
    }

    // Delete image
    @DeleteMapping("/{imageId}")
    public ResponseEntity<String> deleteImage(@PathVariable Long productId, @PathVariable Long imageId) {
        productImageService.deleteImage(imageId);
        return ResponseEntity.ok("Image deleted successfully");
    }

    // Set image as primary
    @PatchMapping("/{imageId}/primary")
    public ResponseEntity<productImageDto> setPrimaryImage(@PathVariable Long productId, @PathVariable Long imageId) {
        productImageDto updatedImage = productImageService.setImageAsPrimary(productId, imageId);
        return ResponseEntity.ok(updatedImage);
    }
}