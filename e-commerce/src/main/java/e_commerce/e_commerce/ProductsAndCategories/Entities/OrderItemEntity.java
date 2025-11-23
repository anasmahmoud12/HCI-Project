package e_commerce.e_commerce.ProductsAndCategories.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int quantity;
    // We store the price here so just in case the price changed
    private BigDecimal price;
    private String color ;
    private Integer size;

    @ManyToOne
    @JoinColumn(name = "order_id" , nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore //avoid infinite recursion
    private OrderEntity order;

    @ManyToOne
    @JoinColumn(name = "product_id" , nullable = false)
    private ProductEntity product;
}
