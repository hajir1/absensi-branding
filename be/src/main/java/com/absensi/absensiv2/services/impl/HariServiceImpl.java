package com.absensi.absensiv2.services.impl;

import com.absensi.absensiv2.dtos.HariRequest;
import com.absensi.absensiv2.dtos.HariResponse;
import com.absensi.absensiv2.models.Hari;
import com.absensi.absensiv2.repositories.HariRepository;
import com.absensi.absensiv2.services.HariService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HariServiceImpl implements HariService {

    private final HariRepository hariRepository;

    @Override
    public HariResponse create(HariRequest req) {

        if (hariRepository.existsByNama(req.getNama())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Nama Hari Sudah Ada"
            );
        }

        Hari hari = Hari.builder()
                .nama(req.getNama())
                .build();

        hariRepository.save(hari);

        return HariResponse.builder()
                .id(hari.getId())
                .nama(String.valueOf(req.getNama()))
                .build();
    }

    @Override
    public List<HariResponse> getAll() {
        return hariRepository.findAll().stream()
                .map(r -> HariResponse.builder()
                        .id(r.getId())
                        .nama(String.valueOf(r.getNama()))
                        .build())
                .toList();
    }

    @Override
    public HariResponse getById(Integer id) {

        Hari hari = hariRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Nama Hari Tidak Ditemukan"
                        ));

        return HariResponse.builder()
                .id(hari.getId())
                .nama(String.valueOf(hari.getNama()))
                .build();
    }

    @Override
    public HariResponse update(Integer id, HariRequest req) {

        Hari hari = hariRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Nama Hari Tidak Ditemukan"
                        ));

                hari.setNama(req.getNama());

        hariRepository.save(hari);

        return HariResponse.builder()
                .id(hari.getId())
                .nama(String.valueOf(hari.getNama()))

                .build();
    }

    @Override
    public void delete(Integer id) {

        Hari hari = hariRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Nama Hari Tidak Ditemukan"
                        ));

        hariRepository.delete(hari);
    }
}