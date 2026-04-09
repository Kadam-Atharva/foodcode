package com.foodcode.foodcode.service;

import com.foodcode.foodcode.entities.Feedback;
import com.foodcode.foodcode.entities.Donation;
import com.foodcode.foodcode.repository.FeedbackRepository;
import com.foodcode.foodcode.repository.DonationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private DonationRepository donationRepository;

    public Feedback createFeedback(Feedback feedback) {
        feedback.setFeedbackDate(LocalDateTime.now());
        return feedbackRepository.save(feedback);
    }

    public List<Feedback> getAllFeedback() {
        return feedbackRepository.findAll();
    }

    public Optional<Feedback> getFeedbackById(String id) {
        return feedbackRepository.findById(id);
    }

    public List<Feedback> getFeedbackByDonationId(String donationId) {
        return feedbackRepository.findByDonationId(donationId);
    }

    public List<Feedback> getFeedbackByUserId(String userId) {
        return feedbackRepository.findByUserId(userId);
    }

    public List<Feedback> getFeedbackByDonorId(String donorId) {
        // Find all donations by this donor, then get feedback for those donations
        List<String> donationIds = donationRepository.findByUserId(donorId)
                .stream()
                .map(Donation::getDonationId)
                .collect(Collectors.toList());

        return feedbackRepository.findAll()
                .stream()
                .filter(fb -> donationIds.contains(fb.getDonationId()))
                .collect(Collectors.toList());
    }

    public Feedback updateFeedback(String id, Feedback feedbackDetails) {
        return feedbackRepository.findById(id).map(existing -> {
            if (feedbackDetails.getRating() > 0) existing.setRating(feedbackDetails.getRating());
            if (feedbackDetails.getComment() != null) existing.setComment(feedbackDetails.getComment());
            return feedbackRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Feedback not found with id " + id));
    }

    public void deleteFeedback(String id) {
        feedbackRepository.deleteById(id);
    }
}
