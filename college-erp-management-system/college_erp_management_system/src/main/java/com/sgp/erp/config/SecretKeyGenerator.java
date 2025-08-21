package com.sgp.erp.config;

import java.util.Base64;

import javax.crypto.SecretKey;

import io.jsonwebtoken.security.Keys;

public class SecretKeyGenerator {
	public static void main(String[] args) {
		SecretKey key = Keys.secretKeyFor(io.jsonwebtoken.SignatureAlgorithm.HS256);
		String base64Key = Base64.getEncoder().encodeToString(key.getEncoded());
		System.out.println("Generated Base64 Secret Key: " + base64Key);
	}

}
