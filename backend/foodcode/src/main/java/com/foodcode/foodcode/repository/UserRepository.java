package com.foodcode.foodcode.repository;

import com.foodcode.foodcode.entities.User;
import com.mongodb.client.MongoClient;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
}
