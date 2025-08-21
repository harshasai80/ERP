package com.sgp.erp.exception;

import java.io.Serial;

public class StudentNotDeletedException extends RuntimeException {
    @Serial
    private static final long serialVersionUID = 1L;

    public StudentNotDeletedException() {
    }

    public StudentNotDeletedException(String message) {
        super(message);
    }

    @Override
    public String getMessage() {
        return "Student not deleted...";
    }
}
