package com.absensi.absensiv2.services;

import com.absensi.absensiv2.dtos.*;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ShiftService {
    WebResponse<ShiftResponse> createShift(ShiftRequest req);
    WebResponse<ShiftResponse> updateShift(ShiftRequest req, String id);
    void deleteShift(String id);
    WebResponse<ShiftResponse> getShiftById(String id);
    Page<ShiftResponse> getAllShifts(int page, int size, String search);
    List<ShiftResponse> getShiftByUser(String userId);
}