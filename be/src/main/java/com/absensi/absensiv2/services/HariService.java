package com.absensi.absensiv2.services;

import com.absensi.absensiv2.dtos.HariRequest;
import com.absensi.absensiv2.dtos.HariResponse;

import java.util.List;

public interface HariService {

    HariResponse create(HariRequest req);

    List<HariResponse> getAll();

    HariResponse getById(Integer id);

    HariResponse update(Integer id, HariRequest req);

    void delete(Integer id);
}