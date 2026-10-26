package com.Project.ScheduleTimeTable.dto.response;


import com.Project.ScheduleTimeTable.enums.Role;
import com.Project.ScheduleTimeTable.enums.Status;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;


@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {


    private Long id;

    private String fullName;

    private String email;

    private String phoneNumber;

    private Role role;

    private Status status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}