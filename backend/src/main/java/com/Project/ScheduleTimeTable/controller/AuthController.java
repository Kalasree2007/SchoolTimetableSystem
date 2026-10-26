package com.Project.ScheduleTimeTable.controller;


import com.Project.ScheduleTimeTable.dto.request.LoginRequest;
import com.Project.ScheduleTimeTable.dto.request.RegisterRequest;
import com.Project.ScheduleTimeTable.dto.response.LoginResponse;
import com.Project.ScheduleTimeTable.service.UserService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {



    private final UserService userService;


    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(
            @RequestBody RegisterRequest request
    ){

        LoginResponse response =
                userService.register(request);


        return new ResponseEntity<>(
                response,
                HttpStatus.CREATED
        );

    }




    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request
    ){


        LoginResponse response =
                userService.login(request);



        return ResponseEntity.ok(response);

    }


}