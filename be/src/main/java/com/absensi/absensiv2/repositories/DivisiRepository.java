package com.absensi.absensiv2.repositories;

import com.absensi.absensiv2.models.Divisi;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DivisiRepository extends JpaRepository<Divisi, Integer> {

    Optional<Divisi> findByNama(String nama);

    boolean existsByNama(String nama);
}