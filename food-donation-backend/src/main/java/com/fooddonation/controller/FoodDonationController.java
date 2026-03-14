package com.fooddonation.controller;

import com.fooddonation.model.FoodDonation;
import com.fooddonation.model.FoodDonation.DonationStatus;
import com.fooddonation.service.FoodDonationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/donations")
@CrossOrigin(origins = "*")
public class FoodDonationController {
    
    @Autowired
    private FoodDonationService foodDonationService;
    
    // Create new donation
    @PostMapping
    public ResponseEntity<?> createDonation(@RequestBody FoodDonation donation) {
        try {
            FoodDonation createdDonation = foodDonationService.createDonation(donation);
            return new ResponseEntity<>(createdDonation, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }
    
    // Get all donations
    @GetMapping
    public ResponseEntity<List<FoodDonation>> getAllDonations() {
        List<FoodDonation> donations = foodDonationService.getAllDonations();
        return new ResponseEntity<>(donations, HttpStatus.OK);
    }
    
    // Get donation by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getDonationById(@PathVariable Integer id) {
        try {
            FoodDonation donation = foodDonationService.getDonationById(id);
            return new ResponseEntity<>(donation, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.NOT_FOUND);
        }
    }
    
    // Get donations by user ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<FoodDonation>> getDonationsByUserId(@PathVariable Integer userId) {
        List<FoodDonation> donations = foodDonationService.getDonationsByUserId(userId);
        return new ResponseEntity<>(donations, HttpStatus.OK);
    }
    
    // Get available donations
    @GetMapping("/available")
    public ResponseEntity<List<FoodDonation>> getAvailableDonations() {
        List<FoodDonation> donations = foodDonationService.getAvailableDonations();
        return new ResponseEntity<>(donations, HttpStatus.OK);
    }
    
    // Search donations by food type
    @GetMapping("/search")
    public ResponseEntity<List<FoodDonation>> searchDonations(@RequestParam String foodType) {
        List<FoodDonation> donations = foodDonationService.searchDonationsByFoodType(foodType);
        return new ResponseEntity<>(donations, HttpStatus.OK);
    }
    
    // Update donation
    @PutMapping("/{id}")
    public ResponseEntity<?> updateDonation(@PathVariable Integer id, @RequestBody FoodDonation donation) {
        try {
            FoodDonation updatedDonation = foodDonationService.updateDonation(id, donation);
            return new ResponseEntity<>(updatedDonation, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.NOT_FOUND);
        }
    }
    
    // Update donation status
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateDonationStatus(@PathVariable Integer id, @RequestBody Map<String, String> statusMap) {
        try {
            DonationStatus status = DonationStatus.valueOf(statusMap.get("status"));
            FoodDonation updatedDonation = foodDonationService.updateDonationStatus(id, status);
            return new ResponseEntity<>(updatedDonation, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }
    
    // Delete donation
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDonation(@PathVariable Integer id) {
        try {
            foodDonationService.deleteDonation(id);
            return new ResponseEntity<>(Map.of("message", "Donation deleted successfully"), HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.NOT_FOUND);
        }
    }
}
