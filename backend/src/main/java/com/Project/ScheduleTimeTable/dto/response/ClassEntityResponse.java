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
public class ClassEntityResponse {

    private Long id;

    private String classCode;

    private String className;

    private String section;

    private String academicYear;

    private Integer capacity;

    private boolean active;

    private Long departmentId;

    private String departmentName;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}