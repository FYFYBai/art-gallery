package com.artgallery.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Service
public class ResendEmailService implements EmailService {

    private final RestClient restClient;
    private final String apiKey;
    private final String fromEmail;

    public ResendEmailService(@Value("${app.email.resend.api-key}") String apiKey,
                              @Value("${app.email.from}") String fromEmail) {
        this.apiKey = apiKey;
        this.fromEmail = fromEmail;
        this.restClient = RestClient.builder()
                .baseUrl("https://api.resend.com")
                .build();
    }

    @Override
    public void sendVerificationEmail(String recipientEmail, String verificationLink) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("RESEND_API_KEY is required to send verification email");
        }

        String text = """
                Welcome to Sylvaine Art.

                Please verify your email address by opening this link:
                %s

                This link expires in 24 hours.
                """.formatted(verificationLink);

        String html = """
                <p>Welcome to Sylvaine Art.</p>
                <p>Please verify your email address by opening this link:</p>
                <p><a href="%s">Verify your email</a></p>
                <p>This link expires in 24 hours.</p>
                """.formatted(verificationLink);

        restClient.post()
                .uri("/emails")
                .header("Authorization", "Bearer " + apiKey)
                .body(Map.of(
                        "from", fromEmail,
                        "to", recipientEmail,
                        "subject", "Verify your Sylvaine Art account",
                        "text", text,
                        "html", html
                ))
                .retrieve()
                .toBodilessEntity();
    }

    @Override
    public void sendPasswordResetEmail(String recipientEmail, String resetLink) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("RESEND_API_KEY is required to send password reset email");
        }

        String text = """
                You requested a password reset for your Sylvaine Art account.

                Open this link to choose a new password:
                %s

                This link expires in 1 hour. If you did not request this, you can ignore this email.
                """.formatted(resetLink);

        String html = """
                <p>You requested a password reset for your Sylvaine Art account.</p>
                <p>Open this link to choose a new password:</p>
                <p><a href="%s">Reset your password</a></p>
                <p>This link expires in 1 hour. If you did not request this, you can ignore this email.</p>
                """.formatted(resetLink);

        restClient.post()
                .uri("/emails")
                .header("Authorization", "Bearer " + apiKey)
                .body(Map.of(
                        "from", fromEmail,
                        "to", recipientEmail,
                        "subject", "Reset your Sylvaine Art password",
                        "text", text,
                        "html", html
                ))
                .retrieve()
                .toBodilessEntity();
    }
}
