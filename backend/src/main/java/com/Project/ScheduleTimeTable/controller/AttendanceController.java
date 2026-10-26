package com.Project.ScheduleTimeTable.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.Project.ScheduleTimeTable.dto.request.AttendanceRequest;
import com.Project.ScheduleTimeTable.dto.request.UpdateAttendanceRequest;
import com.Project.ScheduleTimeTable.dto.response.AttendanceResponse;
import com.Project.ScheduleTimeTable.service.AttendanceService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(
            AttendanceService attendanceService) {

        this.attendanceService = attendanceService;
    }

    @PostMapping
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<AttendanceResponse> createAttendance(
            @Valid @RequestBody AttendanceRequest request) {

        return new ResponseEntity<>(
                attendanceService.createAttendance(request),
                HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<AttendanceResponse>> getAllAttendance() {

        return ResponseEntity.ok(
                attendanceService.getAllAttendance());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AttendanceResponse> getAttendanceById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                attendanceService.getAttendanceById(id));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<AttendanceResponse>> getAttendanceByStudent(
            @PathVariable Long studentId) {

        return ResponseEntity.ok(
                attendanceService.getAttendanceByStudent(studentId));
    }

    @GetMapping("/schedule/{scheduleId}")
    public ResponseEntity<List<AttendanceResponse>> getAttendanceBySchedule(
            @PathVariable Long scheduleId) {

        return ResponseEntity.ok(
                attendanceService.getAttendanceBySchedule(scheduleId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<AttendanceResponse> updateAttendance(
            @PathVariable Long id,
            @Valid @RequestBody UpdateAttendanceRequest request) {

        return ResponseEntity.ok(
                attendanceService.updateAttendance(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteAttendance(
            @PathVariable Long id) {

        attendanceService.deleteAttendance(id);

        return ResponseEntity.ok(
                "Attendance deleted successfully.");
    }
}