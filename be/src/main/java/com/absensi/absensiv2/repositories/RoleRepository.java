package com.absensi.absensiv2.repositories;

import com.absensi.absensiv2.models.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Integer> {

    Optional<Role> findByNama(String nama);

    boolean existsByNama(String nama);

    List<Role> findByNamaNotIgnoreCase(String nama);


}