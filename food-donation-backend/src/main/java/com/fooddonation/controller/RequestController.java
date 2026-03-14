package com.fooddonation.controller;

import com.fooddonation.model.Request;
import com.fooddonation.model.Request.RequestStatus;
import com.fooddonation.service.RequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "*")
public class RequestController {
    
    @Autowired
    private RequestService requestService;
    
    // Create new request
    @PostMapping
    public ResponseEntity<?> createRequest(@RequestBody Request request) {
        try {
            Request createdRequest = requestService.createRequest(request);
            return new ResponseEntity<>(createdRequest, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }
    
    // Get all requests
    @GetMapping
    public ResponseEntity<List<Request>> getAllRequests() {
        List<Request> requests = requestService.getAllRequests();
        return new ResponseEntity<>(requests, HttpStatus.OK);
    }
    
    // Get request by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getRequestById(@PathVariable Integer id) {
        try {
            Request request = requestService.getRequestById(id);
            return new ResponseEntity<>(request, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.NOT_FOUND);
        }
    }
    
    // Get requests by donation ID
    @GetMapping("/donation/{donationId}")
    public ResponseEntity<List<Request>> getRequestsByDonationId(@PathVariable Integer donationId) {
        List<Request> requests = requestService.getRequestsByDonationId(donationId);
        return new ResponseEntity<>(requests, HttpStatus.OK);
    }
    
    // Get requests by receiver ID
    @GetMapping("/receiver/{receiverId}")
    public ResponseEntity<List<Request>> getRequestsByReceiverId(@PathVariable Integer receiverId) {
        List<Request> requests = requestService.getRequestsByReceiverId(receiverId);
        return new ResponseEntity<>(requests, HttpStatus.OK);
    }
    
    // Update request status
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateRequestStatus(@PathVariable Integer id, @RequestBody Map<String, String> statusMap) {
        try {
            RequestStatus status = RequestStatus.valueOf(statusMap.get("status"));
            Request updatedRequest = requestService.updateRequestStatus(id, status);
            return new ResponseEntity<>(updatedRequest, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }
    
    // Update request
    @PutMapping("/{id}")
    public ResponseEntity<?> updateRequest(@PathVariable Integer id, @RequestBody Request request) {
        try {
            Request updatedRequest = requestService.updateRequest(id, request);
            return new ResponseEntity<>(updatedRequest, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.NOT_FOUND);
        }
    }
    
    // Delete request
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRequest(@PathVariable Integer id) {
        try {
            requestService.deleteRequest(id);
            return new ResponseEntity<>(Map.of("message", "Request deleted successfully"), HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.NOT_FOUND);
        }
    }
}
