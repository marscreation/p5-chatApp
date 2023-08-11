import { UserProvider, useUserContext } from "../../context/UserData";
import { ChatProvider } from "../../context/ChatContext";
import { Outlet } from "react-router-dom";
import Channels from "../../components/Channels/Channels";
import "./Chat.css";
import { useState } from "react";

function Chat() {
  const user = useUserContext();
  const [findChat, setFindChat] = useState("");
  return (
    <>
      <UserProvider>
        <ChatProvider>
          <div className="chat sm:grid relative h-screen font-poppins">
            <section className="sidebar h-screen flex flex-col">
              <Channels findChat={findChat} />
            </section>
            <section className="chatbox h-screen show">
              <Outlet />
            </section>
          </div>
        </ChatProvider>
      </UserProvider>
    </>
  );
}

export default Chat;
