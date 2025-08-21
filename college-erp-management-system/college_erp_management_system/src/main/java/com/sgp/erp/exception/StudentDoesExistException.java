package com.sgp.erp.exception;

import java.io.Serial;

public class StudentDoesExistException extends RuntimeException {
    @Serial
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
