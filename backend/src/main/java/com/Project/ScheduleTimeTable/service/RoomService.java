package com.Project.ScheduleTimeTable.service;

import java.util.List;

import com.Project.ScheduleTimeTable.dto.request.RoomRequest;
import com.Project.ScheduleTimeTable.dto.request.UpdateRoomRequest;
import com.Project.ScheduleTimeTable.dto.response.RoomResponse;
import com.Project.ScheduleTimeTable.model.Room;

public interface RoomService {

    RoomResponse createRoom(RoomRequest request);

    
    List<RoomResponse> getAllRooms();

    RoomResponse getRoomById(Long id);

    
    RoomResponse updateRoom(Long id,
                            UpdateRoomRequest request);

    
    void deleteRoom(Long id);

    
    boolean existsByRoomNumber(String roomNumber);

    
    Room findRoomById(Long id);

    Room findRoomByRoomNumber(String roomNumber);

}