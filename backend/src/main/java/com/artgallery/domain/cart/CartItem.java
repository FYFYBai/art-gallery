package com.artgallery.domain.cart;

import com.artgallery.domain.BaseEntity;
import com.artgallery.domain.artwork.Artwork;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "cart_items",
    uniqueConstraints = @UniqueConstraint(columnNames = {"cart_id", "artwork_id"}))
public class CartItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artwork_id", nullable = false)
    private Artwork artwork;

    @Column(nullable = false)
    private Integer quantity = 1;

    @Column(name = "unit_price", precision = 10, scale = 2, nullable = false)
    private BigDecimal unitPrice;  // snapshot of artwork.price at add time

    public Cart getCart() { return cart; }
    public void setCart(Cart cart) { this.cart = cart; }
    public Artwork getArtwork() { return artwork; }
    public void setArtwork(Artwork artwork) { this.artwork = artwork; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
}
