package com.Project.ScheduleTimeTable.service.Impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.Project.ScheduleTimeTable.dto.request.TimeSlotRequest;
import com.Project.ScheduleTimeTable.dto.request.UpdateTimeSlotRequest;
import com.Project.ScheduleTimeTable.dto.response.TimeSlotResponse;
import com.Project.ScheduleTimeTable.exception.ResourceNotFoundException;
import com.Project.ScheduleTimeTable.exception.TimeSlotAlreadyExistsException;
import com.Project.ScheduleTimeTable.model.TimeSlot;
import com.Project.ScheduleTimeTable.repository.TimeSlotRepository;
import com.Project.ScheduleTimeTable.service.TimeSlotService;

@Service
public class TimeSlotServiceImpl implements TimeSlotService {

    private final TimeSlotRepository timeSlotRepository;

    public TimeSlotServiceImpl(TimeSlotRepository timeSlotRepository) {
        this.timeSlotRepository = timeSlotRepository;
    }

    @Override
    public TimeSlotResponse createTimeSlot(TimeSlotRequest request) {

        if (timeSlotRepository.existsBySlotName(request.getSlotName())) {
            throw new TimeSlotAlreadyExistsException(
                    "Time Slot already exists");
        }

        TimeSlot timeSlot = new TimeSlot();

        timeSlot.setSlotName(request.getSlotName());
        timeSlot.setStartTime(request.getStartTime());
        timeSlot.setEndTime(request.getEndTime());
        timeSlot.setDuration(request.getDuration());
        timeSlot.setActive(request.isActive());

        TimeSlot savedTimeSlot = timeSlotRepository.save(timeSlot);

        return mapToResponse(savedTimeSlot);
    }

    @Override
    public List<TimeSlotResponse> getAllTimeSlots() {

        return timeSlotRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public TimeSlotResponse getTimeSlotById(Long id) {

        return mapToResponse(findTimeSlotById(id));
    }

    @Override
    public TimeSlotResponse updateTimeSlot(Long id,
                                           UpdateTimeSlotRequest request) {

        TimeSlot timeSlot = findTimeSlotById(id);

        timeSlot.setSlotName(request.getSlotName());
        timeSlot.setStartTime(request.getStartTime());
        timeSlot.setEndTime(request.getEndTime());
        timeSlot.setDuration(request.getDuration());
        timeSlot.setActive(request.isActive());

        TimeSlot updatedTimeSlot = timeSlotRepository.save(timeSlot);

        return mapToResponse(updatedTimeSlot);
    }

    @Override
    public void deleteTimeSlot(Long id) {

        TimeSlot timeSlot = findTimeSlotById(id);

        timeSlotRepository.delete(timeSlot);
    }

    @Override
    public boolean existsBySlotName(String slotName) {
        return timeSlotRepository.existsBySlotName(slotName);
    }

    @Override
    public TimeSlot findTimeSlotById(Long id) {

        return timeSlotRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Time Slot not found with id : " + id));
    }

    @Override
    public TimeSlot findTimeSlotBySlotName(String slotName) {

        return timeSlotRepository.findBySlotName(slotName)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Time Slot not found : " + slotName));
    }

    private TimeSlotResponse mapToResponse(TimeSlot timeSlot) {

        return new TimeSlotResponse(

                timeSlot.getId(),
                timeSlot.getSlotName(),
                timeSlot.getStartTime(),
                timeSlot.getEndTime(),
                timeSlot.getDuration(),
                timeSlot.isActive(),
                timeSlot.getCreatedAt(),
                timeSlot.getUpdatedAt()

        );
    }

}