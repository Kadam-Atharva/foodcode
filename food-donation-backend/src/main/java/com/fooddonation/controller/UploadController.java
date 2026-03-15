package com.fooddonation.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
public class UploadController {

    private static final Logger logger = LoggerFactory.getLogger(UploadController.class);

    // Directory to save upoaded images
    private final Path fileStorageLocation;

    public UploadController() {
        this.fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    @PostMapping("/image")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        logger.info("Received image upload request. File size: {} bytes", file.getSize());
        
        if (file.isEmpty()) {
            return new ResponseEntity<>(Map.of("error", "Please select a file to upload."), HttpStatus.BAD_REQUEST);
        }

        try {
            // Generate a unique file name
            String originalFileName = file.getOriginalFilename();
            if (originalFileName == null) {
                originalFileName = "unnamed";
            } else {
                originalFileName = StringUtils.cleanPath(originalFileName);
            }
            
            String fileExtension = "";
            if(originalFileName.contains(".")) {
                fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }
            
            String newFileName = UUID.randomUUID().toString() + fileExtension;

            // Copy file to the target location
            Path targetLocation = this.fileStorageLocation.resolve(newFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Construct the download/view URL
            String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/uploads/")
                    .path(newFileName)
                    .toUriString();

            logger.info("Successfully uploaded image to: {}", fileDownloadUri);
            
            return new ResponseEntity<>(Map.of("imageUrl", fileDownloadUri), HttpStatus.OK);
            
        } catch (IOException ex) {
            logger.error("Could not store file. Please try again!", ex);
            return new ResponseEntity<>(Map.of("error", "Could not store file. Please try again!"), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
