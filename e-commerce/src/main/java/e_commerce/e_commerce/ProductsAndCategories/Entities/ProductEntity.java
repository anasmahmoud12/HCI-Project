package e_commerce.e_commerce.ProductsAndCategories.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.Id;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
@Table(name="Product_Table")

public class ProductEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  Long id;
    private String name;
    private  String description;

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
    private CategoryEntity category;
    @OneToMany(mappedBy = "product",cascade = CascadeType.ALL)
    private List<Product_imagesEntity> productImages;





}
