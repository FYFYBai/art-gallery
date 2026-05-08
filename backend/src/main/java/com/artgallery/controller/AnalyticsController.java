package com.artgallery.controller;

import com.artgallery.dto.request.PageViewRequest;
import com.artgallery.service.AnalyticsService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @PostMapping("/page-view")
    public ResponseEntity<Void> recordPageView(@Valid @RequestBody PageViewRequest request) {
        analyticsService.recordPageView(request);
        return ResponseEntity.accepted().build();
    }
}
