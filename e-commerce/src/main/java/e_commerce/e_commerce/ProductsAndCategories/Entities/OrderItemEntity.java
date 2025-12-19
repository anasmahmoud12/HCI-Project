package e_commerce.e_commerce.ProductsAndCategories.Entities;

import java.math.BigDecimal;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private double price;
    //    private String color ;
//    private Integer size;
    private  double totalPrice;

    @ManyToOne
    @JoinColumn(name = "order_id" , nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore //avoid infinite recursion
    private OrderEntity order;

    @ManyToOne
    @JoinColumn(name = "product_id" , nullable = false)
    private ProductEntity product;
}