package com.Project.ScheduleTimeTable.service.Impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.Project.ScheduleTimeTable.dto.request.ClassEntityRequest;
import com.Project.ScheduleTimeTable.dto.request.UpdateClassEntityRequest;
import com.Project.ScheduleTimeTable.dto.response.ClassEntityResponse;
import com.Project.ScheduleTimeTable.exception.ClassAlreadyExistsException;
import com.Project.ScheduleTimeTable.exception.ResourceNotFoundException;
import com.Project.ScheduleTimeTable.model.ClassEntity;
import com.Project.ScheduleTimeTable.model.Department;
import com.Project.ScheduleTimeTable.repository.ClassEntityRepository;
import com.Project.ScheduleTimeTable.service.ClassEntityService;
import com.Project.ScheduleTimeTable.service.DepartmentService;

@Service
public class ClassEntityServiceImpl implements ClassEntityService {

    private final ClassEntityRepository classRepository;
    private final DepartmentService departmentService;

    public ClassEntityServiceImpl(
            ClassEntityRepository classRepository,
            DepartmentService departmentService) {

        this.classRepository = classRepository;
        this.departmentService = departmentService;
    }

    @Override
    public ClassEntityResponse createClass(ClassEntityRequest request) {

        if (classRepository.existsByClassCode(request.getClassCode())) {
            throw new ClassAlreadyExistsException(
                    "Class Code already exists");
        }

        Department department =
                departmentService.findDepartmentById(request.getDepartmentId());

        ClassEntity classEntity = new ClassEntity();

        classEntity.setClassCode(request.getClassCode());
        classEntity.setClassName(request.getClassName());
        classEntity.setSection(request.getSection());
        classEntity.setAcademicYear(request.getAcademicYear());
        classEntity.setCapacity(request.getCapacity());
        classEntity.setActive(request.isActive());
        classEntity.setDepartment(department);

        return mapToResponse(classRepository.save(classEntity));
    }

    @Override
    public List<ClassEntityResponse> getAllClasses() {

        return classRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ClassEntityResponse getClassById(Long id) {

        return mapToResponse(findClassById(id));
    }

    @Override
    public ClassEntityResponse updateClass(
            Long id,
            UpdateClassEntityRequest request) {

        ClassEntity classEntity = findClassById(id);

        Department department =
                departmentService.findDepartmentById(request.getDepartmentId());

        classEntity.setClassName(request.getClassName());
        classEntity.setSection(request.getSection());
        classEntity.setAcademicYear(request.getAcademicYear());
        classEntity.setCapacity(request.getCapacity());
        classEntity.setActive(request.isActive());
        classEntity.setDepartment(department);

        return mapToResponse(classRepository.save(classEntity));
    }

    @Override
    public void deleteClass(Long id) {

        classRepository.delete(findClassById(id));
    }

    @Override
    public boolean existsByClassCode(String classCode) {

        return classRepository.existsByClassCode(classCode);
    }

    @Override
    public ClassEntity findClassById(Long id) {

        return classRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Class not found with id : " + id));
    }

    @Override
    public ClassEntity findClassByClassCode(String classCode) {

        return classRepository.findByClassCode(classCode)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Class not found : " + classCode));
    }

    private ClassEntityResponse mapToResponse(ClassEntity classEntity) {

        return new ClassEntityResponse(

                classEntity.getId(),
                classEntity.getClassCode(),
                classEntity.getClassName(),
                classEntity.getSection(),
                classEntity.getAcademicYear(),
                classEntity.getCapacity(),
                classEntity.isActive(),
                classEntity.getDepartment().getId(),
                classEntity.getDepartment().getDepartmentName(),
                classEntity.getCreatedAt(),
                classEntity.getUpdatedAt()

        );
    }

}