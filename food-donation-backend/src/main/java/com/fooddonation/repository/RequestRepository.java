package com.fooddonation.repository;

import com.fooddonation.model.Request;
import com.fooddonation.model.Request.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RequestRepository extends JpaRepository<Request, Integer> {
    
    // Find requests by donation ID
    List<Request> findByDonationId(Integer donationId);
    
    // Find requests by receiver ID
    List<Request> findByReceiverId(Integer receiverId);
    
    // Find requests by status
    List<Request> findByStatus(RequestStatus status);
    
    // Find requests by receiver and status
    List<Request> findByReceiverIdAndStatus(Integer receiverId, RequestStatus status);
}
