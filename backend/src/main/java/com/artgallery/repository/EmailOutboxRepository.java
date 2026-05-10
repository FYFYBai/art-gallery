package com.artgallery.repository;

import com.artgallery.domain.email.EmailOutboxMessage;
import com.artgallery.domain.email.EmailOutboxStatus;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmailOutboxRepository extends JpaRepository<EmailOutboxMessage, UUID> {
    List<EmailOutboxMessage> findTop20ByStatusAndNextAttemptAtBeforeOrderByCreatedAtAsc(
            EmailOutboxStatus status,
            OffsetDateTime nextAttemptAt
    );
}
