package com.Project.ScheduleTimeTable.service;

import java.util.List;

import com.Project.ScheduleTimeTable.dto.request.AttendanceRequest;
import com.Project.ScheduleTimeTable.dto.request.UpdateAttendanceRequest;
import com.Project.ScheduleTimeTable.dto.response.AttendanceResponse;
import com.Project.ScheduleTimeTable.model.Attendance;

public interface AttendanceService {

    AttendanceResponse createAttendance(
            AttendanceRequest request);

    List<AttendanceResponse> getAllAttendance();

    AttendanceResponse getAttendanceById(Long id);

    List<AttendanceResponse> getAttendanceByStudent(Long studentId);

    List<AttendanceResponse> getAttendanceBySchedule(Long scheduleId);

    AttendanceResponse updateAttendance(
            Long id,
            UpdateAttendanceRequest request);

    void deleteAttendance(Long id);

    Attendance findAttendanceById(Long id);

}