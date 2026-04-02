package com.absensi.absensiv2.controllers;


import com.absensi.absensiv2.dtos.UserRequest;
import com.absensi.absensiv2.dtos.UserResponse;
import com.absensi.absensiv2.dtos.WebResponse;
import com.absensi.absensiv2.enums.Role;
import com.absensi.absensiv2.services.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@AllArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<WebResponse<UserResponse>> createUser(
            @Valid @RequestPart("data") UserRequest req, @RequestPart(value = "foto",required = false) MultipartFile foto
    ) {
        WebResponse<UserResponse> response = userService.createUser(req,foto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<WebResponse<UserResponse>> getUserByEmail(
            @PathVariable String email
    ){
        WebResponse<UserResponse> response = userService.getUserByEmail(email);
        return ResponseEntity.ok(response);
    }
    @GetMapping("/{userId:\\d+}")
    public ResponseEntity<WebResponse<UserResponse>> getUserById(
            @PathVariable String userId
    ){
        WebResponse<UserResponse> response = userService.getUserById(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public Page<UserResponse> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "1") int size,
            @RequestParam(required = false) String search
    ){
        return userService.getAllUsers(page,size,search);
    }
    @GetMapping("/role/{role}")
    public List<UserResponse> getUserByRole(@PathVariable String role) {
        return userService.getUserByRole(role);
    }

    @DeleteMapping("/{userId}")
    public void deleteUserById(
            @PathVariable String userId
    ){
        userService.deleteUser(userId);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<WebResponse<UserResponse>> updateUser(
            @RequestPart("data") UserRequest req, @RequestPart(value = "foto",required = false) MultipartFile foto, @PathVariable String userId
    ){
        WebResponse<UserResponse> response = userService.updateUser(req,foto,userId);
        return ResponseEntity.ok(response);
    }
}
