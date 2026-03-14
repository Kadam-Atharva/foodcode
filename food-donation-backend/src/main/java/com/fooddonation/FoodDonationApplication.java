package com.fooddonation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FoodDonationApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(FoodDonationApplication.class, args);
        System.out.println("Food Donation Platform is running on http://localhost:8080");
    }
}
