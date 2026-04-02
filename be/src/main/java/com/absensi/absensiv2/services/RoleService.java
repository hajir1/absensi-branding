package com.absensi.absensiv2.services;

import com.absensi.absensiv2.dtos.RoleRequest;
import com.absensi.absensiv2.dtos.RoleResponse;

import java.util.List;

public interface RoleService {

    RoleResponse create(RoleRequest req);

    List<RoleResponse> getAll();

    RoleResponse getById(Integer id);

    RoleResponse update(Integer id, RoleRequest req);

    void delete(Integer id);
}