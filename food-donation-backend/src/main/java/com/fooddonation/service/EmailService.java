package com.fooddonation.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Async
    public void sendSimpleEmail(String to, String subject, String body) {
        if (fromEmail == null || fromEmail.equals("your-email@gmail.com")) {
            logger.warn("Email not sent to {}: SMTP credentials not configured in application.properties", to);
            return;
        }
        try {
            logger.info("Attempting to send email to: {} with subject: {}", to, subject);
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);

            mailSender.send(message);
            logger.info("Email sent successfully to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send email to: {}. Error: {}", to, e.getMessage());
        }
    }

    public void sendWelcomeEmail(String to, String name) {
        String subject = "Welcome to FoodCode! 🍽️";
        String body = "Hello " + name + ",\n\n" +
                "Welcome to FoodCode! Thank you for joining our mission to reduce food wastage and help the community.\n\n" +
                "You can now start donating food or requesting available food donations in your area.\n\n" +
                "Best regards,\n" +
                "The FoodCode Team";
        sendSimpleEmail(to, subject, body);
    }

    public void sendRequestUpdateEmail(String to, String foodType, String status) {
        String subject = "Update on your food request: " + status.toUpperCase();
        String body = "Hello,\n\n" +
                "Your request for '" + foodType + "' has been " + status + ".\n\n" +
                (status.equalsIgnoreCase("approved") ? "Please coordinate with the donor for the pickup." : "Thank you for your interest. Please browse other available donations.") + "\n\n" +
                "Best regards,\n" +
                "The FoodCode Team";
        sendSimpleEmail(to, subject, body);
    }
}
