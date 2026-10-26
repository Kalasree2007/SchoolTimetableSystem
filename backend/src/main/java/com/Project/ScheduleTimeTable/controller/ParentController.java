package com.Project.ScheduleTimeTable.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.Project.ScheduleTimeTable.dto.request.ParentRequest;
import com.Project.ScheduleTimeTable.dto.request.UpdateParentRequest;
import com.Project.ScheduleTimeTable.dto.response.ParentResponse;
import com.Project.ScheduleTimeTable.service.ParentService;

import com.Project.ScheduleTimeTable.model.Parent;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/parents")
@Validated
public class ParentController {

    private final ParentService parentService;

    public ParentController(ParentService parentService) {
        this.parentService = parentService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ParentResponse> createParent(
            @Valid @RequestBody ParentRequest request) {

        return new ResponseEntity<>(
                parentService.createParent(request),
                HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public ResponseEntity<List<ParentResponse>> getAllParents() {

        return ResponseEntity.ok(parentService.getAllParents());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','PARENT')")
    public ResponseEntity<ParentResponse> getParentById(
            @PathVariable Long id) {

        return ResponseEntity.ok(parentService.getParentById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ParentResponse> updateParent(
            @PathVariable Long id,
            @Valid @RequestBody UpdateParentRequest request) {

        return ResponseEntity.ok(
                parentService.updateParent(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteParent(
            @PathVariable Long id) {

        parentService.deleteParent(id);

        return ResponseEntity.ok("Parent deleted successfully.");
    }

    @GetMapping("/user/{userId}")
@PreAuthorize("hasRole('PARENT')")
public ResponseEntity<ParentResponse> getParentByUserId(
        @PathVariable Long userId) {

    return ResponseEntity.ok(
            parentService.getParentByUserId(userId)
    );
}
    

}