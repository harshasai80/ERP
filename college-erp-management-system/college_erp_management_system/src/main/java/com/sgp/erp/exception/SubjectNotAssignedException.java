package com.sgp.erp.exception;

public class SubjectNotAssignedException extends RuntimeException {
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
