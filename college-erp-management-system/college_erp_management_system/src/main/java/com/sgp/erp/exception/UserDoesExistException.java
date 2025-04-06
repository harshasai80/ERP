package com.sgp.erp.exception;

public class UserDoesExistException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    public UserDoesExistException() {
    }

    public UserDoesExistException(String message) {
        super(message);
    }

    @Override
    public String getMessage() {
        return "Faculty already exist...";
    }
}
