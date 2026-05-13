package com.artgallery.repository;

import com.artgallery.domain.artwork.Artwork;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ArtworkRepository extends JpaRepository<Artwork, UUID>, JpaSpecificationExecutor<Artwork> {
    Page<Artwork> findAll(Specification<Artwork> spec, Pageable pageable);

    @EntityGraph(attributePaths = {"images", "series"})
    List<Artwork> findByActiveTrueOrderByCreatedAtDesc();

    @Query(
            value = """
                    select a from Artwork a
                    where a.active = true
                      and (:hideSold = false or a.soldOut = false)
                      and (:hasTypes = false or a.artworkType in :artworkTypes)
                      and (:hasSeries = false or exists (
                        select 1 from Artwork seriesArtwork
                        join seriesArtwork.series seriesSlug
                        where seriesArtwork = a and seriesSlug in :series
                      ))
                      and (:hasYears = false or a.artworkYear in :years)
                      and a.price is not null
                      and a.price >= :minPrice
                      and a.price <= :maxPrice
                    """,
            countQuery = """
                    select count(a) from Artwork a
                    where a.active = true
                      and (:hideSold = false or a.soldOut = false)
                      and (:hasTypes = false or a.artworkType in :artworkTypes)
                      and (:hasSeries = false or exists (
                        select 1 from Artwork seriesArtwork
                        join seriesArtwork.series seriesSlug
                        where seriesArtwork = a and seriesSlug in :series
                      ))
                      and (:hasYears = false or a.artworkYear in :years)
                      and a.price is not null
                      and a.price >= :minPrice
                      and a.price <= :maxPrice
                    """
    )
    Page<Artwork> searchPublicArtworks(
            @Param("artworkTypes") List<String> artworkTypes,
            @Param("hasTypes") boolean hasTypes,
            @Param("series") List<String> series,
            @Param("hasSeries") boolean hasSeries,
            @Param("years") List<Short> years,
            @Param("hasYears") boolean hasYears,
            @Param("minPrice") java.math.BigDecimal minPrice,
            @Param("maxPrice") java.math.BigDecimal maxPrice,
            @Param("hideSold") boolean hideSold,
            Pageable pageable
    );

    @EntityGraph(attributePaths = {"images", "series"})
    java.util.Optional<Artwork> findByIdAndActiveTrue(UUID id);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select a from Artwork a where a.id = :id")
    Optional<Artwork> findByIdForUpdate(@Param("id") UUID id);

    @EntityGraph(attributePaths = {"images", "series"})
    java.util.Optional<Artwork> findBySlugAndActiveTrue(String slug);

    java.util.Optional<Artwork> findBySlug(String slug);

    @EntityGraph(attributePaths = {"images", "series"})
    @Query("""
            select distinct a from Artwork a
            left join a.series series
            where a.active = true
              and (
                lower(a.title) like lower(concat('%', :query, '%'))
                or lower(coalesce(a.artworkType, '')) like lower(concat('%', :query, '%'))
                or lower(coalesce(series, '')) like lower(concat('%', :query, '%'))
              )
            order by a.createdAt desc
            """)
    List<Artwork> searchAdminArtworks(@Param("query") String query);
}
