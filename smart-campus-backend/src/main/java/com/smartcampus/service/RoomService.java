package com.smartcampus.service;

import com.smartcampus.entity.Room;
import com.smartcampus.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;

    /* =====================================================
       CREATE
    ===================================================== */

    public Room createRoom(Room room) {

        room.setId(null);

        return roomRepository.save(room);
    }

    /* =====================================================
       READ ALL
    ===================================================== */

    public List<Room> getAllRooms() {

        return roomRepository.findAll();
    }

    /* =====================================================
       READ ONE
    ===================================================== */

    public Room getRoomById(Long id) {

        return roomRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Room not found with id: "
                                        + id
                        )
                );
    }

    /* =====================================================
       READ BY CODE
    ===================================================== */

    public Room getRoomByCode(
            String roomCode
    ) {

        return roomRepository
                .findByRoomCode(roomCode)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Room not found: "
                                        + roomCode
                        )
                );
    }

    /* =====================================================
       UPDATE
    ===================================================== */

    public Room updateRoom(
            Long id,
            Room updatedRoom
    ) {

        Room existingRoom =
                roomRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Room not found with id: "
                                                + id
                                )
                        );

        existingRoom.setRoomCode(
                updatedRoom.getRoomCode()
        );

        existingRoom.setName(
                updatedRoom.getName()
        );

        existingRoom.setBuilding(
                updatedRoom.getBuilding()
        );

        existingRoom.setFloor(
                updatedRoom.getFloor()
        );

        existingRoom.setDataSource(
                updatedRoom.getDataSource()
        );

        return roomRepository.save(
                existingRoom
        );
    }

    /* =====================================================
       DELETE
    ===================================================== */

    public void deleteRoom(Long id) {

        if (!roomRepository.existsById(id)) {

            throw new RuntimeException(
                    "Room not found with id: "
                            + id
            );
        }

        roomRepository.deleteById(id);
    }
}