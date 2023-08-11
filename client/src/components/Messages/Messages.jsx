import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { getMessage, sendMessage } from "../../api/MessageRequest";
import { useUserContext } from "../../context/UserData";
import { TbSend } from "react-icons/tb";
import { useChatContext } from "../../context/ChatContext";
import defaultProfile from "../../assets/defaultProfile.png";
import "./Messages.css";

function Messages() {
  const user = useUserContext();
  const { chats, receivedMessage, onlineUsers, members } = useChatContext();
  const { chatId } = useParams("chatId");
  const [loading, setLoading] = useState(true);
  const [online, setOnline] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentMember, setCurrentMember] = useState({});
  const messageRef = useRef();
  const scroll = useRef();

  const loadMessages = async () => {
    const storage = JSON.parse(sessionStorage.getItem(chatId));
    const listMessages = storage !== null ? storage : await getMessage(chatId);
    sessionStorage.setItem(chatId, JSON.stringify(listMessages))
    // const listMessages = await getMessage(chatId);
    setMessages(listMessages);
    setLoading(false);
  };

  const handleSendButton = async () => {
    if (messageRef.current.value === "") return;
    const textMessage = messageRef.current.value;

    try {
      const receiverId = await chats
        .find((chat) => chatId === chat?._id)
        .members.find((id) => id !== user._id);
      const msg = {
        senderId: user._id,
        message: textMessage,
        receiverId,
        chatId,
      };

      const data = await sendMessage(msg);
      const newValue = [...messages];
      setMessages([data].concat(newValue));
      messageRef.current.value = "";
      sessionStorage.setItem(chatId, JSON.stringify([data].concat(newValue)))
    } catch (error) {
      console.log(error);
    }
  };

  const handleKeyEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendButton();
    }
  };

  useEffect(() => {
    if (receivedMessage !== null && receivedMessage.chatId === chatId) {
      setMessages([receivedMessage, ...messages]);
    }
  }, [receivedMessage]);

  useEffect(() => {
    loadMessages();
  }, [user, chatId]);

  useEffect(() => {
    const current = members.find((id) => chatId === id.chatId);
    setCurrentMember(current);
  }, [chatId, members]);

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const chat = chats
      .find((chat) => chat._id === chatId)
      ?.members.find((id) => id !== user._id);
    const active = onlineUsers.find((id) => chat === id.userId);
    setOnline(active);
  }, [onlineUsers, chatId]);

  if (loading) {
    return (
      <div className="dark:text-slate-600 font-extrabold text-2xl h-full flex place-items-center place-content-center">
        ...Loding
      </div>
    );
  }

  if (!messages) {
    return <div>Error on load</div>;
  }

  return (
    <div key={chatId} className="flex flex-col h-screen">
      <div
        key={`${chatId}header`}
        className="chatbox-header dark:bg-slate-900 dark:text-white text-black shadow-lg dark:shadow-none flex items-center"
      >
        <div className="sm:hidden flex-none">
          <button
            className=" text-blue-800 dark:text-white"
            onClick={() =>
              document.querySelector("section.chatbox").classList.remove("show")
            }
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
        </div>
        <div className="flex-none py-3 ml-3">
          <img
            src={currentMember?.profilePicture || defaultProfile}
            alt=""
            className="rounded-full mr-2 h-10 w-10 lg:h-12 lg:w-12"
          />
        </div>
        <div className="relative flex-1">
          <h1 className="font-bold text-left text-2xl">
            {currentMember?.firstname} {currentMember?.lastname}
          </h1>
          {online && <p className="text-xs text-left">Active now</p>}
        </div>
      </div>
      <div
        key={`${chatId}body`}
        className="chatbox-body dark:bg-slate-800 p-3 overflow-y-auto flex-1"
      >
        {user &&
          [...messages]?.reverse().map((message) => (
            <div
              key={message._id}
              className={message.senderId === user._id ? "sender" : "receiver"}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent:
                  message.senderId === user._id ? "flex-end" : "flex-start",
              }}
            >
              <div className="mt-3">
                <p className="bg-slate-700 p-2 w-auto rounded-xl">
                  {message.text}
                </p>
              </div>
            </div>
          ))}
        {messages.length === 0 && (
          <div className="dark:text-slate-800 font-extrabold text-2xl h-full flex place-items-center place-content-center">
            Start Conversation
          </div>
        )}
        <div ref={scroll}></div>
      </div>

      {/* textarea */}
      <div
        key={`${chatId}textarea`}
        className="flex flex-row dark:bg-slate-700 h-12"
      >
        <input
          ref={messageRef}
          className="messageEntry dark:bg-slate-800 w-full h-full dark:text-white text-black resize-none flex-1 p-2"
          placeholder="Type your reply..."
          onKeyDown={handleKeyEnter}
          style={{backgroundColor: '#2a292e'}}
        />

        <button
          className="px-3 dark:text-white cursor-pointer"
          onClick={handleSendButton}
        >
          <TbSend className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

export default Messages;
