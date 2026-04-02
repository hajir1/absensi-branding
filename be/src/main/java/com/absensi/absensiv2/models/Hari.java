package com.absensi.absensiv2.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Entity
@Table(name = "haris")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Hari {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(unique = true)
    private com.absensi.absensiv2.enums.Hari nama;

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
