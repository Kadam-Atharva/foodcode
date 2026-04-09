package com.foodcode.foodcode.controller;

import com.foodcode.foodcode.entities.FoodRequest;
import com.foodcode.foodcode.service.FoodRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "*")
public class RequestController {

    @Autowired
    private FoodRequestService foodRequestService;

    @PostMapping
    public ResponseEntity<?> createRequest(@RequestBody FoodRequest request) {
        try {
            return ResponseEntity.ok(foodRequestService.createRequest(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public List<FoodRequest> getAllRequests() {
        return foodRequestService.getAllRequests();
    }

    @GetMapping("/{id}")
    public ResponseEntity<FoodRequest> getRequestById(@PathVariable String id) {
        return foodRequestService.getRequestById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/donation/{donationId}")
    public List<FoodRequest> getRequestsByDonationId(@PathVariable String donationId) {
        return foodRequestService.getRequestsByDonationId(donationId);
    }

    @GetMapping("/receiver/{receiverId}")
    public List<FoodRequest> getRequestsByReceiverId(@PathVariable String receiverId) {
        return foodRequestService.getRequestsByReceiverId(receiverId);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateRequestStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        try {
            return ResponseEntity.ok(foodRequestService.updateRequestStatus(id, body.get("status")));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRequest(@PathVariable String id, @RequestBody FoodRequest request) {
        try {
            return ResponseEntity.ok(foodRequestService.updateRequest(id, request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRequest(@PathVariable String id) {
        foodRequestService.deleteRequest(id);
        return ResponseEntity.noContent().build();
    }
}
