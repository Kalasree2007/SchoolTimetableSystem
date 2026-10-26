package com.Project.ScheduleTimeTable.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.Project.ScheduleTimeTable.dto.request.TimeSlotRequest;
import com.Project.ScheduleTimeTable.dto.request.UpdateTimeSlotRequest;
import com.Project.ScheduleTimeTable.dto.response.TimeSlotResponse;
import com.Project.ScheduleTimeTable.service.TimeSlotService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/timeslots")
@Validated
public class TimeSlotController {

    private final TimeSlotService timeSlotService;

    public TimeSlotController(TimeSlotService timeSlotService) {
        this.timeSlotService = timeSlotService;
    }
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TimeSlotResponse> createTimeSlot(
            @Valid @RequestBody TimeSlotRequest request) {

        return new ResponseEntity<>(
                timeSlotService.createTimeSlot(request),
                HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public ResponseEntity<List<TimeSlotResponse>> getAllTimeSlots() {

        return ResponseEntity.ok(timeSlotService.getAllTimeSlots());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public ResponseEntity<TimeSlotResponse> getTimeSlotById(
            @PathVariable Long id) {

        return ResponseEntity.ok(timeSlotService.getTimeSlotById(id));
    }
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TimeSlotResponse> updateTimeSlot(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTimeSlotRequest request) {

        return ResponseEntity.ok(
                timeSlotService.updateTimeSlot(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteTimeSlot(
            @PathVariable Long id) {

        timeSlotService.deleteTimeSlot(id);

        return ResponseEntity.ok("Time Slot deleted successfully.");
    }

}