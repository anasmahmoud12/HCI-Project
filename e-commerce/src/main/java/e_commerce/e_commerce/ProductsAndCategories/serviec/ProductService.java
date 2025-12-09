package e_commerce.e_commerce.ProductsAndCategories.serviec;

import e_commerce.e_commerce.ProductsAndCategories.DTO.ProductDto;
import e_commerce.e_commerce.ProductsAndCategories.Entities.CategoryEntity;
import e_commerce.e_commerce.ProductsAndCategories.Entities.ProductEntity;
import e_commerce.e_commerce.ProductsAndCategories.Entities.Product_imagesEntity;
import e_commerce.e_commerce.ProductsAndCategories.Repositories.CategoryRepository;
import e_commerce.e_commerce.ProductsAndCategories.Repositories.ProductImagesRepository;
import e_commerce.e_commerce.ProductsAndCategories.Repositories.ProductRepository;
import e_commerce.e_commerce.ProductsAndCategories.serviec.Mapper.CategoryMapper;
import e_commerce.e_commerce.ProductsAndCategories.serviec.Mapper.ProductMapper;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import e_commerce.e_commerce.ProductsAndCategories.serviec.ProductImageService;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ProductService {
    @Autowired
    ProductRepository productRepository;

    @Autowired
    CategoryRepository categoryRepository;
    @Autowired
    ProductImagesRepository productImagesRepository;

    @Autowired
    ProductMapper productMapper;
    @Autowired
    CategoryMapper categoryMapper;
    @Autowired
    ProductImageService productImageService;


    public ProductDto addProduct(ProductDto productDto) {
        CategoryEntity categoryEntity = categoryRepository.findById(productDto.getCategoryId()).orElse(null);
        if (categoryEntity != null) {
            ProductEntity productEntity = productMapper.convertToEntity(productDto);
            productEntity = productRepository.save(productEntity);
            productDto.setId(productEntity.getId());

            categoryEntity.getProducts().add(productEntity);
            return productDto;
        } else {
            throw new RuntimeException("this product not belong to existing category");
        }


    }


//    public ProductDto updateProduct(ProductDto productDto) {
//        CategoryEntity categoryEntity = categoryRepository.findById(productDto.getCategoryId()).orElse(null);
////   we donot have to make this test as he select the category from selector has our catagory
//        if (categoryEntity != null) {
//            ProductEntity productEntity = productMapper.convertToEntity(productDto);
//            productEntity = productRepository.save(productEntity);
//            productDto.setId(productEntity.getId());
//
//
//            for (ProductEntity p : categoryEntity.getProducts()) {
//                if (p.getId().equals(productEntity.getId())) {
//                    p = productEntity;
//                    break;
//                }
//            }
//
//            return productDto;
//        } else {
//            throw new RuntimeException("this product not belong to existing category");
//        }
//
//
//    }
@Transactional

public ProductDto updateProductWithImages(
        Long productId,
        String name, String description, Double priceBefore, Double priceAfter,
        Integer stockQuantity, Long categoryId,
        Integer primaryImageIndex, MultipartFile[] newImages,
        List<Long> removedImageIds) {

    try {
        // Get existing product
        ProductEntity existingProduct = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        // Update basic product fields
        existingProduct.setName(name);
        existingProduct.setDescription(description);
        existingProduct.setPriceBefore(priceBefore);
        existingProduct.setPriceAfter(priceAfter);
        existingProduct.setStock_quantity(stockQuantity);

        // Update category if changed
        if (!existingProduct.getCategory().getId().equals(categoryId)) {
            CategoryEntity newCategory = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + categoryId));
            existingProduct.setCategory(newCategory);
        }

        // Update timestamp
        existingProduct.setUpdated_At(LocalDateTime.now());

        // Save the product first
        existingProduct = productRepository.save(existingProduct);

        // Handle image removals
        if (removedImageIds != null && !removedImageIds.isEmpty()) {
            for (Long imageId : removedImageIds) {
                productImageService.deleteImage(imageId);
            }
        }

        // Get current images after removals to determine ordering
        List<Product_imagesEntity> currentImages = productImagesRepository.findByProductIdOrderByDisplayOrderAsc(productId);

        // Update ordering for remaining images
        for (int i = 0; i < currentImages.size(); i++) {
            Product_imagesEntity image = currentImages.get(i);
            image.setDisplayOrder((long) i);
            productImagesRepository.save(image);
        }

        // Get the index for new images (after current images)
        int startIndex = currentImages.size();

        // Handle new image uploads
        if (newImages != null && newImages.length > 0) {
            for (int i = 0; i < newImages.length; i++) {
                MultipartFile file = newImages[i];

                if (!file.isEmpty()) {
                    boolean isPrimary = false;

                    // Determine if this new image should be primary
                    // primaryImageIndex is relative to the final array: current images + new images
                    if (primaryImageIndex == (startIndex + i)) {
                        isPrimary = true;

                        // If setting a new image as primary, unset any existing primary
                        for (Product_imagesEntity existingImage : currentImages) {
                            if (existingImage.getIs_primary()) {
                                existingImage.setIs_primary(false);
                                productImagesRepository.save(existingImage);
                            }
                        }
                    }

                    try {
                        // Save new image with correct ordering
                        productImageService.addImageToProduct(
                                productId,
                                file,
                                isPrimary,
                                (long) (startIndex + i)
                        );
                    } catch (Exception e) {
                        System.err.println("Failed to upload image " + i + ": " + e.getMessage());
                    }
                }
            }
        } else {
            // If no new images, we might need to update primary image among existing ones
            if (primaryImageIndex >= 0 && primaryImageIndex < currentImages.size()) {
                // Unset all primary
                for (Product_imagesEntity image : currentImages) {
                    image.setIs_primary(false);
                    productImagesRepository.save(image);
                }

                // Set new primary
                Product_imagesEntity newPrimary = currentImages.get(primaryImageIndex);
                newPrimary.setIs_primary(true);
                productImagesRepository.save(newPrimary);
            }
        }

        // Return updated product DTO
        return productMapper.convertToDto(existingProduct);

    } catch (Exception e) {
        throw new RuntimeException("Failed to update product with images: " + e.getMessage(), e);
    }
}
    @Transactional

    // Delete product
    public void deleteProduct(Long id) {
        // First delete all images associated with the product
        List<Product_imagesEntity> images = productImagesRepository.findByProductId(id);
        for (Product_imagesEntity image : images) {
            productImagesRepository.delete(image);
        }

        // Then delete the product
        productRepository.deleteById(id);
    }

