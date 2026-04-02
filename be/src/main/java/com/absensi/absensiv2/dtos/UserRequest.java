package com.absensi.absensiv2.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserRequest {
    private Integer roleId;
    private Integer divisiId;
    private Integer mentorId;
    @NotBlank(message = "Username wajib diisi")
    @Size(max = 40)
    private String username;

    @Size(max = 40)
    @NotBlank(message = "Nim wajib diisi")
    private String nim;

//    @Size(max = 40)
    @Email(message = "Format email tidak valid")
    @NotBlank(message = "Email wajib diisi")
    private String email;

    @Size(min = 6, message = "Password minimal 6 karakter")
    private String password;
}
