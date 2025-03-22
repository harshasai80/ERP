package com.sgp.erp.exception;

public class InvalidCredentials extends RuntimeException{
    private static final long serialVersionUID = 1L;

    public InvalidCredentials() {
    }

    public InvalidCredentials(String message) {
        super(message);
    }

    @Override
    public String getMessage() {
        return "Invalid credentials";
    }
}
