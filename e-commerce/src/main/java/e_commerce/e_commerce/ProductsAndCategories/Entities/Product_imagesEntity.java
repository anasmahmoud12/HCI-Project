package e_commerce.e_commerce.ProductsAndCategories.Entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "product") // Add this line
@EqualsAndHashCode(exclude = "product") // Add this line
@Table(name = "Product_Images")
public class Product_imagesEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  Long id;
    @Lob
    @Column(name = "img") 

    private byte[]img;
    private Boolean is_primary;
    private long displayOrder;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="product_id")
    @JsonBackReference

    private ProductEntity product;
}