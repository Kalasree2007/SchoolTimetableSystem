package com.Project.ScheduleTimeTable.exception;

public class TimeSlotAlreadyExistsException extends RuntimeException {

    public TimeSlotAlreadyExistsException(String message) {
        super(message);
    }

}