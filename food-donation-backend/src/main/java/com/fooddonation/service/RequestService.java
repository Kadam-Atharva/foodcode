package com.fooddonation.service;

import com.fooddonation.model.Request;
import com.fooddonation.model.Request.RequestStatus;
import com.fooddonation.repository.RequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class RequestService {
    
    @Autowired
    private RequestRepository requestRepository;
    
    @Autowired
    private FoodDonationService foodDonationService;
    
    // Create new request
    public Request createRequest(Request request) {
        request.setStatus(RequestStatus.pending);
        return requestRepository.save(request);
    }
    
    // Get all requests
    public List<Request> getAllRequests() {
        return requestRepository.findAll();
    }
    
    // Get request by ID
    public Request getRequestById(Integer id) {
        return requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found with id: " + id));
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
        Request request = getRequestById(id);
        request.setStatus(status);
        
        // If request is approved, update donation status to claimed
        if (status == RequestStatus.approved) {
            foodDonationService.updateDonationStatus(
                request.getDonationId(), 
                com.fooddonation.model.FoodDonation.DonationStatus.claimed
            );
        }
        
        return requestRepository.save(request);
    }
    
    // Update request
    public Request updateRequest(Integer id, Request requestDetails) {
        Request request = getRequestById(id);
        request.setPickupTime(requestDetails.getPickupTime());
        request.setStatus(requestDetails.getStatus());
        return requestRepository.save(request);
    }
    
    // Delete request
    public void deleteRequest(Integer id) {
        Request request = getRequestById(id);
        requestRepository.delete(request);
    }
}
