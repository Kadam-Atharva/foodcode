package com.fooddonation.repository;

import com.fooddonation.model.FoodDonation;
import com.fooddonation.model.FoodDonation.DonationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FoodDonationRepository extends JpaRepository<FoodDonation, Integer> {
    
    // Find donations by user ID
    List<FoodDonation> findByUserId(Integer userId);
    
    // Find donations by status
    List<FoodDonation> findByStatus(DonationStatus status);
    
    // Find available donations
    List<FoodDonation> findByStatusOrderByCreatedDateDesc(DonationStatus status);
    
    // Find donations by food type
    List<FoodDonation> findByFoodTypeContainingIgnoreCase(String foodType);
}
