package com.sgp.erp.exception;

public class StudentDoesExistException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    public StudentDoesExistException() {
    }

    public StudentDoesExistException(String message) {
        super(message);
    }

    @Override
    public String getMessage() {
        return "Student already exist...";
    }
}
