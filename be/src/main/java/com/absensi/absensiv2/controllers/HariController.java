package com.absensi.absensiv2.controllers;

import com.absensi.absensiv2.dtos.HariRequest;
import com.absensi.absensiv2.dtos.HariResponse;
import com.absensi.absensiv2.enums.Hari;
import com.absensi.absensiv2.services.HariService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/haris")
@RequiredArgsConstructor
public class HariController {

    private final HariService hariService;

    @PostMapping
    public HariResponse create(@Valid @RequestBody HariRequest req) {
        return hariService.create(req);
    }

    @GetMapping
    public List<HariResponse> getAll() {
        return hariService.getAll();
    }

    @GetMapping("/{id}")
    public HariResponse getById(@PathVariable Integer id) {
        return hariService.getById(id);
    }

    @PutMapping("/{id}")
    public HariResponse update(
            @PathVariable Integer id,
            @RequestBody HariRequest req
    ) {
        return hariService.update(id, req);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        hariService.delete(id);
    }
}