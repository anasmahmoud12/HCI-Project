package e_commerce.e_commerce.ProductsAndCategories.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "Product_Images")
public class Product_imagesEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  Long id;
    @Lob
    private byte[]img;
    private Boolean is_primary;
    private long display_order;


    @ManyToOne
    @JoinColumn(name="product_id")
    private ProductEntity product;
}