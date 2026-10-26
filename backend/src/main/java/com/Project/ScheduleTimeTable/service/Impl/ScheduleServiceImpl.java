package com.Project.ScheduleTimeTable.service.Impl;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.Project.ScheduleTimeTable.dto.request.ScheduleRequest;
import com.Project.ScheduleTimeTable.dto.request.UpdateScheduleRequest;
import com.Project.ScheduleTimeTable.dto.response.ScheduleResponse;
import com.Project.ScheduleTimeTable.exception.ResourceNotFoundException;
import com.Project.ScheduleTimeTable.exception.ScheduleAlreadyExistsException;
import com.Project.ScheduleTimeTable.model.Schedule;
import com.Project.ScheduleTimeTable.model.Timetable;
import com.Project.ScheduleTimeTable.repository.ScheduleRepository;
import com.Project.ScheduleTimeTable.service.ScheduleService;
import com.Project.ScheduleTimeTable.service.TimetableService;

@Service
public class ScheduleServiceImpl implements ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final TimetableService timetableService;

    public ScheduleServiceImpl(
            ScheduleRepository scheduleRepository,
            TimetableService timetableService) {

        this.scheduleRepository = scheduleRepository;
        this.timetableService = timetableService;
    }

    @Override
    public ScheduleResponse createSchedule(ScheduleRequest request) {

        if (scheduleRepository.existsByScheduleDateAndTimetableId(
                request.getScheduleDate(),
                request.getTimetableId())) {

            throw new ScheduleAlreadyExistsException(
                    "Schedule already exists.");
        }

        Timetable timetable =
                timetableService.findTimetableById(
                        request.getTimetableId());

        Schedule schedule = new Schedule();

        schedule.setScheduleDate(request.getScheduleDate());
        schedule.setTimetable(timetable);
        schedule.setCancelled(request.isCancelled());
        schedule.setRemarks(request.getRemarks());
        schedule.setActive(request.isActive());

        return mapToResponse(
                scheduleRepository.save(schedule));
    }

    @Override
    public List<ScheduleResponse> getAllSchedules() {

        return scheduleRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ScheduleResponse getScheduleById(Long id) {

        return mapToResponse(findScheduleById(id));
    }

    @Override
    public List<ScheduleResponse> getSchedulesByDate(LocalDate date) {

        return scheduleRepository.findByScheduleDate(date)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ScheduleResponse> getSchedulesByTimetable(Long timetableId) {

        return scheduleRepository.findByTimetableId(timetableId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ScheduleResponse updateSchedule(
            Long id,
            UpdateScheduleRequest request) {

        Schedule schedule = findScheduleById(id);

        schedule.setScheduleDate(request.getScheduleDate());

        schedule.setTimetable(
                timetableService.findTimetableById(
                        request.getTimetableId()));

        schedule.setCancelled(request.isCancelled());
        schedule.setRemarks(request.getRemarks());
        schedule.setActive(request.isActive());

        return mapToResponse(
                scheduleRepository.save(schedule));
    }

    @Override
    public void deleteSchedule(Long id) {

        scheduleRepository.delete(findScheduleById(id));
    }

    @Override
    public Schedule findScheduleById(Long id) {

        return scheduleRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Schedule not found with id : " + id));
    }

    private ScheduleResponse mapToResponse(
            Schedule schedule) {

        return new ScheduleResponse(

                schedule.getId(),
                schedule.getScheduleDate(),
                schedule.getTimetable().getId(),
                schedule.isCancelled(),
                schedule.getRemarks(),
                schedule.isActive(),
                schedule.getCreatedAt(),
                schedule.getUpdatedAt()

        );
    }

}