package com.Project.ScheduleTimeTable.controller;


import com.Project.ScheduleTimeTable.dto.request.ChangePasswordRequest;
import com.Project.ScheduleTimeTable.dto.request.UpdateUserRequest;
import com.Project.ScheduleTimeTable.dto.response.UserResponse;
import com.Project.ScheduleTimeTable.enums.Role;
import com.Project.ScheduleTimeTable.service.UserService;

import lombok.RequiredArgsConstructor;


import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {



    private final UserService userService;


    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(){

        return ResponseEntity.ok(
                userService.getCurrentUser()
        );

    }


    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> getUserById(
            @PathVariable Long id
    ){

        return ResponseEntity.ok(
                userService.getUserById(id)
        );

    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUsers(){

        return ResponseEntity.ok(
                userService.getAllUsers()
        );

    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long id,
            @RequestBody UpdateUserRequest request
    ){


        return ResponseEntity.ok(
                userService.updateUser(id,request)
        );

    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteUser(
            @PathVariable Long id
    ){


        userService.deleteUser(id);


        return ResponseEntity.ok(
                "User deleted successfully"
        );

    }






    // Change Password

    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestParam Long Id,@RequestBody ChangePasswordRequest request){


        userService.changePassword(Id,request);


        return ResponseEntity.ok(
                "Password changed successfully"
        );

    }







    // Get Users By Role

    @GetMapping("/role/{role}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getUsersByRole(
            @PathVariable Role role
    ){


        return ResponseEntity.ok(
                userService.getUsersByRole(role)
        );

    }





    // Activate User

    @PutMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> activateUser(
            @PathVariable Long id
    ){

        userService.activateUser(id);


        return ResponseEntity.ok(
                "User activated successfully"
        );

    }





    // Deactivate User

    @PutMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deactivateUser(
            @PathVariable Long id
    ){

        userService.deactivateUser(id);


        return ResponseEntity.ok(
                "User deactivated successfully"
        );

    }


}