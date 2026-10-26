package com.Project.ScheduleTimeTable.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TeacherRequest {

    @NotBlank
    private String employeeId;

    @NotBlank
    private String qualification;

    @NotNull
    private Integer experience;

    @NotBlank
    private String specialization;

    @NotNull
    private Long userId;

    @NotNull
    private Long departmentId;

    private boolean active=true;

}