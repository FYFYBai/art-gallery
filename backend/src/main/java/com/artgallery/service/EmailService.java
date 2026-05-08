package com.artgallery.service;

public interface EmailService {
    void sendVerificationEmail(String recipientEmail, String verificationLink);
    void sendPasswordResetEmail(String recipientEmail, String resetLink);
    void sendOrderShippedEmail(String recipientEmail, String orderNumber, String trackingLink);
    void sendOrderDeliveredEmail(String recipientEmail, String orderNumber);
    void sendOrderRefundedEmail(String recipientEmail, String orderNumber, String refundAmount);
}
