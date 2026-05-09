package com.artgallery.repository;

import com.artgallery.domain.order.Order;
import com.artgallery.domain.order.OrderStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, UUID> {
    @EntityGraph(attributePaths = {"shippingAddress", "paymentMethod", "items"})
    List<Order> findByUserIdOrderByCreatedAtDesc(UUID userId);

    @EntityGraph(attributePaths = {"user", "items"})
    List<Order> findTop20ByOrderStatusInOrderByCreatedAtAsc(List<OrderStatus> statuses);

    @EntityGraph(attributePaths = {"user", "items"})
    List<Order> findTop5ByOrderStatusInOrderByCreatedAtAsc(List<OrderStatus> statuses);

    @EntityGraph(attributePaths = {"user", "items"})
    List<Order> findTop5ByOrderStatusInOrderByCreatedAtDesc(List<OrderStatus> statuses);

    @EntityGraph(attributePaths = {"user", "items"})
    List<Order> findTop5ByOrderStatusOrderByCreatedAtDesc(OrderStatus status);

    @EntityGraph(attributePaths = {"user", "items", "items.artwork"})
    Optional<Order> findByStripeCheckoutSessionId(String stripeCheckoutSessionId);

    @EntityGraph(attributePaths = {"items", "items.artwork"})
    List<Order> findByOrderStatusAndCheckoutExpiresAtBefore(OrderStatus status, OffsetDateTime cutoff);

    @EntityGraph(attributePaths = {"user", "items"})
    @Query("""
            select distinct o from Order o
            left join o.items i
            where lower(o.orderNumber) like lower(concat('%', :query, '%'))
               or cast(o.id as string) like concat('%', :query, '%')
               or lower(i.artworkTitle) like lower(concat('%', :query, '%'))
               or lower(o.user.email) like lower(concat('%', :query, '%'))
            order by o.createdAt desc
            """)
    List<Order> searchAdminOrders(@Param("query") String query);

    @EntityGraph(attributePaths = {"user", "items"})
    @Query("""
            select distinct o from Order o
            left join o.items i
            where o.orderStatus = :status
              and (
                  lower(o.orderNumber) like lower(concat('%', :query, '%'))
                  or cast(o.id as string) like concat('%', :query, '%')
                  or lower(i.artworkTitle) like lower(concat('%', :query, '%'))
                  or lower(o.user.email) like lower(concat('%', :query, '%'))
              )
            order by o.createdAt desc
            """)
    List<Order> searchAdminOrdersByStatus(@Param("status") OrderStatus status, @Param("query") String query);

    @Modifying
    @Query("delete from Order o where o.orderStatus = :status and o.checkoutExpiresAt < :cutoff")
    int deleteExpiredPendingOrders(@Param("status") OrderStatus status, @Param("cutoff") OffsetDateTime cutoff);
}
