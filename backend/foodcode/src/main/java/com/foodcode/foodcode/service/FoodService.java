package com.foodcode.foodcode.service;

import com.foodcode.foodcode.entities.Food;
import com.foodcode.foodcode.repository.FoodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FoodService {

    @Autowired
    private FoodRepository foodRepository;

    public Food createFood(Food food) {
        return foodRepository.save(food);
    }

    public List<Food> getAllFoods() {
        return foodRepository.findAll();
    }

    public Optional<Food> getFoodById(String id) {
        return foodRepository.findById(id);
    }

    public Food updateFood(String id, Food foodDetails) {
        return foodRepository.findById(id).map(existingFood -> {
            existingFood.setTitle(foodDetails.getTitle());
            existingFood.setDescription(foodDetails.getDescription());
            existingFood.setQuantity(foodDetails.getQuantity());
            existingFood.setClaimed(foodDetails.isClaimed());
            existingFood.setDonorId(foodDetails.getDonorId());
            return foodRepository.save(existingFood);
        }).orElseThrow(() -> new RuntimeException("Food not found with id " + id));
    }

    public void deleteFood(String id) {
        foodRepository.deleteById(id);
    }

}