//    public void deleteProduct(Long productId) {
//        productRepository.deleteById(productId);
//    }

    public ProductDto getProduct(Long productId) {
        ProductEntity productEntity = productRepository.findById(productId).orElse(null);
        return productMapper.convertToDto(productEntity);
    }

@Transactional
    public List<ProductDto> getAllProducts() {
        List<ProductEntity> productEntities = productRepository.findAll();
        List<ProductDto> productDtos = new ArrayList<ProductDto>();
        for (ProductEntity p : productEntities) {

            System.out.println("Product Images: " + p.getProductImages());
            System.out.println("Images count: " + (p.getProductImages() != null ? p.getProductImages().size() : "null"));
            productDtos.add(productMapper.convertToDto(p));
        }
        return productDtos;

    }

    public List<ProductDto> getProductsByCategory(Long categoryId) {
        List<ProductEntity> productEntities = productRepository.findByCategoryId(categoryId);
        List<ProductDto> productDtos = new ArrayList<ProductDto>();
        for (ProductEntity p : productEntities) {
            productDtos.add(productMapper.convertToDto(p));
        }
        return productDtos;
    }
    // new function
    public ProductDto addProductWithImages(
            String name, String description, Double priceBefore, Double priceAfter,
            Integer stockQuantity, Long categoryId,
            Integer primaryImageIndex, MultipartFile[] images) {

        // first, create and save the product ( to get its id that will be saved in each related image)
        ProductDto productDto = ProductDto.builder()
                .name(name)
                .description(description)
                .priceBefore(priceBefore)
                .priceAfter(priceAfter)
                .stock_quantity(stockQuantity)
                .categoryId(categoryId)
                .build();


        ProductDto savedProduct = this.addProduct(productDto);

        // Then, save all images with the recently created product_id
        if (images != null && images.length > 0) {
            for (int i = 0; i < images.length; i++) {
                MultipartFile file = images[i];
                boolean isPrimary = (primaryImageIndex == i);

                if (!file.isEmpty()) {
                    try {
                        productImageService.addImageToProduct(savedProduct.getId(), file, isPrimary, (long) i);
                    } catch (Exception e) {
                        System.err.println("Failed to upload image " + i + ": " + e.getMessage());
                    }
                }
            }
        }

        return savedProduct;
    }
}




