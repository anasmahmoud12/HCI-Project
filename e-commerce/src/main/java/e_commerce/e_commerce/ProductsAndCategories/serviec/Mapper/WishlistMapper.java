package e_commerce.e_commerce.ProductsAndCategories.serviec.Mapper;

import e_commerce.e_commerce.ProductsAndCategories.DTO.WishlistDto;
import e_commerce.e_commerce.ProductsAndCategories.Entities.WishlistEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class WishlistMapper {

    @Autowired
    private ProductMapper productMapper;

    public WishlistDto convertToDto(WishlistEntity entity) {
        if (entity == null) {
            return null;
        }

        return WishlistDto.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .product(productMapper.convertToDto(entity.getProduct()))
                .addedAt(entity.getAddedAt())
                .build();
    }

    public WishlistEntity convertToEntity(WishlistDto dto) {
        if (dto == null) {
            return null;
        }

        return WishlistEntity.builder()
                .id(dto.getId())
                .userId(dto.getUserId())
                .addedAt(dto.getAddedAt())
                .build();
    }
}