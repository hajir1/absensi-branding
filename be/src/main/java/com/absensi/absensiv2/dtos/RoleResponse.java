package com.absensi.absensiv2.dtos;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RoleResponse {
    private Long id;
    private String nama;
}