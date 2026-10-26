package com.Project.ScheduleTimeTable.dto.request;

import java.time.LocalDate;

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
public class StudentRequest {

    @NotBlank
    private String admissionNumber;

    @NotNull
    private LocalDate admissionDate;

    @NotBlank
    private String rollNumber;

    @NotBlank
    private String semester;

    @NotNull
    private Long userId;

    @NotNull
    private Long classId;

    private boolean active=true;

}