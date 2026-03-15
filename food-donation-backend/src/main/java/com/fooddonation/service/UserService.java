package com.fooddonation.service;

import com.fooddonation.model.User;
import com.fooddonation.repository.UserRepository;
import com.fooddonation.exception.BadRequestException;
import com.fooddonation.exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;
    
    public User createUser(User user) {
        logger.info("Attempting to create a new user with email: {}", user.getEmail());
        if (userRepository.existsByEmail(user.getEmail())) {
            logger.warn("Registration failed. Email already exists: {}", user.getEmail());
            throw new BadRequestException("Email already exists: " + user.getEmail());
        }
        User savedUser = userRepository.save(user);
        logger.info("Successfully created user with ID: {}", savedUser.getUserId());
        
        // Send welcome email (wrapped in try-catch for safety)
        try {
            emailService.sendWelcomeEmail(savedUser.getEmail(), savedUser.getName());
        } catch (Exception e) {
            logger.error("Could not trigger welcome email for user {}: {}", savedUser.getEmail(), e.getMessage());
        }
        
        return savedUser;
    }
    
    // Login user
    public User loginUser(String email, String password) {
        logger.info("Attempting login for email: {}", email);
        Optional<User> user = userRepository.findByEmailAndPassword(email, password);
        if (user.isPresent()) {
            logger.info("Login successful for email: {}", email);
            return user.get();
        }
        logger.warn("Login failed for email: {}. Invalid credentials.", email);
        throw new BadRequestException("Invalid email or password");
    }
    
    // Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    // Get user by ID
    public User getUserById(Integer id) {
        logger.debug("Fetching user by ID: {}", id);
        return userRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("User not found with id: {}", id);
                    return new ResourceNotFoundException("User not found with id: " + id);
                });
    }
    
    // Update user
    public User updateUser(Integer id, User userDetails) {
        logger.info("Updating user details for ID: {}", id);
        User user = getUserById(id);
        user.setName(userDetails.getName());
        user.setPhoneNumber(userDetails.getPhoneNumber());
        user.setAddress(userDetails.getAddress());
        User updated = userRepository.save(user);
        logger.info("Successfully updated user details for ID: {}", id);
        return updated;
    }
    
    // Delete user
    public void deleteUser(Integer id) {
        logger.info("Attempting to delete user with ID: {}", id);
        User user = getUserById(id);
        userRepository.delete(user);
        logger.info("Successfully deleted user with ID: {}", id);
    }
}
