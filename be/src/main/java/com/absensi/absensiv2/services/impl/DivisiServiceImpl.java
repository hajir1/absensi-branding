package com.absensi.absensiv2.services.impl;

import com.absensi.absensiv2.dtos.DivisiRequest;
import com.absensi.absensiv2.dtos.DivisiResponse;
import com.absensi.absensiv2.models.Divisi;
import com.absensi.absensiv2.repositories.DivisiRepository;
import com.absensi.absensiv2.services.DivisiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DivisiServiceImpl implements DivisiService {

    private final DivisiRepository divisiRepository;

    @Override
    public DivisiResponse create(DivisiRequest req) {

        if (divisiRepository.existsByNama(req.getNama())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Nama Divisi Sudah Ada"
            );
        }

        Divisi divisi = Divisi.builder()
                .nama(req.getNama())
                .build();

        divisiRepository.save(divisi);

        return DivisiResponse.builder()
                .id(divisi.getId())
                .nama(divisi.getNama())
                .build();
    }

    @Override
    public List<DivisiResponse> getAll() {
        return divisiRepository.findAll().stream()
                .map(r -> DivisiResponse.builder()
                        .id(r.getId())
                        .nama(r.getNama())
                        .build())
                .toList();
    }

    @Override
    public DivisiResponse getById(Integer id) {

        Divisi divisi = divisiRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Divisi Tidak Ditemukan"
                        ));

        return DivisiResponse.builder()
                .id(divisi.getId())
                .nama(divisi.getNama())
                .build();
    }

    @Override
    public DivisiResponse update(Integer id, DivisiRequest req) {

        Divisi divisi = divisiRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Divisi Tidak Ditemukan"
                        ));

        divisi.setNama(req.getNama());

        divisiRepository.save(divisi);

        return DivisiResponse.builder()
                .id(divisi.getId())
                .nama(divisi.getNama())
                .build();
    }

    @Override
    public void delete(Integer id) {

        Divisi divisi = divisiRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Divisi Tidak Ditemukan"
                        ));

        divisiRepository.delete(divisi);
    }
}