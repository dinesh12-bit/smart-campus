package com.smartcampus.controller;

import com.smartcampus.entity.Room;
import com.smartcampus.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    /* =====================================================
       CREATE
    ===================================================== */

    @PostMapping
    public ResponseEntity<Room> createRoom(
            @RequestBody Room room
    ) {

        return ResponseEntity.ok(
                roomService.createRoom(room)
        );
    }

    /* =====================================================
       READ ALL
    ===================================================== */

    @GetMapping
    public ResponseEntity<List<Room>> getAllRooms() {

        return ResponseEntity.ok(
                roomService.getAllRooms()
        );
    }

    /* =====================================================
       READ ONE
    ===================================================== */

    @GetMapping("/{id}")
    public ResponseEntity<Room> getRoomById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                roomService.getRoomById(id)
        );
    }

    /* =====================================================
       READ BY ROOM CODE
    ===================================================== */

    @GetMapping("/code/{roomCode}")
    public ResponseEntity<Room> getRoomByCode(
            @PathVariable String roomCode
    ) {

        return ResponseEntity.ok(
                roomService.getRoomByCode(roomCode)
        );
    }

    /* =====================================================
       UPDATE
    ===================================================== */

    @PutMapping("/{id}")
    public ResponseEntity<Room> updateRoom(
            @PathVariable Long id,
            @RequestBody Room room
    ) {

        return ResponseEntity.ok(
                roomService.updateRoom(
                        id,
                        room
                )
        );
    }

    /* =====================================================
       DELETE
    ===================================================== */

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoom(
            @PathVariable Long id
    ) {

        roomService.deleteRoom(id);

        return ResponseEntity.noContent()
                .build();
    }
}