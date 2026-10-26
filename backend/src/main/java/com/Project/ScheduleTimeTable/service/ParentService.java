package com.Project.ScheduleTimeTable.service;

import java.util.List;

import com.Project.ScheduleTimeTable.dto.request.ParentRequest;
import com.Project.ScheduleTimeTable.dto.request.UpdateParentRequest;
import com.Project.ScheduleTimeTable.dto.response.ParentResponse;
import com.Project.ScheduleTimeTable.model.Parent;

public interface ParentService {

    ParentResponse createParent(ParentRequest request);

    List<ParentResponse> getAllParents();

    ParentResponse getParentById(Long id);

    ParentResponse updateParent(Long id,
                                UpdateParentRequest request);

    void deleteParent(Long id);

    Parent findParentById(Long id);

    ParentResponse getParentByUserId(Long userId);


}