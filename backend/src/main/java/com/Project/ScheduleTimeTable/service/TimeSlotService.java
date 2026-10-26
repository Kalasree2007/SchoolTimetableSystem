package com.Project.ScheduleTimeTable.service;

import java.util.List;

import com.Project.ScheduleTimeTable.dto.request.TimeSlotRequest;
import com.Project.ScheduleTimeTable.dto.request.UpdateTimeSlotRequest;
import com.Project.ScheduleTimeTable.dto.response.TimeSlotResponse;
import com.Project.ScheduleTimeTable.model.TimeSlot;

public interface TimeSlotService {

    
    TimeSlotResponse createTimeSlot(TimeSlotRequest request);

    
    List<TimeSlotResponse> getAllTimeSlots();

    TimeSlotResponse getTimeSlotById(Long id);

    TimeSlotResponse updateTimeSlot(Long id,
                                    UpdateTimeSlotRequest request);

    
    void deleteTimeSlot(Long id);

    boolean existsBySlotName(String slotName);

    TimeSlot findTimeSlotById(Long id);

    TimeSlot findTimeSlotBySlotName(String slotName);

}