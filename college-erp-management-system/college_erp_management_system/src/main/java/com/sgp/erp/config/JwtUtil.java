package com.sgp.erp.config;

import java.security.Key;
import java.util.Base64;
import java.util.Date;

import org.springframework.stereotype.Component;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Component
public class JwtUtil {
    private final Key SECRET_KEY;

    public JwtUtil() {
        System.out.println("enter jwtUtil");
        String base64Key = "IpPGd3Pc0dL2Pg6ujScN9f/rjPhhs8ayOA/GW0iO3qk="; // Replace with your generated key
        byte[] decodedKey = Base64.getDecoder().decode(base64Key);
        this.SECRET_KEY = Keys.hmacShaKeyFor(decodedKey);
        System.out.println(this.SECRET_KEY);
    }

    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // Token valid for 1 hour
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();
    }
}