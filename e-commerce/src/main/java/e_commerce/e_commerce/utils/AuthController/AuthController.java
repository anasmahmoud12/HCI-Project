package e_commerce.e_commerce.utils.AuthController;

import e_commerce.e_commerce.utils.Entities.User;
import e_commerce.e_commerce.utils.Repasitories.UserRepository;
import e_commerce.e_commerce.utils.dto.UserDTO;
import e_commerce.e_commerce.utils.enums.RoleName;
import e_commerce.e_commerce.utils.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthController(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        // Check if user exists
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Error: Email is already in use!");
        }

        // Encode password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        // Set default role
        user.setRole(RoleName.CUSTOMER);

        // Save user
        userRepository.save(user);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("User registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        User existingUser = userRepository.findByEmail(user.getEmail()).orElse(null);

        if (existingUser != null && passwordEncoder.matches(user.getPassword(), existingUser.getPassword())) {
            // Generate JWT token
            String jwt = jwtUtil.generateToken(existingUser);

            // Create and return UserDTO
            UserDTO userDTO = new UserDTO(
                    existingUser.getId(),
                    existingUser.getEmail(),
                    existingUser.getFirstName(),
                    existingUser.getLastName(),
                    existingUser.getRole(),
                    jwt
            );

            return ResponseEntity.ok(userDTO);
        } else {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Error: Invalid email or password!");
        }
    }
}