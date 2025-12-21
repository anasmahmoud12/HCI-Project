package e_commerce.e_commerce.ProductsAndCategories.Repositories;

import e_commerce.e_commerce.ProductsAndCategories.Entities.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<ProductEntity,Long> {
 public List<ProductEntity> findByCategoryId(Long categoryId);

 // Search all products by name or description
 @Query("SELECT p FROM ProductEntity p WHERE " +
         "LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
         "LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%'))")
 List<ProductEntity> searchProducts(@Param("query") String query);

 // Search products within a specific category
 @Query("SELECT p FROM ProductEntity p WHERE p.category.id = :categoryId AND " +
         "(LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
         "LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%')))")
 List<ProductEntity> searchProductsByCategory(@Param("query") String query,
                                              @Param("categoryId") Long categoryId);



 @Query("SELECT p FROM ProductEntity p ORDER BY p.priceAfter ASC")
 List<ProductEntity> findAllOrderByPriceAsc();

 // Sort all products by discount (difference between priceBefore and priceAfter, descending)
 @Query("SELECT p FROM ProductEntity p ORDER BY (p.priceBefore - p.priceAfter) DESC")
 List<ProductEntity> findAllOrderByDiscountDesc();

 // Sort products by category and price (ascending)
 @Query("SELECT p FROM ProductEntity p WHERE p.category.id = :categoryId ORDER BY p.priceAfter ASC")
 List<ProductEntity> findByCategoryIdOrderByPriceAsc(@Param("categoryId") Long categoryId);

 // Sort products by category and discount (descending)
 @Query("SELECT p FROM ProductEntity p WHERE p.category.id = :categoryId ORDER BY (p.priceBefore - p.priceAfter) DESC")
 List<ProductEntity> findByCategoryIdOrderByDiscountDesc(@Param("categoryId") Long categoryId);


 @Query("SELECT p FROM ProductEntity p WHERE " +
         "(:productName IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :productName, '%'))) AND " +
         "(:description IS NULL OR LOWER(p.description) LIKE LOWER(CONCAT('%', :description, '%'))) AND " +
         "(:minPrice IS NULL OR p.priceAfter >= :minPrice) AND " +
         "(:maxPrice IS NULL OR p.priceAfter <= :maxPrice) AND " +
         "(:minDiscount IS NULL OR (p.priceBefore - p.priceAfter) >= :minDiscount) AND " +
         "(:maxDiscount IS NULL OR (p.priceBefore - p.priceAfter) <= :maxDiscount) AND " +
         "(:includeOutOfStock = true OR p.stock_quantity > 0)")
 List<ProductEntity> filterProducts(
         @Param("productName") String productName,
         @Param("description") String description,
         @Param("minPrice") Double minPrice,
         @Param("maxPrice") Double maxPrice,
         @Param("minDiscount") Double minDiscount,
         @Param("maxDiscount") Double maxDiscount,
         @Param("includeOutOfStock") Boolean includeOutOfStock
 );

 // Filter products by category
 @Query("SELECT p FROM ProductEntity p WHERE p.category.id = :categoryId AND " +
         "(:productName IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :productName, '%'))) AND " +
         "(:description IS NULL OR LOWER(p.description) LIKE LOWER(CONCAT('%', :description, '%'))) AND " +
         "(:minPrice IS NULL OR p.priceAfter >= :minPrice) AND " +
         "(:maxPrice IS NULL OR p.priceAfter <= :maxPrice) AND " +
         "(:minDiscount IS NULL OR (p.priceBefore - p.priceAfter) >= :minDiscount) AND " +
         "(:maxDiscount IS NULL OR (p.priceBefore - p.priceAfter) <= :maxDiscount) AND " +
         "(:includeOutOfStock = true OR p.stock_quantity > 0)")
 List<ProductEntity> filterProductsByCategory(
         @Param("categoryId") Long categoryId,
         @Param("productName") String productName,
         @Param("description") String description,
         @Param("minPrice") Double minPrice,
         @Param("maxPrice") Double maxPrice,
         @Param("minDiscount") Double minDiscount,
         @Param("maxDiscount") Double maxDiscount,
         @Param("includeOutOfStock") Boolean includeOutOfStock
 );




}
