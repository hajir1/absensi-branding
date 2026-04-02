package com.absensi.absensiv2.services.impl;

import com.absensi.absensiv2.dtos.AbsensiResponse;
import com.absensi.absensiv2.dtos.ShiftRequest;
import com.absensi.absensiv2.dtos.ShiftResponse;
import com.absensi.absensiv2.dtos.WebResponse;
import com.absensi.absensiv2.models.*;
import com.absensi.absensiv2.repositories.*;
import com.absensi.absensiv2.services.ShiftService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ShiftServiceImpl implements ShiftService {
    private final ShiftRepository shiftRepository;
    private final HariRepository hariRepository;
    private final UserRepository userRepository;

    @Override
    public WebResponse<ShiftResponse> createShift(ShiftRequest req) {

        Shift shift = new Shift();
        User user = userRepository.findById(req.getUserId())
                .orElseThrow(() -> new RuntimeException("Nama Pengguna Tidak Ditemukan"));

        Hari hari = hariRepository.findById(req.getHariId())
                .orElseThrow(() -> new RuntimeException("Nama Hari Tidak Ditemukan"));

        if(req.getToleransiMenit() == null){
            shift.setToleransiMenit(60);
        }else{
            shift.setToleransiMenit(req.getToleransiMenit());
        }
        shift.setHari(hari);
        shift.setUser(user);
        shift.setAkhir(req.getAkhir());
        shift.setMulai(req.getMulai());

        Shift saved = shiftRepository.save(shift);

        ShiftResponse response = mapToResponse(saved);

        return WebResponse.<ShiftResponse>builder()
                .data(response)
                .build();
    }
    @Override
    public List<ShiftResponse> getShiftByUser(String userId) {
        return shiftRepository.findByUserId(Integer.parseInt(userId)).
                stream().
                map(this::mapToResponse).
                toList();
    }

    @Override
    public WebResponse<ShiftResponse> updateShift(ShiftRequest req, String shiftId) {
        Shift existingShift = shiftRepository.findById(Integer.parseInt(shiftId))
                .orElseThrow(()->new ResponseStatusException(HttpStatus.BAD_REQUEST,"Id Not Found"));
        if(req.getMulai() != null){
            existingShift.setMulai(req.getMulai());
        }
        if(req.getAkhir() != null){
            existingShift.setAkhir(req.getAkhir());
        }
        User user = userRepository.findById(req.getUserId())
                .orElseThrow(() -> new RuntimeException("Nama Pengguna Tidak Ditemukan"));

        Hari hari = hariRepository.findById(req.getHariId())
                .orElseThrow(() -> new RuntimeException("Nama Hari Tidak Ditemukan"));

        existingShift.setHari(hari);
        existingShift.setUser(user);


        Shift updatedShift = shiftRepository.save(existingShift);

        ShiftResponse response = mapToResponse(updatedShift);

        return WebResponse.<ShiftResponse>builder()
                .data(response)
                .errors(null)
                .build();
    }

    @Override
    public void deleteShift(String shiftId) {
        Shift shift = shiftRepository.findById(Integer.parseInt(shiftId))
                .orElseThrow(()->new ResponseStatusException(HttpStatus.BAD_REQUEST,"Id Not Found"));

        shiftRepository.delete(shift);
    }

    @Override
    public WebResponse<ShiftResponse> getShiftById(String id) {
        return null;
    }


    @Override
    public Page<ShiftResponse> getAllShifts(int page, int size, String search) {
        Pageable pageable = PageRequest.of(page, size);

        Page<Shift> shiftPage;

        if (search != null && !search.isBlank()) {
            shiftPage =
                    shiftRepository
                            .findByUser_UsernameContainingIgnoreCase(
                                    search,
                                    pageable
                            );
        } else {
            shiftPage =
                    shiftRepository
                            .findAllByOrderByCreatedAtDesc(pageable);
        }

        return shiftPage.map(this::mapToResponse);
    }


    private ShiftResponse mapToResponse(Shift shift) {
        Hari hari = shift.getHari();
        User user = shift.getUser();

        return ShiftResponse.builder()
                .id(shift.getId())
                .userId(user != null ? user.getId() : null)
                .UserName(user != null ? user.getUsername() : "null")
                .hariId(hari != null ? hari.getId() : null)
                .hariName(hari != null ? hari.getNama().name() : "null")
                .mulai(shift.getMulai())
                .akhir(shift.getAkhir())
                .toleransiMenit(shift.getToleransiMenit())
                .created_at(shift.getCreatedAt())
                .updated_at(shift.getUpdatedAt())
                .build();
    }
}
