package com.absensi.absensiv2.services;

import com.absensi.absensiv2.dtos.DivisiRequest;
import com.absensi.absensiv2.dtos.DivisiResponse;

import java.util.List;

public interface DivisiService {

    DivisiResponse create(DivisiRequest req);

    List<DivisiResponse> getAll();

    DivisiResponse getById(Integer id);

    DivisiResponse update(Integer id, DivisiRequest req);

    void delete(Integer id);
}