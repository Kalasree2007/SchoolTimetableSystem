package com.Project.ScheduleTimeTable.dto.request;

import java.time.DayOfWeek;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateTimetableRequest {

    @NotNull
    private DayOfWeek dayOfWeek;

    @NotNull
    private Long teacherId;

    @NotNull
    private Long subjectId;

    @NotNull
    private Long classId;

    @NotNull
    private Long roomId;

    @NotNull
    private Long timeSlotId;

    private boolean active;

}