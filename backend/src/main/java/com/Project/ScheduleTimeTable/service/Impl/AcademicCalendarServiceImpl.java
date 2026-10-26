package com.Project.ScheduleTimeTable.service.Impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.Project.ScheduleTimeTable.dto.request.AcademicCalendarRequest;
import com.Project.ScheduleTimeTable.dto.request.UpdateAcademicCalendarRequest;
import com.Project.ScheduleTimeTable.dto.response.AcademicCalendarResponse;
import com.Project.ScheduleTimeTable.exception.AcademicCalendarAlreadyExistsException;
import com.Project.ScheduleTimeTable.exception.ResourceNotFoundException;
import com.Project.ScheduleTimeTable.model.AcademicCalendar;
import com.Project.ScheduleTimeTable.repository.AcademicCalendarRepository;
import com.Project.ScheduleTimeTable.service.AcademicCalendarService;

@Service
public class AcademicCalendarServiceImpl implements AcademicCalendarService {

    private final AcademicCalendarRepository academicCalendarRepository;

    public AcademicCalendarServiceImpl(
            AcademicCalendarRepository academicCalendarRepository) {

        this.academicCalendarRepository = academicCalendarRepository;
    }

    @Override
    public AcademicCalendarResponse createEvent(
            AcademicCalendarRequest request) {

        if (academicCalendarRepository.existsByTitle(request.getTitle())) {

            throw new AcademicCalendarAlreadyExistsException(
                    "Event already exists");
        }

        AcademicCalendar calendar = new AcademicCalendar();

        calendar.setTitle(request.getTitle());
        calendar.setDescription(request.getDescription());
        calendar.setEventType(request.getEventType());
        calendar.setStartDate(request.getStartDate());
        calendar.setEndDate(request.getEndDate());
        calendar.setActive(request.isActive());

        return mapToResponse(
                academicCalendarRepository.save(calendar));
    }

    @Override
    public List<AcademicCalendarResponse> getAllEvents() {

        return academicCalendarRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AcademicCalendarResponse getEventById(Long id) {

        return mapToResponse(findEventById(id));
    }

    @Override
    public AcademicCalendarResponse updateEvent(
            Long id,
            UpdateAcademicCalendarRequest request) {

        AcademicCalendar calendar = findEventById(id);

        calendar.setTitle(request.getTitle());
        calendar.setDescription(request.getDescription());
        calendar.setEventType(request.getEventType());
        calendar.setStartDate(request.getStartDate());
        calendar.setEndDate(request.getEndDate());
        calendar.setActive(request.isActive());

        return mapToResponse(
                academicCalendarRepository.save(calendar));
    }

    @Override
    public void deleteEvent(Long id) {

        academicCalendarRepository.delete(findEventById(id));
    }

    @Override
    public AcademicCalendar findEventById(Long id) {

        return academicCalendarRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Academic Calendar Event not found with id : " + id));
    }

    @Override
    public boolean existsByTitle(String title) {

        return academicCalendarRepository.existsByTitle(title);
    }

    private AcademicCalendarResponse mapToResponse(
            AcademicCalendar calendar) {

        return new AcademicCalendarResponse(

                calendar.getId(),
                calendar.getTitle(),
                calendar.getDescription(),
                calendar.getEventType(),
                calendar.getStartDate(),
                calendar.getEndDate(),
                calendar.isActive(),
                calendar.getCreatedAt(),
                calendar.getUpdatedAt()

        );
    }

}