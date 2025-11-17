package e_commerce.e_commerce.utils;

import e_commerce.e_commerce.utils.enums.RoleName;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {
    private final String SECRET_KEY = "lxuC9JfC8z7wq1KF0pB3WcD8JtR9Mf2Qx5vA7sT9kL2uN8hR3yP4tU6vW8xZ0bC";
//new Data give all Data we make  casting         ????????????????????????????
    public String generateToken(String email, RoleName role) {
//        who has tocken
//        another data
//        making time
//        expired time
//        digital sing as if some change role not be able change role  it make algrithm for secret key
//        .conmpact make this string  jwt=>  header . claims . sign     what is header???????????????
//those say payload or claims
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    public String extractEmail(String token) {
        return extractClaims(token).getSubject();
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


    //    this return claims and thie is interface or we can say this is object has
//    (calims of jwt )or payload
//    how we get by jets.parser
//    this setSigninkey take key to use after
//    parserClaimsJws it sperate the type from claims and varity signiture if
//    this Claims which has getters we use
    private Claims extractClaims(String token) {
        try {
            return Jwts.parser()
                    .setSigningKey(SECRET_KEY)
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            throw new RuntimeException("authentication");
        }


    }
}