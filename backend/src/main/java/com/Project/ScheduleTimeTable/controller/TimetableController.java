package com.Project.ScheduleTimeTable.controller;

import java.time.DayOfWeek;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.Project.ScheduleTimeTable.dto.request.TimetableRequest;
import com.Project.ScheduleTimeTable.dto.request.UpdateTimetableRequest;
import com.Project.ScheduleTimeTable.dto.response.TimetableResponse;
import com.Project.ScheduleTimeTable.service.TimetableService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/timetables")
public class TimetableController {

    private final TimetableService timetableService;

    public TimetableController(TimetableService timetableService) {
        this.timetableService = timetableService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TimetableResponse> create(
            @Valid @RequestBody TimetableRequest request) {

        return new ResponseEntity<>(
                timetableService.createTimetable(request),
                HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<TimetableResponse>> getAll() {
        return ResponseEntity.ok(timetableService.getAllTimetables());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TimetableResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(timetableService.getTimetableById(id));
    }

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<List<TimetableResponse>> getTeacherTimetable(
            @PathVariable Long teacherId) {

        return ResponseEntity.ok(timetableService.getByTeacher(teacherId));
    }

    @GetMapping("/class/{classId}")
    public ResponseEntity<List<TimetableResponse>> getClassTimetable(
            @PathVariable Long classId) {

        return ResponseEntity.ok(timetableService.getByClass(classId));
    }

    @GetMapping("/day/{day}")
    public ResponseEntity<List<TimetableResponse>> getDayTimetable(
            @PathVariable DayOfWeek day) {

        return ResponseEntity.ok(timetableService.getByDay(day));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TimetableResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTimetableRequest request) {

        return ResponseEntity.ok(
                timetableService.updateTimetable(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> delete(@PathVariable Long id) {

        timetableService.deleteTimetable(id);

        return ResponseEntity.ok("Timetable deleted successfully.");
    }
}