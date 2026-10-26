package com.Project.ScheduleTimeTable.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Project.ScheduleTimeTable.model.Student;

@Repository
public interface StudentRepository extends JpaRepository<Student,Long>{

    Optional<Student> findByAdmissionNumber(String admissionNumber);

    boolean existsByAdmissionNumber(String admissionNumber);

    Optional<Student> findByUserId(Long userId);

}