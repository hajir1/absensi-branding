package com.absensi.absensiv2.services.impl;

import com.absensi.absensiv2.dtos.RoleRequest;
import com.absensi.absensiv2.dtos.RoleResponse;
import com.absensi.absensiv2.models.Role;
import com.absensi.absensiv2.repositories.RoleRepository;
import com.absensi.absensiv2.services.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    @Override
    public RoleResponse create(RoleRequest req) {

        if (roleRepository.existsByNama(req.getNama())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Nama Role Sudah Ada"
            );
        }

        Role role = Role.builder()
                .nama(req.getNama())
                .build();

        roleRepository.save(role);

        return RoleResponse.builder()
                .id(Long.valueOf(role.getId()))
                .nama(role.getNama())
                .build();
    }

    @Override
    public List<RoleResponse> getAll() {
        return roleRepository.findByNamaNotIgnoreCase("Admin").stream()
                .map(r -> RoleResponse.builder()
                        .id(Long.valueOf(r.getId()))
                        .nama(r.getNama())
                        .build())
                .toList();
    }

    @Override
    public RoleResponse getById(Integer id) {

        Role role = roleRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Nama Role Tidak Ditemukan"
                        ));

        return RoleResponse.builder()
                .id(Long.valueOf(role.getId()))
                .nama(role.getNama())
                .build();
    }

    @Override
    public RoleResponse update(Integer id, RoleRequest req) {

        Role role = roleRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Nama Role Tidak Ditemukan"
                        ));

        role.setNama(req.getNama());

        roleRepository.save(role);

        return RoleResponse.builder()
                .id(Long.valueOf(role.getId()))
                .nama(role.getNama())
                .build();
    }

    @Override
    public void delete(Integer id) {

        Role role = roleRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Nama Role Tidak Ditemukan"
                        ));

        roleRepository.delete(role);
    }
}