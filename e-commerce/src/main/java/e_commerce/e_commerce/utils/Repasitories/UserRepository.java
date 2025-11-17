package e_commerce.e_commerce.utils.Repasitories;

import e_commerce.e_commerce.utils.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface UserRepository extends JpaRepository<User,Long> {
//    public User findByEmail(String email){
//        List<User> users=this.findAll();
//        for(User user : users){
//            if(user.getEmail().equals(email)){
//                return user;
//            }
//        }
//        return null;
//    }
//    this is low performance than above
Optional<User> findByEmail(String email);
}
