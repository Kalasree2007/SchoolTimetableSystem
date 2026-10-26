package com.Project.ScheduleTimeTable.service.Impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.Project.ScheduleTimeTable.dto.request.AttendanceRequest;
import com.Project.ScheduleTimeTable.dto.request.UpdateAttendanceRequest;
import com.Project.ScheduleTimeTable.dto.response.AttendanceResponse;
import com.Project.ScheduleTimeTable.exception.AttendanceAlreadyExistsException;
import com.Project.ScheduleTimeTable.exception.ResourceNotFoundException;
import com.Project.ScheduleTimeTable.model.Attendance;
import com.Project.ScheduleTimeTable.model.Schedule;
import com.Project.ScheduleTimeTable.model.Student;
import com.Project.ScheduleTimeTable.repository.AttendanceRepository;
import com.Project.ScheduleTimeTable.service.AttendanceService;
import com.Project.ScheduleTimeTable.service.ScheduleService;
import com.Project.ScheduleTimeTable.service.StudentService;

@Service
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentService studentService;
    private final ScheduleService scheduleService;

    public AttendanceServiceImpl(
            AttendanceRepository attendanceRepository,
            StudentService studentService,
            ScheduleService scheduleService) {

        this.attendanceRepository = attendanceRepository;
        this.studentService = studentService;
        this.scheduleService = scheduleService;
    }

    @Override
    public AttendanceResponse createAttendance(
            AttendanceRequest request) {

        if (attendanceRepository.existsByStudentIdAndScheduleId(
                request.getStudentId(),
                request.getScheduleId())) {

            throw new AttendanceAlreadyExistsException(
                    "Attendance already marked.");
        }

        Student student =
                studentService.findStudentById(request.getStudentId());

        Schedule schedule =
                scheduleService.findScheduleById(request.getScheduleId());

        Attendance attendance = new Attendance();

        attendance.setStudent(student);
        attendance.setSchedule(schedule);
        attendance.setStatus(request.getStatus());
        attendance.setRemarks(request.getRemarks());
        attendance.setActive(request.isActive());

        return mapToResponse(
                attendanceRepository.save(attendance));
    }

    @Override
    public List<AttendanceResponse> getAllAttendance() {

        return attendanceRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AttendanceResponse getAttendanceById(Long id) {

        return mapToResponse(findAttendanceById(id));
    }

    @Override
    public List<AttendanceResponse> getAttendanceByStudent(Long studentId) {

        return attendanceRepository.findByStudentId(studentId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<AttendanceResponse> getAttendanceBySchedule(Long scheduleId) {

        return attendanceRepository.findByScheduleId(scheduleId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AttendanceResponse updateAttendance(
            Long id,
            UpdateAttendanceRequest request) {

        Attendance attendance = findAttendanceById(id);

        attendance.setStatus(request.getStatus());
        attendance.setRemarks(request.getRemarks());
        attendance.setActive(request.isActive());

        return mapToResponse(
                attendanceRepository.save(attendance));
    }

    @Override
    public void deleteAttendance(Long id) {

        attendanceRepository.delete(findAttendanceById(id));
    }

    @Override
    public Attendance findAttendanceById(Long id) {

        return attendanceRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Attendance not found with id : " + id));
    }

    private AttendanceResponse mapToResponse(
            Attendance attendance) {

        return new AttendanceResponse(

                attendance.getId(),

                attendance.getStudent().getId(),
                attendance.getStudent().getUser().getFullName(),

                attendance.getSchedule().getId(),

                attendance.getStatus(),

                attendance.getRemarks(),

                attendance.isActive(),

                attendance.getCreatedAt(),

                attendance.getUpdatedAt()

        );
    }
}