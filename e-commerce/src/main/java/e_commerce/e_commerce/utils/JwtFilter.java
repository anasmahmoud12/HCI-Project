package e_commerce.e_commerce.utils;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
@Component

public class JwtFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;

    public JwtFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }
//HttpServletRequest this is the request which has url : Post path            Header:has some keys like Authontication which has Breare+jwt(encoded)
//   HttpServletResponse this is response  we use it if there is wrong send error
//    FilterChain this need futher explain but used to make other filters or classes use this request ( this pass request to next level)
    @Override
    protected void doFilterInternal (HttpServletRequest request,
                                     HttpServletResponse response,
                                     FilterChain filterChain)
            throws ServletException, IOException {
//get header
        String authHeader = request.getHeader("Authorization");
        String token = null;
// remove Beareer and get jwt
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7); // نشيل كلمة "Bearer "
        }
//is valid
        if (token != null && jwtUtil.validateToken(token) && !jwtUtil.isTokenExpired(token)) {
            String role = jwtUtil.extractRole(token);
            String email = jwtUtil.extractEmail(token);
// make this which like id like jwt but this will save in SecurityContextHolder to make spring security see
            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                            email, null, List.of(new SimpleGrantedAuthority("ROLE_" + role)));
//            what make save
            SecurityContextHolder.getContext().setAuthentication(authToken);
        } else if (token != null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
//to make rest filter or controller use this request
        filterChain.doFilter(request, response);
    }
}
