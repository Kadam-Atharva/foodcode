package com.foodcode.foodcode.entities;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "feedbacks")
public class Feedback {

    public Feedback(String comment, String feedbackId, String userId, String donationId, int rating, LocalDateTime feedbackDate) {
        this.comment = comment;
        this.feedbackId = feedbackId;
        this.userId = userId;
        this.donationId = donationId;
        this.rating = rating;
        this.feedbackDate = feedbackDate;
    }

    @Id
    private String feedbackId;

    private String userId;

    private String donationId;

    public String getDonationId() {
        return donationId;
    }

    public void setDonationId(String donationId) {
        this.donationId = donationId;
    }

    public String getFeedbackId() {
        return feedbackId;
    }

    public void setFeedbackId(String feedbackId) {
        this.feedbackId = feedbackId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
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

    private int rating;

    private String comment;

    private LocalDateTime feedbackDate;
}
