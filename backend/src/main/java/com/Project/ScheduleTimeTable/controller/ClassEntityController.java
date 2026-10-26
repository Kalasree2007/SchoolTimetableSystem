package com.Project.ScheduleTimeTable.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.Project.ScheduleTimeTable.dto.request.ClassEntityRequest;
import com.Project.ScheduleTimeTable.dto.request.UpdateClassEntityRequest;
import com.Project.ScheduleTimeTable.dto.response.ClassEntityResponse;
import com.Project.ScheduleTimeTable.service.ClassEntityService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/classes")
@Validated
public class ClassEntityController {

    private final ClassEntityService classService;

    public ClassEntityController(ClassEntityService classService) {
        this.classService = classService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ClassEntityResponse> createClass(
            @Valid @RequestBody ClassEntityRequest request) {

        return new ResponseEntity<>(
                classService.createClass(request),
                HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public ResponseEntity<List<ClassEntityResponse>> getAllClasses() {

        return ResponseEntity.ok(classService.getAllClasses());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public ResponseEntity<ClassEntityResponse> getClassById(
            @PathVariable Long id) {

        return ResponseEntity.ok(classService.getClassById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ClassEntityResponse> updateClass(
            @PathVariable Long id,
            @Valid @RequestBody UpdateClassEntityRequest request) {

        return ResponseEntity.ok(
                classService.updateClass(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteClass(
            @PathVariable Long id) {

        classService.deleteClass(id);

        return ResponseEntity.ok("Class deleted successfully.");
    }

}