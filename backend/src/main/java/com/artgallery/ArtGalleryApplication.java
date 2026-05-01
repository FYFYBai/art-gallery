package com.artgallery;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point for the Art Gallery e-commerce backend.
 *
 * <p>Spring Boot auto-configures:
 * <ul>
 *   <li>Flyway — runs all unapplied migrations in {@code src/main/resources/db/migration/} on startup</li>
 *   <li>Spring Data JPA — manages all {@code @Entity} classes under {@code com.artgallery.domain}</li>
 *   <li>Spring Security — JWT-based stateless authentication</li>
 * </ul>
 */
@SpringBootApplication
public class ArtGalleryApplication {

    public static void main(String[] args) {
        SpringApplication.run(ArtGalleryApplication.class, args);
    }
}
