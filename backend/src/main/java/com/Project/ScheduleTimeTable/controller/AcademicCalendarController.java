package com.Project.ScheduleTimeTable.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.Project.ScheduleTimeTable.dto.request.AcademicCalendarRequest;
import com.Project.ScheduleTimeTable.dto.request.UpdateAcademicCalendarRequest;
import com.Project.ScheduleTimeTable.dto.response.AcademicCalendarResponse;
import com.Project.ScheduleTimeTable.service.AcademicCalendarService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/calendar")
@Validated
public class AcademicCalendarController {

    private final AcademicCalendarService academicCalendarService;

    public AcademicCalendarController(
            AcademicCalendarService academicCalendarService) {

        this.academicCalendarService = academicCalendarService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AcademicCalendarResponse> createEvent(
            @Valid @RequestBody AcademicCalendarRequest request) {

        return new ResponseEntity<>(
                academicCalendarService.createEvent(request),
                HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<AcademicCalendarResponse>> getAllEvents() {

        return ResponseEntity.ok(
                academicCalendarService.getAllEvents());
    }

    @GetMapping("/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<AcademicCalendarResponse> getEventById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                academicCalendarService.getEventById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AcademicCalendarResponse> updateEvent(
            @PathVariable Long id,
            @Valid @RequestBody UpdateAcademicCalendarRequest request) {

        return ResponseEntity.ok(
                academicCalendarService.updateEvent(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteEvent(
            @PathVariable Long id) {

        academicCalendarService.deleteEvent(id);

        return ResponseEntity.ok(
                "Academic Calendar Event deleted successfully.");
    }

}