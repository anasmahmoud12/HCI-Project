package e_commerce.e_commerce.ProductsAndCategories.Repositories;

import e_commerce.e_commerce.ProductsAndCategories.Entities.Product_imagesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProductImagesRepository extends JpaRepository<Product_imagesEntity, Long> {

    List<Product_imagesEntity> findByProductId(Long productId);
    List<Product_imagesEntity> findByProductIdOrderByDisplayOrderAsc(Long productId);

}