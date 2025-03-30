package com.substring.chat.Repositries;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.substring.chat.entities.Room;



public interface RoomRepository extends MongoRepository<Room, String> {

    //get room using roomId
    Room findByRoomId(String roomId);

}
