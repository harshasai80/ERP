package com.sgp.erp.exception;

public class DataNotSavedException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    public DataNotSavedException() {
    }

    public DataNotSavedException(String message) {
        super(message);
    }

    @Override
    public String getMessage() {
        return "Data not saved";
    }
}
