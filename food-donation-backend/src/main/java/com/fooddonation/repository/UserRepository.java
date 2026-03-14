package com.fooddonation.repository;

import com.fooddonation.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    
    // Find user by email
    Optional<User> findByEmail(String email);
    
    // Find user by email and password (for login)
    Optional<User> findByEmailAndPassword(String email, String password);
    
    // Check if email exists
    boolean existsByEmail(String email);
}
