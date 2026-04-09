package com.foodcode.foodcode.service;

import com.foodcode.foodcode.entities.Donation;
import com.foodcode.foodcode.entities.FoodRequest;
import com.foodcode.foodcode.repository.DonationRepository;
import com.foodcode.foodcode.repository.FoodRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class FoodRequestService {

    @Autowired
    private FoodRequestRepository foodRequestRepository;

    @Autowired
    private DonationRepository donationRepository;

    public FoodRequest createRequest(FoodRequest request) {
        request.setStatus("pending");
        request.setRequestDate(LocalDateTime.now());

        // Mark the donation as claimed
        donationRepository.findById(request.getDonationId()).ifPresent(donation -> {
            donation.setStatus("claimed");
            donationRepository.save(donation);
        });

        return foodRequestRepository.save(request);
    }

    public List<FoodRequest> getAllRequests() {
        return foodRequestRepository.findAll();
    }

    public Optional<FoodRequest> getRequestById(String id) {
        return foodRequestRepository.findById(id);
    }

    public List<FoodRequest> getRequestsByDonationId(String donationId) {
        return foodRequestRepository.findByDonationId(donationId);
    }

    public List<FoodRequest> getRequestsByReceiverId(String receiverId) {
        return foodRequestRepository.findByReceiverId(receiverId);
    }

    public FoodRequest updateRequestStatus(String id, String status) {
        return foodRequestRepository.findById(id).map(existing -> {
            existing.setStatus(status);

            // If rejected, check if there are other pending requests for this donation
            // If no more pending requests, set donation back to available
            if ("rejected".equals(status)) {
                String donationId = existing.getDonationId();
                List<FoodRequest> otherPending = foodRequestRepository.findByDonationId(donationId)
                        .stream()
                        .filter(r -> !r.getRequestId().equals(id) && "pending".equals(r.getStatus()))
                        .toList();
                if (otherPending.isEmpty()) {
                    donationRepository.findById(donationId).ifPresent(donation -> {
                        donation.setStatus("available");
                        donationRepository.save(donation);
                    });
                }
            }

            return foodRequestRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Request not found with id " + id));
    }

    public FoodRequest updateRequest(String id, FoodRequest requestDetails) {
        return foodRequestRepository.findById(id).map(existing -> {
            if (requestDetails.getPickupTime() != null) existing.setPickupTime(requestDetails.getPickupTime());
            if (requestDetails.getStatus() != null) existing.setStatus(requestDetails.getStatus());
            return foodRequestRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Request not found with id " + id));
    }

    public void deleteRequest(String id) {
        // If deleting a pending request, check if donation should go back to available
        foodRequestRepository.findById(id).ifPresent(request -> {
            if ("pending".equals(request.getStatus())) {
                String donationId = request.getDonationId();
                List<FoodRequest> otherPending = foodRequestRepository.findByDonationId(donationId)
                        .stream()
                        .filter(r -> !r.getRequestId().equals(id) && "pending".equals(r.getStatus()))
                        .toList();
                if (otherPending.isEmpty()) {
                    donationRepository.findById(donationId).ifPresent(donation -> {
                        donation.setStatus("available");
                        donationRepository.save(donation);
                    });
                }
            }
        });
        foodRequestRepository.deleteById(id);
    }
}
