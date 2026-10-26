package com.Project.ScheduleTimeTable.exception;

public class TimetableAlreadyExistsException extends RuntimeException {

    public TimetableAlreadyExistsException(String message) {
        super(message);
    }

}