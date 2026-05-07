package com.artgallery.service;

public interface EmailService {
    void sendVerificationEmail(String recipientEmail, String verificationLink);
    void sendPasswordResetEmail(String recipientEmail, String resetLink);
}
