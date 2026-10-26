package com.Project.ScheduleTimeTable.dto.request;

import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateScheduleRequest {

    @NotNull
    private LocalDate scheduleDate;

    @NotNull
    private Long timetableId;

    private boolean cancelled;

    private String remarks;

    private boolean active;
}