package com.Project.ScheduleTimeTable.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Project.ScheduleTimeTable.model.Schedule;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    boolean existsByScheduleDateAndTimetableId(
            LocalDate scheduleDate,
            Long timetableId);

    List<Schedule> findByScheduleDate(LocalDate scheduleDate);

    List<Schedule> findByTimetableId(Long timetableId);
}