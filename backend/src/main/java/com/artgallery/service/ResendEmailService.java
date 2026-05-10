package com.artgallery.service;

import com.artgallery.domain.email.EmailOutboxMessage;
import com.artgallery.repository.EmailOutboxRepository;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import org.springframework.stereotype.Service;

@Service
public class ResendEmailService implements EmailService {

    private final EmailOutboxRepository emailOutboxRepository;

    public ResendEmailService(EmailOutboxRepository emailOutboxRepository) {
        this.emailOutboxRepository = emailOutboxRepository;
    }

    @Override
    public void sendVerificationEmail(String recipientEmail, String verificationLink) {
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

        enqueue(recipientEmail, "Verify your Sylvaine Art account", text, html);
    }

    @Override
    public void sendPasswordResetEmail(String recipientEmail, String resetLink) {
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

        enqueue(recipientEmail, "Reset your Sylvaine Art password", text, html);
    }

    @Override
    public void sendOrderReceiptEmail(String recipientEmail, String orderNumber, String totalAmount) {
        String text = """
                Thank you for your Sylvaine Art order %s.

                We have received your payment of %s.

                We will prepare your artwork and contact you when it is ready to ship.
                """.formatted(orderNumber, totalAmount);

        String html = """
                <p>Thank you for your Sylvaine Art order <strong>%s</strong>.</p>
                <p>We have received your payment of <strong>%s</strong>.</p>
                <p>We will prepare your artwork and contact you when it is ready to ship.</p>
                """.formatted(orderNumber, totalAmount);

        enqueue(recipientEmail, "Your Sylvaine Art order receipt", text, html);
    }

    @Override
    public void sendOrderShippedEmail(String recipientEmail, String orderNumber, String trackingLink) {
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

        enqueue(recipientEmail, "Your Sylvaine Art order has shipped", text, html);
    }

    @Override
    public void sendOrderDeliveredEmail(String recipientEmail, String orderNumber) {
        String text = """
                Your Sylvaine Art order %s has been marked as delivered.

                Thank you for supporting us and for giving the artwork a place in your home.
                """.formatted(orderNumber);

        String html = """
                <p>Your Sylvaine Art order <strong>%s</strong> has been marked as delivered.</p>
                <p>Thank you for supporting us and for giving the artwork a place in your home.</p>
                """.formatted(orderNumber);

        enqueue(recipientEmail, "Your Sylvaine Art order was delivered", text, html);
    }

    @Override
    public void sendOrderRefundedEmail(String recipientEmail, String orderNumber, String refundAmount) {
        String text = """
                We are sorry to hear that you are unsatisfied with your Sylvaine Art order %s.

                Your refund of %s will be sent to you in 5 business days.
                """.formatted(orderNumber, refundAmount);

        String html = """
                <p>We are sorry to hear that you are unsatisfied with your Sylvaine Art order <strong>%s</strong>.</p>
                <p>Your refund of <strong>%s</strong> will be sent to you in 5 business days.</p>
                """.formatted(orderNumber, refundAmount);

        enqueue(recipientEmail, "Your Sylvaine Art refund is being processed", text, html);
    }

    @Override
    public void sendRefundRequestRejectedEmail(String recipientEmail, String orderNumber, String reason) {
        String text = """
                We reviewed your refund request for Sylvaine Art order %s.

                We are unable to approve this refund request for the following reason:
                %s

                If you have additional information, please reply to this email and we will review it.
                """.formatted(orderNumber, reason);

        String html = """
                <p>We reviewed your refund request for Sylvaine Art order <strong>%s</strong>.</p>
                <p>We are unable to approve this refund request for the following reason:</p>
                <p>%s</p>
                <p>If you have additional information, please reply to this email and we will review it.</p>
                """.formatted(orderNumber, escapeHtml(reason));

        enqueue(recipientEmail, "Update on your Sylvaine Art refund request", text, html);
    }

    private void enqueue(String recipientEmail, String subject, String text, String html) {
        EmailOutboxMessage message = new EmailOutboxMessage();
        message.setRecipient(recipientEmail);
        message.setSubject(subject);
        message.setTextBody(text);
        message.setHtmlBody(html);
        message.setNextAttemptAt(OffsetDateTime.now(ZoneOffset.UTC));
        emailOutboxRepository.save(message);
    }

    private String escapeHtml(String value) {
        if (value == null) {
            return "";
        }
        return value
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}
