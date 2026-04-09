package com.foodcode.foodcode.repository;

import com.foodcode.foodcode.entities.Donation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DonationRepository extends MongoRepository<Donation, String> {
    List<Donation> findByUserId(String userId);
    List<Donation> findByStatus(String status);
    List<Donation> findByFoodTypeContainingIgnoreCase(String foodType);
}
