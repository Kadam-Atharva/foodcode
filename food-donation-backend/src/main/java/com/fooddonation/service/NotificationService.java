package com.fooddonation.service;

import com.fooddonation.model.NotificationMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {
    
    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void sendNotification(Integer userId, String title, String message, String type) {
        NotificationMessage notification = new NotificationMessage(title, message, type);
        logger.info("Sending real-time notification to user {}: {}", userId, title);
        
        // STOMP sends to /user/{userId}/queue/notifications
        messagingTemplate.convertAndSendToUser(
            String.valueOf(userId), 
            "/queue/notifications", 
            notification
        );
    }

    public void broadcastNotification(String title, String message, String type) {
        NotificationMessage notification = new NotificationMessage(title, message, type);
        logger.info("Broadcasting real-time notification: {}", title);
        
        messagingTemplate.convertAndSend("/topic/public", notification);
    }
}
