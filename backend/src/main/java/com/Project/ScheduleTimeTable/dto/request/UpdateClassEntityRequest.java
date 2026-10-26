package com.Project.ScheduleTimeTable.dto.request;

import jakarta.validation.constraints.Min;
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
public class UpdateClassEntityRequest {

    @NotBlank
    private String className;

    @NotBlank
    private String section;

    @NotBlank
    private String academicYear;

    @NotNull
    @Min(1)
    private Integer capacity;

    @NotNull
    private Long departmentId;

    private boolean active;

}