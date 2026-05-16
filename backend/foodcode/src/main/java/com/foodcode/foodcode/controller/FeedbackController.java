package com.foodcode.foodcode.controller;

import com.foodcode.foodcode.entities.Feedback;
import com.foodcode.foodcode.service.FeedbackService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "*")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @PostMapping
    public ResponseEntity<?> createFeedback(@RequestBody Feedback feedback) {
        try {
            Feedback created = feedbackService.createFeedback(feedback);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping
    public List<Feedback> getAllFeedback() {
        return feedbackService.getAllFeedback();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getFeedbackById(@PathVariable String id) {
        return feedbackService.getFeedbackById(id)
                .map(feedback -> ResponseEntity.ok(feedback))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
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
            Feedback updated = feedbackService.updateFeedback(id, feedback);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFeedback(@PathVariable String id) {
        try {
            feedbackService.deleteFeedback(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }
}
