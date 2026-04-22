package com.absensi.absensiv2.dtos;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalTime;


@Data
public class AbsensiRequest {
    private Integer userId;
    private Integer shiftId;
    private String keterangan;
    private String status;
    private String jenis;
    private String foto;
    private Boolean isPrivate;
}
