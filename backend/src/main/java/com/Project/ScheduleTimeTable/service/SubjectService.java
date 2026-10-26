package com.Project.ScheduleTimeTable.service;

import java.util.List;

import com.Project.ScheduleTimeTable.dto.request.SubjectRequest;
import com.Project.ScheduleTimeTable.dto.request.UpdateSubjectRequest;
import com.Project.ScheduleTimeTable.dto.response.SubjectResponse;
import com.Project.ScheduleTimeTable.model.Subject;

public interface SubjectService {

    SubjectResponse createSubject(SubjectRequest request);

    List<SubjectResponse> getAllSubjects();

    SubjectResponse getSubjectById(Long id);

    SubjectResponse updateSubject(Long id,
                                 UpdateSubjectRequest request);

    void deleteSubject(Long id);

    boolean existsBySubjectCode(String subjectCode);

    boolean existsBySubjectName(String subjectName);

    Subject findSubjectById(Long id);

    Subject findSubjectByCode(String subjectCode);

}