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

        stats.put("totalUsers", totalUsers);
        stats.put("totalDonations", totalDonations);
        stats.put("totalRequests", totalRequests);
        stats.put("availableDonations", availableDonations);
        stats.put("completedDonations", completedDonations);
        stats.put("approvedRequests", approvedRequests);
        stats.put("successRate", totalDonations > 0 ? (completedDonations * 100.0 / totalDonations) : 0);

        return stats;
    }
}
