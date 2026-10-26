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
public class AcademicCalendarResponse {

    private Long id;

    private String title;

    private String description;

    private String eventType;

    private LocalDate startDate;

    private LocalDate endDate;

    private boolean active;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}