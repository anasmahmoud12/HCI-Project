package e_commerce.e_commerce.ProductsAndCategories.serviec;

import e_commerce.e_commerce.ProductsAndCategories.DTO.ProductDto;
import e_commerce.e_commerce.ProductsAndCategories.Entities.CategoryEntity;
import e_commerce.e_commerce.ProductsAndCategories.Entities.ProductEntity;
import e_commerce.e_commerce.ProductsAndCategories.Repositories.CategoryRepository;
import e_commerce.e_commerce.ProductsAndCategories.Repositories.ProductRepository;
import e_commerce.e_commerce.ProductsAndCategories.serviec.Mapper.CategoryMapper;
import e_commerce.e_commerce.ProductsAndCategories.serviec.Mapper.ProductMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import e_commerce.e_commerce.ProductsAndCategories.serviec.ProductImageService;
import java.util.ArrayList;
import java.util.List;

@Service
public class ProductService {
    @Autowired
    ProductRepository productRepository;

    @Autowired
    CategoryRepository categoryRepository;

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


    public ProductDto updateProduct(ProductDto productDto) {
        CategoryEntity categoryEntity = categoryRepository.findById(productDto.getCategoryId()).orElse(null);
//   we donot have to make this test as he select the category from selector has our catagory
        if (categoryEntity != null) {
            ProductEntity productEntity = productMapper.convertToEntity(productDto);
            productEntity = productRepository.save(productEntity);
            productDto.setId(productEntity.getId());


            for (ProductEntity p : categoryEntity.getProducts()) {
                if (p.getId().equals(productEntity.getId())) {
                    p = productEntity;
                    break;
                }
            }

            return productDto;
        } else {
            throw new RuntimeException("this product not belong to existing category");
        }


    }


    public void deleteProduct(Long productId) {
        productRepository.deleteById(productId);
    }

    public ProductDto getProduct(Long productId) {
        ProductEntity productEntity = productRepository.findById(productId).orElse(null);
        return productMapper.convertToDto(productEntity);
    }


    public List<ProductDto> getAllProducts() {
        List<ProductEntity> productEntities = productRepository.findAll();
        List<ProductDto> productDtos = new ArrayList<ProductDto>();
        for (ProductEntity p : productEntities) {
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




