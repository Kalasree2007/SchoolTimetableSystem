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
public class ParentResponse {

    private Long id;

    private String occupation;

    private String relationship;

    private String address;

    private boolean active;

    private Long userId;

    private String parentName;

    private Long studentId;

    private String studentName;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}