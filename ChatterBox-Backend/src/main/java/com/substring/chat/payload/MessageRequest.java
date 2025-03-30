package com.substring.chat.payload;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class MessageRequest {

    private String content;
    private String sender;
    private String roomId;
    private LocalDateTime messageTime;
}
