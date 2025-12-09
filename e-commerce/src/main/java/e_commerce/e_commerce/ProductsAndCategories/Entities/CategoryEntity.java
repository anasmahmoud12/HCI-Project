package e_commerce.e_commerce.ProductsAndCategories.Entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import jakarta.persistence.Id;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "products") // Add this line
@EqualsAndHashCode(exclude = "products") // Add this line
@Table(name = "Catagory_Table")
public class CategoryEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  Long id;
    private String name;
    private  String description;
    private Boolean isactive ;
    @Lob
    private byte[]img;
    private LocalDateTime created_At;
    private LocalDateTime update_At;
//mappedBy mean in table products and forien key without it he will make another table
    // ( CascadeType.ALL) if we deleted a category , all products in will be deleted . (we can use isactive Attr instead)
    @OneToMany(mappedBy = "category",cascade = CascadeType.ALL)
    @JsonManagedReference

    private List<ProductEntity> products;











}
