package com.artgallery.repository;

import com.artgallery.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;
import java.util.List;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    @Query("""
            select u from User u
            where lower(u.email) like lower(concat('%', :query, '%'))
               or lower(coalesce(u.firstName, '')) like lower(concat('%', :query, '%'))
               or lower(coalesce(u.lastName, '')) like lower(concat('%', :query, '%'))
            order by u.createdAt desc
            """)
    List<User> searchUsers(@Param("query") String query);
}
