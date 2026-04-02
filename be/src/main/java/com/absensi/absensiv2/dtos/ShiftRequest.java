package com.absensi.absensiv2.dtos;

import lombok.Data;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
public class ShiftRequest {

    private Integer userId;
    private Integer hariId;
    private Integer toleransiMenit;
    private LocalTime mulai;
    private LocalTime akhir;
}