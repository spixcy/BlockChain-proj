package com.sih.api.security;
import io.jsonwebtoken.*;
import org.springframework.stereotype.Component;
import java.util.Date;
import java.security.Key;
import io.jsonwebtoken.security.Keys;
@Component
public class JwtUtils {
    // Hardcoded for hackathon MVP, use env vars in prod
    @org.springframework.beans.factory.annotation.Value("${jwt.secret:SIH26183HackathonSuperSecretKeyForJWTAuthThatIsLongEnoughButUseEnvVarInProd}")
    private String jwtSecret;
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

