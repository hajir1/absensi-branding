package com.absensi.absensiv2.dtos;

import org.springframework.http.HttpStatus;

public record ErrorResponse (
    String message,
    String status,
    HttpStatus statusCode
){}
