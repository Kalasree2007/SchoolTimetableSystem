package com.Project.ScheduleTimeTable.service;

import java.util.List;

import com.Project.ScheduleTimeTable.dto.request.TeacherRequest;
import com.Project.ScheduleTimeTable.dto.request.UpdateTeacherRequest;
import com.Project.ScheduleTimeTable.dto.response.TeacherResponse;
import com.Project.ScheduleTimeTable.model.Teacher;

public interface TeacherService {

    TeacherResponse createTeacher(TeacherRequest request);

    List<TeacherResponse> getAllTeachers();

    TeacherResponse getTeacherById(Long id);

    TeacherResponse updateTeacher(Long id,
                                  UpdateTeacherRequest request);

    void deleteTeacher(Long id);

    boolean existsByEmployeeId(String employeeId);

    boolean existsByUserId(Long userId);

    Teacher findTeacherById(Long id);

    Teacher findTeacherByEmployeeId(String employeeId);

}