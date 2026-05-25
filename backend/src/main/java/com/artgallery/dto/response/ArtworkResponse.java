package com.artgallery.dto.response;

import com.artgallery.domain.artwork.Artwork;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record ArtworkResponse(
        UUID id,
        String slug,
        String title,
        String description,
        String descriptionEn,
        String descriptionZh,
        String imageUrl,
        String secondaryImageUrl,
        String artworkType,
        List<String> series,
        BigDecimal price,
        String currency,
        String size,
        Short year,
        boolean soldOut
) {
    public static ArtworkResponse from(Artwork artwork) {
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

        return new ArtworkResponse(
                artwork.getId(),
                artwork.getSlug(),
                artwork.getTitle(),
                artwork.getDescription(),
                artwork.getDescriptionEn(),
                artwork.getDescriptionZh(),
                imageUrl,
                secondaryImageUrl,
                artwork.getArtworkType(),
                artwork.getSeries(),
                artwork.getPrice(),
                artwork.getCurrency(),
                artwork.getArtworkSize(),
                artwork.getArtworkYear(),
                artwork.isSoldOut()
        );
    }
}
