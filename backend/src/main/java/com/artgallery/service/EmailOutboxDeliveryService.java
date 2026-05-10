package com.artgallery.service;

import com.artgallery.domain.email.EmailOutboxMessage;
import com.artgallery.domain.email.EmailOutboxStatus;
import com.artgallery.repository.EmailOutboxRepository;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

@Service
public class EmailOutboxDeliveryService {

    private static final int MAX_ATTEMPTS = 5;

    private final EmailOutboxRepository emailOutboxRepository;
    private final RestClient restClient;
    private final String apiKey;
    private final String fromEmail;

    public EmailOutboxDeliveryService(EmailOutboxRepository emailOutboxRepository,
                                      @Value("${app.email.resend.api-key}") String apiKey,
                                      @Value("${app.email.from}") String fromEmail) {
        this.emailOutboxRepository = emailOutboxRepository;
        this.apiKey = apiKey;
        this.fromEmail = fromEmail;
        this.restClient = RestClient.builder()
                .baseUrl("https://api.resend.com")
                .build();
    }

    @Scheduled(fixedDelayString = "${app.email.outbox-delivery-ms:15000}")
    @Transactional
    public void deliverPendingEmails() {
        OffsetDateTime now = OffsetDateTime.now(ZoneOffset.UTC);
        emailOutboxRepository.findTop20ByStatusAndNextAttemptAtBeforeOrderByCreatedAtAsc(
                        EmailOutboxStatus.PENDING,
                        now
                )
                .forEach(this::deliver);
    }

    private void deliver(EmailOutboxMessage message) {
        try {
            if (apiKey == null || apiKey.isBlank()) {
                throw new IllegalStateException("RESEND_API_KEY is required to send email");
            }

            restClient.post()
                    .uri("/emails")
                    .header("Authorization", "Bearer " + apiKey)
                    .body(Map.of(
                            "from", fromEmail,
                            "to", message.getRecipient(),
                            "subject", message.getSubject(),
                            "text", message.getTextBody(),
                            "html", message.getHtmlBody()
                    ))
                    .retrieve()
                    .toBodilessEntity();

            message.setStatus(EmailOutboxStatus.SENT);
            message.setSentAt(OffsetDateTime.now(ZoneOffset.UTC));
            message.setLastError(null);
        } catch (Exception ex) {
            int attempts = message.getAttempts() + 1;
            message.setAttempts(attempts);
            message.setLastError(ex.getMessage());
            if (attempts >= MAX_ATTEMPTS) {
                message.setStatus(EmailOutboxStatus.FAILED);
            } else {
                message.setNextAttemptAt(OffsetDateTime.now(ZoneOffset.UTC).plusMinutes(attempts * 5L));
            }
        }
    }
}
