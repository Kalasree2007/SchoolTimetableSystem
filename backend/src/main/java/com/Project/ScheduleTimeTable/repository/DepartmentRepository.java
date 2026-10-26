package com.Project.ScheduleTimeTable.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Project.ScheduleTimeTable.model.Department;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {

    // Find by Department Code
    Optional<Department> findByDepartmentCode(String departmentCode);

    // Find by Department Name
    Optional<Department> findByDepartmentName(String departmentName);

    // Check Department Code Exists
    boolean existsByDepartmentCode(String departmentCode);

    // Check Department Name Exists
    boolean existsByDepartmentName(String departmentName);

}