package com.foodcode.foodcode.entities;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "users")
public class User {

    @Id
    private String userId;

    private String name;

    @Indexed(unique = true)
    private String email;

    private String password;

    private String phoneNumber;

    private String userType; // donor, receiver, admin

    private String address;

    private LocalDateTime createdDate;
}
