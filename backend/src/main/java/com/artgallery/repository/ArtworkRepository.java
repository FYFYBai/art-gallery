package com.artgallery.repository;

import com.artgallery.domain.artwork.Artwork;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.util.UUID;

public interface ArtworkRepository extends JpaRepository<Artwork, UUID>, JpaSpecificationExecutor<Artwork> {
    Page<Artwork> findAll(Specification<Artwork> spec, Pageable pageable);
}
