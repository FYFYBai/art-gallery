package com.artgallery.controller;

import com.artgallery.dto.response.ArtworkResponse;
import com.artgallery.service.ArtworkService;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/artworks")
public class ArtworkController {

    private final ArtworkService artworkService;

    public ArtworkController(ArtworkService artworkService) {
        this.artworkService = artworkService;
    }

    @GetMapping
    public List<ArtworkResponse> artworks(
            @RequestParam(required = false) List<String> artworkTypes,
            @RequestParam(required = false) List<String> series,
            @RequestParam(required = false) List<Short> years,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice
    ) {
        return artworkService.listArtworks(artworkTypes, series, years, minPrice, maxPrice);
    }

    @GetMapping("/{slug}")
    public ArtworkResponse artwork(@PathVariable String slug) {
        return artworkService.getArtwork(slug);
    }
}
