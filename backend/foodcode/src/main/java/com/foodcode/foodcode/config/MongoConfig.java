package com.foodcode.foodcode.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;

@Configuration
public class MongoConfig extends AbstractMongoClientConfiguration {

    @Override
    protected String getDatabaseName() {
        return "foodcode";
    }

    @Bean
    public MongoClient mongoClient() {
        return MongoClients.create(
                "mongodb url"
        );
    }
}