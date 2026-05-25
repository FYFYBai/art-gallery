package com.artgallery.domain.artwork;

import com.artgallery.domain.BaseEntity;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "artworks")
public class Artwork extends BaseEntity {

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, length = 255, unique = true)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "description_en", columnDefinition = "TEXT")
    private String descriptionEn;

    @Column(name = "description_zh", columnDefinition = "TEXT")
    private String descriptionZh;

    @Column(name = "artwork_type", length = 50)
    private String artworkType;

    @ElementCollection
    @CollectionTable(
            name = "artwork_series",
            joinColumns = @JoinColumn(name = "artwork_id")
    )
    @Column(name = "series_slug", length = 100, nullable = false)
    @OrderColumn(name = "display_order")
    private List<String> series = new ArrayList<>();

    @Column(name = "artwork_size", length = 100)
    private String artworkSize;

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
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getDescriptionEn() { return descriptionEn; }
    public void setDescriptionEn(String descriptionEn) { this.descriptionEn = descriptionEn; }
    public String getDescriptionZh() { return descriptionZh; }
    public void setDescriptionZh(String descriptionZh) { this.descriptionZh = descriptionZh; }
    public String getArtworkType() { return artworkType; }
    public void setArtworkType(String artworkType) { this.artworkType = artworkType; }
    public List<String> getSeries() { return series; }
    public void setSeries(List<String> series) {
        this.series.clear();
        if (series == null) {
            return;
        }
        Set<String> uniqueSeries = new LinkedHashSet<>(series);
        this.series.addAll(uniqueSeries);
    }
    public String getArtworkSize() { return artworkSize; }
    public void setArtworkSize(String artworkSize) { this.artworkSize = artworkSize; }
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
