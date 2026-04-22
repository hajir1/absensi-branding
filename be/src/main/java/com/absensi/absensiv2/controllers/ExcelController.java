package com.absensi.absensiv2.controllers;

import com.absensi.absensiv2.services.ExcelService;
import lombok.AllArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/excel/download")
public class ExcelController {

    private final ExcelService excelService;

    @GetMapping("/byMentor/{mentorId}")
    public ResponseEntity<byte[]> downloadExcel(
            @PathVariable String mentorId,
            @RequestParam(required = false) String date,
            @RequestParam(required = false) String search
    ) {

        byte[] excelBytes = excelService.generateExcelByMentor(
                Integer.parseInt(mentorId),date, search);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=dataAbsensiByentor.xlsx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(excelBytes);
    }
}