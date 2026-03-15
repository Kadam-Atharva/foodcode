package com.fooddonation.controller;

import com.fooddonation.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getPlatformStats() {
        return ResponseEntity.ok(analyticsService.getPlatformAnalytics());
    }
}
