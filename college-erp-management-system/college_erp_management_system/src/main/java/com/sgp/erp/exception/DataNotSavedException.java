package com.sgp.erp.exception;

import java.io.Serial;

public class DataNotSavedException extends RuntimeException {
    @Serial
    private static final long serialVersionUID = 1L;

    public DataNotSavedException() {
    }

    public DataNotSavedException(String message) {
        super(message);
    }
}
