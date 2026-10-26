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
public class ParentRequest {

    @NotBlank
    private String occupation;

    @NotBlank
    private String relationship;

    @NotBlank
    private String address;

    @NotNull
    private Long userId;

    @NotNull
    private Long studentId;

    private boolean active = true;

}