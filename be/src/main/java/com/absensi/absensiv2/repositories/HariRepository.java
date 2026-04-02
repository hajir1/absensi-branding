package com.absensi.absensiv2.repositories;

import com.absensi.absensiv2.models.Hari;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HariRepository extends JpaRepository<Hari, Integer> {

    Optional<Hari> findByNama(com.absensi.absensiv2.enums.Hari nama);

    boolean existsByNama(com.absensi.absensiv2.enums.Hari nama);
}