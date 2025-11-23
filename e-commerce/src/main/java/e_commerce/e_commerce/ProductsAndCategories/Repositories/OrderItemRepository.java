package e_commerce.e_commerce.ProductsAndCategories.Repositories;

import e_commerce.e_commerce.ProductsAndCategories.Entities.OrderItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface OrderItemRepository extends JpaRepository<OrderItemEntity, Long> {
// JpaRepository gives you .save(), .delete(), .findById() automatically.
}
