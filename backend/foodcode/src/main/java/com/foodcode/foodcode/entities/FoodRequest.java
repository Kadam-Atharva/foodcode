package com.foodcode.foodcode.entities;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "requests")
public class FoodRequest {

    @Id
    private String requestId;

    private String donationId;

    private String receiverId;

    private String status; // pending, approved, rejected

    private String pickupTime;

    private LocalDateTime requestDate;
}
