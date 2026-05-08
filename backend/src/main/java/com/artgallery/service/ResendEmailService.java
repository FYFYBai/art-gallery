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

    @Override
    public void sendOrderShippedEmail(String recipientEmail, String orderNumber, String trackingLink) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("RESEND_API_KEY is required to send shipment email");
        }

        String text = """
                Your Sylvaine Art order %s has shipped.

                You can follow the delivery here:
                %s

                We will mark the order as delivered once the shipment is complete.
                """.formatted(orderNumber, trackingLink);

        String html = """
                <p>Your Sylvaine Art order <strong>%s</strong> has shipped.</p>
                <p>You can follow the delivery here:</p>
                <p><a href="%s">Track your order</a></p>
                <p>We will mark the order as delivered once the shipment is complete.</p>
                """.formatted(orderNumber, trackingLink);

        restClient.post()
                .uri("/emails")
                .header("Authorization", "Bearer " + apiKey)
                .body(Map.of(
                        "from", fromEmail,
                        "to", recipientEmail,
                        "subject", "Your Sylvaine Art order has shipped",
                        "text", text,
                        "html", html
                ))
                .retrieve()
                .toBodilessEntity();
    }

    @Override
    public void sendOrderDeliveredEmail(String recipientEmail, String orderNumber) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("RESEND_API_KEY is required to send delivery email");
        }

        String text = """
                Your Sylvaine Art order %s has been marked as delivered.

                Thank you for supporting us and for giving the artwork a place in your home.
                """.formatted(orderNumber);

        String html = """
                <p>Your Sylvaine Art order <strong>%s</strong> has been marked as delivered.</p>
                <p>Thank you for supporting us and for giving the artwork a place in your home.</p>
                """.formatted(orderNumber);

        restClient.post()
                .uri("/emails")
                .header("Authorization", "Bearer " + apiKey)
                .body(Map.of(
                        "from", fromEmail,
                        "to", recipientEmail,
                        "subject", "Your Sylvaine Art order was delivered",
                        "text", text,
                        "html", html
                ))
                .retrieve()
                .toBodilessEntity();
    }

    @Override
    public void sendOrderRefundedEmail(String recipientEmail, String orderNumber, String refundAmount) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("RESEND_API_KEY is required to send refund email");
        }

        String text = """
                We are sorry to hear that you are unsatisfied with your Sylvaine Art order %s.

                Your refund of %s will be sent to you in 5 business days.
                """.formatted(orderNumber, refundAmount);

        String html = """
                <p>We are sorry to hear that you are unsatisfied with your Sylvaine Art order <strong>%s</strong>.</p>
                <p>Your refund of <strong>%s</strong> will be sent to you in 5 business days.</p>
                """.formatted(orderNumber, refundAmount);

        restClient.post()
                .uri("/emails")
                .header("Authorization", "Bearer " + apiKey)
                .body(Map.of(
                        "from", fromEmail,
                        "to", recipientEmail,
                        "subject", "Your Sylvaine Art refund is being processed",
                        "text", text,
                        "html", html
                ))
                .retrieve()
                .toBodilessEntity();
    }

}
