package com.Project.ScheduleTimeTable.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.Project.ScheduleTimeTable.dto.request.StudentRequest;
import com.Project.ScheduleTimeTable.dto.request.UpdateStudentRequest;
import com.Project.ScheduleTimeTable.dto.response.StudentResponse;
import com.Project.ScheduleTimeTable.service.StudentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/students")
@Validated
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StudentResponse> createStudent(
            @Valid @RequestBody StudentRequest request) {

        return new ResponseEntity<>(
                studentService.createStudent(request),
                HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public ResponseEntity<List<StudentResponse>> getAllStudents() {

        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER','PARENT')")
    public ResponseEntity<StudentResponse> getStudentById(
            @PathVariable Long id) {

        return ResponseEntity.ok(studentService.getStudentById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StudentResponse> updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody UpdateStudentRequest request) {

        return ResponseEntity.ok(
                studentService.updateStudent(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteStudent(
            @PathVariable Long id) {

        studentService.deleteStudent(id);

        return ResponseEntity.ok("Student deleted successfully.");
    }

    @GetMapping("/user/{userId}")
@PreAuthorize("hasRole('STUDENT')")
public ResponseEntity<StudentResponse> getStudentByUserId(
        @PathVariable Long userId) {

    return ResponseEntity.ok(
            studentService.getStudentByUserId(userId)
    );
}

}