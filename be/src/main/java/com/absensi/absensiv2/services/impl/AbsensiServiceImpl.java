package com.absensi.absensiv2.services.impl;

import com.absensi.absensiv2.dtos.AbsensiRequest;
import com.absensi.absensiv2.dtos.AbsensiResponse;
import com.absensi.absensiv2.dtos.ApprovalRequest;
import com.absensi.absensiv2.dtos.WebResponse;
import com.absensi.absensiv2.enums.Approval;
import com.absensi.absensiv2.enums.Jenis;
import com.absensi.absensiv2.enums.StatusAbsensi;
import com.absensi.absensiv2.models.*;
import com.absensi.absensiv2.repositories.*;
import com.absensi.absensiv2.services.AbsensiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
@Service
@RequiredArgsConstructor
public class AbsensiServiceImpl implements AbsensiService {
    private final AbsensiRepository absensiRepository;
    private final ShiftRepository shiftRepository;
    private final UserRepository userRepository;

    @Override
    public WebResponse<AbsensiResponse> createAbsensi(AbsensiRequest req, MultipartFile foto ) {

        /**
         * modul 1
         */
        Absensi absensi = new Absensi();
        User user = userRepository.findById(req.getUserId())
                .orElseThrow(() -> new RuntimeException("Nama Pengguna Tidak Ditemukan"));

        Shift shift = shiftRepository.findById(req.getShiftId())
                .orElseThrow(() -> new RuntimeException("Shift Tidak Ditemukan"));

        LocalDateTime waktuAbsensi = LocalDateTime.now();
        LocalTime jamAbsensi = waktuAbsensi.toLocalTime();
        LocalTime jamShift = shift.getMulai();


        /**
         * logika 08:00 + 60 = 09:00
         */
        LocalTime batasTelat = jamShift.plusMinutes(shift.getToleransiMenit());
        /**
         * apakah batas telat terjadi setelah jam absensi??
         * absen setelah jam 09:00??
         */
        if(jamAbsensi.isAfter(batasTelat) && req.getJenis().equals("DATANG")){
            absensi.setStatus(StatusAbsensi.TERLAMBAT);
        }else{
            absensi.setStatus(StatusAbsensi.valueOf(req.getStatus()));
        }
        absensi.setUser(user);
        absensi.setShift(shift);
        absensi.setKeterangan(req.getKeterangan());
        absensi.setIsPrivate(req.getIsPrivate());
        absensi.setJenis(Jenis.valueOf(req.getJenis()));
        absensi.setApproval(Approval.PENDING);
        if(absensi.getTanggal() == null){
            absensi.setTanggal(LocalDate.now());
        }
        if (foto != null && !foto.isEmpty()) {
            try {
                String uploadDir = "D:/all-tugas/basdat-smt2/upload-img/absensi/"+ user.getUsername();
                new File(uploadDir).mkdirs();

                String fileName = System.currentTimeMillis() + "_" + foto.getOriginalFilename();
                File destination = new File(uploadDir, fileName);
                foto.transferTo(destination);

                absensi.setFoto(fileName); // simpan nama/path di DB

            } catch (IOException e) {
                e.printStackTrace(); // atau pakai logger
                throw new RuntimeException("Upload gagal: " + e.getMessage());
            }
        }


        Absensi saved = absensiRepository.save(absensi);

        AbsensiResponse response = mapToResponse(saved);

        return WebResponse.<AbsensiResponse>builder()
                .data(response)
                .build();
    }
    @Override
    public Page<AbsensiResponse> getAllAbsensis(int page, int size, String search) {
        Pageable pageable = PageRequest.of(page, size);

        Page<Absensi> absensiPage;

        if (search != null && !search.isBlank()) {
            absensiPage =
                    absensiRepository
                            .findByUser_UsernameContainingIgnoreCase(
                                    search,
                                    pageable
                            );
        } else {
            absensiPage =
                    absensiRepository
                            .findAllByOrderByCreatedAtDesc(pageable);
        }

        return absensiPage.map(this::mapToResponse);
    }


