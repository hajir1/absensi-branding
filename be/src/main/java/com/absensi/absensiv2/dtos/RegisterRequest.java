package com.absensi.absensiv2.dtos;


import com.absensi.absensiv2.enums.Divisi;
import com.absensi.absensiv2.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    private Integer roleId;
    private Divisi divisi;
    @NotBlank(message = "Username wajib diisi")
    @Size(max = 40)
    private String username;

    @Size(max = 40)
    @Email(message = "Format email tidak valid")
    @NotBlank(message = "Email wajib diisi")
    private String email;

    @Size(min = 6, message = "Password minimal 6 karakter")
    private String password;
}
