package com.artgallery.dto.response;

import com.artgallery.domain.artwork.Artwork;
import com.artgallery.domain.artwork.ArtworkImage;
import com.artgallery.domain.cart.CartItem;
import java.math.BigDecimal;
import java.util.UUID;

public record CartItemResponse(
        UUID id,
        UUID artworkId,
        String slug,
        String title,
        String imageUrl,
        BigDecimal unitPrice,
        String currency,
        String size,
        Short year,
        boolean soldOut,
        boolean active,
        boolean available
) {
    public static CartItemResponse from(CartItem item) {
        Artwork artwork = item.getArtwork();
        String imageUrl = artwork.getImages().stream()
                .filter(ArtworkImage::isPrimary)
                .findFirst()
                .or(() -> artwork.getImages().stream().findFirst())
                .map(ArtworkImage::getImageUrl)
                .orElse(null);
        boolean available = artwork.isActive() && !artwork.isSoldOut();

        return new CartItemResponse(
                item.getId(),
                artwork.getId(),
                artwork.getSlug(),
                artwork.getTitle(),
                imageUrl,
                item.getUnitPrice(),
                artwork.getCurrency(),
                artwork.getArtworkSize(),
                artwork.getArtworkYear(),
                artwork.isSoldOut(),
                artwork.isActive(),
                available
        );
    }
}
