package com.absensi.absensiv2.exceptions;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;

/**
 * modul 7
 * @param status
 * @param error
 * @param message
 * @param path
 * @param offsetDatetime
 */
public record ApiError(int status, String error, String message, String path, OffsetDateTime offsetDatetime ) {
    public static ApiError of(int status, String error, String message, String path){
        return new ApiError(status, error, message, path, OffsetDateTime.now(ZoneOffset.UTC));
    }
    public static ApiError of(int status, String error, String message, String path, boolean notDatetime){
        return new ApiError(status, error, message, path,null);
    }
}
