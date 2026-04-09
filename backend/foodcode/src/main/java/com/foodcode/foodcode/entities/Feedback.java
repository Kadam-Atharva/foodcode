package com.foodcode.foodcode.entities;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "feedbacks")
public class Feedback {

    @Id
    private String feedbackId;

    private String userId;

    private String donationId;

    private int rating;

    private String comment;

    private LocalDateTime feedbackDate;
}
