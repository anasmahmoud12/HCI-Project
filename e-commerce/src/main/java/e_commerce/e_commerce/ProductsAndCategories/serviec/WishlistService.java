package e_commerce.e_commerce.ProductsAndCategories.serviec;

import e_commerce.e_commerce.ProductsAndCategories.DTO.WishlistDto;
import e_commerce.e_commerce.ProductsAndCategories.Entities.ProductEntity;
import e_commerce.e_commerce.ProductsAndCategories.Entities.WishlistEntity;
import e_commerce.e_commerce.ProductsAndCategories.Repositories.ProductRepository;
import e_commerce.e_commerce.ProductsAndCategories.Repositories.WishlistRepository;
import e_commerce.e_commerce.ProductsAndCategories.serviec.Mapper.WishlistMapper;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private WishlistMapper wishlistMapper;

    // Add product to wishlist

    @Transactional
    public WishlistDto addToWishlist(Long userId, Long productId) {
        // Check if already in wishlist
        if (wishlistRepository.existsByUserIdAndProductId(userId, productId)) {
            throw new RuntimeException("Product already in wishlist");
        }

        ProductEntity product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        WishlistEntity wishlistEntity = WishlistEntity.builder()
                .userId(userId)
                .product(product)
                .build();

        wishlistEntity = wishlistRepository.save(wishlistEntity);
        return wishlistMapper.convertToDto(wishlistEntity);
    }

    // Remove product from wishlist
    @Transactional
    public void removeFromWishlist(Long userId, Long productId) {
        if (!wishlistRepository.existsByUserIdAndProductId(userId, productId)) {
            throw new RuntimeException("Product not in wishlist");
        }
        wishlistRepository.deleteByUserIdAndProductId(userId, productId);
    }

    // Get all wishlist items for a user
    @Transactional
    public List<WishlistDto> getUserWishlist(Long userId) {
        List<WishlistEntity> wishlistEntities = wishlistRepository.findByUserId(userId);
        return wishlistEntities.stream()
                .map(wishlistMapper::convertToDto)
                .collect(Collectors.toList());
    }

    // Check if product is in user's wishlist
    @Transactional
    public boolean isInWishlist(Long userId, Long productId) {
        return wishlistRepository.existsByUserIdAndProductId(userId, productId);
    }

    // Toggle wishlist (add if not present, remove if present)
    @Transactional
    public WishlistDto toggleWishlist(Long userId, Long productId) {
        if (wishlistRepository.existsByUserIdAndProductId(userId, productId)) {
            wishlistRepository.deleteByUserIdAndProductId(userId, productId);
            return null; // Indicates removal
        } else {
            return addToWishlist(userId, productId);
        }
    }
}