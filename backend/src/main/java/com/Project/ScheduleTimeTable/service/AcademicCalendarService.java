package com.Project.ScheduleTimeTable.service;

import java.util.List;

import com.Project.ScheduleTimeTable.dto.request.AcademicCalendarRequest;
import com.Project.ScheduleTimeTable.dto.request.UpdateAcademicCalendarRequest;
import com.Project.ScheduleTimeTable.dto.response.AcademicCalendarResponse;
import com.Project.ScheduleTimeTable.model.AcademicCalendar;

public interface AcademicCalendarService {

    AcademicCalendarResponse createEvent(AcademicCalendarRequest request);

    List<AcademicCalendarResponse> getAllEvents();

    AcademicCalendarResponse getEventById(Long id);

    AcademicCalendarResponse updateEvent(
            Long id,
            UpdateAcademicCalendarRequest request);

    void deleteEvent(Long id);

    AcademicCalendar findEventById(Long id);

    boolean existsByTitle(String title);

}