package com.foodcode.foodcode.entities;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "donations")
public class Donation {

    @Id
    private String donationId;

    private String foodType;

    private String quantity;

    private String expiryTime;

    private String pickupAddress;

    private String description;

    private String imageUrl;

    private String status; // available, claimed, completed

    private String userId; // donor's userId

    private Double latitude;

    private Double longitude;

    private LocalDateTime createdDate;
}
