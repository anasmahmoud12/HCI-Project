package e_commerce.e_commerce.utils.Repasitories;

import e_commerce.e_commerce.utils.Entities.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AddressRepository  extends JpaRepository<Address, Long> {
    List<Address> findByUser_Id(Long id);
}