package com.sgp.erp.exception;

import java.io.Serial;

public class FacultyNotFoundException extends RuntimeException {
    @Serial
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
