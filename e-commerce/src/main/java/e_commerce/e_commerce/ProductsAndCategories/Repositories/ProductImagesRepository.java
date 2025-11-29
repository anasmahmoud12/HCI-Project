package e_commerce.e_commerce.ProductsAndCategories.Repositories;

import e_commerce.e_commerce.ProductsAndCategories.Entities.Product_imagesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductImagesRepository extends JpaRepository<Product_imagesEntity, Long> {

    // ✅ CORRECT: Use camelCase for method name
    List<Product_imagesEntity> findByProductId(Long productId);

}