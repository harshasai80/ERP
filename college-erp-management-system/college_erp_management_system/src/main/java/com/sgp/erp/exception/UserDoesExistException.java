package com.sgp.erp.exception;

import java.io.Serial;

public class UserDoesExistException extends RuntimeException {
    @Serial
    private static final long serialVersionUID = 1L;

    public UserDoesExistException() {
    }

    public UserDoesExistException(String message) {
        super(message);
    }
}
