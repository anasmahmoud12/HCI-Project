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
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "Catagory_Table")
public class CategoryEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  Long id;
    private String name;
    private  String description;
    private Boolean isactive ;
    private LocalDateTime created_At;
    private LocalDateTime update_At;
//mappedBy mean in table products and forien key without it he will make another table
    // ( CascadeType.ALL) if we deleted a category , all products in will be deleted . (we can use isactive Attr insteed)
    @OneToMany(mappedBy = "category",cascade = CascadeType.ALL)
    private List<ProductEntity> products;











}
