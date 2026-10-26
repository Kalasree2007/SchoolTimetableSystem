package com.Project.ScheduleTimeTable.dto.response;

import java.time.LocalDateTime;
import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TimeSlotResponse {

    private Long id;

    private String slotName;

    private LocalTime startTime;

    private LocalTime endTime;

    private Integer duration;

    private boolean active;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}