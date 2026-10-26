package com.Project.ScheduleTimeTable.service.Impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.Project.ScheduleTimeTable.dto.request.RoomRequest;
import com.Project.ScheduleTimeTable.dto.request.UpdateRoomRequest;
import com.Project.ScheduleTimeTable.dto.response.RoomResponse;
import com.Project.ScheduleTimeTable.exception.ResourceNotFoundException;
import com.Project.ScheduleTimeTable.exception.RoomAlreadyExistsException;
import com.Project.ScheduleTimeTable.model.Room;
import com.Project.ScheduleTimeTable.repository.RoomRepository;
import com.Project.ScheduleTimeTable.service.RoomService;

@Service
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;

    public RoomServiceImpl(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    @Override
    public RoomResponse createRoom(RoomRequest request) {

        if(roomRepository.existsByRoomNumber(request.getRoomNumber())) {
            throw new RoomAlreadyExistsException(
                    "Room Number already exists");
        }

        Room room = new Room();

        room.setRoomNumber(request.getRoomNumber());
        room.setRoomName(request.getRoomName());
        room.setRoomType(request.getRoomType());
        room.setCapacity(request.getCapacity());
        room.setBuilding(request.getBuilding());
        room.setFloor(request.getFloor());
        room.setActive(request.isActive());

        Room savedRoom = roomRepository.save(room);

        return mapToResponse(savedRoom);
    }

    @Override
    public List<RoomResponse> getAllRooms() {

        return roomRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public RoomResponse getRoomById(Long id) {

        return mapToResponse(findRoomById(id));
    }

    @Override
    public RoomResponse updateRoom(Long id,
                                   UpdateRoomRequest request) {

        Room room = findRoomById(id);

        room.setRoomName(request.getRoomName());
        room.setRoomType(request.getRoomType());
        room.setCapacity(request.getCapacity());
        room.setBuilding(request.getBuilding());
        room.setFloor(request.getFloor());
        room.setActive(request.isActive());

        Room updatedRoom = roomRepository.save(room);

        return mapToResponse(updatedRoom);
    }

    @Override
    public void deleteRoom(Long id) {

        Room room = findRoomById(id);

        roomRepository.delete(room);
    }

    @Override
    public boolean existsByRoomNumber(String roomNumber) {
        return roomRepository.existsByRoomNumber(roomNumber);
    }

    @Override
    public Room findRoomById(Long id) {

        return roomRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Room not found with id : " + id));
    }

    @Override
    public Room findRoomByRoomNumber(String roomNumber) {

        return roomRepository.findByRoomNumber(roomNumber)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Room not found : " + roomNumber));
    }

    private RoomResponse mapToResponse(Room room) {

        return new RoomResponse(

                room.getId(),
                room.getRoomNumber(),
                room.getRoomName(),
                room.getRoomType(),
                room.getCapacity(),
                room.getBuilding(),
                room.getFloor(),
                room.isActive(),
                room.getCreatedAt(),
                room.getUpdatedAt()

        );
    }

}