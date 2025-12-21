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
}
