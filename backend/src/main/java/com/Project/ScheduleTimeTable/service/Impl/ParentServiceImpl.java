package com.Project.ScheduleTimeTable.service.Impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.Project.ScheduleTimeTable.dto.request.ParentRequest;
import com.Project.ScheduleTimeTable.dto.request.UpdateParentRequest;
import com.Project.ScheduleTimeTable.dto.response.ParentResponse;
import com.Project.ScheduleTimeTable.exception.ParentAlreadyExistsException;
import com.Project.ScheduleTimeTable.exception.ResourceNotFoundException;
import com.Project.ScheduleTimeTable.model.Parent;
import com.Project.ScheduleTimeTable.model.Student;
import com.Project.ScheduleTimeTable.model.User;
import com.Project.ScheduleTimeTable.repository.ParentRepository;
import com.Project.ScheduleTimeTable.service.ParentService;
import com.Project.ScheduleTimeTable.service.StudentService;
import com.Project.ScheduleTimeTable.service.UserService;

@Service
public class ParentServiceImpl implements ParentService {

    private final ParentRepository parentRepository;
    private final UserService userService;
    private final StudentService studentService;

    public ParentServiceImpl(ParentRepository parentRepository,
                             UserService userService,
                             StudentService studentService) {

        this.parentRepository = parentRepository;
        this.userService = userService;
        this.studentService = studentService;
    }

    @Override
    public ParentResponse createParent(ParentRequest request) {

        if(parentRepository.existsByUserId(request.getUserId())) {
            throw new ParentAlreadyExistsException(
                    "Parent already exists for this user");
        }

        User user = userService.findUserById(request.getUserId());

        Student student =
                studentService.findStudentById(request.getStudentId());

        Parent parent = new Parent();

        parent.setOccupation(request.getOccupation());
        parent.setRelationship(request.getRelationship());
        parent.setAddress(request.getAddress());
        parent.setActive(request.isActive());
        parent.setUser(user);
        parent.setStudent(student);

        return mapToResponse(parentRepository.save(parent));
    }

    @Override
    public List<ParentResponse> getAllParents() {

        return parentRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ParentResponse getParentById(Long id) {

        return mapToResponse(findParentById(id));
    }

    @Override
    public ParentResponse updateParent(Long id,
                                       UpdateParentRequest request) {

        Parent parent = findParentById(id);

        parent.setOccupation(request.getOccupation());
        parent.setRelationship(request.getRelationship());
        parent.setAddress(request.getAddress());
        parent.setActive(request.isActive());

        return mapToResponse(parentRepository.save(parent));
    }

    @Override
    public void deleteParent(Long id) {

        parentRepository.delete(findParentById(id));
    }

    @Override
    public Parent findParentById(Long id) {

        return parentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Parent not found with id : " + id));
    }

    private ParentResponse mapToResponse(Parent parent) {

        return new ParentResponse(

                parent.getId(),
                parent.getOccupation(),
                parent.getRelationship(),
                parent.getAddress(),
                parent.isActive(),

                parent.getUser().getId(),
                parent.getUser().getFullName(),

                parent.getStudent().getId(),
                parent.getStudent().getUser().getFullName(),

                parent.getCreatedAt(),
                parent.getUpdatedAt()

        );
    }


    @Override
public ParentResponse getParentByUserId(Long userId) {

    return mapToResponse(
            parentRepository.findByUserId(userId)
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Parent record not found for user ID: " + userId
                            )
                    )
    );
}

}