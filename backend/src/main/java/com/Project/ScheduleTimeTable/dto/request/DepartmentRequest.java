package com.Project.ScheduleTimeTable.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DepartmentRequest {

    @NotBlank(message = "Department code is required")
    @Size(max = 10, message = "Department code cannot exceed 10 characters")
    private String departmentCode;

    @NotBlank(message = "Department name is required")
    @Size(max = 100, message = "Department name cannot exceed 100 characters")
    private String departmentName;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

    private boolean active = true;


}