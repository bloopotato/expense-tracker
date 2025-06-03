package com.example.backend.service;

import com.example.backend.dto.*;
import com.example.backend.mappers.UserMapper;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.util.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authManager;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    @Autowired
    private CategoryService catService;

    @Autowired
    private SecurityUtil securityUtil;

    public String register(User user) {
        Optional<User> userExists = userRepo.findByEmail(user.getEmail());
        if (userExists.isPresent()) throw new RuntimeException("User already exists");
        user.setPassword(encoder.encode(user.getPassword()));
        userRepo.save(user);
        // Create default categories
        catService.createDefaultCategories(user);
        // Generate token
        return jwtService.generateToken(user.getEmail());
    }

    public String login(LoginRequest loginRequest) {
        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        if (auth.isAuthenticated()) {
            return jwtService.generateToken(loginRequest.getEmail());
        }
        throw new RuntimeException("Authentication failed");
    }

    public UserDto getUserData() {
        User user = securityUtil.getUser();
        return userMapper.toUserDto(user);
    }

    public Object getAllUsers() {
        return userRepo.findAll()
                .stream()
                .map(userMapper::toUserDto)
                .toList();
    }

    public ProfileResponse updateProfile(ProfileRequest request) {
        User user = securityUtil.getUser();
        userMapper.updateModelFromRequest(request, user);
        User updatedUser = userRepo.save(user);
        return new ProfileResponse(jwtService.generateToken(user.getEmail()), userMapper.toUserDto(updatedUser));
    }

    public void updatePassword(PasswordRequest request) {
        User user = securityUtil.getUser();
        if (!encoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }
        user.setPassword(encoder.encode(request.getNewPassword()));
        userRepo.save(user);
    }
}
