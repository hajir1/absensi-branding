package com.absensi.absensiv2.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserResponse {
    private Integer id;
    private String username;
    private Integer roleId;     // ✔️ bukan String
    private String roleName; // ✔️ camelCase
    private Integer divisiId;     // ✔️ bukan String
    private String divisiName; // ✔️ camelCase
    private Integer mentorId;     // ✔️ bukan String
    private String mentorName; // ✔️ camelCase
    private String nim;
    private String isVerify;
    private String foto;
    private String email;
    private LocalDateTime created_at;
    private LocalDateTime updated_at;

}
