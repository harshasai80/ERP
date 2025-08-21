package com.sgp.erp.exception;

import java.io.Serial;

public class StudentNotFoundException extends RuntimeException {
    @Serial
    private static final long serialVersionUID = 1L;

    @Override
    public String getMessage() {
        return "Student not found";
    }
}
