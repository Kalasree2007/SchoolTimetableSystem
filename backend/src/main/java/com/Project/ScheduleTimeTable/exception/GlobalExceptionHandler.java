package com.Project.ScheduleTimeTable.exception;


import com.Project.ScheduleTimeTable.dto.response.ApiResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse> handleResourceNotFound(
            ResourceNotFoundException exception
    ){

        ApiResponse response = new ApiResponse();

        response.setSuccess(false);

        response.setMessage(exception.getMessage());


        return new ResponseEntity<>(
                response,
                HttpStatus.NOT_FOUND
        );

    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ApiResponse> handleUserAlreadyExists(
            UserAlreadyExistsException exception
    ){


        ApiResponse response = new ApiResponse();

        response.setSuccess(false);

        response.setMessage(exception.getMessage());


        return new ResponseEntity<>(
                response,
                HttpStatus.CONFLICT
        );

    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ApiResponse> handleInvalidCredentials(
            InvalidCredentialsException exception
    ){


        ApiResponse response = new ApiResponse();

        response.setSuccess(false);

        response.setMessage(exception.getMessage());


        return new ResponseEntity<>(
                response,
                HttpStatus.UNAUTHORIZED
        );

    }





    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ApiResponse> handleUnauthorized(
            UnauthorizedException exception
    ){


        ApiResponse response = new ApiResponse();

        response.setSuccess(false);

        response.setMessage(exception.getMessage());


        return new ResponseEntity<>(
                response,
                HttpStatus.FORBIDDEN
        );

    }





    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse> handleGlobalException(
            Exception exception
    ){


        ApiResponse response = new ApiResponse();

        response.setSuccess(false);

        response.setMessage(
                exception.getMessage()
        );


        return new ResponseEntity<>(
                response,
                HttpStatus.INTERNAL_SERVER_ERROR
        );

    }
    @ExceptionHandler(DepartmentAlreadyExistsException.class)
    public ResponseEntity<ApiResponse> handleDepartmentAlreadyExistsException(
        DepartmentAlreadyExistsException ex) {

        ApiResponse response = new ApiResponse(
            false,
            ex.getMessage()
        );

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(SubjectAlreadyExistsException.class)
    public ResponseEntity<ApiResponse> handleSubjectAlreadyExistsException(
        SubjectAlreadyExistsException ex) {

        ApiResponse response = new ApiResponse(
            false,
            ex.getMessage()
        );

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(TeacherAlreadyExistsException.class)
    public ResponseEntity<ApiResponse> handleTeacherAlreadyExistsException(
        TeacherAlreadyExistsException ex){

        ApiResponse response=new ApiResponse(
            false,
            ex.getMessage());

        return new ResponseEntity<>(response,HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(RoomAlreadyExistsException.class)
    public ResponseEntity<ApiResponse> handleRoomAlreadyExistsException(
        RoomAlreadyExistsException ex) {

        ApiResponse response = new ApiResponse(
            false,
            ex.getMessage());

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(TimeSlotAlreadyExistsException.class)
    public ResponseEntity<ApiResponse> handleTimeSlotAlreadyExistsException(
        TimeSlotAlreadyExistsException ex) {

        ApiResponse response = new ApiResponse(
            false,
            ex.getMessage());

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(ClassAlreadyExistsException.class)
    public ResponseEntity<ApiResponse> handleClassAlreadyExistsException(
        ClassAlreadyExistsException ex) {

        ApiResponse response = new ApiResponse(
            false,
            ex.getMessage());

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(StudentAlreadyExistsException.class)
    public ResponseEntity<ApiResponse> handleStudentAlreadyExistsException(
        StudentAlreadyExistsException ex){

        ApiResponse response=new ApiResponse(
            false,
            ex.getMessage());

        return new ResponseEntity<>(response,HttpStatus.BAD_REQUEST);

    }

    @ExceptionHandler(ParentAlreadyExistsException.class)
    public ResponseEntity<ApiResponse> handleParentAlreadyExistsException(
        ParentAlreadyExistsException ex) {

        ApiResponse response = new ApiResponse(
            false,
            ex.getMessage());

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
    
    @ExceptionHandler(AcademicCalendarAlreadyExistsException.class)
    public ResponseEntity<ApiResponse> handleAcademicCalendarAlreadyExistsException(
        AcademicCalendarAlreadyExistsException ex) {

        ApiResponse response = new ApiResponse(
            false,
            ex.getMessage());

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(TimetableAlreadyExistsException.class)
    public ResponseEntity<ApiResponse> handleTimetableAlreadyExistsException(
        TimetableAlreadyExistsException ex) {

        ApiResponse response =
            new ApiResponse(false, ex.getMessage());

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(ScheduleAlreadyExistsException.class)
    public ResponseEntity<ApiResponse> handleScheduleAlreadyExistsException(
        ScheduleAlreadyExistsException ex) {

        ApiResponse response =
            new ApiResponse(false, ex.getMessage());

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(AttendanceAlreadyExistsException.class)
    public ResponseEntity<ApiResponse> handleAttendanceAlreadyExistsException(
        AttendanceAlreadyExistsException ex) {

        ApiResponse response =
            new ApiResponse(false, ex.getMessage());

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
}