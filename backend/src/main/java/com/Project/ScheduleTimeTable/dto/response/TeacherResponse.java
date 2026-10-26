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
public class TeacherResponse {

    private Long id;

    private String employeeId;

    private String qualification;

    private Integer experience;

    private String specialization;

    private boolean active;

    private Long userId;

    private String teacherName;

    private String teacherEmail;

    private Long departmentId;

    private String departmentName;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}