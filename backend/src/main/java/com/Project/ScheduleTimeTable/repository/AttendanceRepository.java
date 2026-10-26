package com.Project.ScheduleTimeTable.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Project.ScheduleTimeTable.model.Attendance;

public interface AttendanceRepository
        extends JpaRepository<Attendance, Long> {

    boolean existsByStudentIdAndScheduleId(
            Long studentId,
            Long scheduleId);

    List<Attendance> findByStudentId(Long studentId);

    List<Attendance> findByScheduleId(Long scheduleId);

}