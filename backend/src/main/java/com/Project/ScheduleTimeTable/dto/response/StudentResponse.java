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
public class StudentResponse {

    private Long id;

    private String admissionNumber;

    private LocalDate admissionDate;

    private String rollNumber;

    private String semester;

    private boolean active;

    private Long userId;

    private String studentName;

    private Long classId;

    private String className;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}