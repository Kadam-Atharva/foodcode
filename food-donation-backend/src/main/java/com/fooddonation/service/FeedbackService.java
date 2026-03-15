package com.fooddonation.service;

import com.fooddonation.model.Feedback;
import com.fooddonation.repository.FeedbackRepository;
import com.fooddonation.exception.BadRequestException;
import com.fooddonation.exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FeedbackService {
    
    private static final Logger logger = LoggerFactory.getLogger(FeedbackService.class);
    
    @Autowired
    private FeedbackRepository feedbackRepository;
    
    // Create new feedback
    public Feedback createFeedback(Feedback feedback) {
        logger.info("Creating feedback from user ID: {} for donation ID: {}", feedback.getUserId(), feedback.getDonationId());
        if (feedback.getRating() < 1 || feedback.getRating() > 5) {
            logger.warn("Invalid rating provided: {}. Must be between 1 and 5", feedback.getRating());
            throw new BadRequestException("Rating must be between 1 and 5");
        }
        Feedback savedFeedback = feedbackRepository.save(feedback);
        logger.info("Successfully created feedback with ID: {}", savedFeedback.getFeedbackId());
        return savedFeedback;
    }
    
    // Get all feedback
    public List<Feedback> getAllFeedback() {
        return feedbackRepository.findAll();
    }
    
    // Get feedback by ID
    public Feedback getFeedbackById(Integer id) {
        logger.debug("Fetching feedback by ID: {}", id);
        return feedbackRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Feedback not found with id: {}", id);
                    return new ResourceNotFoundException("Feedback not found with id: " + id);
                });
    }
    
    // Get feedback by donation ID
    public List<Feedback> getFeedbackByDonationId(Integer donationId) {
        return feedbackRepository.findByDonationIdOrderByFeedbackDateDesc(donationId);
    }
    
    // Get feedback by user ID (feedback WRITTEN by user)
    public List<Feedback> getFeedbackByUserId(Integer userId) {
        return feedbackRepository.findByUserId(userId);
    }

    // Get feedback for a specific donor (feedback RECEIVED by donor on their items)
    public List<Feedback> getFeedbackByDonorId(Integer donorId) {
        return feedbackRepository.findByDonorId(donorId);
    }
    
    // Update feedback
    public Feedback updateFeedback(Integer id, Feedback feedbackDetails) {
        logger.info("Attempting to update feedback details for ID: {}", id);
        Feedback feedback = getFeedbackById(id);
        feedback.setRating(feedbackDetails.getRating());
        feedback.setComment(feedbackDetails.getComment());
        Feedback updated = feedbackRepository.save(feedback);
        logger.info("Successfully updated feedback ID: {}", id);
        return updated;
    }
    
    // Delete feedback
    public void deleteFeedback(Integer id) {
        logger.info("Attempting to delete feedback with ID: {}", id);
        Feedback feedback = getFeedbackById(id);
        feedbackRepository.delete(feedback);
        logger.info("Successfully deleted feedback with ID: {}", id);
    }
}
