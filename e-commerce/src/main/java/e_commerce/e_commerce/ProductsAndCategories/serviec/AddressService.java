package e_commerce.e_commerce.ProductsAndCategories.serviec;

import e_commerce.e_commerce.ProductsAndCategories.DTO.AddressDto;
import e_commerce.e_commerce.utils.Entities.Address;
import e_commerce.e_commerce.utils.Entities.User;
import e_commerce.e_commerce.utils.Repasitories.AddressRepository;
import e_commerce.e_commerce.utils.Repasitories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
@RequiredArgsConstructor
@Service

public class AddressService {
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;


    public Address addAddress(Long userId, AddressDto dto) {

        // we need to find the user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("unfortunately user not found"));

        //map the dto to the entity
        Address address = new Address();
        address.setStreet(dto.getStreetAddress());
        address.setCity(dto.getCity());
        address.setCountry(dto.getCountry());
        address.setPostalCode(dto.getPostalCode());
        address.setIsDefault(dto.isDefault());

        // then link the user with them
        address.setUser(user);

        //save the data to the data base
        return addressRepository.save(address);
    }
}
