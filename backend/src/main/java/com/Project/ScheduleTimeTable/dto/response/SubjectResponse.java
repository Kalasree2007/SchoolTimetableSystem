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
public class SubjectResponse {

    private Long id;

    private String subjectCode;

    private String subjectName;

    private String description;

    private Integer credits;

    private boolean active;

    // Department Details
    private Long departmentId;

    private String departmentName;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}