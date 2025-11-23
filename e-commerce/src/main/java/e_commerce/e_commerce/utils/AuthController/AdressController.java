package e_commerce.e_commerce.utils.AuthController;

import e_commerce.e_commerce.ProductsAndCategories.DTO.AddressDto;
import e_commerce.e_commerce.ProductsAndCategories.serviec.AddressService;
import e_commerce.e_commerce.utils.Entities.Address;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/addresses") //localhost:8080/api/addresses
@RequiredArgsConstructor
public class AdressController {

    private final AddressService addressService;

    @PostMapping("/{userId}") //post
    public ResponseEntity<Address> createAddress(@PathVariable Long userId, @RequestBody AddressDto addressDto) {
        Address savedAddress = addressService.addAddress(userId, addressDto); //transferring the json file to the data
        return ResponseEntity.ok(savedAddress);
    }
}
