package com.absensi.absensiv2.repositories;

import com.absensi.absensiv2.models.Absensi;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AbsensiRepository extends JpaRepository<Absensi, Integer> {

    List<Absensi> findByUserId(Integer userId);

    Page<Absensi> findAllByOrderByCreatedAtDesc(Pageable pageable);
    Page<Absensi> findByUser_UsernameContainingIgnoreCase(
            String username,
            Pageable pageable
    );

    Page<Absensi> findByUser_IdAndUser_UsernameContainingIgnoreCase(
            Integer userId,
            String username,
            Pageable pageable
    );
    Page<Absensi> findByUserIdOrderByCreatedAtDesc(
            Integer userId,
            Pageable pageable
    );
    Page<Absensi> findByUser_Mentor_IdAndUser_UsernameContainingIgnoreCase(Integer mentorId,
                                                           String username,
                                                           Pageable pageable);
    Page<Absensi> findByUser_Mentor_IdOrderByCreatedAtDesc(
            Integer mentorId,
            Pageable pageable
    );
    Page<Absensi> findByIsPrivateAndUser_UsernameContainingIgnoreCase(
            Boolean n,String username,
            Pageable pageable
    );
    Page<Absensi> findByIsPrivateOrderByCreatedAtDesc(
            Boolean n,
            Pageable pageable
    );
}