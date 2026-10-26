package com.Project.ScheduleTimeTable.service.Impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.Project.ScheduleTimeTable.dto.request.StudentRequest;
import com.Project.ScheduleTimeTable.dto.request.UpdateStudentRequest;
import com.Project.ScheduleTimeTable.dto.response.StudentResponse;
import com.Project.ScheduleTimeTable.exception.ResourceNotFoundException;
import com.Project.ScheduleTimeTable.exception.StudentAlreadyExistsException;
import com.Project.ScheduleTimeTable.model.ClassEntity;
import com.Project.ScheduleTimeTable.model.Student;
import com.Project.ScheduleTimeTable.model.User;
import com.Project.ScheduleTimeTable.repository.StudentRepository;
import com.Project.ScheduleTimeTable.service.ClassEntityService;
import com.Project.ScheduleTimeTable.service.StudentService;
import com.Project.ScheduleTimeTable.service.UserService;

@Service
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final UserService userService;
    private final ClassEntityService classEntityService;

    public StudentServiceImpl(StudentRepository studentRepository,
                              UserService userService,
                              ClassEntityService classEntityService) {

        this.studentRepository = studentRepository;
        this.userService = userService;
        this.classEntityService = classEntityService;
    }

    @Override
    public StudentResponse createStudent(StudentRequest request) {

        if(studentRepository.existsByAdmissionNumber(request.getAdmissionNumber())) {
            throw new StudentAlreadyExistsException(
                    "Admission Number already exists");
        }

        User user = userService.findUserById(request.getUserId());

        ClassEntity classEntity =
                classEntityService.findClassById(request.getClassId());

        Student student = new Student();

        student.setAdmissionNumber(request.getAdmissionNumber());
        student.setAdmissionDate(request.getAdmissionDate());
        student.setRollNumber(request.getRollNumber());
        student.setSemester(request.getSemester());
        student.setActive(request.isActive());
        student.setUser(user);
        student.setClassEntity(classEntity);

        return mapToResponse(studentRepository.save(student));
    }

    @Override
    public List<StudentResponse> getAllStudents() {

        return studentRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public StudentResponse getStudentById(Long id) {

        return mapToResponse(findStudentById(id));
    }

    @Override
    public StudentResponse updateStudent(Long id,
                                         UpdateStudentRequest request) {

        Student student = findStudentById(id);

        ClassEntity classEntity =
                classEntityService.findClassById(request.getClassId());

        student.setRollNumber(request.getRollNumber());
        student.setSemester(request.getSemester());
        student.setActive(request.isActive());
        student.setClassEntity(classEntity);

        return mapToResponse(studentRepository.save(student));
    }

    
    @Override
    public void deleteStudent(Long id) {

        studentRepository.delete(findStudentById(id));
    }

    @Override
    public boolean existsByAdmissionNumber(String admissionNumber) {

        return studentRepository.existsByAdmissionNumber(admissionNumber);
    }

    @Override
    public Student findStudentById(Long id) {

        return studentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student not found with id : " + id));
    }

    @Override
    public Student findStudentByAdmissionNumber(String admissionNumber) {

        return studentRepository.findByAdmissionNumber(admissionNumber)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student not found : " + admissionNumber));
    }

    private StudentResponse mapToResponse(Student student) {

        return new StudentResponse(

                student.getId(),
                student.getAdmissionNumber(),
                student.getAdmissionDate(),
                student.getRollNumber(),
                student.getSemester(),
                student.isActive(),

                student.getUser().getId(),
                student.getUser().getFullName(),

                student.getClassEntity().getId(),
                student.getClassEntity().getClassName(),

                student.getCreatedAt(),
                student.getUpdatedAt()

        );
    }

    @Override
public StudentResponse getStudentByUserId(Long userId) {

    Student student = studentRepository.findByUserId(userId)
            .orElseThrow(() ->
                    new ResourceNotFoundException(
                            "Student not found for user ID: " + userId
                    )
            );

    return mapToResponse(student);
}

}