package com.foodcode.foodcode.repository;

import com.foodcode.foodcode.entities.FoodRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodRequestRepository extends MongoRepository<FoodRequest, String> {
    List<FoodRequest> findByDonationId(String donationId);
    List<FoodRequest> findByReceiverId(String receiverId);
}
