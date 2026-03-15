package com.fooddonation.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "food_donations")
public class FoodDonation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "donation_id")
    private Integer donationId;
    
    @Column(name = "user_id", nullable = false)
    private Integer userId;
    
    @Column(name = "food_type", nullable = false, length = 100)
    private String foodType;
    
    @Column(nullable = false, length = 50)
    private String quantity;
    
    @Column(name = "expiry_time", nullable = false)
    private LocalDateTime expiryTime;
    
    @Column(name = "pickup_address", nullable = false, columnDefinition = "TEXT")
    private String pickupAddress;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DonationStatus status = DonationStatus.available;
    
    @Column(name = "created_date", updatable = false)
    private LocalDateTime createdDate = LocalDateTime.now();
    
    @Column(name = "image_url", length = 255)
    private String imageUrl;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;
    
    // Enum for donation status
    public enum DonationStatus {
        available, claimed, completed
    }
    
    // Constructors
    public FoodDonation() {}
    
    public FoodDonation(Integer userId, String foodType, String quantity, LocalDateTime expiryTime, 
                        String pickupAddress, String description) {
        this.userId = userId;
        this.foodType = foodType;
        this.quantity = quantity;
        this.expiryTime = expiryTime;
        this.pickupAddress = pickupAddress;
        this.description = description;
    }
    
    // Getters and Setters
    public Integer getDonationId() {
        return donationId;
    }
    
    public void setDonationId(Integer donationId) {
        this.donationId = donationId;
    }
    
    public Integer getUserId() {
        return userId;
    }
    
    public void setUserId(Integer userId) {
        this.userId = userId;
    }
    
    public String getFoodType() {
        return foodType;
    }
    
    public void setFoodType(String foodType) {
        this.foodType = foodType;
    }
    
    public String getQuantity() {
        return quantity;
    }
    
    public void setQuantity(String quantity) {
        this.quantity = quantity;
    }
    
    public LocalDateTime getExpiryTime() {
        return expiryTime;
    }
    
    public void setExpiryTime(LocalDateTime expiryTime) {
        this.expiryTime = expiryTime;
    }
    
    public String getPickupAddress() {
        return pickupAddress;
    }
    
    public void setPickupAddress(String pickupAddress) {
        this.pickupAddress = pickupAddress;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public DonationStatus getStatus() {
        return status;
    }
    
    public void setStatus(DonationStatus status) {
        this.status = status;
    }
    
    public LocalDateTime getCreatedDate() {
        return createdDate;
    }
    
    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }
    
    public String getImageUrl() {
        return imageUrl;
    }
    
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }
}
