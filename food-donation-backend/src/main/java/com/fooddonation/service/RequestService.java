package com.fooddonation.service;

import com.fooddonation.model.Request;
import com.fooddonation.model.Request.RequestStatus;
import com.fooddonation.repository.RequestRepository;
import com.fooddonation.exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class RequestService {
    
    private static final Logger logger = LoggerFactory.getLogger(RequestService.class);
    
    @Autowired
    private RequestRepository requestRepository;
    
    @Autowired
    private FoodDonationService foodDonationService;

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private NotificationService notificationService;
    
    // Create new request
    public Request createRequest(Request request) {
        logger.info("Creating a new request for donation ID: {}", request.getDonationId());
        request.setStatus(RequestStatus.pending);
        Request savedRequest = requestRepository.save(request);
        logger.info("Successfully created request with ID: {}", savedRequest.getRequestId());

        // Send Real-Time Notification to Donor
        try {
            com.fooddonation.model.FoodDonation donation = foodDonationService.getDonationById(savedRequest.getDonationId());
            com.fooddonation.model.User receiver = userService.getUserById(savedRequest.getReceiverId());
            
            notificationService.sendNotification(
                donation.getUserId(),
                "New Food Request! 🔔",
                receiver.getName() + " has requested your " + donation.getFoodType() + ".",
                "info"
            );
        } catch (Exception e) {
            logger.error("Failed to send real-time notification to donor: {}", e.getMessage());
        }

        return savedRequest;
    }
    
    // Get all requests
    public List<Request> getAllRequests() {
        return requestRepository.findAll();
    }
    
    // Get request by ID
    public Request getRequestById(Integer id) {
        logger.debug("Fetching request by ID: {}", id);
        return requestRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Request not found with id: {}", id);
                    return new ResourceNotFoundException("Request not found with id: " + id);
                });
    }
    
    // Get requests by donation ID
    public List<Request> getRequestsByDonationId(Integer donationId) {
        return requestRepository.findByDonationId(donationId);
    }
    
    // Get requests by receiver ID
    public List<Request> getRequestsByReceiverId(Integer receiverId) {
        return requestRepository.findByReceiverId(receiverId);
    }
    
    // Update request status
    public Request updateRequestStatus(Integer id, RequestStatus status) {
        logger.info("Attempting to update status for request ID: {} to {}", id, status);
        Request request = getRequestById(id);
        request.setStatus(status);
        
        // If request is approved, update donation status to claimed
        if (status == RequestStatus.approved) {
            logger.info("Request approved. Updating donation ID: {} to claimed", request.getDonationId());
            foodDonationService.updateDonationStatus(
                request.getDonationId(), 
                com.fooddonation.model.FoodDonation.DonationStatus.claimed
            );
        }
        
        Request updated = requestRepository.save(request);
        logger.info("Successfully updated status for request ID: {}", id);

        // Send status update email and real-time notification to receiver
        try {
            com.fooddonation.model.User receiver = userService.getUserById(updated.getReceiverId());
            com.fooddonation.model.FoodDonation donation = foodDonationService.getDonationById(updated.getDonationId());
            
            // Email
            emailService.sendRequestUpdateEmail(receiver.getEmail(), donation.getFoodType(), status.name());
            
            // Real-time notification
            String title = status == RequestStatus.approved ? "Request Approved! ✅" : "Request Update 📋";
            String message = "Your request for " + donation.getFoodType() + " has been " + status.name() + ".";
            notificationService.sendNotification(receiver.getUserId(), title, message, status == RequestStatus.approved ? "success" : "info");
            
        } catch (Exception e) {
            logger.error("Failed to trigger notifications: {}", e.getMessage());
        }

        return updated;
    }
    
    // Update request
    public Request updateRequest(Integer id, Request requestDetails) {
        logger.info("Updating request details for ID: {}", id);
        Request request = getRequestById(id);
        request.setPickupTime(requestDetails.getPickupTime());
        request.setStatus(requestDetails.getStatus());
        return requestRepository.save(request);
    }
    
    // Delete request
    public void deleteRequest(Integer id) {
        logger.info("Attempting to delete request with ID: {}", id);
        Request request = getRequestById(id);
        requestRepository.delete(request);
        logger.info("Successfully deleted request with ID: {}", id);
    }
}
