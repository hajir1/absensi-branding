package com.absensi.absensiv2.exceptions;

import com.absensi.absensiv2.dtos.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.CredentialsExpiredException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({
            UsernameNotFoundException.class,
            BadCredentialsException.class,
            CredentialsExpiredException.class,
            AuthenticationException.class,
            DisabledException.class
    })
    public ResponseEntity<ApiError> handleAuthException(Exception ex, HttpServletRequest req) {
        var apiError = ApiError.of(HttpStatus.BAD_REQUEST.value(), "bad request",ex.getMessage(),req.getRequestURI());
        return ResponseEntity.badRequest().body(apiError);
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<?> handleMaxSizeException(MaxUploadSizeExceededException ex) {

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Ukuran file maksimal 5MB");
        response.put("status", "PAYLOAD_TOO_LARGE");
        response.put("statusCode", 413);

        return ResponseEntity
                .status(HttpStatus.PAYLOAD_TOO_LARGE)
                .body(response);
    }

        // 🔴 VALIDASI DTO @Valid @RequestBody
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {

        String error = ex.getBindingResult()
                .getFieldErrors()
                .get(0)
                .getDefaultMessage();

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(
                        error,
                        "BAD_REQUEST",
                        HttpStatus.BAD_REQUEST
                ));
    }

    // 🔴 VALIDASI @RequestParam / @PathVariable
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleConstraint(ConstraintViolationException ex) {

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(
                        ex.getMessage(),
                        "BAD_REQUEST",
                        HttpStatus.BAD_REQUEST
                ));
    }

    // 🔴 Error dari ResponseStatusException
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ErrorResponse> handleResponseStatus(ResponseStatusException ex) {

        return ResponseEntity
                .status(ex.getStatusCode())
                .body(new ErrorResponse(
                        ex.getReason(),
                        "BAD REQUEST",
                        HttpStatus.valueOf(ex.getStatusCode().value())
                ));
    }

    // 🔴 Error database
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDatabase(Exception ex) {

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(
                        "Data tidak valid / duplikat",
                        "BAD_REQUEST",
                        HttpStatus.BAD_REQUEST
                ));
    }

    // 🔴 Fallback error
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleAll(Exception ex) {

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse(
                        ex.getMessage(),
                        "INTERNAL_SERVER_ERROR",
                        HttpStatus.INTERNAL_SERVER_ERROR
                ));
    }
}