package com.foodcode.foodcode.entities;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Builder
@Document(collection = "donations")
public class Donation {

    @Id
    private String donationId;

    private String foodType;

    private String quantity;

    private String expiryTime;

    private String pickupAddress;

    private String description;

    private String imageUrl;

    private String status; // available, claimed, completed

    private String userId; // donor's userId

    private Double latitude;

    private Double longitude;

    public Donation(String userId, String donationId, String foodType, String quantity, String expiryTime, String pickupAddress, String description, String imageUrl, String status, Double latitude, Double longitude, LocalDateTime createdDate) {
        this.userId = userId;
        this.donationId = donationId;
        this.foodType = foodType;
        this.quantity = quantity;
        this.expiryTime = expiryTime;
        this.pickupAddress = pickupAddress;
        this.description = description;
        this.imageUrl = imageUrl;
        this.status = status;
        this.latitude = latitude;
        this.longitude = longitude;
        this.createdDate = createdDate;
    }

    private LocalDateTime createdDate;

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPickupAddress() {
        return pickupAddress;
    }

    public void setPickupAddress(String pickupAddress) {
        this.pickupAddress = pickupAddress;
    }

    public String getExpiryTime() {
        return expiryTime;
    }

    public void setExpiryTime(String expiryTime) {
        this.expiryTime = expiryTime;
    }

    public String getQuantity() {
        return quantity;
    }

    public void setQuantity(String quantity) {
        this.quantity = quantity;
    }

    public String getFoodType() {
        return foodType;
    }

    public void setFoodType(String foodType) {
        this.foodType = foodType;
    }

    public String getDonationId() {
        return donationId;
    }

    public void setDonationId(String donationId) {
        this.donationId = donationId;
    }

}
