import React, {useRef, useState, useEffect} from "react";
import {  MdAttachFile ,MdSend } from "react-icons/md";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";
import { baseURL } from "../config/AxiosHelper";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import toast from "react-hot-toast";
import { getMessages } from "../services/RoomService";
import { getWhatsAppTimestamp } from "../config/helper";
import axios from "axios";


const ChatPage = () => {

const {roomId, 
        currentUser, 
        connected, 
        setConnected, 
        setRoomId, 
        setCurrentUser
    }= useChatContext();
/* console.log(roomId);
console.log(currentUser);
console.log(connected);
 */
const navigate = useNavigate()
useEffect(()=>{
    if(!connected){
        navigate("/");
    }
},[connected, roomId, currentUser]);

const [messages,setMessages] = useState([]);
const [input,setInput] = useState("");
const inputRef = useRef(null);
const chatBoxRef = useRef(null);
const [stompClient, setStompClient] = useState(null);
const fileInputRef = useRef(null);

//page init
//have to loadmessages

//stompClient
    //Subscribe

useEffect(()=>{
        async function loadMessages(){
            try {
                const messages = await getMessages(roomId);
                /* console.log(messages) */
                setMessages(messages);
                
            } catch (error) {
                
            }
        }
        if(connected){
            loadMessages();
        }
    },[]);

useEffect(() =>{
        if(chatBoxRef.current){
             chatBoxRef.current.scroll({
                top: chatBoxRef.current.scrollHeight,
                behaviour: "smooth",
             });
        }
    },[messages])

useEffect(()=>{
    const connectWebSocket = () => {

            //Sockjs 
            const sock = new SockJS(`${baseURL}/chat`)
            const client=Stomp.over(sock)

            client.connect({},()=>{
                setStompClient(client);

                toast.success("connectecd");
                
                client.subscribe(`/topic/room/${roomId}`, (message) => {
                    console.log(message);
                    const newMessage = JSON.parse(message.body);
                    setMessages((prev) => [...prev, newMessage]);
                });
            });
        };

        //stomp client
        if(connected){
            connectWebSocket();
        }

    },[roomId])

//send message handle

const sendMessage=async ()=>{
    if(stompClient && connected && input.trim()){
            console.log(input);

            const message={
                sender:currentUser,
                content:input,
                roomId:roomId
            }

            stompClient.send(`/app/sendMessage/${roomId}`,{},JSON.stringify(message),{});
            setInput("")
    }
}

function handleLogout(){
    stompClient.disconnect();
    setConnected(false);
    setRoomId('')
    setCurrentUser('')
    navigate('/');
}

// Handle file selection
const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
        uploadFile(file);
    }
};

const handleAttachmentClick = () => {
    if (fileInputRef.current) {
        fileInputRef.current.click(); // Ensure it's not null before calling click()
    } else {
        console.error("File input reference is null");
    }
};

// Handle file upload
const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await axios.post(`${baseURL}/upload`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        const fileUrl = response.data.url;

        // Send file message to WebSocket
        if (stompClient && connected) {
            const messageObject = {
                sender: currentUser,
                content: fileUrl,
                roomId: roomId,
                type: "file", // Message type: file
                fileName: file.name,
            };

            stompClient.send(`/app/chat/${roomId}`, {}, JSON.stringify(messageObject));
        }
    } catch (error) {
        console.error("File upload failed", error);
        toast.error("Failed to upload file");
    }
};


    return (
        <div className="">

            {/* This is header portion */}
            <header className="dark:border-gray-700 border h-20 fixed w-full dark:bg-gray-900 py-5 flex justify-around items-center "> 
                {/* Room name container */}
                <div>
                    <h1 className="text-xl font-semibold">
                        Room: <span>{roomId}</span>    
                    </h1> 
                </div>

                {/* Username container */}
                <div>
                <h1 className="text-xl font-semibold">
                        User: <span>{currentUser}</span>    
                    </h1> 
                </div>

                {/* button: leave room*/}
                <div>
                    <button 
                        onClick={handleLogout}
                        className="dark:bg-red-500 dark:hover:bg-red-700 px-3 py-2 rounded-full"> Leave</button>
                </div> 
            </header>

            {/* main content */}
            <main 
                ref={chatBoxRef}
                className="py-20 px-10 h-screen w-2/3 dark:bg-slate-600 mx-auto overflow-auto">
               {
                messages.map((message,index)=>(
                    <div key={index} className={`flex ${message.sender==currentUser?'justify-end':'justify-start'} `}>
                        <div  className={`my-2 ${message.sender==currentUser? 'bg-green-800':'bg-gray-800'} p-2 max-w-xs rounded`}>
                      <div className="flex flex-row gap-1">
                        <img className = "h-10 w-10" src={'https://avatar.iran.liara.run/public/39'} alt="" /> 
                      <div className="flex flex-col gap-1">
                            <p>{message.sender}</p>  
                            <p>{message.content}</p>
                            <p className="text-xs text-gray-400">{getWhatsAppTimestamp(message.timeStamp)}</p>
                        </div>
                      </div>
                    </div>
                    </div>
                ))
               }
            </main>

            {/* Input message container */}
            <div className="fixed bottom-4 w-full h-16">
                <div className="h-full pr-10 gap-4 flex items-center justify-between rounded-full w-1/2 mx-auto dark:bg-gray-900">
                        <input
                            value={input}
                            onChange={(e)=>{
                                setInput(e.target.value)
                            }}
                            onKeyDown={(e) => {
                                if(e.key==="Enter"){
                                    sendMessage();
                                }
                            }
                            } 
                            type="text"
                            placeholder="write the message..."
                            className=" border dark:border-gray-600 w-full dark:bg-gray-800 px-5 py-2 rounded-full h-full focus:outline-none"    
                        />
                        <div className="flex gap-2">
                            <input
                                type="file"
                                ref={fileInputRef} // ✅ Assign ref properly
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        <button 
                            onClick={handleAttachmentClick}
                            className="dark:bg-purple-600 h-10 w-10 flex justify-center items-center rounded-full">
                           <MdAttachFile size={20} />
                        </button>
                        <button 
                            onClick={sendMessage}
                            className="dark:bg-green-600 h-10 w-10 flex justify-center items-center rounded-full">
                           <MdSend size={20}/>
                        </button>
                    </div>
                </div>
            </div>

        </div>
    
    );
};

export default ChatPage;