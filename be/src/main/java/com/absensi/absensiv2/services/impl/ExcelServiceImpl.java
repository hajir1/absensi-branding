package com.absensi.absensiv2.services.impl;

import com.absensi.absensiv2.models.Absensi;
import com.absensi.absensiv2.repositories.AbsensiRepository;
import com.absensi.absensiv2.services.AbsensiService;
import com.absensi.absensiv2.services.ExcelService;
import lombok.AllArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@AllArgsConstructor
public class ExcelServiceImpl implements ExcelService {

    private final AbsensiRepository absensiRepository;
    public byte[] generateExcelByMentor(Integer mentorId,String date, String search) {
        System.out.println("date"+ date);
        try (Workbook workbook = new XSSFWorkbook()) {

            Sheet sheet = workbook.createSheet("Data Absensi");

            // ======================
            // STYLE
            // ======================
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);
            headerStyle.setVerticalAlignment(VerticalAlignment.CENTER);

            // border
            headerStyle.setBorderTop(BorderStyle.THIN);
            headerStyle.setBorderBottom(BorderStyle.THIN);
            headerStyle.setBorderLeft(BorderStyle.THIN);
            headerStyle.setBorderRight(BorderStyle.THIN);

            CellStyle bodyStyle = workbook.createCellStyle();
            bodyStyle.setBorderTop(BorderStyle.THIN);
            bodyStyle.setBorderBottom(BorderStyle.THIN);
            bodyStyle.setBorderLeft(BorderStyle.THIN);
            bodyStyle.setBorderRight(BorderStyle.THIN);

            // ======================
            // HEADER
            // ======================
            Row header = sheet.createRow(0);

            String[] headers = {
                    "Nama", "Keterangan", "", "",
                    "Jenis", "Status", "Dibuat Pada",
                    "Approval", "Alasan Approval"
            };

            for (int i = 0; i < headers.length; i++) {
                Cell cell = header.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // merge keterangan (kolom 1-3)
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 1, 3));

            // ================= RANGE DATE =================
            String[] parts = date.split("-");

            int year = Integer.parseInt(parts[0]);
            int month = Integer.parseInt(parts[1]);
            System.out.println("year"+year);
            System.out.println("month"+month);
            LocalDateTime start = LocalDateTime.of(year, month, 1, 0, 0);
            LocalDateTime end = start.plusMonths(1).minusSeconds(1);

            // ======================
            // AMBIL DATA
            // ======================
            List<Absensi> absensis = absensiRepository
                    .findByMentorMonthAndSearch(
                            mentorId,
                            start,
                            end,
                            search
                    );

            System.out.println("Total data: " + absensis.size()); // debug

            // ======================
            // ISI DATA
            // ======================
            int rowNum = 1;
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm");

            for (Absensi a : absensis) {
                Row row = sheet.createRow(rowNum);

                // Nama
                Cell c0 = row.createCell(0);
                c0.setCellValue(a.getUser().getUsername());
                c0.setCellStyle(bodyStyle);

                // Keterangan (merge 1-3)
                Cell c1 = row.createCell(1);
                c1.setCellValue(a.getKeterangan() != null ? a.getKeterangan() : "-");
                c1.setCellStyle(bodyStyle);

                // create empty cell biar merge rapi
                for (int i = 2; i <= 3; i++) {
                    Cell empty = row.createCell(i);
                    empty.setCellStyle(bodyStyle);
                }

                sheet.addMergedRegion(new CellRangeAddress(rowNum, rowNum, 1, 3));

                // Jenis
                Cell c4 = row.createCell(4);
                c4.setCellValue(a.getJenis() != null ? a.getJenis().toString() : "-");
                c4.setCellStyle(bodyStyle);

                // Status
                Cell c5 = row.createCell(5);
                c5.setCellValue(a.getStatus() != null ? a.getStatus().toString() : "-");
                c5.setCellStyle(bodyStyle);

                // Tanggal
                Cell c6 = row.createCell(6);
                c6.setCellValue(
                        a.getCreatedAt() != null ? a.getCreatedAt().format(formatter) : "-"
                );
                c6.setCellStyle(bodyStyle);

                // Approval
                Cell c7 = row.createCell(7);
                c7.setCellValue(a.getApproval() != null ? a.getApproval().toString() : "-");
                c7.setCellStyle(bodyStyle);

                // Alasan Approval
                Cell c8 = row.createCell(8);
                c8.setCellValue(a.getAlasanApproval() != null ? a.getAlasanApproval() : "-");
                c8.setCellStyle(bodyStyle);

                rowNum++;
            }

            // ======================
            // AUTO SIZE
            // ======================
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            // freeze header
            sheet.createFreezePane(0, 1);

            // ======================
            // OUTPUT
            // ======================
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);

            return out.toByteArray();

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
