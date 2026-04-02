package com.absensi.absensiv2.services;


import com.absensi.absensiv2.dtos.AbsensiRequest;
import com.absensi.absensiv2.dtos.AbsensiResponse;
import com.absensi.absensiv2.dtos.ApprovalRequest;
import com.absensi.absensiv2.dtos.WebResponse;
import com.absensi.absensiv2.models.Absensi;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


/**
 * modul 5 dan 6
 */
public interface AbsensiService {
    WebResponse<AbsensiResponse> createAbsensi(AbsensiRequest req, MultipartFile foto);
    WebResponse<AbsensiResponse> updateAbsensi(AbsensiRequest req, MultipartFile foto,String id);
    void deleteAbsensi(String id);
    WebResponse<AbsensiResponse> getAbsensiById(String id);
    Page<AbsensiResponse> getAllAbsensis(int page, int size, String search);
    Page<AbsensiResponse> getAbsensiByUser(String userId, int page, int size, String search);
    Page<AbsensiResponse> getAbsensiByMentor(Integer mentorId, int page, int size, String search);
    Page<AbsensiResponse> getAbsensiByIsPrivate(Boolean n, int page, int size, String search);
    void approval(ApprovalRequest n, String absensiId);
}