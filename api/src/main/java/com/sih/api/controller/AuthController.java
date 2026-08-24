package com.sih.api.controller;
import com.sih.api.entity.User;
import com.sih.api.repository.UserRepository;
import com.sih.api.security.JwtUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Map;
import java.util.Optional;
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository userRepo;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder encoder;
    
    public AuthController(UserRepository userRepo, JwtUtils jwtUtils, PasswordEncoder encoder) {
        this.userRepo = userRepo; this.jwtUtils = jwtUtils; this.encoder = encoder;
    }
    
    @PostMapping("/login")
    public Map<String, String> authenticateUser(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");
        Optional<User> userOpt = userRepo.findByUsername(username);
        if (userOpt.isPresent() && encoder.matches(password, userOpt.get().getPassword())) {
            String jwt = jwtUtils.generateJwtToken(username, userOpt.get().getRole());
            return Map.of("token", jwt, "role", userOpt.get().getRole());
        }
        throw new RuntimeException("Invalid credentials");
    }
}
