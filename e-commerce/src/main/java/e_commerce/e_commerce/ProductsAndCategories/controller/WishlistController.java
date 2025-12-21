package e_commerce.e_commerce.ProductsAndCategories.controller;

import e_commerce.e_commerce.ProductsAndCategories.DTO.WishlistDto;
import e_commerce.e_commerce.ProductsAndCategories.serviec.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin("*")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    // Add product to wishlist
    @PostMapping("/{userId}/products/{productId}")
    public ResponseEntity<WishlistDto> addToWishlist(
            @PathVariable Long userId,
            @PathVariable Long productId) {
        try {
            WishlistDto wishlistDto = wishlistService.addToWishlist(userId, productId);
            return ResponseEntity.status(HttpStatus.CREATED).body(wishlistDto);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // Remove product from wishlist
    @DeleteMapping("/{userId}/products/{productId}")
    public ResponseEntity<Void> removeFromWishlist(
            @PathVariable Long userId,
            @PathVariable Long productId) {
        try {
            wishlistService.removeFromWishlist(userId, productId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // Get user's wishlist
    @GetMapping("/{userId}")
    public ResponseEntity<List<WishlistDto>> getUserWishlist(@PathVariable Long userId) {
        List<WishlistDto> wishlist = wishlistService.getUserWishlist(userId);
        return ResponseEntity.ok(wishlist);
    }

    // Check if product is in wishlist
    @GetMapping("/{userId}/products/{productId}/status")
    public ResponseEntity<Boolean> checkWishlistStatus(
            @PathVariable Long userId,
            @PathVariable Long productId) {
        boolean isInWishlist = wishlistService.isInWishlist(userId, productId);
        return ResponseEntity.ok(isInWishlist);
    }

    // Toggle wishlist (add/remove)
    @PostMapping("/{userId}/products/{productId}/toggle")
    public ResponseEntity<?> toggleWishlist(
            @PathVariable Long userId,
            @PathVariable Long productId) {
        try {
            WishlistDto result = wishlistService.toggleWishlist(userId, productId);
            if (result == null) {
                return ResponseEntity.ok().body("{\"action\": \"removed\"}");
            } else {
                return ResponseEntity.ok().body("{\"action\": \"added\"}");
            }
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}