package com.Project.ScheduleTimeTable.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateParentRequest {

    @NotBlank
    private String occupation;

    @NotBlank
    private String relationship;

    @NotBlank
    private String address;

    private boolean active;

}