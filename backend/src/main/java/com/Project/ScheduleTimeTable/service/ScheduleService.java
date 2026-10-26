package com.Project.ScheduleTimeTable.service;

import java.time.LocalDate;
import java.util.List;

import com.Project.ScheduleTimeTable.dto.request.ScheduleRequest;
import com.Project.ScheduleTimeTable.dto.request.UpdateScheduleRequest;
import com.Project.ScheduleTimeTable.dto.response.ScheduleResponse;
import com.Project.ScheduleTimeTable.model.Schedule;

public interface ScheduleService {

    
    ScheduleResponse createSchedule(ScheduleRequest request);

    
    List<ScheduleResponse> getAllSchedules();

    ScheduleResponse getScheduleById(Long id);

    List<ScheduleResponse> getSchedulesByDate(LocalDate date);

    List<ScheduleResponse> getSchedulesByTimetable(Long timetableId);


    ScheduleResponse updateSchedule(
            Long id,
            UpdateScheduleRequest request);


    void deleteSchedule(Long id);


    Schedule findScheduleById(Long id);

}