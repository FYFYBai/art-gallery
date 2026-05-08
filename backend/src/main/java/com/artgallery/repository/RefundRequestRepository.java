package com.artgallery.repository;

import com.artgallery.domain.order.RefundRequestEntity;
import com.artgallery.domain.order.RefundRequestStatus;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RefundRequestRepository extends JpaRepository<RefundRequestEntity, UUID> {

    @EntityGraph(attributePaths = {"order", "user", "order.items"})
    List<RefundRequestEntity> findTop20ByStatusOrderByCreatedAtAsc(RefundRequestStatus status);
}
