package com.fooddonation.service;

import com.fooddonation.model.FoodDonation;
import com.fooddonation.model.FoodDonation.DonationStatus;
import com.fooddonation.repository.FoodDonationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FoodDonationService {
    
    @Autowired
    private FoodDonationRepository foodDonationRepository;
    
    // Create new donation
    public FoodDonation createDonation(FoodDonation donation) {
        donation.setStatus(DonationStatus.available);
        return foodDonationRepository.save(donation);
    }
    
    // Get all donations
    public List<FoodDonation> getAllDonations() {
        return foodDonationRepository.findAll();
    }
    
    // Get donation by ID
    public FoodDonation getDonationById(Integer id) {
        return foodDonationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Donation not found with id: " + id));
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
        FoodDonation donation = getDonationById(id);
        donation.setFoodType(donationDetails.getFoodType());
        donation.setQuantity(donationDetails.getQuantity());
        donation.setExpiryTime(donationDetails.getExpiryTime());
        donation.setPickupAddress(donationDetails.getPickupAddress());
        donation.setDescription(donationDetails.getDescription());
        donation.setStatus(donationDetails.getStatus());
        return foodDonationRepository.save(donation);
    }
    
    // Update donation status
    public FoodDonation updateDonationStatus(Integer id, DonationStatus status) {
        FoodDonation donation = getDonationById(id);
        donation.setStatus(status);
        return foodDonationRepository.save(donation);
    }
    
    // Delete donation
    public void deleteDonation(Integer id) {
        FoodDonation donation = getDonationById(id);
        foodDonationRepository.delete(donation);
    }
}
