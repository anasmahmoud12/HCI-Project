
package e_commerce.e_commerce.ProductsAndCategories.Entities;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import e_commerce.e_commerce.utils.Entities.Address;
import e_commerce.e_commerce.utils.Entities.User;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "orders")
@Data@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true , nullable = false)//thing unique for the order 
    private String orderNumber;
    private double totalPrice;

    private String status;//we can make enum to it 
//    private String paymentMethod;//////>>>?????


    @ManyToOne
    @JoinColumn(name ="user_id", nullable = false)
    private User user;

//    @ManyToOne
//    @JoinColumn(name="shipping_address_id", nullable = false)
//    private Address shippingAddress;

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