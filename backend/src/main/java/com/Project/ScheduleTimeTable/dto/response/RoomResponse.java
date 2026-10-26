package com.Project.ScheduleTimeTable.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RoomResponse {

    private Long id;

    private String roomNumber;

    private String roomName;

    private String roomType;

    private Integer capacity;

    private String building;

    private Integer floor;

    private boolean active;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}