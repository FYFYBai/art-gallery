package com.artgallery.service;

import com.artgallery.domain.artwork.Artwork;
import com.artgallery.dto.response.ArtworkResponse;
import com.artgallery.repository.ArtworkRepository;
import jakarta.persistence.EntityNotFoundException;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ArtworkService {

    private final ArtworkRepository artworkRepository;

    public ArtworkService(ArtworkRepository artworkRepository) {
        this.artworkRepository = artworkRepository;
    }

    @Transactional(readOnly = true)
    public List<ArtworkResponse> listArtworks(
            List<String> artworkTypes,
            List<String> series,
            List<Short> years,
            BigDecimal minPrice,
            BigDecimal maxPrice
    ) {
        List<String> normalizedTypes = normalizeList(artworkTypes);
        List<String> normalizedSeries = normalizeList(series);
        List<Short> normalizedYears = years == null ? List.of() : years.stream()
                .filter(year -> year != null)
                .toList();
        BigDecimal min = minPrice == null ? BigDecimal.ZERO : minPrice;
        BigDecimal max = maxPrice == null ? new BigDecimal("5000") : maxPrice;

        return artworkRepository.findByActiveTrueOrderByCreatedAtDesc()
                .stream()
                .filter(artwork -> normalizedTypes.isEmpty() || normalizedTypes.contains(artwork.getArtworkType()))
                .filter(artwork -> normalizedSeries.isEmpty() || artwork.getSeries().stream().anyMatch(normalizedSeries::contains))
                .filter(artwork -> normalizedYears.isEmpty() || normalizedYears.contains(artwork.getArtworkYear()))
                .filter(artwork -> artwork.getPrice() != null
                        && artwork.getPrice().compareTo(min) >= 0
                        && artwork.getPrice().compareTo(max) <= 0)
                .map(ArtworkResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public ArtworkResponse getArtwork(String slug) {
        Artwork artwork = artworkRepository.findBySlugAndActiveTrue(slug)
                .orElseThrow(() -> new EntityNotFoundException("Artwork was not found"));
        return ArtworkResponse.from(artwork);
    }

    private List<String> normalizeList(List<String> values) {
        if (values == null) {
            return List.of();
        }

        return values.stream()
                .filter(value -> value != null && !value.isBlank())
                .map(String::trim)
                .toList();
    }
}
