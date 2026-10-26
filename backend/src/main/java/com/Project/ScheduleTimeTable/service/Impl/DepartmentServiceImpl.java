package com.Project.ScheduleTimeTable.service.Impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.Project.ScheduleTimeTable.dto.request.DepartmentRequest;
import com.Project.ScheduleTimeTable.dto.request.UpdateDepartmentRequest;
import com.Project.ScheduleTimeTable.dto.response.DepartmentResponse;
import com.Project.ScheduleTimeTable.exception.DepartmentAlreadyExistsException;
import com.Project.ScheduleTimeTable.exception.ResourceNotFoundException;
import com.Project.ScheduleTimeTable.model.Department;
import com.Project.ScheduleTimeTable.repository.DepartmentRepository;
import com.Project.ScheduleTimeTable.service.DepartmentService;

@Service
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentServiceImpl(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    @Override
    public DepartmentResponse createDepartment(DepartmentRequest request) {

        if (departmentRepository.existsByDepartmentCode(request.getDepartmentCode())) {
            throw new DepartmentAlreadyExistsException(
                    "Department code already exists");
        }

        if (departmentRepository.existsByDepartmentName(request.getDepartmentName())) {
            throw new DepartmentAlreadyExistsException(
                    "Department name already exists");
        }

        Department department = new Department();

        department.setDepartmentCode(request.getDepartmentCode());
        department.setDepartmentName(request.getDepartmentName());
        department.setDescription(request.getDescription());
        department.setActive(request.isActive());

        Department savedDepartment = departmentRepository.save(department);

        return mapToResponse(savedDepartment);
    }

    @Override
    public DepartmentResponse getDepartmentById(Long id) {

        Department department = findDepartmentById(id);

        return mapToResponse(department);
    }

    @Override
    public List<DepartmentResponse> getAllDepartments() {

        return departmentRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public DepartmentResponse updateDepartment(Long id,
                                               UpdateDepartmentRequest request) {

        Department department = findDepartmentById(id);

        department.setDepartmentName(request.getDepartmentName());
        department.setDescription(request.getDescription());
        department.setActive(request.isActive());

        Department updatedDepartment = departmentRepository.save(department);

        return mapToResponse(updatedDepartment);
    }

    @Override
    public void deleteDepartment(Long id) {

        Department department = findDepartmentById(id);

        departmentRepository.delete(department);
    }

    @Override
    public boolean existsByDepartmentCode(String departmentCode) {

        return departmentRepository.existsByDepartmentCode(departmentCode);
    }

    @Override
    public boolean existsByDepartmentName(String departmentName) {

        return departmentRepository.existsByDepartmentName(departmentName);
    }

    @Override
    public Department findDepartmentById(Long id) {

        return departmentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Department not found with id : " + id));
    }

    @Override
    public Department findDepartmentByCode(String departmentCode) {

        return departmentRepository.findByDepartmentCode(departmentCode)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Department not found with code : " + departmentCode));
    }

    private DepartmentResponse mapToResponse(Department department) {

        return new DepartmentResponse(
                department.getId(),
                department.getDepartmentCode(),
                department.getDepartmentName(),
                department.getDescription(),
                department.isActive(),
                department.getCreatedAt(),
                department.getUpdatedAt()
        );
    }

}