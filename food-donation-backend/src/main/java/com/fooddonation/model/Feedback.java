package com.fooddonation.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "feedback")
public class Feedback {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "feedback_id")
    private Integer feedbackId;
    
    @Column(name = "user_id", nullable = false)
    private Integer userId;
    
    @Column(name = "donation_id", nullable = false)
    private Integer donationId;
    
    @Column
    private Integer rating;
    
    @Column(columnDefinition = "TEXT")
    private String comment;
    
    @Column(name = "feedback_date", updatable = false)
    private LocalDateTime feedbackDate = LocalDateTime.now();
    
    // Constructors
    public Feedback() {}
    
    public Feedback(Integer userId, Integer donationId, Integer rating, String comment) {
        this.userId = userId;
        this.donationId = donationId;
        this.rating = rating;
        this.comment = comment;
    }
    
    // Getters and Setters
    public Integer getFeedbackId() {
        return feedbackId;
    }
    
    public void setFeedbackId(Integer feedbackId) {
        this.feedbackId = feedbackId;
    }
    
    public Integer getUserId() {
        return userId;
    }
    
    public void setUserId(Integer userId) {
        this.userId = userId;
    }
    
    public Integer getDonationId() {
        return donationId;
    }
    
    public void setDonationId(Integer donationId) {
        this.donationId = donationId;
    }
    
    public Integer getRating() {
        return rating;
    }
    
    public void setRating(Integer rating) {
        this.rating = rating;
    }
    
    public String getComment() {
        return comment;
    }
    
    public void setComment(String comment) {
        this.comment = comment;
    }
    
    public LocalDateTime getFeedbackDate() {
        return feedbackDate;
    }
    
    public void setFeedbackDate(LocalDateTime feedbackDate) {
        this.feedbackDate = feedbackDate;
    }
}
