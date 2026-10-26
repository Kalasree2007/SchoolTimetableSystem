package com.Project.ScheduleTimeTable.dto.response;

import java.time.LocalDateTime;

import com.Project.ScheduleTimeTable.enums.AttendanceStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceResponse {

    private Long id;

    private Long studentId;
    private String studentName;

    private Long scheduleId;

    private AttendanceStatus status;

    private String remarks;

    private boolean active;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}