package com.absensi.absensiv2.dtos;

import com.absensi.absensiv2.enums.Hari;
import jakarta.persistence.Column;
import lombok.Data;

@Data
public class HariRequest {
    @Column(unique = true)
    private Hari nama;
}