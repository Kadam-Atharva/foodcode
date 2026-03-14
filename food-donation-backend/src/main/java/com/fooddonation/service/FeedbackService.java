package com.fooddonation.service;

import com.fooddonation.model.Feedback;
import com.fooddonation.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FeedbackService {
    
    @Autowired
    private FeedbackRepository feedbackRepository;
    
    // Create new feedback
    public Feedback createFeedback(Feedback feedback) {
        if (feedback.getRating() < 1 || feedback.getRating() > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }
        return feedbackRepository.save(feedback);
    }
    
    // Get all feedback
    public List<Feedback> getAllFeedback() {
        return feedbackRepository.findAll();
    }
    
    // Get feedback by ID
    public Feedback getFeedbackById(Integer id) {
        return feedbackRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Feedback not found with id: " + id));
    }
    
    // Get feedback by donation ID
    public List<Feedback> getFeedbackByDonationId(Integer donationId) {
        return feedbackRepository.findByDonationIdOrderByFeedbackDateDesc(donationId);
    }
    
    // Get feedback by user ID
    public List<Feedback> getFeedbackByUserId(Integer userId) {
        return feedbackRepository.findByUserId(userId);
    }
    
    // Update feedback
    public Feedback updateFeedback(Integer id, Feedback feedbackDetails) {
        Feedback feedback = getFeedbackById(id);
        feedback.setRating(feedbackDetails.getRating());
        feedback.setComment(feedbackDetails.getComment());
        return feedbackRepository.save(feedback);
    }
    
    // Delete feedback
    public void deleteFeedback(Integer id) {
        Feedback feedback = getFeedbackById(id);
        feedbackRepository.delete(feedback);
    }
}
