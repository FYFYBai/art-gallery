package com.artgallery.repository;

import com.artgallery.domain.artwork.Artwork;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.UUID;

public interface ArtworkRepository extends JpaRepository<Artwork, UUID>, JpaSpecificationExecutor<Artwork> {
    Page<Artwork> findAll(Specification<Artwork> spec, Pageable pageable);

    @EntityGraph(attributePaths = "images")
    @Query("""
            select distinct a from Artwork a
            where lower(a.title) like lower(concat('%', :query, '%'))
               or lower(coalesce(a.artworkType, '')) like lower(concat('%', :query, '%'))
               or lower(coalesce(a.series, '')) like lower(concat('%', :query, '%'))
            order by a.createdAt desc
            """)
    List<Artwork> searchAdminArtworks(@Param("query") String query);
}
