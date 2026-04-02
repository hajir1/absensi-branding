package com.absensi.absensiv2.dtos;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DivisiResponse {
    private Integer id;
    private String nama;
}