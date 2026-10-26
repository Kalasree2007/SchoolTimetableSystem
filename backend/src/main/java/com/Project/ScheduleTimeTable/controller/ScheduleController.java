package com.Project.ScheduleTimeTable.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.Project.ScheduleTimeTable.dto.request.ScheduleRequest;
import com.Project.ScheduleTimeTable.dto.request.UpdateScheduleRequest;
import com.Project.ScheduleTimeTable.dto.response.ScheduleResponse;
import com.Project.ScheduleTimeTable.service.ScheduleService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/schedules")
public class ScheduleController {

    private final ScheduleService scheduleService;

    public ScheduleController(
            ScheduleService scheduleService) {

        this.scheduleService = scheduleService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ScheduleResponse> createSchedule(
            @Valid @RequestBody ScheduleRequest request) {

        return new ResponseEntity<>(
                scheduleService.createSchedule(request),
                HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ScheduleResponse>> getAllSchedules() {

        return ResponseEntity.ok(
                scheduleService.getAllSchedules());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ScheduleResponse> getScheduleById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                scheduleService.getScheduleById(id));
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<ScheduleResponse>> getSchedulesByDate(
            @PathVariable LocalDate date) {

        return ResponseEntity.ok(
                scheduleService.getSchedulesByDate(date));
    }

    @GetMapping("/timetable/{timetableId}")
    public ResponseEntity<List<ScheduleResponse>> getSchedulesByTimetable(
            @PathVariable Long timetableId) {

        return ResponseEntity.ok(
                scheduleService.getSchedulesByTimetable(timetableId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ScheduleResponse> updateSchedule(
            @PathVariable Long id,
            @Valid @RequestBody UpdateScheduleRequest request) {

        return ResponseEntity.ok(
                scheduleService.updateSchedule(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteSchedule(
            @PathVariable Long id) {

        scheduleService.deleteSchedule(id);

        return ResponseEntity.ok(
                "Schedule deleted successfully.");
    }
}