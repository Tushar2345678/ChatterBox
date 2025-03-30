package com.substring.chat.controllers;

import org.springframework.web.bind.annotation.RestController;

import com.substring.chat.Repositries.RoomRepository;
import com.substring.chat.entities.Message;
import com.substring.chat.entities.Room;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;





@RestController
@RequestMapping("/api/v1/rooms")
@CrossOrigin("http://localhost:5173")
public class RoomController {

    private RoomRepository roomRepository;

    public RoomController(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    //create room
    @PostMapping
    public ResponseEntity<?> createRoom(@RequestBody String roomId){

        if(roomRepository.findByRoomId(roomId) != null){
            
            //room is already there
            return ResponseEntity.badRequest().body("Room already exsists!");
        }

        //create new room
        Room room = new Room();
        room.setRoomId(roomId);
        Room savedRoom = roomRepository.save(room);
        return ResponseEntity.status(HttpStatus.CREATED).body(room);    

    }
    //get room : join
    @GetMapping("/{roomId}") ResponseEntity<?> joinRoom(
        @PathVariable String roomId
    ){


        Room room = roomRepository.findByRoomId(roomId);

        if (room==null) {
            return ResponseEntity.badRequest()
                    .body("Room Not Found");
        }

        return ResponseEntity.ok(room);




    }


    //get message of room]
    @GetMapping("/{roomId}/messages")
    public ResponseEntity<List<Message>> getMessages(
        @PathVariable String roomId,
        @RequestParam(value = "page", defaultValue = "0", required = false) int page,
        @RequestParam(value = "size", defaultValue = "20", required = false) int size
        ){

            Room room = roomRepository.findByRoomId(roomId);
            if (room == null) {
                return ResponseEntity.badRequest().build();
            }

            //get message :
            //pagination
            List<Message> messages = room.getMessages();

            int start = Math.max(0, messages.size() - (page + 1) * size); 
            int end = Math.min(messages.size(), start + size);
            List<Message> paginatedMessages = messages.subList(start, end);


            return ResponseEntity.ok(messages);
        
    }

   }

