package e_commerce.e_commerce.utils.dto;


import e_commerce.e_commerce.utils.enums.RoleName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private RoleName role;
    private String jwtToken;

}