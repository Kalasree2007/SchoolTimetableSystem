package com.Project.ScheduleTimeTable.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Project.ScheduleTimeTable.model.AcademicCalendar;

@Repository
public interface AcademicCalendarRepository
        extends JpaRepository<AcademicCalendar, Long> {

    Optional<AcademicCalendar> findByTitle(String title);

    boolean existsByTitle(String title);

}