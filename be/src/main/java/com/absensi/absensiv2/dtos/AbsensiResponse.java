package com.absensi.absensiv2.dtos;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Data
@Builder
public class AbsensiResponse {
    private Integer id;
    private Integer userId;
    private String userName;
    private Integer shiftId;
    private LocalDateTime shiftCreated_at;
    private String keterangan;
    private String status;
    private String jenis;
    private String foto;
    private String apporoval;
    private String alasanApporoval;
    private Boolean isPrivate;
    private LocalDate tanggal;
    private LocalDateTime created_at;
    private LocalDateTime updated_at;
}