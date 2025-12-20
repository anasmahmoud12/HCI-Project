package e_commerce.e_commerce.utils.Entities;
import jakarta.persistence.Column;
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
@Table(name ="Address")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class Address {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    private  String street;
    private  String city;
//    private  String postalCode;
    private  String country;


    @Column(name = "is_default")
    private  Boolean isDefault;

    @ManyToOne()
    @JoinColumn(name = "user_id" , nullable = false)
    private User user;
}

