package com.Project.ScheduleTimeTable.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Project.ScheduleTimeTable.model.TimeSlot;

@Repository
public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long>{

    Optional<TimeSlot> findBySlotName(String slotName);

    boolean existsBySlotName(String slotName);

}