package com.Project.ScheduleTimeTable.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.Project.ScheduleTimeTable.dto.request.TeacherRequest;
import com.Project.ScheduleTimeTable.dto.request.UpdateTeacherRequest;
import com.Project.ScheduleTimeTable.dto.response.TeacherResponse;
import com.Project.ScheduleTimeTable.service.TeacherService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/teachers")
@Validated
public class TeacherController {

    private final TeacherService teacherService;

    public TeacherController(TeacherService teacherService) {
        this.teacherService = teacherService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TeacherResponse> createTeacher(
            @Valid @RequestBody TeacherRequest request) {

        TeacherResponse response = teacherService.createTeacher(request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }


    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public ResponseEntity<List<TeacherResponse>> getAllTeachers() {

        return ResponseEntity.ok(teacherService.getAllTeachers());
    }


    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public ResponseEntity<TeacherResponse> getTeacherById(
            @PathVariable Long id) {

        return ResponseEntity.ok(teacherService.getTeacherById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TeacherResponse> updateTeacher(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTeacherRequest request) {

        return ResponseEntity.ok(
                teacherService.updateTeacher(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteTeacher(
            @PathVariable Long id) {

        teacherService.deleteTeacher(id);

        return ResponseEntity.ok("Teacher deleted successfully.");
    }

}