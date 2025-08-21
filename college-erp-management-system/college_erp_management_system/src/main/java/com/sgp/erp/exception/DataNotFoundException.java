package com.sgp.erp.exception;

import java.io.Serial;

public class DataNotFoundException extends RuntimeException {
    @Serial
    private static final long serialVersionUID = 1L;

    public DataNotFoundException() {
    }

    public DataNotFoundException(String message) {
        super(message);
    }

    @Override
    public String getMessage() {
        return "Data not found";
    }
}
