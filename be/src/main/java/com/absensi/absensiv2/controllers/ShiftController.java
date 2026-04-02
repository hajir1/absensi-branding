package com.absensi.absensiv2.controllers;


import com.absensi.absensiv2.dtos.ShiftRequest;
import com.absensi.absensiv2.dtos.ShiftResponse;
import com.absensi.absensiv2.dtos.WebResponse;
import com.absensi.absensiv2.enums.Role;
import com.absensi.absensiv2.services.ShiftService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/shifts")
@AllArgsConstructor
public class ShiftController {

    private final ShiftService shiftService;

    @PostMapping
    public ResponseEntity<WebResponse<ShiftResponse>> createShift(
            @Valid @RequestBody ShiftRequest req
    ) {
        WebResponse<ShiftResponse> response = shiftService.createShift(req);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}")
    public List<ShiftResponse> getShiftByUser(
            @PathVariable String userId
    ){
        return shiftService.getShiftByUser(userId);
    }
    @GetMapping("/{shiftId:\\d+}")
    public ResponseEntity<WebResponse<ShiftResponse>> getShiftById(
            @PathVariable String shiftId
    ){
        WebResponse<ShiftResponse> response = shiftService.getShiftById(shiftId);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public Page<ShiftResponse> getAllShifts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "1") int size,
            @RequestParam(required = false) String search
    ){
        return shiftService.getAllShifts(page,size,search);
    }

    @DeleteMapping("/{shiftId}")
    public void deleteShiftById(
            @PathVariable String shiftId
    ){
        shiftService.deleteShift(shiftId);
    }

    @PutMapping("/{shiftId}")
    public ResponseEntity<WebResponse<ShiftResponse>> updateShift(
            @RequestBody ShiftRequest req, @PathVariable String shiftId
    ){
        WebResponse<ShiftResponse> response = shiftService.updateShift(req,shiftId);
        return ResponseEntity.ok(response);
    }
}
