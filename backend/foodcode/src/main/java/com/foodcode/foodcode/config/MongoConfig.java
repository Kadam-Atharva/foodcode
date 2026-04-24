package com.foodcode.foodcode.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@Configuration
@EnableMongoRepositories(basePackages = "com.foodcode.foodcode.repository")
public class MongoConfig {
    // Spring Boot auto-configures MongoDB connection using application.properties
    // No custom bean needed for local MongoDB

    protected String getDatabaseName() {
        return "foodcode";   // 🔥 THIS FIXES YOUR ISSUE
    }

    @Bean
    public MongoClient mongoClient() {
        return MongoClients.create(
                "mongodb+srv://new_user:atharva@cluster0.7xf2l.mongodb.net"
        );
    }
}