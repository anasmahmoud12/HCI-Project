package e_commerce.e_commerce.ProductsAndCategories.DTO;

import lombok.Data;

@Data
public class AddressDto {
    private String streetAddress;
    private String city;
    private String postalCode;
    private String country;
    private boolean isDefault;
}
