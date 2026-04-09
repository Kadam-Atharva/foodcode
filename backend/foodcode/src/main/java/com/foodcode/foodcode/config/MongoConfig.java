package com.foodcode.foodcode.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@Configuration
@EnableMongoRepositories(basePackages = "com.foodcode.foodcode.repository")
public class MongoConfig {
    // Spring Boot auto-configures MongoDB connection using application.properties
    // No custom bean needed for local MongoDB
}