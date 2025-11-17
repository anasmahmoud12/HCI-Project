package e_commerce.e_commerce.ProductsAndCategories.Repositories;

import e_commerce.e_commerce.ProductsAndCategories.Entities.CategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<CategoryEntity,Long> {
}
