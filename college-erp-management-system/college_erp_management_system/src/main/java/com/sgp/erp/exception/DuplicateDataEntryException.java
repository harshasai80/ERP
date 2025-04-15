package com.sgp.erp.exception;

public class DuplicateDataEntryException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public DuplicateDataEntryException(String message) {
        super(message);
    }

}
