import os

base_dir = "api/src/main/java/com/sih/api"
os.makedirs(f"{base_dir}/security", exist_ok=True)
os.makedirs(f"{base_dir}/controller", exist_ok=True)
os.makedirs(f"{base_dir}/config", exist_ok=True)

files = {
    "security/JwtUtils.java": """package com.sih.api.security;
import io.jsonwebtoken.*;
import org.springframework.stereotype.Component;
import java.util.Date;
import java.security.Key;
import io.jsonwebtoken.security.Keys;
@Component
public class JwtUtils {
    // Hardcoded for hackathon MVP, use env vars in prod
    private final String jwtSecret = "SIH26183HackathonSuperSecretKeyForJWTAuthThatIsLongEnough";
    private final int jwtExpirationMs = 86400000;
    private Key key() { return Keys.hmacShaKeyFor(jwtSecret.getBytes()); }
    
    public String generateJwtToken(String username, String role) {
        return Jwts.builder()
            .setSubject((username))
            .claim("role", role)
            .setIssuedAt(new Date())
            .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
            .signWith(key(), SignatureAlgorithm.HS256)
            .compact();
    }
    public String getUserNameFromJwtToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key()).build().parseClaimsJws(token).getBody().getSubject();
    }
    public boolean validateJwtToken(String authToken) {
        try { Jwts.parserBuilder().setSigningKey(key()).build().parseClaimsJws(authToken); return true; }
        catch (Exception e) { return false; }
    }
}
""",
    "security/AuthTokenFilter.java": """package com.sih.api.security;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.Collections;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

public class AuthTokenFilter extends OncePerRequestFilter {
    private JwtUtils jwtUtils;
    public AuthTokenFilter(JwtUtils jwtUtils) { this.jwtUtils = jwtUtils; }
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String jwt = parseJwt(request);
            if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
                String username = jwtUtils.getUserNameFromJwtToken(jwt);
                // Simplify authorities for MVP
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        username, null, Collections.singletonList(new SimpleGrantedAuthority("ROLE_INVESTIGATOR")));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception e) { }
        filterChain.doFilter(request, response);
    }
    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        if (headerAuth != null && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }
        return null;
    }
}
""",
    "security/WebSecurityConfig.java": """package com.sih.api.security;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.config.http.SessionCreationPolicy;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {
    private final JwtUtils jwtUtils;
    public WebSecurityConfig(JwtUtils jwtUtils) { this.jwtUtils = jwtUtils; }
    
    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter() { return new AuthTokenFilter(jwtUtils); }
    
    @Bean
    public PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors(cors -> cors.disable()).csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> 
                auth.requestMatchers("/api/auth/**").permitAll()
                    .requestMatchers("/health").permitAll()
                    .anyRequest().authenticated()
            );
        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
""",
    "controller/AuthController.java": """package com.sih.api.controller;
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
""",
    "config/DataLoader.java": """package com.sih.api.config;
import com.sih.api.entity.User;
import com.sih.api.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.password.PasswordEncoder;

@Component
public class DataLoader implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataLoader(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("ADMIN");
            userRepository.save(admin);

            User investigator = new User();
            investigator.setUsername("investigator");
            investigator.setPassword(passwordEncoder.encode("investigator123"));
            investigator.setRole("INVESTIGATOR");
            userRepository.save(investigator);
        }
    }
}
"""
}

for filepath, content in files.items():
    with open(f"{base_dir}/{filepath}", "w") as f:
        f.write(content)

print("Spring Security and Auth boilerplate generated successfully.")
