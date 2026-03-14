package com.fooddonation.repository;

import com.fooddonation.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Integer> {
    
    // Find feedback by donation ID
    List<Feedback> findByDonationId(Integer donationId);
    
    // Find feedback by user ID
    List<Feedback> findByUserId(Integer userId);
    
    // Find feedback by donation ID ordered by date
    List<Feedback> findByDonationIdOrderByFeedbackDateDesc(Integer donationId);
}
