package com.Project.ScheduleTimeTable.dto.request;

import com.Project.ScheduleTimeTable.enums.AttendanceStatus;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceRequest {

    @NotNull
    private Long studentId;

    @NotNull
    private Long scheduleId;

    @NotNull
    private AttendanceStatus status;

    private String remarks;

    private boolean active = true;

}