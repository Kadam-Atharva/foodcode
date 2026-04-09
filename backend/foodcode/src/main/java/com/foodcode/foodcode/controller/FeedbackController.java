package com.foodcode.foodcode.controller;

import com.foodcode.foodcode.entities.Feedback;
import com.foodcode.foodcode.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "*")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @PostMapping
    public ResponseEntity<?> createFeedback(@RequestBody Feedback feedback) {
        try {
            return ResponseEntity.ok(feedbackService.createFeedback(feedback));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public List<Feedback> getAllFeedback() {
        return feedbackService.getAllFeedback();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Feedback> getFeedbackById(@PathVariable String id) {
        return feedbackService.getFeedbackById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/donation/{donationId}")
    public List<Feedback> getFeedbackByDonationId(@PathVariable String donationId) {
        return feedbackService.getFeedbackByDonationId(donationId);
    }

    @GetMapping("/user/{userId}")
    public List<Feedback> getFeedbackByUserId(@PathVariable String userId) {
        return feedbackService.getFeedbackByUserId(userId);
    }

    @GetMapping("/donor/{donorId}")
    public List<Feedback> getFeedbackByDonorId(@PathVariable String donorId) {
        return feedbackService.getFeedbackByDonorId(donorId);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateFeedback(@PathVariable String id, @RequestBody Feedback feedback) {
        try {
            return ResponseEntity.ok(feedbackService.updateFeedback(id, feedback));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFeedback(@PathVariable String id) {
        feedbackService.deleteFeedback(id);
        return ResponseEntity.noContent().build();
    }
}
