package e_commerce.e_commerce.ProductsAndCategories.serviec;
// SearchService.java

import e_commerce.e_commerce.ProductsAndCategories.DTO.ProductDto;
import e_commerce.e_commerce.ProductsAndCategories.DTO.CategoryDto;
import e_commerce.e_commerce.ProductsAndCategories.DTO.SearchResultDto;
import e_commerce.e_commerce.ProductsAndCategories.Entities.ProductEntity;
import e_commerce.e_commerce.ProductsAndCategories.Entities.CategoryEntity;
import e_commerce.e_commerce.ProductsAndCategories.Repositories.ProductRepository;
import e_commerce.e_commerce.ProductsAndCategories.Repositories.CategoryRepository;
import e_commerce.e_commerce.ProductsAndCategories.serviec.Mapper.ProductMapper;
import e_commerce.e_commerce.ProductsAndCategories.serviec.Mapper.CategoryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SearchService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;
    private final CategoryMapper categoryMapper;

    /**
     * Search all products (for home page or all products page)
     */
    @Transactional(readOnly = true)
    public List<ProductDto> searchAllProducts(String query) {
        List<ProductEntity> products;

        if (query == null || query.trim().isEmpty()) {
            products = productRepository.findAll();
        } else {
            products = productRepository.searchProducts(query.trim());
        }

        return products.stream()
                .map(productMapper::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Search products within a specific category
     */
    @Transactional(readOnly = true)
    public List<ProductDto> searchProductsByCategory(String query, Long categoryId) {
        List<ProductEntity> products;

        if (query == null || query.trim().isEmpty()) {
            // Get all products in category if no search query
            products = productRepository.findAll().stream()
                    .filter(p -> p.getCategory() != null && p.getCategory().getId().equals(categoryId))
                    .collect(Collectors.toList());
        } else {
            products = productRepository.searchProductsByCategory(query.trim(), categoryId);
        }

        return products.stream()
                .map(productMapper::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Search categories (for categories page)
     */
    @Transactional(readOnly = true)
    public List<CategoryDto> searchCategories(String query) {
        List<CategoryEntity> categories;

        if (query == null || query.trim().isEmpty()) {
            categories = categoryRepository.findAll();
        } else {
            categories = categoryRepository.searchCategories(query.trim());
        }

        return categories.stream()
                .map(categoryMapper::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Universal search - searches both products and categories
     */
    @Transactional(readOnly = true)
    public SearchResultDto universalSearch(String query) {
        if (query == null || query.trim().isEmpty()) {
            return SearchResultDto.builder()
                    .query("")
                    .products(List.of())
                    .categories(List.of())
                    .build();
        }

        return SearchResultDto.builder()
                .query(query.trim())
                .products(searchAllProducts(query))
                .categories(searchCategories(query))
                .build();
    }
}