package com.absensi.absensiv2.controllers;


import com.absensi.absensiv2.dtos.*;
import com.absensi.absensiv2.dtos.AbsensiRequest;
import com.absensi.absensiv2.enums.Role;
import com.absensi.absensiv2.services.AbsensiService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/absensis")
@AllArgsConstructor

/**
 * modul 2
 */
public class AbsensiController {

    private final AbsensiService absensiService;

    @PostMapping
    public ResponseEntity<WebResponse<AbsensiResponse>> createAbsensi(
            @Valid @RequestPart("data") AbsensiRequest req, @RequestPart(value = "foto",required = false) MultipartFile foto
    ) {

        WebResponse<AbsensiResponse> response = absensiService.createAbsensi(req,foto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}")
    public Page<AbsensiResponse> getAbsensiByUser(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "1") int size,
            @RequestParam(required = false) String search
    ){
        return absensiService.getAbsensiByUser(userId,page,size,search);
    }
    @GetMapping("/mentor/{mentorId}")
    public Page<AbsensiResponse> getAbsensiByMentor(
            @PathVariable String mentorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "1") int size,
            @RequestParam(required = false) String search
    ){
        return absensiService.getAbsensiByMentor(Integer.valueOf(mentorId),page,size,search);
    }
    @GetMapping("/isPrivate/{isPrivate}")
    public Page<AbsensiResponse> getAbsensiByIsPrivate(
            @PathVariable String isPrivate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "1") int size,
            @RequestParam(required = false) String search
    ){
        return absensiService.getAbsensiByIsPrivate(Boolean.parseBoolean(isPrivate),page,size,search);
    }
    @GetMapping("/{absensiId:\\d+}")
    public ResponseEntity<WebResponse<AbsensiResponse>> getAbsensiById(
            @PathVariable String absensiId
    ){
        WebResponse<AbsensiResponse> response = absensiService.getAbsensiById(absensiId);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public Page<AbsensiResponse> getAllAbsensis(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "1") int size,
            @RequestParam(required = false) String search
    ){
        return absensiService.getAllAbsensis(page,size,search);
    }

    @DeleteMapping("/{absensiId}")
    public void deleteAbsensiById(
            @PathVariable String absensiId
    ){
        absensiService.deleteAbsensi(absensiId);
    }

    @PutMapping("/approval/{absensiId}")
    public void AppovalAbsensiById(
            @RequestBody ApprovalRequest req, @PathVariable String absensiId
    ){
        absensiService.approval(req,absensiId);
    }

    @PutMapping("/update/{absensiId}")
    public ResponseEntity<WebResponse<AbsensiResponse>> updateAbsensi(
            @RequestPart("data") AbsensiRequest req, @RequestPart(value = "foto",required = false) MultipartFile foto, @PathVariable String absensiId
    ){
        WebResponse<AbsensiResponse> response = absensiService.updateAbsensi(req,foto,absensiId);
        return ResponseEntity.ok(response);
    }
}
