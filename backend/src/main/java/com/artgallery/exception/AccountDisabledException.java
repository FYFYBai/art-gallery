package com.artgallery.exception;

public class AccountDisabledException extends RuntimeException {

    public AccountDisabledException() {
        super("Account is disabled");
    }

    public AccountDisabledException(String message) {
        super(message);
    }
}
