package e_commerce.e_commerce.utils;


import e_commerce.e_commerce.utils.Entities.User;
import e_commerce.e_commerce.utils.Repasitories.UserRepository;
import e_commerce.e_commerce.utils.enums.RoleName;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

@Configuration
public class DataInitializer {

    @Bean
    @Transactional
    CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Check if admin user already exists
            String adminEmail = "ad@g.com"; // Change this to your desired admin email
            if (userRepository.findByEmail(adminEmail).isEmpty()) {
                // Create admin user
                User adminUser = new User();
                adminUser.setEmail(adminEmail);
                adminUser.setPassword(passwordEncoder.encode("123")); // Change this password
                adminUser.setFirstName("Admin");
                adminUser.setLastName("User");
                adminUser.setRole(RoleName.ADMIN);

                userRepository.save(adminUser);
                System.out.println("Admin user created with email: " + adminEmail);
            } else {
                System.out.println("Admin user already exists");
            }
        };
    }
}