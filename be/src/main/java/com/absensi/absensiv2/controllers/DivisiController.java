package com.absensi.absensiv2.controllers;

import com.absensi.absensiv2.dtos.DivisiRequest;
import com.absensi.absensiv2.dtos.DivisiResponse;
import com.absensi.absensiv2.services.DivisiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/divisis")
@RequiredArgsConstructor
public class DivisiController {

    private final DivisiService divisiService;

    @PostMapping
    public DivisiResponse create(@Valid @RequestBody DivisiRequest req) {
        return divisiService.create(req);
    }

    @GetMapping
    public List<DivisiResponse> getAll() {
        return divisiService.getAll();
    }

    @GetMapping("/{id}")
    public DivisiResponse getById(@PathVariable Integer id) {
        return divisiService.getById(id);
    }

    @PutMapping("/{id}")
    public DivisiResponse update(
            @PathVariable Integer id,
            @RequestBody DivisiRequest req
    ) {
        return divisiService.update(id, req);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        divisiService.delete(id);
    }
}