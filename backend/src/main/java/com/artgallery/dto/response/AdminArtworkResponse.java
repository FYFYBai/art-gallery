package com.artgallery.dto.response;

import com.artgallery.domain.artwork.Artwork;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public record AdminArtworkResponse(
        UUID id,
        String imageUrl,
        String artworkType,
        String series,
        String description,
        String name,
        BigDecimal price,
        String currency,
        String size,
        Short year,
        boolean active,
        boolean soldOut,
        OffsetDateTime createdAt
) {
    public static AdminArtworkResponse from(Artwork artwork) {
        String imageUrl = artwork.getImages().stream()
                .filter(image -> image.isPrimary())
                .findFirst()
                .or(() -> artwork.getImages().stream().findFirst())
                .map(image -> image.getImageUrl())
                .orElse("");

        return new AdminArtworkResponse(
                artwork.getId(),
                imageUrl,
                artwork.getArtworkType(),
                artwork.getSeries(),
                artwork.getDescription(),
                artwork.getTitle(),
                artwork.getPrice(),
                artwork.getCurrency(),
                artwork.getArtworkSize(),
                artwork.getArtworkYear(),
                artwork.isActive(),
                artwork.isSoldOut(),
                artwork.getCreatedAt()
        );
    }
}
