package com.absensi.absensiv2.controllers;

import com.absensi.absensiv2.dtos.RoleRequest;
import com.absensi.absensiv2.dtos.RoleResponse;
import com.absensi.absensiv2.services.RoleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/roles")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;

    @PostMapping
    public RoleResponse create(@Valid @RequestBody RoleRequest req) {
        return roleService.create(req);
    }

    @GetMapping("/get")
    public List<RoleResponse> getAll() {
        return roleService.getAll();
    }

    @GetMapping("/{id}")
    public RoleResponse getById(@PathVariable Integer id) {
        return roleService.getById(id);
    }

    @PutMapping("/{id}")
    public RoleResponse update(
            @PathVariable Integer id,
            @RequestBody RoleRequest req
    ) {
        return roleService.update(id, req);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        roleService.delete(id);
    }
}