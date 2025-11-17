package e_commerce.e_commerce.ProductsAndCategories.Repositories;

import e_commerce.e_commerce.ProductsAndCategories.Entities.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<ProductEntity,Long> {
 public List<ProductEntity> findByCategoryId(Long categoryId);

}
