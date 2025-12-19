package e_commerce.e_commerce.ProductsAndCategories.Repositories;

import e_commerce.e_commerce.ProductsAndCategories.Entities.OrderEntity;
import e_commerce.e_commerce.utils.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<OrderEntity, Long> {

    // Find all orders for a user, sorted by creation date (newest first)
    List<OrderEntity> findByUserOrderByCreatedAtDesc(User user);

    // Optional: Find orders by status
    List<OrderEntity> findByUserAndStatusOrderByCreatedAtDesc(User user, String status);
}