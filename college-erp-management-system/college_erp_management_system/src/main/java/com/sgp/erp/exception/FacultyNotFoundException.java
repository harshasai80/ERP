package com.sgp.erp.exception;

public class FacultyNotFoundException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    public FacultyNotFoundException() {
    }

    public FacultyNotFoundException(String message) {
        super(message);
    }

    @Override
    public String getMessage() {
        return "Faculty not found";
    }
}
