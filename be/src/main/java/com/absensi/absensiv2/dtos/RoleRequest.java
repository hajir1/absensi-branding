package com.absensi.absensiv2.dtos;

import jakarta.persistence.Column;
import lombok.Data;

@Data
public class RoleRequest {
    @Column(unique = true)
    private String nama;
}