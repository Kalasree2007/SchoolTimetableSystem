package com.Project.ScheduleTimeTable.service.Impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.Project.ScheduleTimeTable.dto.request.SubjectRequest;
import com.Project.ScheduleTimeTable.dto.request.UpdateSubjectRequest;
import com.Project.ScheduleTimeTable.dto.response.SubjectResponse;
import com.Project.ScheduleTimeTable.exception.ResourceNotFoundException;
import com.Project.ScheduleTimeTable.exception.SubjectAlreadyExistsException;
import com.Project.ScheduleTimeTable.model.Department;
import com.Project.ScheduleTimeTable.model.Subject;
import com.Project.ScheduleTimeTable.repository.SubjectRepository;
import com.Project.ScheduleTimeTable.service.DepartmentService;
import com.Project.ScheduleTimeTable.service.SubjectService;

@Service
public class SubjectServiceImpl implements SubjectService {

    private final SubjectRepository subjectRepository;
    private final DepartmentService departmentService;

    public SubjectServiceImpl(SubjectRepository subjectRepository,
                              DepartmentService departmentService) {

        this.subjectRepository = subjectRepository;
        this.departmentService = departmentService;
    }

    @Override
    public SubjectResponse createSubject(SubjectRequest request) {

        if (subjectRepository.existsBySubjectCode(request.getSubjectCode())) {
            throw new SubjectAlreadyExistsException(
                    "Subject code already exists");
        }

        if (subjectRepository.existsBySubjectName(request.getSubjectName())) {
            throw new SubjectAlreadyExistsException(
                    "Subject name already exists");
        }

        Department department =
                departmentService.findDepartmentById(
                        request.getDepartmentId());

        Subject subject = new Subject();

        subject.setSubjectCode(request.getSubjectCode());
        subject.setSubjectName(request.getSubjectName());
        subject.setDescription(request.getDescription());
        subject.setCredits(request.getCredits());
        subject.setActive(request.isActive());
        subject.setDepartment(department);

        Subject savedSubject = subjectRepository.save(subject);

        return mapToResponse(savedSubject);
    }

    @Override
    public List<SubjectResponse> getAllSubjects() {

        return subjectRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public SubjectResponse getSubjectById(Long id) {

        return mapToResponse(findSubjectById(id));
    }

    @Override
    public SubjectResponse updateSubject(Long id,
                                         UpdateSubjectRequest request) {

        Subject subject = findSubjectById(id);

        Department department =
                departmentService.findDepartmentById(
                        request.getDepartmentId());

        subject.setSubjectName(request.getSubjectName());
        subject.setDescription(request.getDescription());
        subject.setCredits(request.getCredits());
        subject.setActive(request.isActive());
        subject.setDepartment(department);

        Subject updatedSubject = subjectRepository.save(subject);

        return mapToResponse(updatedSubject);
    }

    @Override
    public void deleteSubject(Long id) {

        Subject subject = findSubjectById(id);

        subjectRepository.delete(subject);
    }

    @Override
    public boolean existsBySubjectCode(String subjectCode) {

        return subjectRepository.existsBySubjectCode(subjectCode);
    }

    @Override
    public boolean existsBySubjectName(String subjectName) {

        return subjectRepository.existsBySubjectName(subjectName);
    }

    @Override
    public Subject findSubjectById(Long id) {

        return subjectRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Subject not found with id : " + id));
    }

    @Override
    public Subject findSubjectByCode(String subjectCode) {

        return subjectRepository.findBySubjectCode(subjectCode)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Subject not found with code : " + subjectCode));
    }

    private SubjectResponse mapToResponse(Subject subject) {

        return new SubjectResponse(
                subject.getId(),
                subject.getSubjectCode(),
                subject.getSubjectName(),
                subject.getDescription(),
                subject.getCredits(),
                subject.isActive(),
                subject.getDepartment().getId(),
                subject.getDepartment().getDepartmentName(),
                subject.getCreatedAt(),
                subject.getUpdatedAt()
        );
    }

}