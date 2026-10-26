package com.Project.ScheduleTimeTable.service;

import java.util.List;

import com.Project.ScheduleTimeTable.dto.request.StudentRequest;
import com.Project.ScheduleTimeTable.dto.request.UpdateStudentRequest;
import com.Project.ScheduleTimeTable.dto.response.StudentResponse;
import com.Project.ScheduleTimeTable.model.Student;

public interface StudentService {

    
    StudentResponse createStudent(StudentRequest request);

    
    List<StudentResponse> getAllStudents();

    StudentResponse getStudentById(Long id);

    StudentResponse updateStudent(Long id,
                                  UpdateStudentRequest request);

    void deleteStudent(Long id);

    boolean existsByAdmissionNumber(String admissionNumber);

    Student findStudentById(Long id);

    Student findStudentByAdmissionNumber(String admissionNumber);
    StudentResponse getStudentByUserId(Long userId);
    

}