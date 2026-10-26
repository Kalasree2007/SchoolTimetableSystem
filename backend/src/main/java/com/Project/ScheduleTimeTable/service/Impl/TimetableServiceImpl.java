package com.Project.ScheduleTimeTable.service.Impl;

import java.time.DayOfWeek;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.Project.ScheduleTimeTable.dto.request.TimetableRequest;
import com.Project.ScheduleTimeTable.dto.request.UpdateTimetableRequest;
import com.Project.ScheduleTimeTable.dto.response.TimetableResponse;
import com.Project.ScheduleTimeTable.exception.ResourceNotFoundException;
import com.Project.ScheduleTimeTable.exception.TimetableAlreadyExistsException;
import com.Project.ScheduleTimeTable.model.ClassEntity;
import com.Project.ScheduleTimeTable.model.Room;
import com.Project.ScheduleTimeTable.model.Subject;
import com.Project.ScheduleTimeTable.model.Teacher;
import com.Project.ScheduleTimeTable.model.TimeSlot;
import com.Project.ScheduleTimeTable.model.Timetable;
import com.Project.ScheduleTimeTable.repository.TimetableRepository;
import com.Project.ScheduleTimeTable.service.ClassEntityService;
import com.Project.ScheduleTimeTable.service.RoomService;
import com.Project.ScheduleTimeTable.service.SubjectService;
import com.Project.ScheduleTimeTable.service.TeacherService;
import com.Project.ScheduleTimeTable.service.TimeSlotService;
import com.Project.ScheduleTimeTable.service.TimetableService;

@Service
public class TimetableServiceImpl implements TimetableService {

    private final TimetableRepository timetableRepository;
    private final TeacherService teacherService;
    private final SubjectService subjectService;
    private final RoomService roomService;
    private final TimeSlotService timeSlotService;
    private final ClassEntityService classEntityService;

    public TimetableServiceImpl(
            TimetableRepository timetableRepository,
            TeacherService teacherService,
            SubjectService subjectService,
            RoomService roomService,
            TimeSlotService timeSlotService,
            ClassEntityService classEntityService) {

        this.timetableRepository = timetableRepository;
        this.teacherService = teacherService;
        this.subjectService = subjectService;
        this.roomService = roomService;
        this.timeSlotService = timeSlotService;
        this.classEntityService = classEntityService;
    }

    @Override
    public TimetableResponse createTimetable(TimetableRequest request) {

        if (timetableRepository
                .existsByClassEntityIdAndDayOfWeekAndTimeSlotId(
                        request.getClassId(),
                        request.getDayOfWeek(),
                        request.getTimeSlotId())) {

            throw new TimetableAlreadyExistsException(
                    "Timetable already exists for this class.");
        }

        Teacher teacher = teacherService.findTeacherById(request.getTeacherId());
        Subject subject = subjectService.findSubjectById(request.getSubjectId());
        Room room = roomService.findRoomById(request.getRoomId());
        TimeSlot slot = timeSlotService.findTimeSlotById(request.getTimeSlotId());
        ClassEntity classEntity = classEntityService.findClassById(request.getClassId());

        Timetable timetable = new Timetable();

        timetable.setDayOfWeek(request.getDayOfWeek());
        timetable.setTeacher(teacher);
        timetable.setSubject(subject);
        timetable.setRoom(room);
        timetable.setTimeSlot(slot);
        timetable.setClassEntity(classEntity);
        timetable.setActive(request.isActive());

        return mapToResponse(timetableRepository.save(timetable));
    }

    @Override
    public List<TimetableResponse> getAllTimetables() {
        return timetableRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public TimetableResponse getTimetableById(Long id) {
        return mapToResponse(findTimetableById(id));
    }

    @Override
    public TimetableResponse updateTimetable(Long id,
            UpdateTimetableRequest request) {

        Timetable timetable = findTimetableById(id);

        timetable.setDayOfWeek(request.getDayOfWeek());
        timetable.setTeacher(teacherService.findTeacherById(request.getTeacherId()));
        timetable.setSubject(subjectService.findSubjectById(request.getSubjectId()));
        timetable.setRoom(roomService.findRoomById(request.getRoomId()));
        timetable.setTimeSlot(timeSlotService.findTimeSlotById(request.getTimeSlotId()));
        timetable.setClassEntity(classEntityService.findClassById(request.getClassId()));
        timetable.setActive(request.isActive());

        return mapToResponse(timetableRepository.save(timetable));
    }

    @Override
    public void deleteTimetable(Long id) {
        timetableRepository.delete(findTimetableById(id));
    }

    @Override
    public Timetable findTimetableById(Long id) {

        return timetableRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Timetable not found with id : " + id));
    }

    @Override
    public List<TimetableResponse> getByTeacher(Long teacherId) {
        return timetableRepository.findByTeacherId(teacherId)
                .stream().map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<TimetableResponse> getByClass(Long classId) {
        return timetableRepository.findByClassEntityId(classId)
                .stream().map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<TimetableResponse> getByDay(DayOfWeek day) {
        return timetableRepository.findByDayOfWeek(day)
                .stream().map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private TimetableResponse mapToResponse(Timetable t) {

        return new TimetableResponse(
                t.getId(),
                t.getDayOfWeek(),

                t.getTeacher().getId(),
                t.getTeacher().getUser().getFullName(),

                t.getSubject().getId(),
                t.getSubject().getSubjectName(),

                t.getClassEntity().getId(),
                t.getClassEntity().getClassName(),

                t.getRoom().getId(),
                t.getRoom().getRoomNumber(),

                t.getTimeSlot().getId(),
                t.getTimeSlot().getStartTime().toString(),
                t.getTimeSlot().getEndTime().toString(),

                t.isActive(),
                t.getCreatedAt(),
                t.getUpdatedAt()
        );
    }
}