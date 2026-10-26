package com.Project.ScheduleTimeTable.repository;

import java.time.DayOfWeek;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Project.ScheduleTimeTable.model.Timetable;

public interface TimetableRepository
        extends JpaRepository<Timetable, Long> {

    boolean existsByClassEntityIdAndDayOfWeekAndTimeSlotId(
            Long classId,
            DayOfWeek day,
            Long timeSlotId);

    List<Timetable> findByClassEntityId(Long classId);

    List<Timetable> findByTeacherId(Long teacherId);

    List<Timetable> findByDayOfWeek(DayOfWeek day);

}