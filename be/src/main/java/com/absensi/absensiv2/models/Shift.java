package com.absensi.absensiv2.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "shifts",
        uniqueConstraints = {
        @UniqueConstraint(
                name = "uk_user_hari",
                columnNames = {"user_id", "hari_id"}
        )
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Shift {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private Integer toleransiMenit;

    private LocalTime mulai;
    private LocalTime akhir;

    @ManyToOne
    @JoinColumn(name = "user_id", foreignKey = @ForeignKey(name = "fk_user_id", foreignKeyDefinition = "FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE"))
    private User user;

    // Mentor (self relation)
    @ManyToOne
    @JoinColumn(name = "hari_id", foreignKey = @ForeignKey(name = "fk_hari_id", foreignKeyDefinition = "FOREIGN KEY (hari_id) REFERENCES haris(id) ON DELETE CASCADE"))
    private Hari hari;


    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;
}