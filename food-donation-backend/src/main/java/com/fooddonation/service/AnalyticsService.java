package com.fooddonation.service;

import com.fooddonation.model.FoodDonation;
import com.fooddonation.model.Request;
import com.fooddonation.repository.FoodDonationRepository;
import com.fooddonation.repository.RequestRepository;
import com.fooddonation.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AnalyticsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FoodDonationRepository foodDonationRepository;

    @Autowired
    private RequestRepository requestRepository;

    public Map<String, Object> getPlatformAnalytics() {
        Map<String, Object> stats = new HashMap<>();

        long totalUsers = userRepository.count();
        long totalDonations = foodDonationRepository.count();
        long totalRequests = requestRepository.count();

        long availableDonations = foodDonationRepository.findByStatusOrderByCreatedDateDesc(FoodDonation.DonationStatus.available).size();
        long completedDonations = foodDonationRepository.findByStatusOrderByCreatedDateDesc(FoodDonation.DonationStatus.completed).size();
        
        long approvedRequests = requestRepository.findAll().stream()
                .filter(r -> r.getStatus() == Request.RequestStatus.approved)
                .count();

        long activeDonors = foodDonationRepository.findAll().stream()
                .map(FoodDonation::getUserId)
                .distinct()
                .count();

        stats.put("totalUsers", totalUsers);
        stats.put("totalDonations", totalDonations);
        stats.put("totalRequests", totalRequests);
        stats.put("availableDonations", availableDonations);
        stats.put("completedDonations", completedDonations);
        stats.put("approvedRequests", approvedRequests);
        stats.put("activeDonors", activeDonors);
        
        // Complex Metrics
        stats.put("successRate", totalDonations > 0 ? (completedDonations * 100.0 / totalDonations) : 0);
        stats.put("fulfillmentRate", totalRequests > 0 ? (approvedRequests * 100.0 / totalRequests) : 0);
        
        // Estimated Impact (Meals shared estimation)
        // Assuming each completed donation helps approx 3-5 people
        stats.put("estimatedImpact", completedDonations * 4);

        return stats;
    }
}
