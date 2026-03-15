package com.fooddonation.controller;

import com.fooddonation.model.Feedback;
import com.fooddonation.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {
    
    @Autowired
    private FeedbackService feedbackService;
    
    // Create new feedback
    @PostMapping
    public ResponseEntity<Feedback> createFeedback(@RequestBody Feedback feedback) {
        Feedback createdFeedback = feedbackService.createFeedback(feedback);
        return new ResponseEntity<>(createdFeedback, HttpStatus.CREATED);
    }
    
    // Get all feedback
    @GetMapping
    public ResponseEntity<List<Feedback>> getAllFeedback() {
        List<Feedback> feedbackList = feedbackService.getAllFeedback();
        return new ResponseEntity<>(feedbackList, HttpStatus.OK);
    }
    
    // Get feedback by ID
    @GetMapping("/{id}")
    public ResponseEntity<Feedback> getFeedbackById(@PathVariable Integer id) {
        Feedback feedback = feedbackService.getFeedbackById(id);
        return new ResponseEntity<>(feedback, HttpStatus.OK);
    }
    
    // Get feedback by donation ID
    @GetMapping("/donation/{donationId}")
    public ResponseEntity<List<Feedback>> getFeedbackByDonationId(@PathVariable Integer donationId) {
        List<Feedback> feedbackList = feedbackService.getFeedbackByDonationId(donationId);
        return new ResponseEntity<>(feedbackList, HttpStatus.OK);
    }
    
    // Get feedback by user ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Feedback>> getFeedbackByUserId(@PathVariable Integer userId) {
        List<Feedback> feedbackList = feedbackService.getFeedbackByUserId(userId);
        return new ResponseEntity<>(feedbackList, HttpStatus.OK);
    }
    
    // Update feedback
    @PutMapping("/{id}")
    public ResponseEntity<Feedback> updateFeedback(@PathVariable Integer id, @RequestBody Feedback feedback) {
        Feedback updatedFeedback = feedbackService.updateFeedback(id, feedback);
        return new ResponseEntity<>(updatedFeedback, HttpStatus.OK);
    }
    
    // Delete feedback
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteFeedback(@PathVariable Integer id) {
        feedbackService.deleteFeedback(id);
        return new ResponseEntity<>(Map.of("message", "Feedback deleted successfully"), HttpStatus.OK);
    }
}
