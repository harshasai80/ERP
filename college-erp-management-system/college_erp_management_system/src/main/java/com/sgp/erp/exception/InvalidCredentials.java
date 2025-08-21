package com.sgp.erp.exception;

import java.io.Serial;

public class InvalidCredentials extends RuntimeException{
    @Serial
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
