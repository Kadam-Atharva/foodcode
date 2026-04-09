package com.foodcode.foodcode.service;

import com.foodcode.foodcode.entities.Donation;
import com.foodcode.foodcode.repository.DonationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class DonationService {

    @Autowired
    private DonationRepository donationRepository;

    public Donation createDonation(Donation donation) {
        donation.setStatus("available");
        donation.setCreatedDate(LocalDateTime.now());
        return donationRepository.save(donation);
    }

    public List<Donation> getAllDonations() {
        return donationRepository.findAll();
    }

    public Optional<Donation> getDonationById(String id) {
        return donationRepository.findById(id);
    }

    public List<Donation> getDonationsByUserId(String userId) {
        return donationRepository.findByUserId(userId);
    }

    public List<Donation> getAvailableDonations() {
        return donationRepository.findByStatus("available");
    }

    public List<Donation> searchByFoodType(String foodType) {
        return donationRepository.findByFoodTypeContainingIgnoreCase(foodType);
    }

    public Donation updateDonation(String id, Donation donationDetails) {
        return donationRepository.findById(id).map(existing -> {
            if (donationDetails.getFoodType() != null) existing.setFoodType(donationDetails.getFoodType());
            if (donationDetails.getQuantity() != null) existing.setQuantity(donationDetails.getQuantity());
            if (donationDetails.getExpiryTime() != null) existing.setExpiryTime(donationDetails.getExpiryTime());
            if (donationDetails.getPickupAddress() != null) existing.setPickupAddress(donationDetails.getPickupAddress());
            if (donationDetails.getDescription() != null) existing.setDescription(donationDetails.getDescription());
            if (donationDetails.getImageUrl() != null) existing.setImageUrl(donationDetails.getImageUrl());
            if (donationDetails.getStatus() != null) existing.setStatus(donationDetails.getStatus());
            if (donationDetails.getLatitude() != null) existing.setLatitude(donationDetails.getLatitude());
            if (donationDetails.getLongitude() != null) existing.setLongitude(donationDetails.getLongitude());
            return donationRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Donation not found with id " + id));
    }

    public Donation updateDonationStatus(String id, String status) {
        return donationRepository.findById(id).map(existing -> {
            existing.setStatus(status);
            return donationRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Donation not found with id " + id));
    }

    public void deleteDonation(String id) {
        donationRepository.deleteById(id);
    }
}
