package com.fooddonation.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "requests")
public class Request {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "request_id")
    private Integer requestId;
    
    @Column(name = "donation_id", nullable = false)
    private Integer donationId;
    
    @Column(name = "receiver_id", nullable = false)
    private Integer receiverId;
    
    @Column(name = "request_date", updatable = false)
    private LocalDateTime requestDate = LocalDateTime.now();
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status = RequestStatus.pending;
    
    @Column(name = "pickup_time")
    private LocalDateTime pickupTime;
    
    // Enum for request status
    public enum RequestStatus {
        pending, approved, rejected
    }
    
    // Constructors
    public Request() {}
    
    public Request(Integer donationId, Integer receiverId, LocalDateTime pickupTime) {
        this.donationId = donationId;
        this.receiverId = receiverId;
        this.pickupTime = pickupTime;
    }
    
    // Getters and Setters
    public Integer getRequestId() {
        return requestId;
    }
    
    public void setRequestId(Integer requestId) {
        this.requestId = requestId;
    }
    
    public Integer getDonationId() {
        return donationId;
    }
    
    public void setDonationId(Integer donationId) {
        this.donationId = donationId;
    }
    
    public Integer getReceiverId() {
        return receiverId;
    }
    
    public void setReceiverId(Integer receiverId) {
        this.receiverId = receiverId;
    }
    
    public LocalDateTime getRequestDate() {
        return requestDate;
    }
    
    public void setRequestDate(LocalDateTime requestDate) {
        this.requestDate = requestDate;
    }
    
    public RequestStatus getStatus() {
        return status;
    }
    
    public void setStatus(RequestStatus status) {
        this.status = status;
    }
    
    public LocalDateTime getPickupTime() {
        return pickupTime;
    }
    
    public void setPickupTime(LocalDateTime pickupTime) {
        this.pickupTime = pickupTime;
    }
}
