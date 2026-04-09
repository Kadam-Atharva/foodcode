package com.foodcode.foodcode.repository;

import com.foodcode.foodcode.entities.Feedback;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends MongoRepository<Feedback, String> {
    List<Feedback> findByDonationId(String donationId);
    List<Feedback> findByUserId(String userId);
}
