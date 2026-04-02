package com.absensi.absensiv2.models;

import com.absensi.absensiv2.enums.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Entity
@Table(name = "divisis")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Divisi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nama;

    @Column(nullable = false, updatable = false)
    private LocalDateTime created_at;

    @Column(nullable = false)
    private LocalDateTime updated_at;

    @PrePersist
    public void prePersist() {
        created_at = LocalDateTime.now();
        updated_at = LocalDateTime.now();
    }
}
