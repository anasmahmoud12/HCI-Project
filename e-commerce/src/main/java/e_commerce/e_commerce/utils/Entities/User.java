package e_commerce.e_commerce.utils.Entities;

import e_commerce.e_commerce.utils.enums.RoleName;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.Id;
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

    private String name ;

    private RoleName role;

    private String password;
    @Lob
    private byte[]img;
//this notation make manully determine kind of data not hibernate






}
