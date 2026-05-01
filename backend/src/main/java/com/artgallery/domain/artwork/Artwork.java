package com.artgallery.domain.artwork;

import com.artgallery.domain.BaseEntity;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "artworks")
public class Artwork extends BaseEntity {

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "artwork_type", length = 50)
    private String artworkType;

    @Column(name = "artwork_medium", length = 100)
    private String artworkMedium;

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal price;

    @Column(nullable = false, length = 10)
    private String currency = "CAD";

    @Column(name = "artwork_year")
    private Short artworkYear;

    @Column(name = "is_sold_out", nullable = false)
    private boolean soldOut = false;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    @OneToMany(mappedBy = "artwork", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("displayOrder ASC")
    private List<ArtworkImage> images = new ArrayList<>();

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getArtworkType() { return artworkType; }
    public void setArtworkType(String artworkType) { this.artworkType = artworkType; }
    public String getArtworkMedium() { return artworkMedium; }
    public void setArtworkMedium(String artworkMedium) { this.artworkMedium = artworkMedium; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public Short getArtworkYear() { return artworkYear; }
    public void setArtworkYear(Short artworkYear) { this.artworkYear = artworkYear; }
    public boolean isSoldOut() { return soldOut; }
    public void setSoldOut(boolean soldOut) { this.soldOut = soldOut; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    public List<ArtworkImage> getImages() { return images; }
}
