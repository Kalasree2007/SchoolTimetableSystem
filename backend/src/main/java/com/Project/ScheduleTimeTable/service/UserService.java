package com.Project.ScheduleTimeTable.service;

import java.util.List;

import com.Project.ScheduleTimeTable.dto.request.ChangePasswordRequest;
import com.Project.ScheduleTimeTable.dto.request.LoginRequest;
import com.Project.ScheduleTimeTable.dto.request.RegisterRequest;
import com.Project.ScheduleTimeTable.dto.request.UpdateUserRequest;
import com.Project.ScheduleTimeTable.dto.response.LoginResponse;
import com.Project.ScheduleTimeTable.dto.response.UserResponse;
import com.Project.ScheduleTimeTable.enums.Role;
import com.Project.ScheduleTimeTable.model.User;

public interface UserService {


    LoginResponse register(RegisterRequest request);

    LoginResponse login(LoginRequest request);



    UserResponse getUserById(Long id);

    List<UserResponse> getAllUsers();

    UserResponse updateUser(Long id, UpdateUserRequest request);

    void deleteUser(Long id);

    void changePassword(Long id,
                        ChangePasswordRequest request);

    UserResponse getCurrentUser();


    List<UserResponse> getUsersByRole(Role role);

    void activateUser(Long id);

    void deactivateUser(Long id);

    User findUserById(Long id);


}