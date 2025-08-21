package com.sgp.erp.exception;

import java.io.Serial;

public class SubjectNotAssignedException extends RuntimeException {
    @Serial
    private static final long serialVersionUID = 1L;

    public SubjectNotAssignedException() {
    }

    public SubjectNotAssignedException(String message) {
        super(message);
    }

    @Override
    public String getMessage() {
        return "Subject Not Assigned";
    }
}
