package com.absensi.absensiv2.models;

import com.absensi.absensiv2.enums.Approval;
import com.absensi.absensiv2.enums.Jenis;
import com.absensi.absensiv2.enums.StatusAbsensi;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Table(name = "absensis",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_user_hari",
                        columnNames = {"user_id", "shift_id","tanggal","jenis"}
                )
        })
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Absensi {

    /**
     * enkasulapsi
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String foto;

    @Column(columnDefinition = "TEXT")
    private String keterangan;

    @Column(columnDefinition = "TEXT")
    private String alasanApproval;

    private Boolean isPrivate= true;

    @Enumerated(EnumType.STRING)
    private StatusAbsensi status;

    @Enumerated(EnumType.STRING)
    private Approval approval;

    @Enumerated(EnumType.STRING)
    private Jenis jenis;
    private LocalDate tanggal;
    @ManyToOne
    @JoinColumn(name = "user_id", foreignKey = @ForeignKey(name = "fk_user_id", foreignKeyDefinition = "FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE"))
    private User user;

    @ManyToOne
    @JoinColumn(name = "shift_id", foreignKey = @ForeignKey(name = "fk_shift_id", foreignKeyDefinition = "FOREIGN KEY (shift_id) REFERENCES shifts(id) ON DELETE CASCADE"))
    private Shift shift;

//    @Query("""
//            CREATE TRIGGER before_insert_users
//                BEFORE INSERT ON users
//                FOR EACH ROW
//                SET NEW.created_at = NOW();
//                SET NEW.updated_at = NOW();
//            """);

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();

    }



    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}