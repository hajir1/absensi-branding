package com.absensi.absensiv2.dtos;

import jakarta.persistence.Column;
import lombok.Data;

@Data
public class DivisiRequest {
    @Column(unique = true)
    private String nama;
}