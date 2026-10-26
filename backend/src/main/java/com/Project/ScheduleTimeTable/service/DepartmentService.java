package com.Project.ScheduleTimeTable.service;

import java.util.List;

import com.Project.ScheduleTimeTable.dto.request.DepartmentRequest;
import com.Project.ScheduleTimeTable.dto.request.UpdateDepartmentRequest;
import com.Project.ScheduleTimeTable.dto.response.DepartmentResponse;
import com.Project.ScheduleTimeTable.model.Department;

public interface DepartmentService {


    DepartmentResponse createDepartment(DepartmentRequest request);

    DepartmentResponse getDepartmentById(Long id);

    List<DepartmentResponse> getAllDepartments();


    DepartmentResponse updateDepartment(
            Long id,
            UpdateDepartmentRequest request
    );


    void deleteDepartment(Long id);

    boolean existsByDepartmentCode(String departmentCode);

    boolean existsByDepartmentName(String departmentName);


    Department findDepartmentById(Long id);

    Department findDepartmentByCode(String departmentCode);

}