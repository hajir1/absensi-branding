package com.absensi.absensiv2.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;


@Data
public class LoginRequest {

    @NotBlank(message = "Email wajib diisi")
    @Email
    private String email;


    @NotBlank(message = "Password wajib diisi")
    @Size(min=5)
    private String password;
}
