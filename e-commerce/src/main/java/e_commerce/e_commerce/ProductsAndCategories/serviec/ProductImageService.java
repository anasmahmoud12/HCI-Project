package e_commerce.e_commerce.ProductsAndCategories.serviec;

import e_commerce.e_commerce.ProductsAndCategories.DTO.productImageDto;
import e_commerce.e_commerce.ProductsAndCategories.Entities.Product_imagesEntity;
import e_commerce.e_commerce.ProductsAndCategories.Entities.ProductEntity;
import e_commerce.e_commerce.ProductsAndCategories.Repositories.ProductImagesRepository;
import e_commerce.e_commerce.ProductsAndCategories.Repositories.ProductRepository;
import e_commerce.e_commerce.ProductsAndCategories.serviec.Mapper.ProductImageMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional

public class ProductImageService {

    @Autowired
    private ProductImagesRepository productImagesRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductImageMapper productImageMapper;

    public productImageDto addImageToProduct(Long productId, productImageDto imageDto) {
        ProductEntity product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Product_imagesEntity imageEntity = productImageMapper.convertToEntity(imageDto);
        imageEntity.setProduct(product);
        Product_imagesEntity savedImage = productImagesRepository.save(imageEntity);

        return productImageMapper.convertToDto(savedImage);
    }

    @Transactional(readOnly = true)
    public List<productImageDto> getAllImagesForProduct(Long productId) {
        List<Product_imagesEntity> images = productImagesRepository.findByProductId(productId);
        List<productImageDto> dtos = new ArrayList<>();

        for (Product_imagesEntity image : images) {
            dtos.add(productImageMapper.convertToDto(image));
        }

        return dtos;
    }

    public productImageDto getImageById(Long imageId) {
        Product_imagesEntity image = productImagesRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found"));
        return productImageMapper.convertToDto(image);
    }

    public productImageDto getPrimaryImageForProduct(Long productId) {
        List<Product_imagesEntity> images = productImagesRepository.findByProductId(productId);

        for (Product_imagesEntity image : images) {
            if (image.getIs_primary()) {
                return productImageMapper.convertToDto(image);
            }
        }

        throw new RuntimeException("No primary image found");
    }

    public productImageDto updateImage(Long productId, Long imageId, productImageDto imageDto) {
        Product_imagesEntity existingImage = productImagesRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found"));

        existingImage.setImg(imageDto.getImg());
        existingImage.setIs_primary(imageDto.getIs_primary());
        existingImage.setDisplayOrder(imageDto.getDisplay_order());

        Product_imagesEntity updatedImage = productImagesRepository.save(existingImage);
        return productImageMapper.convertToDto(updatedImage);
    }

//    public void deleteImage(Long imageId) {
//        productImagesRepository.deleteById(imageId);
//    }
public void deleteImage(Long imageId) {
    Product_imagesEntity image = productImagesRepository.findById(imageId)
            .orElseThrow(() -> new RuntimeException("Image not found with id: " + imageId));

    // Get the product to check if we're deleting a primary image
    Long productId = image.getProduct().getId();

    // Delete the image
    productImagesRepository.deleteById(imageId);

    // If we deleted a primary image, set the first remaining image as primary
    if (image.getIs_primary()) {
        List< Product_imagesEntity> remainingImages = productImagesRepository.findByProductIdOrderByDisplayOrderAsc(productId);
        if (!remainingImages.isEmpty()) {
            Product_imagesEntity newPrimary = remainingImages.get(0);
            newPrimary.setIs_primary(true);
            productImagesRepository.save(newPrimary);
        }
    }
}
    public productImageDto setImageAsPrimary(Long productId, Long imageId) {
        // Get all images for the product
        List<Product_imagesEntity> allImages = productImagesRepository.findByProductId(productId);

        // Set all images to non-primary
        for (Product_imagesEntity image : allImages) {
            image.setIs_primary(false);
        }
        productImagesRepository.saveAll(allImages);

        // Set the specified image as primary
        Product_imagesEntity primaryImage = productImagesRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found"));
        primaryImage.setIs_primary(true);

        Product_imagesEntity updatedImage = productImagesRepository.save(primaryImage);
        return productImageMapper.convertToDto(updatedImage);
    }

    public List<productImageDto> getImagesOrderedByDisplay(Long productId, String order) {
        List<Product_imagesEntity> images = productImagesRepository.findByProductId(productId);

        // Sort images by display order
        if ("desc".equalsIgnoreCase(order)) {
            // Descending order
            for (int i = 0; i < images.size() - 1; i++) {
                for (int j = i + 1; j < images.size(); j++) {
                    if (images.get(i).getDisplayOrder() < images.get(j).getDisplayOrder()) {
                        Product_imagesEntity temp = images.get(i);
                        images.set(i, images.get(j));
                        images.set(j, temp);
                    }
                }
            }
        } else {
            // Ascending order (default)
            for (int i = 0; i < images.size() - 1; i++) {
                for (int j = i + 1; j < images.size(); j++) {
                    if (images.get(i).getDisplayOrder() > images.get(j).getDisplayOrder()) {
                        Product_imagesEntity temp = images.get(i);
                        images.set(i, images.get(j));
                        images.set(j, temp);
                    }
                }
            }
        }

        // Convert to DTOs
        List<productImageDto> dtos = new ArrayList<>();
        for (Product_imagesEntity image : images) {
            dtos.add(productImageMapper.convertToDto(image));
        }

        return dtos;
    }
    public productImageDto addImageToProduct(Long productId, MultipartFile file, boolean isPrimary, Long displayOrder) {
        ProductEntity product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        try {
            byte[] imageBytes = file.getBytes();
            productImageDto imageDto = productImageDto.builder()
                    .img(imageBytes)
                    .is_primary(isPrimary)
                    .display_order(displayOrder)
                    .productid(productId)
                    .build();

            Product_imagesEntity imageEntity = productImageMapper.convertToEntity(imageDto);
            imageEntity.setProduct(product);
            Product_imagesEntity savedImage = productImagesRepository.save(imageEntity);

            return productImageMapper.convertToDto(savedImage);
        } catch (Exception e) {
            throw new RuntimeException("Failed to process image: " + e.getMessage());
        }
    }
}