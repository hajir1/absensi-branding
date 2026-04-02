package com.absensi.absensiv2.services;

import com.absensi.absensiv2.dtos.AbsensiResponse;
import com.absensi.absensiv2.dtos.UserRequest;
import com.absensi.absensiv2.dtos.UserResponse;
import com.absensi.absensiv2.dtos.WebResponse;
import com.absensi.absensiv2.enums.Role;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface UserService {
    WebResponse<UserResponse> createUser(UserRequest req, MultipartFile foto);
    WebResponse<UserResponse> getUserByEmail(String email);
    WebResponse<UserResponse> updateUser(UserRequest req, MultipartFile foto, String userId);
    void deleteUser(String userId);
    WebResponse<UserResponse> getUserById(String userId);
    Page<UserResponse> getAllUsers(int page, int size, String search);
    List<UserResponse> getUserByRole(String name);
}
