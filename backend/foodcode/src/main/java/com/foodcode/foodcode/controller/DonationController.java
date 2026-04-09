package com.foodcode.foodcode.controller;

import com.foodcode.foodcode.entities.Donation;
import com.foodcode.foodcode.service.DonationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/donations")
@CrossOrigin(origins = "*")
public class DonationController {

    @Autowired
    private DonationService donationService;

    @PostMapping
    public ResponseEntity<?> createDonation(@RequestBody Donation donation) {
        try {
            return ResponseEntity.ok(donationService.createDonation(donation));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public List<Donation> getAllDonations() {
        return donationService.getAllDonations();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Donation> getDonationById(@PathVariable String id) {
        return donationService.getDonationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public List<Donation> getDonationsByUserId(@PathVariable String userId) {
        return donationService.getDonationsByUserId(userId);
    }

    @GetMapping("/available")
    public List<Donation> getAvailableDonations() {
        return donationService.getAvailableDonations();
    }

    @GetMapping("/search")
    public List<Donation> searchDonations(@RequestParam String foodType) {
        return donationService.searchByFoodType(foodType);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDonation(@PathVariable String id, @RequestBody Donation donation) {
        try {
            return ResponseEntity.ok(donationService.updateDonation(id, donation));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateDonationStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        try {
            return ResponseEntity.ok(donationService.updateDonationStatus(id, body.get("status")));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDonation(@PathVariable String id) {
        donationService.deleteDonation(id);
        return ResponseEntity.noContent().build();
    }
}
