package com.foodcode.foodcode.controller;

import com.foodcode.foodcode.repository.DonationRepository;
import com.foodcode.foodcode.repository.FoodRequestRepository;
import com.foodcode.foodcode.repository.UserRepository;
import com.foodcode.foodcode.repository.FeedbackRepository;
import com.foodcode.foodcode.entities.Donation;
import com.foodcode.foodcode.entities.FoodRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    @Autowired
    private DonationRepository donationRepository;

    @Autowired
    private FoodRequestRepository foodRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();

        List<Donation> allDonations = donationRepository.findAll();
        List<FoodRequest> allRequests = foodRequestRepository.findAll();

        long totalDonations = allDonations.size();
        long totalRequests = allRequests.size();
        long completedDonations = allDonations.stream().filter(d -> "completed".equals(d.getStatus())).count();
        long approvedRequests = allRequests.stream().filter(r -> "approved".equals(r.getStatus()) || "completed".equals(r.getStatus())).count();

        // Unique donors who have made donations
        long activeDonors = allDonations.stream().map(Donation::getUserId).distinct().count();

        // Success rate: completed donations / total donations
        double successRate = totalDonations > 0 ? (double) completedDonations / totalDonations * 100 : 0;

        // Fulfillment rate: approved requests / total requests
        double fulfillmentRate = totalRequests > 0 ? (double) approvedRequests / totalRequests * 100 : 0;

        // Estimated impact: number of approved/completed requests (each = 1 person helped)
        long estimatedImpact = approvedRequests;

        stats.put("totalDonations", totalDonations);
        stats.put("totalRequests", totalRequests);
        stats.put("completedDonations", completedDonations);
        stats.put("approvedRequests", approvedRequests);
        stats.put("activeDonors", activeDonors);
        stats.put("successRate", successRate);
        stats.put("fulfillmentRate", fulfillmentRate);
        stats.put("estimatedImpact", estimatedImpact);
        stats.put("totalUsers", userRepository.count());
        stats.put("totalFeedback", feedbackRepository.count());

        return stats;
    }
}
