package com.absensi.absensiv2.dtos;

import com.absensi.absensiv2.enums.Hari;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class HariResponse {
    private Integer id;
    private String nama;
}