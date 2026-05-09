package com.artgallery.dto.request;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class AddCartItemRequest {

    @NotNull(message = "Artwork id is required")
    private UUID artworkId;

    public UUID getArtworkId() {
        return artworkId;
    }

    public void setArtworkId(UUID artworkId) {
        this.artworkId = artworkId;
    }
}
