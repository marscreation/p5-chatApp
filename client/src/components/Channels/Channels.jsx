import React, { useEffect, useState } from "react";
import { useUserContext } from "../../context/UserData";
import { userChats } from "../../api/ChatRequest";
import Member from "../Member/Member";
import { useChatContext } from "../../context/ChatContext";
import { useNavigate } from "react-router-dom";
import defaultProfile from "../../assets/defaultProfile.png";

function Channels({ findChat }) {
  const user = useUserContext();
  const { setChats, chats } = useChatContext();
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadChannels = async () => {
    try {
      const data = await userChats(user?._id);
      setChannels(data);
      setLoading(false);
      setChats(data);
    } catch (error) {
      console.log(error);
    }
  };

  function handleLogout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userId");
    navigate("/");
  }

  useEffect(() => {
    loadChannels();
  }, [user]);

  useEffect(() => {
    setChannels(chats);
  }, [chats]);

  if (loading) {
    return (
      <div className="dark:text-slate-600 font-extrabold text-2xl h-full flex place-content-center">
        ...Loading
      </div>
    );
  }

  if (!channels) {
    return (
      <div className="dark:text-slate-600 font-extrabold text-2xl h-full flex place-items-center place-content-center">
        No Conversation Found
      </div>
    );
  }

  return (
    <>
      <div className="profile grid">
        <div className="flex flex-row p-4">
          <img src={defaultProfile} alt="" className=" w-16 rounded-full" />
          <p className="ml-4 text-slate-100 text-lg font-extrabold place-self-center">{user?.firstname} {user?.lastname}</p>
        </div>
      </div>
      <div className="search flex flex-row mb-3 px-1">
        <label htmlFor="search" className="place-self-center p-3 " style={{ backgroundColor: '#2a292e' }}>
          <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" fill="#fff">
            <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
          </svg>
        </label>
        <input type="text" className="flex-1 w-full p-2" id="search" placeholder="Search here" style={{ backgroundColor: '#2a292e', outline: 'none' }} />
      </div>
      <div className="h-full w-full flex-1">
        <div className="">
          {channels.map((channel) => (
            <Member
              key={channel._id}
              data={channel}
              currentUserId={user._id}
              findChat={findChat}
            />
          ))}
        </div>
      </div>
      <div className="flex border-t-2 border-slate-800 h-12">
        <button className="w-full py-1 text-slate-400 bg-slate-800">Add contact</button>
        <button className="w-full py-1 text-slate-400 bg-slate-800 border-l-2 border-slate-900" onClick={handleLogout}>Sign out</button>
      </div>
    </>
  );
}

export default Channels;
