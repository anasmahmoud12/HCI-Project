package e_commerce.e_commerce.ProductsAndCategories.Entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import jakarta.persistence.Id;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"category", "productImages"}) // Add this line
@EqualsAndHashCode(exclude = {"category", "productImages"}) // Add this line
@Data
@Table(name="Product_Table")

public class ProductEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  Long id;
    private String name;
    private  String description;
//private String brand ;
    private LocalDateTime created_At;
    private LocalDateTime updated_At;
    private double priceBefore ;
    private double priceAfter ;
//    private double price ;
    private int stock_quantity;
//    @Lob
//private byte[]img;
    @ManyToOne
    @JoinColumn(name="catagory_id")
    @JsonManagedReference

    private CategoryEntity category;
    @OneToMany(mappedBy = "product",cascade = CascadeType.ALL,orphanRemoval = true)
    @JsonManagedReference

    private List<Product_imagesEntity> productImages;





}
