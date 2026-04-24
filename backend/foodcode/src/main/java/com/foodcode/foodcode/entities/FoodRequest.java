package com.foodcode.foodcode.entities;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "requests")
public class FoodRequest {

    @Id
    private String requestId;

    private String donationId;

    public String getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(String receiverId) {
        this.receiverId = receiverId;
    }

    public String getRequestId() {
        return requestId;
    }

    public void setRequestId(String requestId) {
        this.requestId = requestId;
    }

    public String getDonationId() {
        return donationId;
    }

    public void setDonationId(String donationId) {
        this.donationId = donationId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPickupTime() {
        return pickupTime;
    }

    public void setPickupTime(String pickupTime) {
        this.pickupTime = pickupTime;
    }

    public LocalDateTime getRequestDate() {
        return requestDate;
    }

    public void setRequestDate(LocalDateTime requestDate) {
        this.requestDate = requestDate;
    }

    private String receiverId;

    private String status; // pending, approved, rejected

    private String pickupTime;

    private LocalDateTime requestDate;

    public FoodRequest(String status, String requestId, String donationId, String receiverId, String pickupTime, LocalDateTime requestDate) {
        this.status = status;
        this.requestId = requestId;
        this.donationId = donationId;
        this.receiverId = receiverId;
        this.pickupTime = pickupTime;
        this.requestDate = requestDate;
    }



}
