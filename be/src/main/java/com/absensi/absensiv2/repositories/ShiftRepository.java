package com.absensi.absensiv2.repositories;

import com.absensi.absensiv2.models.Absensi;
import com.absensi.absensiv2.models.Shift;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ShiftRepository extends JpaRepository<Shift, Integer> {

    List<Shift> findByUserId(Integer userId);

    Page<Shift> findAllByOrderByCreatedAtDesc(Pageable pageable);
    Page<Shift> findByUser_UsernameContainingIgnoreCase(
            String username,
            Pageable pageable
    );
}