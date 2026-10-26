package com.Project.ScheduleTimeTable.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Project.ScheduleTimeTable.model.Teacher;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long>{

    Optional<Teacher> findByEmployeeId(String employeeId);

    Optional<Teacher> findByUserId(Long userId);

    boolean existsByEmployeeId(String employeeId);

    boolean existsByUserId(Long userId);

}