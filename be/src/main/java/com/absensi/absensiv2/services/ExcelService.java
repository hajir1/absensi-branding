package com.absensi.absensiv2.services;

import java.io.ByteArrayOutputStream;

public interface ExcelService {
    byte[] generateExcelByMentor(Integer mentorId,String date, String search);
}