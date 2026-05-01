package com.artgallery.domain.user;

import com.artgallery.domain.BaseEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "payment_methods")
public class PaymentMethod extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_type", nullable = false, length = 20)
    private PaymentType paymentType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PaymentProvider provider;

    @Column(name = "provider_payment_method_id", length = 255)
    private String providerPaymentMethodId;

    @Column(name = "card_brand", length = 30)
    private String cardBrand;

    @Column(name = "card_last4", length = 4)
    private String cardLast4;

    @Column(name = "card_exp_month")
    private Short cardExpMonth;

    @Column(name = "card_exp_year")
    private Short cardExpYear;

    @Column(name = "paypal_email", length = 255)
    private String paypalEmail;

    @Column(name = "is_default", nullable = false)
    private boolean isDefault = false;

    // No card_number or cvv fields — by design
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public PaymentType getPaymentType() { return paymentType; }
    public void setPaymentType(PaymentType paymentType) { this.paymentType = paymentType; }
    public PaymentProvider getProvider() { return provider; }
    public void setProvider(PaymentProvider provider) { this.provider = provider; }
    public String getProviderPaymentMethodId() { return providerPaymentMethodId; }
    public void setProviderPaymentMethodId(String id) { this.providerPaymentMethodId = id; }
    public String getCardBrand() { return cardBrand; }
    public void setCardBrand(String cardBrand) { this.cardBrand = cardBrand; }
    public String getCardLast4() { return cardLast4; }
    public void setCardLast4(String cardLast4) { this.cardLast4 = cardLast4; }
    public Short getCardExpMonth() { return cardExpMonth; }
    public void setCardExpMonth(Short cardExpMonth) { this.cardExpMonth = cardExpMonth; }
    public Short getCardExpYear() { return cardExpYear; }
    public void setCardExpYear(Short cardExpYear) { this.cardExpYear = cardExpYear; }
    public String getPaypalEmail() { return paypalEmail; }
    public void setPaypalEmail(String paypalEmail) { this.paypalEmail = paypalEmail; }
    public boolean isDefault() { return isDefault; }
    public void setDefault(boolean isDefault) { this.isDefault = isDefault; }
}
