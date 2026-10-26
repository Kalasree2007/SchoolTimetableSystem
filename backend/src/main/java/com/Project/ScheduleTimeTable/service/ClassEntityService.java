package com.Project.ScheduleTimeTable.service;

import java.util.List;

import com.Project.ScheduleTimeTable.dto.request.ClassEntityRequest;
import com.Project.ScheduleTimeTable.dto.request.UpdateClassEntityRequest;
import com.Project.ScheduleTimeTable.dto.response.ClassEntityResponse;
import com.Project.ScheduleTimeTable.model.ClassEntity;

public interface ClassEntityService {

    ClassEntityResponse createClass(ClassEntityRequest request);

    List<ClassEntityResponse> getAllClasses();

    ClassEntityResponse getClassById(Long id);

    ClassEntityResponse updateClass(Long id,
                                    UpdateClassEntityRequest request);

    void deleteClass(Long id);

    boolean existsByClassCode(String classCode);

    ClassEntity findClassById(Long id);

    ClassEntity findClassByClassCode(String classCode);

}