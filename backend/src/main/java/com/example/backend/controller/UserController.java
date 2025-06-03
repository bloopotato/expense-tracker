package com.example.backend.controller;

import com.example.backend.dto.*;
import com.example.backend.model.User;
import com.example.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/auth/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            String token = userService.register(user);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Collections.singletonMap("token", token));
        } catch (Exception e) {
            String message = e.getMessage();
            if (message.equals("User already exists")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Collections.singletonMap("error", "You already have an account"));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Collections.singletonMap("error", "Registration failed"));
            }
        }
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            System.out.println("email: " + request.getEmail() + " password: " + request.getPassword() );
            String token = userService.login(request);
            return ResponseEntity.ok()
                    .body(Collections.singletonMap("token", token));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("error", "Invalid credentials"));
        }
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        try {
            return ResponseEntity.ok()
                    .body(userService.getAllUsers());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Unable to fetch users"));
        }
    }

    // Get user's own data
    @GetMapping("/users/profile")
    public ResponseEntity<?> getUserById() {
        UserDto user = userService.getUserData();
        return ResponseEntity.ok()
                .body(user);
    }

    // Update profile info
    @PutMapping("/users/profile")
    public ResponseEntity<?> updateProfile(@RequestBody ProfileRequest request) {
        try {
            ProfileResponse response = userService.updateProfile(request);
            return ResponseEntity.ok()
                    .body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("error", "Profile update failed"));
        }
    }

    // Update password
    @PutMapping("/users/password")
    public ResponseEntity<?> updatePassword(@RequestBody PasswordRequest request) {
        try {
            userService.updatePassword(request);
            return ResponseEntity.ok()
                    .body(Collections.singletonMap("message", "Password updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("error", "Password update failed"));
        }
    }
}
