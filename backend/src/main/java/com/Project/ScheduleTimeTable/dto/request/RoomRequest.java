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
public class RoomRequest {

    @NotBlank
    private String roomNumber;

    @NotBlank
    private String roomName;

    @NotBlank
    private String roomType;

    @NotNull
    @Min(1)
    private Integer capacity;

    private String building;

    private Integer floor;

    private boolean active = true;

}