package com.absensi.absensiv2.repositories;

import com.absensi.absensiv2.models.Absensi;
import com.absensi.absensiv2.models.Divisi;
import com.absensi.absensiv2.models.Role;
import com.absensi.absensiv2.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByRole_Nama(String nama);
    boolean existsByRole_Nama(String nama);
    List<User> findByDivisi_Nama(String nama);
    List<User> findByMentor_Username(String nama);
    Page<User> findAllByOrderByCreatedAtDesc(Pageable pageable);
    Page<User> findByUsernameContainingIgnoreCase(
            String username,
            Pageable pageable
    );


//    @Query(value = """
//    SELECT
//        COUNT(CASE WHEN r.nama = 'HADIR' THEN 1 END) AS hadir,
//        COUNT(CASE WHEN status = 'izin' THEN 1 END) AS izin,
//        COUNT(CASE WHEN status = 'sakit' THEN 1 END) AS sakit,
//        COUNT(CASE WHEN status = 'alfa' THEN 1 END) AS alfa
//    FROM absensi a jpin roles r on a.roleId = r.id
//    WHERE mentor = :mentor
//    """, nativeQuery = true)
//        Object[] getRekapByMentor(@Param("mentor") String mentor);
}