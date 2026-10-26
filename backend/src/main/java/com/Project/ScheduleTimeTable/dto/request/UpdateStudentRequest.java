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
public class UpdateStudentRequest {

    @NotBlank
    private String rollNumber;

    @NotBlank
    private String semester;

    @NotNull
    private Long classId;

    private boolean active;

}