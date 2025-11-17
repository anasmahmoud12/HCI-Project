package e_commerce.e_commerce.utils.AuthController;

import e_commerce.e_commerce.utils.Entities.User;
import e_commerce.e_commerce.utils.Repasitories.UserRepository;
import e_commerce.e_commerce.utils.enums.RoleName;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import e_commerce.e_commerce.utils.JwtUtil;
@RestController
@RequestMapping("/api/auth")
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
//      check this user not exitst first
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Error: Email is already in use!");
        }

//encode password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
//give role
        RoleName roleName=RoleName.CUSTOMER;
        user.setRole(roleName);
//save in data base
        userRepository.save(user);

        return ResponseEntity
                .status(HttpStatus.CREATED) // 201 Created
                .body("User registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User user) {
//        orElse mean make it Optional hase value return it else return null
        User existingUser = userRepository.findByEmail(user.getEmail()).orElse(null);

        if (existingUser != null && passwordEncoder.matches(user.getPassword(), existingUser.getPassword())) {

            String jwt = jwtUtil.generateToken(existingUser.getEmail(), existingUser.getRole());
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(jwt);
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("there is error in password or email  ");
        }
    }
}
