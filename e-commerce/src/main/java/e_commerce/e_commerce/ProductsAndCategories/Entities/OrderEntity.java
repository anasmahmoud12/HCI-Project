package e_commerce.e_commerce.ProductsAndCategories.Entities;
import e_commerce.e_commerce.utils.Entities.Address;
import e_commerce.e_commerce.utils.Entities.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "order")
@Data@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true , nullable = false)
    private String orderNumber;
    private BigDecimal totalPrice;

    private String status;
    private String paymentMethod;


    @ManyToOne
    @JoinColumn(name ="user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name="shipping_address_id", nullable = false)
    private Address shippingAddress;

    private LocalDateTime createdAt;

    //  gom3a is leaving this for now . 3shan el orderItem


    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL,orphanRemoval = true)
    private List<OrderItemEntity> orderItems;

    //add & remove orders to help
    public void addOrderItem(OrderItemEntity orderItem) {
        orderItems.add(orderItem);
        orderItem.setOrder(this);
    }
    public void removeOrderItem(OrderItemEntity orderItem) {
        orderItems.remove(orderItem);
        orderItem.setOrder(null);
    }



}
