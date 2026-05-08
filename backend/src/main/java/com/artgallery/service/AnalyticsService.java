package com.artgallery.service;

import com.artgallery.dto.request.PageViewRequest;
import com.artgallery.repository.AnalyticsRepository;
import org.springframework.stereotype.Service;

@Service
public class AnalyticsService {

    private final AnalyticsRepository analyticsRepository;

    public AnalyticsService(AnalyticsRepository analyticsRepository) {
        this.analyticsRepository = analyticsRepository;
    }

    public void recordPageView(PageViewRequest request) {
        analyticsRepository.recordPageView(
                request.getPath(),
                request.getLocale(),
                request.getSessionId()
        );
    }
}
