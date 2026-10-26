package com.Project.ScheduleTimeTable.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.Project.ScheduleTimeTable.dto.request.RoomRequest;
import com.Project.ScheduleTimeTable.dto.request.UpdateRoomRequest;
import com.Project.ScheduleTimeTable.dto.response.RoomResponse;
import com.Project.ScheduleTimeTable.service.RoomService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/rooms")
@Validated
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RoomResponse> createRoom(
            @Valid @RequestBody RoomRequest request) {

        return new ResponseEntity<>(
                roomService.createRoom(request),
                HttpStatus.CREATED);
    }

    
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public ResponseEntity<List<RoomResponse>> getAllRooms() {

        return ResponseEntity.ok(roomService.getAllRooms());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public ResponseEntity<RoomResponse> getRoomById(
            @PathVariable Long id) {

        return ResponseEntity.ok(roomService.getRoomById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RoomResponse> updateRoom(
            @PathVariable Long id,
            @Valid @RequestBody UpdateRoomRequest request) {

        return ResponseEntity.ok(
                roomService.updateRoom(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteRoom(
            @PathVariable Long id) {

        roomService.deleteRoom(id);

        return ResponseEntity.ok("Room deleted successfully.");
    }

}