    @Override
    public Page<AbsensiResponse> getAbsensiByUser(
            String userId,
            int page,
            int size,
            String search
    ) {

        Pageable pageable = PageRequest.of(page, size);

        Integer uid = Integer.parseInt(userId);

        Page<Absensi> absensiPage;

        if (search != null && !search.isBlank()) {
            absensiPage =
                    absensiRepository
                            .findByUser_IdAndUser_UsernameContainingIgnoreCase(
                                    uid,
                                    search,
                                    pageable
                            );
        } else {
            absensiPage =
                    absensiRepository
                            .findByUserIdOrderByCreatedAtDesc(
                                    uid,
                                    pageable
                            );
        }

        return absensiPage.map(this::mapToResponse);
    }
    public Page<AbsensiResponse> getAbsensiByMentor(Integer mentorId, int page, int size, String search) {
        Pageable pageable = PageRequest.of(page, size);


        Page<Absensi> absensiPage;

        if (search != null && !search.isBlank()) {
            absensiPage =
                    absensiRepository
                            .findByUser_Mentor_IdAndUser_UsernameContainingIgnoreCase(
                                    mentorId,
                                    search,
                                    pageable
                            );
        } else {
            absensiPage =
                    absensiRepository
                            .findByUser_Mentor_IdOrderByCreatedAtDesc(
                                    mentorId,
                                    pageable
                            );
        }

        return absensiPage.map(this::mapToResponse);
    }
    public Page<AbsensiResponse> getAbsensiByIsPrivate(Boolean n, int page, int size, String search) {
        Pageable pageable = PageRequest.of(page, size);


        Page<Absensi> absensiPage;

        if (search != null && !search.isBlank()) {
            absensiPage =
                    absensiRepository
                            .findByIsPrivateAndUser_UsernameContainingIgnoreCase(
                                    n,
                                    search,
                                    pageable
                            );
        } else {
            absensiPage =
                    absensiRepository
                            .findByIsPrivateOrderByCreatedAtDesc(
                                    n,
                                    pageable
                            );
        }

        return absensiPage.map(this::mapToResponse);
    }

    @Override
    public WebResponse<AbsensiResponse> updateAbsensi(AbsensiRequest req,MultipartFile foto, String absensiId) {
        Absensi existingAbsensi = absensiRepository.findById(Integer.parseInt(absensiId))
                .orElseThrow(()->new ResponseStatusException(HttpStatus.BAD_REQUEST,"Id Not Found"));
        if(req.getKeterangan() != null){
            existingAbsensi.setKeterangan(req.getKeterangan());
        }

//        START TRANSACTION;
//
//        -- 1. Lock data absensi
//        SELECT approval
//        FROM absensis
//        WHERE id = 10
//        AND approval = 'PENDING'
//        FOR UPDATE;
//
//        -- cek apakah ada row yang berubah
//                -- kalau ROW_COUNT() = 0 → berarti bukan PENDING → ROLLBACK
//
//                -- 3. Update approval
//        UPDATE absensis
//        SET approval = 'DISETUJUI',
//                updated_at = NOW()
//        WHERE id = 10;
//
//        COMMIT;
//        if(!String.valueOf(existingAbsensi.getApproval()).equals("PENDING")){
//            throw new ResponseStatusException(
//                    HttpStatus.BAD_REQUEST,
//                    "Bukan Pending"
//            );
//        }

        if(req.getStatus() != null){
            existingAbsensi.setStatus(StatusAbsensi.valueOf(req.getStatus()));
        }
        if(req.getJenis() != null){
            existingAbsensi.setJenis(Jenis.valueOf(req.getJenis()));
        }
        User user = userRepository.findById(req.getUserId())
                .orElseThrow(() -> new RuntimeException("Nama Pengguna Tidak Ditemukan"));

        Shift shift = shiftRepository.findById(req.getShiftId())
                .orElseThrow(() -> new RuntimeException("Nama Hari Tidak Ditemukan"));

        existingAbsensi.setShift(shift);
        existingAbsensi.setUser(user);
        if (foto != null && !foto.isEmpty()) {
            try {
                String uploadDir = "D:/all-tugas/basdat-smt2/upload-img/absensi/"+ user.getUsername();
                new File(uploadDir).mkdirs();

                // 1. Hapus foto lama
                if (existingAbsensi.getFoto() != null) {
                    File oldFile = new File(uploadDir + existingAbsensi.getFoto());
                    if (oldFile.exists()) {
                        oldFile.delete(); // hapus file lama
                    }
                }

                // 2. Simpan foto baru
                String fileName = System.currentTimeMillis() + "_" + foto.getOriginalFilename();
                foto.transferTo(new File(uploadDir + fileName));

                // 3. Update absensi
                existingAbsensi.setFoto(fileName);

            } catch (IOException e) {
                e.printStackTrace();
                throw new RuntimeException("Upload gagal: " + e.getMessage());
            }
        }

        Absensi updatedAbsensi = absensiRepository.save(existingAbsensi);

        AbsensiResponse response = mapToResponse(updatedAbsensi);

        return WebResponse.<AbsensiResponse>builder()
                .data(response)
                .errors(null)
                .build();
    }

