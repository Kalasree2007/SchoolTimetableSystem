package com.Project.ScheduleTimeTable.service;

import java.time.DayOfWeek;
import java.util.List;

import com.Project.ScheduleTimeTable.dto.request.TimetableRequest;
import com.Project.ScheduleTimeTable.dto.request.UpdateTimetableRequest;
import com.Project.ScheduleTimeTable.dto.response.TimetableResponse;
import com.Project.ScheduleTimeTable.model.Timetable;

public interface TimetableService {

    TimetableResponse createTimetable(
            TimetableRequest request);

    List<TimetableResponse> getAllTimetables();

    TimetableResponse getTimetableById(Long id);

    TimetableResponse updateTimetable(
            Long id,
            UpdateTimetableRequest request);

    void deleteTimetable(Long id);

    Timetable findTimetableById(Long id);

    List<TimetableResponse> getByTeacher(Long teacherId);

    List<TimetableResponse> getByClass(Long classId);

    List<TimetableResponse> getByDay(DayOfWeek day);

}