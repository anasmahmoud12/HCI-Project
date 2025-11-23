package e_commerce.e_commerce.utils.Entities;
import jakarta.persistence.*;
import lombok.*;
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
    private  String postalCode;
    private  String country;


    @Column(name = "is_default")
    private  Boolean isDefault;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id" , nullable = false)
    private User user;
}

