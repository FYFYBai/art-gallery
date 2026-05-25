package com.artgallery.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class AdminArtworkRequest {

    @NotBlank(message = "Image is required")
    @Size(max = 2048, message = "Image URL is too long")
    private String imageUrl;

    @Size(max = 2048, message = "Second image URL is too long")
    private String secondaryImageUrl;

    @NotBlank(message = "Artwork type is required")
    @Size(max = 50, message = "Artwork type is too long")
    private String artworkType;

    private List<@Size(max = 100, message = "Series is too long") String> series = new ArrayList<>();

    @Size(max = 10000, message = "Description is too long")
    private String description;

    @Size(max = 10000, message = "English description is too long")
    private String descriptionEn;

    @Size(max = 10000, message = "Chinese description is too long")
    private String descriptionZh;

    @NotBlank(message = "Name is required")
    @Size(max = 255, message = "Name is too long")
    private String name;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be positive")
    private BigDecimal price;

    @Size(max = 100, message = "Size is too long")
    private String size;

    private Short year;

    private boolean soldOut;

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getSecondaryImageUrl() {
        return secondaryImageUrl;
    }

    public void setSecondaryImageUrl(String secondaryImageUrl) {
        this.secondaryImageUrl = secondaryImageUrl;
    }

    public String getArtworkType() {
        return artworkType;
    }

    public void setArtworkType(String artworkType) {
        this.artworkType = artworkType;
    }

    public List<String> getSeries() {
        return series;
    }

    public void setSeries(List<String> series) {
        this.series = series;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDescriptionEn() {
        return descriptionEn;
    }

    public void setDescriptionEn(String descriptionEn) {
        this.descriptionEn = descriptionEn;
    }

    public String getDescriptionZh() {
        return descriptionZh;
    }

    public void setDescriptionZh(String descriptionZh) {
        this.descriptionZh = descriptionZh;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public Short getYear() {
        return year;
    }

    public void setYear(Short year) {
        this.year = year;
    }

    public boolean isSoldOut() {
        return soldOut;
    }

    public void setSoldOut(boolean soldOut) {
        this.soldOut = soldOut;
    }
}
