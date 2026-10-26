package com.Project.ScheduleTimeTable.dto.response;

import java.time.DayOfWeek;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TimetableResponse {

    private Long id;

    private DayOfWeek dayOfWeek;

    private Long teacherId;
    private String teacherName;

    private Long subjectId;
    private String subjectName;

    private Long classId;
    private String className;

    private Long roomId;
    private String roomNumber;

    private Long timeSlotId;
    private String startTime;
    private String endTime;

    private boolean active;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}