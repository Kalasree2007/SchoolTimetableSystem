package com.Project.ScheduleTimeTable.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.Project.ScheduleTimeTable.dto.request.SubjectRequest;
import com.Project.ScheduleTimeTable.dto.request.UpdateSubjectRequest;
import com.Project.ScheduleTimeTable.dto.response.SubjectResponse;
import com.Project.ScheduleTimeTable.service.SubjectService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/subjects")
@Validated
public class SubjectController {

    private final SubjectService subjectService;

    public SubjectController(SubjectService subjectService) {
        this.subjectService = subjectService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SubjectResponse> createSubject(
            @Valid @RequestBody SubjectRequest request) {

        SubjectResponse response = subjectService.createSubject(request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    @GetMapping
    public ResponseEntity<List<SubjectResponse>> getAllSubjects() {

        return ResponseEntity.ok(subjectService.getAllSubjects());
    }


    @GetMapping("/{id}")
    public ResponseEntity<SubjectResponse> getSubjectById(
            @PathVariable Long id) {

        return ResponseEntity.ok(subjectService.getSubjectById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SubjectResponse> updateSubject(
            @PathVariable Long id,
            @Valid @RequestBody UpdateSubjectRequest request) {

        return ResponseEntity.ok(
                subjectService.updateSubject(id, request));
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteSubject(
            @PathVariable Long id) {

        subjectService.deleteSubject(id);

        return ResponseEntity.ok("Subject deleted successfully.");
    }

}