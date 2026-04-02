package com.absensi.absensiv2.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.LocalTime;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ShiftResponse {
    private Integer id;
    private LocalTime mulai;
    private LocalTime akhir;
    private Integer toleransiMenit;
    private Integer hariId;     // ✔️ bukan String
    private String hariName; // ✔️ camelCase
    private Integer userId;     // ✔️ bukan String
    private String UserName; // ✔️ camelCase
    private LocalDateTime created_at;
    private LocalDateTime updated_at;
}
