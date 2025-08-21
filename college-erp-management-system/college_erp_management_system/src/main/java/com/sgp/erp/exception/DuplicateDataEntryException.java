package com.sgp.erp.exception;

import java.io.Serial;

public class DuplicateDataEntryException extends RuntimeException {

    @Serial
    private static final long serialVersionUID = 1L;

    public DuplicateDataEntryException(String message) {
        super(message);
    }

}
