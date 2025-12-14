package e_commerce.e_commerce.utils.Entities;

import java.util.List;

import e_commerce.e_commerce.utils.enums.RoleName;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name="User_Table")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id ;

    private String email;

    private String name ;//update it to second and second name not just name 

    private RoleName role;

    private String password;
    @Lob
    private byte[]img;
//this notation make manully determine kind of data not hibernate
// mapped by user as this is the field in address which has the relation ship 
@OneToMany(mappedBy="user",orphanRemoval = true,cascade=CascadeType.ALL,fetch=FetchType.LAZY)
private List<Address>addresses;





}
