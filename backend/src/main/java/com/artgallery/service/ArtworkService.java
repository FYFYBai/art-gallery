package com.artgallery.service;

import com.artgallery.domain.artwork.Artwork;
import com.artgallery.dto.response.ArtworkPageResponse;
import com.artgallery.dto.response.ArtworkResponse;
import com.artgallery.repository.ArtworkRepository;
import jakarta.persistence.EntityNotFoundException;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ArtworkService {

    private final ArtworkRepository artworkRepository;

    public ArtworkService(ArtworkRepository artworkRepository) {
        this.artworkRepository = artworkRepository;
    }

    @Transactional(readOnly = true)
    public ArtworkPageResponse listArtworks(
            List<String> artworkTypes,
            List<String> series,
            List<Short> years,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            boolean hideSold,
            int page,
            int size
    ) {
        List<String> normalizedTypes = normalizeList(artworkTypes);
        List<String> normalizedSeries = normalizeList(series);
        List<Short> normalizedYears = years == null ? List.of() : years.stream()
                .filter(year -> year != null)
                .toList();
        BigDecimal min = minPrice == null ? BigDecimal.ZERO : minPrice;
        BigDecimal max = maxPrice == null ? new BigDecimal("5000") : maxPrice;
        int safePage = Math.max(1, page);
        int safeSize = Math.min(Math.max(1, size), 60);
        PageRequest pageRequest = PageRequest.of(
                safePage - 1,
                safeSize,
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        Page<Artwork> artworkPage = artworkRepository.searchPublicArtworks(
                normalizedTypes.isEmpty() ? List.of("__no_artwork_type__") : normalizedTypes,
                !normalizedTypes.isEmpty(),
                normalizedSeries.isEmpty() ? List.of("__no_series__") : normalizedSeries,
                !normalizedSeries.isEmpty(),
                normalizedYears.isEmpty() ? List.of((short) -1) : normalizedYears,
                !normalizedYears.isEmpty(),
                min,
                max,
                hideSold,
                pageRequest
        );

        List<ArtworkResponse> items = artworkPage.getContent().stream()
                .map(ArtworkResponse::from)
                .toList();

        return new ArtworkPageResponse(
                items,
                artworkPage.getNumber() + 1,
                artworkPage.getSize(),
                artworkPage.getTotalElements(),
                artworkPage.getTotalPages()
        );
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
