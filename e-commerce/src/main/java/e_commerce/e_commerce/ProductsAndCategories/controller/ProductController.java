package e_commerce.e_commerce.ProductsAndCategories.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import e_commerce.e_commerce.ProductsAndCategories.DTO.ProductDto;
import e_commerce.e_commerce.ProductsAndCategories.serviec.ProductService;
import e_commerce.e_commerce.ProductsAndCategories.serviec.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin("*")
public class ProductController {
    @Autowired
    private SearchService searchService;

    @Autowired
    private ProductService productService;

    // Create product
    @PostMapping
    public ResponseEntity<ProductDto> createProduct(@RequestBody ProductDto productDto) {
        ProductDto createdProduct = productService.addProduct(productDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
    }

    // Update product
//    @PutMapping("/{id}")
//    public ResponseEntity<ProductDto> updateProduct(@PathVariable Long id, @RequestBody ProductDto productDto) {
//        // Make sure ID in path matches ID in body
//        productDto.setId(id);
//        ProductDto updatedProduct = productService.updateProduct(productDto);
//        return ResponseEntity.ok(updatedProduct);
//    }
//    @PutMapping(value = "/{id}/with-images", consumes = "multipart/form-data")
//    public ResponseEntity<ProductDto> updateProductWithImages(
//            @PathVariable Long id,
//            @RequestParam("name") String name,
//            @RequestParam("description") String description,
//            @RequestParam("priceBefore") Double priceBefore,
//            @RequestParam("priceAfter") Double priceAfter,
//            @RequestParam("stock_quantity") Integer stockQuantity,
//            @RequestParam("categoryId") Long categoryId,
//            @RequestParam(value = "primaryImageIndex", defaultValue = "0") Integer primaryImageIndex,
//            @RequestParam(value = "images", required = false) MultipartFile[] images,
//            @RequestParam(value = "removedImageIds", required = false) String removedImageIdsJson) {
//
//        try {
//            List<Long> removedImageIds = new ArrayList<>();
//
//            // Parse removed image IDs if provided
//            if (removedImageIdsJson != null && !removedImageIdsJson.isEmpty()) {
//                try {
//                    ObjectMapper objectMapper = new ObjectMapper();
//                    removedImageIds = objectMapper.readValue(removedImageIdsJson,
//                            new TypeReference<List<Long>>() {});
//                } catch (Exception e) {
//                    System.err.println("Failed to parse removedImageIds: " + e.getMessage());
//                }
//            }
//
//            // Convert empty array to null if no images provided
//            MultipartFile[] newImages = (images != null && images.length > 0) ? images : null;
//
//            ProductDto updatedProduct = productService.updateProductWithImages(
//                    id, name, description, priceBefore, priceAfter, stockQuantity,
//                    categoryId, primaryImageIndex, newImages, removedImageIds
//            );
//
//            return ResponseEntity.ok(updatedProduct);
//
//        } catch (RuntimeException e) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
//        }
//    }
    @PutMapping(value = "/{id}/with-images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductDto> updateProductWithImages(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("description") String description,
//            @RequestParam("brand") String brand,

            @RequestParam("priceBefore") Double priceBefore,
            @RequestParam("priceAfter") Double priceAfter,
            @RequestParam("stock_quantity") Integer stockQuantity,
            @RequestParam("categoryId") Long categoryId,
            @RequestParam(value = "primaryImageIndex", defaultValue = "0") Integer primaryImageIndex,
            @RequestParam(value = "images", required = false) MultipartFile[] images,
            @RequestParam(value = "removedImageIds", required = false) String removedImageIdsJson) {

        try {
            System.out.println("=== UPDATE PRODUCT REQUEST ===");
            System.out.println("Product ID: " + id);
            System.out.println("Name: " + name);
            System.out.println("Description: " + description);
            System.out.println("Price Before: " + priceBefore);
            System.out.println("Price After: " + priceAfter);
            System.out.println("Stock: " + stockQuantity);
            System.out.println("Category ID: " + categoryId);
            System.out.println("Primary Image Index: " + primaryImageIndex);
            System.out.println("Images count: " + (images != null ? images.length : 0));
            System.out.println("Removed Image IDs JSON: " + removedImageIdsJson);

            List<Long> removedImageIds = new ArrayList<>();

            // Parse removed image IDs if provided
            if (removedImageIdsJson != null && !removedImageIdsJson.isEmpty() && !removedImageIdsJson.equals("[]")) {
                try {
                    ObjectMapper objectMapper = new ObjectMapper();
                    removedImageIds = objectMapper.readValue(removedImageIdsJson,
                            new TypeReference<List<Long>>() {});
                    System.out.println("Parsed removed image IDs: " + removedImageIds);
                } catch (Exception e) {
                    System.err.println("Failed to parse removedImageIds: " + e.getMessage());
                    System.out.println("Raw JSON: " + removedImageIdsJson);
                }
            }

            // Handle empty images array
            MultipartFile[] newImages = images;
            if (images == null || images.length == 0 || (images.length == 1 && images[0].isEmpty())) {
                newImages = new MultipartFile[0];
                System.out.println("No new images to process");
            } else {
                System.out.println("Processing " + newImages.length + " new images");
            }

            ProductDto updatedProduct = productService.updateProductWithImages(
                    id, name, description, priceBefore, priceAfter, stockQuantity,
                    categoryId, primaryImageIndex, newImages, removedImageIds
            );

            System.out.println("=== UPDATE SUCCESSFUL ===");
            return ResponseEntity.ok(updatedProduct);

        } catch (Exception e) {
            System.err.println("=== UPDATE FAILED ===");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

//    // Delete product
//    @DeleteMapping("/{id}")
//    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
//        productService.deleteProduct(id);
//        return ResponseEntity.ok("Product deleted successfully");
//    }

    // Get all products
    @GetMapping
    public ResponseEntity<List<ProductDto>> getAllProducts() {
        List<ProductDto> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    // Get single product
    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getProduct(@PathVariable Long id) {
        ProductDto product = productService.getProduct(id);
        return ResponseEntity.ok(product);
    }

    // Get products by category
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<ProductDto>> getProductsByCategory(@PathVariable Long categoryId) {
        List<ProductDto> products = productService.getProductsByCategory(categoryId);
        return ResponseEntity.ok(products);
    }
    //new endpoint for the product creation form
    @PostMapping(value = "/with-images", consumes = "multipart/form-data")
    public ResponseEntity<ProductDto> createProductWithImages(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("priceBefore") Double priceBefore,
            @RequestParam("priceAfter") Double priceAfter,
            @RequestParam("stock_quantity") Integer stockQuantity,
            @RequestParam("categoryId") Long categoryId,
//            @RequestParam("brand") String brand,
            @RequestParam(value = "primaryImageIndex", defaultValue = "0") Integer primaryImageIndex,
            @RequestParam("images") MultipartFile[] images) {

        try {
            ProductDto createdProduct = productService.addProductWithImages(
                    name, description,priceBefore, priceAfter, stockQuantity,
                    categoryId, primaryImageIndex, images
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }




    /**
     * Search all products
     * GET /api/products/search?q=laptop
     */
    @GetMapping("/search")
    public ResponseEntity<List<ProductDto>> searchProducts(
            @RequestParam(value = "q", required = false) String query) {
        List<ProductDto> products = searchService.searchAllProducts(query);
        return ResponseEntity.ok(products);
    }

    /**
     * Search products within a specific category
     * GET /api/products/search/category/5?q=laptop
     */
    @GetMapping("/search/category/{categoryId}")
    public ResponseEntity<List<ProductDto>> searchProductsByCategory(
            @RequestParam(value = "q", required = false) String query,
            @PathVariable Long categoryId) {
        List<ProductDto> products = searchService.searchProductsByCategory(query, categoryId);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/sorted")
    public ResponseEntity<List<ProductDto>> getAllProductsSorted(
            @RequestParam(value = "sortBy", defaultValue = "date") String sortBy) {
        List<ProductDto> products = productService.getAllProductsSorted(sortBy);
        return ResponseEntity.ok(products);
    }

    // Get products by category with sorting
    @GetMapping("/category/{categoryId}/sorted")
    public ResponseEntity<List<ProductDto>> getProductsByCategorySorted(
            @PathVariable Long categoryId,
            @RequestParam(value = "sortBy", defaultValue = "date") String sortBy) {
        List<ProductDto> products = productService.getProductsByCategorySorted(categoryId, sortBy);
        return ResponseEntity.ok(products);
    }


    @GetMapping("/filter")
    public ResponseEntity<List<ProductDto>> filterProducts(
            @RequestParam(value = "productName", required = false) String productName,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "minPrice", required = false) Double minPrice,
            @RequestParam(value = "maxPrice", required = false) Double maxPrice,
            @RequestParam(value = "minDiscount", required = false) Double minDiscount,
            @RequestParam(value = "maxDiscount", required = false) Double maxDiscount,
            @RequestParam(value = "includeOutOfStock", defaultValue = "true") Boolean includeOutOfStock) {

        List<ProductDto> products = productService.filterProducts(
                productName, description, minPrice, maxPrice,
                minDiscount, maxDiscount, includeOutOfStock
        );
        return ResponseEntity.ok(products);
    }

    // Filter products by category
    @GetMapping("/category/{categoryId}/filter")
    public ResponseEntity<List<ProductDto>> filterProductsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(value = "productName", required = false) String productName,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "minPrice", required = false) Double minPrice,
            @RequestParam(value = "maxPrice", required = false) Double maxPrice,
            @RequestParam(value = "minDiscount", required = false) Double minDiscount,
            @RequestParam(value = "maxDiscount", required = false) Double maxDiscount,
            @RequestParam(value = "includeOutOfStock", defaultValue = "true") Boolean includeOutOfStock) {

        List<ProductDto> products = productService.filterProductsByCategory(
                categoryId, productName, description, minPrice, maxPrice,
                minDiscount, maxDiscount, includeOutOfStock
        );
        return ResponseEntity.ok(products);
    }

    
    @GetMapping("/top-discounts")
    public ResponseEntity<List<ProductDto>> getTopDiscountedProducts(
            @RequestParam(value = "limit", defaultValue = "20") int limit) {
        List<ProductDto> products = productService.getTopDiscountedProducts(limit);
        return ResponseEntity.ok(products);
    }



}
