package e_commerce.e_commerce.utils;

import e_commerce.e_commerce.utils.Entities.User;
import e_commerce.e_commerce.utils.enums.RoleName;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {
    private final String SECRET_KEY = "lxuC9JfC8z7wq1KF0pB3WcD8JtR9Mf2Qx5vA7sT9kL2uN8hR3yP4tU6vW8xZ0bC";

    // Update this method to accept User object
    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("userId", user.getId())          // Add user ID
                .claim("firstName", user.getFirstName()) // Add first name
                .claim("lastName", user.getLastName())   // Add last name
                .claim("role", user.getRole())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 1 hour
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    // Add method to extract user ID from token
    public Long extractUserId(String token) {
        return extractClaims(token).get("userId", Long.class);
    }

    public String extractEmail(String token) {
        return extractClaims(token).getSubject();
    }

    public String extractFirstName(String token) {
        return extractClaims(token).get("firstName", String.class);
    }

    public String extractLastName(String token) {
        return extractClaims(token).get("lastName", String.class);
    }

    public String extractRole(String token) {
        return extractClaims(token).get("role", String.class);
    }

    public boolean isTokenExpired(String token) {
        return extractClaims(token).getExpiration().before(new Date());
    }

    public boolean validateToken(String token) {
        try {
            extractClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private Claims extractClaims(String token) {
        try {
            return Jwts.parser()
                    .setSigningKey(SECRET_KEY)
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            throw new RuntimeException("Invalid or expired token");
        }
    }
}