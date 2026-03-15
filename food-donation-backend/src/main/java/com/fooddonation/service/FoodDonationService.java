package com.fooddonation.service;

import com.fooddonation.model.FoodDonation;
import com.fooddonation.model.FoodDonation.DonationStatus;
import com.fooddonation.repository.FoodDonationRepository;
import com.fooddonation.exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FoodDonationService {
    
    private static final Logger logger = LoggerFactory.getLogger(FoodDonationService.class);
    
    @Autowired
    private FoodDonationRepository foodDonationRepository;

    @Autowired
    private NotificationService notificationService;
    
    // Create new donation
    public FoodDonation createDonation(FoodDonation donation) {
        logger.info("Creating a new food donation for user ID: {}", donation.getUserId());
        donation.setStatus(DonationStatus.available);
        FoodDonation savedDonation = foodDonationRepository.save(donation);
        logger.info("Successfully created donation with ID: {}", savedDonation.getDonationId());

        // Broadcast notification to all users
        notificationService.broadcastNotification(
            "New Food Available! 🍎",
            "Someone just posted " + savedDonation.getFoodType() + ". Check it out now!",
            "info"
        );

        return savedDonation;
    }
    
    // Get all donations
    public List<FoodDonation> getAllDonations() {
        return foodDonationRepository.findAll();
    }
    
    // Get donation by ID
    public FoodDonation getDonationById(Integer id) {
        logger.debug("Fetching donation by ID: {}", id);
        return foodDonationRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Donation not found with id: {}", id);
                    return new ResourceNotFoundException("Donation not found with id: " + id);
                });
    }
    
    // Get donations by user ID
    public List<FoodDonation> getDonationsByUserId(Integer userId) {
        return foodDonationRepository.findByUserId(userId);
    }
    
    // Get available donations
    public List<FoodDonation> getAvailableDonations() {
        return foodDonationRepository.findByStatusOrderByCreatedDateDesc(DonationStatus.available);
    }
    
    // Search donations by food type
    public List<FoodDonation> searchDonationsByFoodType(String foodType) {
        return foodDonationRepository.findByFoodTypeContainingIgnoreCase(foodType);
    }
    
    // Update donation
    public FoodDonation updateDonation(Integer id, FoodDonation donationDetails) {
        logger.info("Attempting to update donation details for ID: {}", id);
        FoodDonation donation = getDonationById(id);
        donation.setFoodType(donationDetails.getFoodType());
        donation.setQuantity(donationDetails.getQuantity());
        donation.setExpiryTime(donationDetails.getExpiryTime());
        donation.setPickupAddress(donationDetails.getPickupAddress());
        donation.setDescription(donationDetails.getDescription());
        donation.setStatus(donationDetails.getStatus());
        if (donationDetails.getImageUrl() != null) {
            donation.setImageUrl(donationDetails.getImageUrl());
        }
        donation.setLatitude(donationDetails.getLatitude());
        donation.setLongitude(donationDetails.getLongitude());
        FoodDonation updated = foodDonationRepository.save(donation);
        logger.info("Successfully updated donation details for ID: {}", id);
        return updated;
    }
    
    // Update donation status
    public FoodDonation updateDonationStatus(Integer id, DonationStatus status) {
        FoodDonation donation = getDonationById(id);
        donation.setStatus(status);
        return foodDonationRepository.save(donation);
    }
    
    // Delete donation
    public void deleteDonation(Integer id) {
        logger.info("Attempting to delete donation with ID: {}", id);
        FoodDonation donation = getDonationById(id);
        foodDonationRepository.delete(donation);
        logger.info("Successfully deleted donation with ID: {}", id);
    }
}
