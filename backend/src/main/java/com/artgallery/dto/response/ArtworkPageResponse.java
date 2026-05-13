package com.artgallery.dto.response;

import java.util.List;

public record ArtworkPageResponse(
        List<ArtworkResponse> items,
        int page,
        int size,
        long totalItems,
        int totalPages
) {
}
