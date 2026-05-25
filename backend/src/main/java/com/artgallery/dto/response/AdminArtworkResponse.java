package com.artgallery.dto.response;

import com.artgallery.domain.artwork.Artwork;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public record AdminArtworkResponse(
        UUID id,
        String slug,
        String imageUrl,
        String secondaryImageUrl,
        String artworkType,
        List<String> series,
        String description,
        String descriptionEn,
        String descriptionZh,
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
        String secondaryImageUrl = artwork.getImages().stream()
                .filter(image -> !image.isPrimary())
                .findFirst()
                .or(() -> artwork.getImages().stream()
                        .filter(image -> !image.getImageUrl().equals(imageUrl))
                        .findFirst())
                .map(image -> image.getImageUrl())
                .orElse("");

        return new AdminArtworkResponse(
                artwork.getId(),
                artwork.getSlug(),
                imageUrl,
                secondaryImageUrl,
                artwork.getArtworkType(),
                artwork.getSeries(),
                artwork.getDescription(),
                artwork.getDescriptionEn(),
                artwork.getDescriptionZh(),
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
