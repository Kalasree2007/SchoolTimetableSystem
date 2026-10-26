package com.Project.ScheduleTimeTable.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleResponse {

    private Long id;

    private LocalDate scheduleDate;

    private Long timetableId;

    private boolean cancelled;

    private String remarks;

    private boolean active;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}