    @Override
    public void deleteAbsensi(String absensiId) {
        Absensi existingAbsensi = absensiRepository.findById(Integer.parseInt(absensiId))
                .orElseThrow(()->new ResponseStatusException(HttpStatus.BAD_REQUEST,"Id Not Found"));

        if (existingAbsensi.getFoto() != null) {
            try {
                String uploadDir = "D:/all-tugas/basdat-smt2/upload-img/profile/"+ existingAbsensi.getUser().getUsername();
                new File(uploadDir).mkdirs();

                File oldFile = new File(uploadDir + existingAbsensi.getFoto());
                if (oldFile.exists()) {
                    oldFile.delete(); // hapus file lama
                }

            } catch (Exception e) {
                e.printStackTrace();
                throw new RuntimeException(e.getMessage());
            }
        }
        absensiRepository.delete(existingAbsensi);
    }

    @Override
    public WebResponse<AbsensiResponse> getAbsensiById(String id) {
        return null;
    }



    @Override
    public void approval(ApprovalRequest req, String absensiId) {
        Absensi absensi = absensiRepository.findById(Integer.parseInt(absensiId))
                .orElseThrow(()->new ResponseStatusException(HttpStatus.BAD_REQUEST,"Id Not Found"));

        absensi.setApproval(Approval.valueOf(req.getN()));
        absensi.setAlasanApproval(req.getAlasanApproval());
        absensiRepository.save(absensi);

    }
    private AbsensiResponse mapToResponse(Absensi absensi) {
        Shift shift = absensi.getShift();
        User user = absensi.getUser();

        return AbsensiResponse.builder()
                .id(absensi.getId())
                .userId(user != null ? user.getId() : null)
                .userName(user != null ? user.getUsername() : "null")
                .shiftId(shift != null ? shift.getId() : null)
                .shiftCreated_at(shift != null ? shift.getCreatedAt() : null)
                .foto(absensi.getFoto())
                .keterangan(absensi.getKeterangan())
                .apporoval(String.valueOf(absensi.getApproval()))
                .alasanApporoval(absensi.getAlasanApproval())
                .isPrivate(absensi.getIsPrivate())
                .tanggal(absensi.getTanggal())
                .status(String.valueOf(absensi.getStatus()))
                .jenis(String.valueOf(absensi.getJenis()))
                .created_at(absensi.getCreatedAt())
                .updated_at(absensi.getUpdatedAt())
                .build();
    }
}
