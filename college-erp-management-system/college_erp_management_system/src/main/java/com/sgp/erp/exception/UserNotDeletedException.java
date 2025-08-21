package com.sgp.erp.exception;

import java.io.Serial;

public class UserNotDeletedException extends RuntimeException {

    @Serial
    private static final long serialVersionUID = 1L;

    public UserNotDeletedException() {
    }

    public UserNotDeletedException(String message) {
        super(message);
    }

    @Override
    public String getMessage() {
        return "User not deleted...";
    }

}
