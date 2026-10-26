package com.Project.ScheduleTimeTable.service.Impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.Project.ScheduleTimeTable.dto.request.TeacherRequest;
import com.Project.ScheduleTimeTable.dto.request.UpdateTeacherRequest;
import com.Project.ScheduleTimeTable.dto.response.TeacherResponse;
import com.Project.ScheduleTimeTable.exception.ResourceNotFoundException;
import com.Project.ScheduleTimeTable.exception.TeacherAlreadyExistsException;
import com.Project.ScheduleTimeTable.model.Department;
import com.Project.ScheduleTimeTable.model.Teacher;
import com.Project.ScheduleTimeTable.model.User;
import com.Project.ScheduleTimeTable.repository.TeacherRepository;
import com.Project.ScheduleTimeTable.service.DepartmentService;
import com.Project.ScheduleTimeTable.service.TeacherService;
import com.Project.ScheduleTimeTable.service.UserService;

@Service
public class TeacherServiceImpl implements TeacherService {

    private final TeacherRepository teacherRepository;
    private final UserService userService;
    private final DepartmentService departmentService;

    public TeacherServiceImpl(TeacherRepository teacherRepository,
                              UserService userService,
                              DepartmentService departmentService) {

        this.teacherRepository = teacherRepository;
        this.userService = userService;
        this.departmentService = departmentService;
    }

    @Override
    public TeacherResponse createTeacher(TeacherRequest request) {

        if (teacherRepository.existsByEmployeeId(request.getEmployeeId())) {
            throw new TeacherAlreadyExistsException("Employee Id already exists");
        }

        if (teacherRepository.existsByUserId(request.getUserId())) {
            throw new TeacherAlreadyExistsException("Teacher already assigned to this user");
        }

        User user = userService.findUserById(request.getUserId());

        Department department =
                departmentService.findDepartmentById(request.getDepartmentId());

        Teacher teacher = new Teacher();

        teacher.setEmployeeId(request.getEmployeeId());
        teacher.setQualification(request.getQualification());
        teacher.setExperience(request.getExperience());
        teacher.setSpecialization(request.getSpecialization());
        teacher.setActive(request.isActive());
        teacher.setUser(user);
        teacher.setDepartment(department);

        Teacher savedTeacher = teacherRepository.save(teacher);

        return mapToResponse(savedTeacher);
    }

    @Override
    public List<TeacherResponse> getAllTeachers() {

        return teacherRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public TeacherResponse getTeacherById(Long id) {

        return mapToResponse(findTeacherById(id));
    }

    @Override
    public TeacherResponse updateTeacher(Long id,
                                         UpdateTeacherRequest request) {

        Teacher teacher = findTeacherById(id);

        Department department =
                departmentService.findDepartmentById(request.getDepartmentId());

        teacher.setQualification(request.getQualification());
        teacher.setExperience(request.getExperience());
        teacher.setSpecialization(request.getSpecialization());
        teacher.setActive(request.isActive());
        teacher.setDepartment(department);

        Teacher updatedTeacher = teacherRepository.save(teacher);

        return mapToResponse(updatedTeacher);
    }

    @Override
    public void deleteTeacher(Long id) {

        Teacher teacher = findTeacherById(id);

        teacherRepository.delete(teacher);
    }

    @Override
    public boolean existsByEmployeeId(String employeeId) {
        return teacherRepository.existsByEmployeeId(employeeId);
    }

    @Override
    public boolean existsByUserId(Long userId) {
        return teacherRepository.existsByUserId(userId);
    }

    @Override
    public Teacher findTeacherById(Long id) {

        return teacherRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Teacher not found with id : " + id));
    }

    @Override
    public Teacher findTeacherByEmployeeId(String employeeId) {

        return teacherRepository.findByEmployeeId(employeeId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Teacher not found with Employee Id : " + employeeId));
    }

    private TeacherResponse mapToResponse(Teacher teacher) {

        return new TeacherResponse(
                teacher.getId(),
                teacher.getEmployeeId(),
                teacher.getQualification(),
                teacher.getExperience(),
                teacher.getSpecialization(),
                teacher.isActive(),

                teacher.getUser().getId(),
                teacher.getUser().getFullName(),
                teacher.getUser().getEmail(),

                teacher.getDepartment().getId(),
                teacher.getDepartment().getDepartmentName(),

                teacher.getCreatedAt(),
                teacher.getUpdatedAt()
        );
    }
}