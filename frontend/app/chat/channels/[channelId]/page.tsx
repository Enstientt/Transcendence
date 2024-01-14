'use client'
import { FC, useEffect, useState } from "react"
import { Channel, ChannelMessage, MemberShip, User, useAppContext } from "@/app/AppContext"
import Cookies from "universal-cookie"
import { io } from "socket.io-client"
import { SingleMessageReceived, SingleMessageSent, getCurrentUser, getUser } from "../../[roomId]/page"
import { Loading } from "@/app/components/Loading"
import toast, { Toaster } from "react-hot-toast"
import { Navbar } from "@/app/components/Navbar"
import { Sidebar } from "@/app/components/Sidebar"
import { Conversations } from "../../page"
import { IoMdArrowBack } from "react-icons/io"
import { Avatar, AvatarGroup } from "@mantine/core"
import { FaUserEdit } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import Image from "next/image"
import { useDisclosure } from '@mantine/hooks';
import { Modal, Button } from '@mantine/core';
import { Select } from '@mantine/core';
import Search from "@/app/notif/page"

interface PageProps {
  params: {
    channelId: string
  }
}

async function searchMember(query:string, channelId:string) {
  const response = await fetch(`http://localhost:3001/chat/chan/${channelId}/Search?q=${query}`,
  {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  
  });

  const data = await response.json();
  return data;
}
const EditMemberShip = ({ member }: any) => {
  const [opened, { open, close }] = useDisclosure(false);

  const handleSubmit = () => {
    console.log('data submited');
  }


  return (
    <>
      <Modal opened={opened} onClose={close} title="Authentication" centered>
        <div>
          <div className="member-avatar">

          </div>
          <div className="login">

          </div>
          <div className="change-privilege">
            <Select
              label="Priviliges"
              placeholder="Change Member Privilige"
              data={['Moderator', 'admin']}
            />
            <div className="banne"></div>
          </div>
          <div className="muted">
            <Select
              label="Mute User for"
              placeholder="Pick value"
              data={['1h', '6h', '12h', 'for ever']}
            />
          </div>
          <Button onClick={()=>{
            close();
            handleSubmit();
          }}> submit </Button>
        </div>
      </Modal>
      <FaUserEdit className="text-white w-6 h-6 transform transition-transform hover:scale-150" onClick={open} />
    </>
  );
}

const MemberCard = ({ member }: any) => {
  const context = useAppContext();
  return (
    <div className="flex flex-row overflow-x-auto justify-center items-center">
      <div className="flex flex-row items-center text-xs p-3  my-1 hover:bg-gray-800 rounded ">
          <Image
            width={50}
            height={50}
            src={member?.Avatar}
            alt="My profile"
            className="w-10 sm:w-10 h-10 sm:h-10 rounded-full"
          />
          <span className="p-2 text-white">{member?.login}</span>

        <div>
        {(member.isOwner || member.isModerator)
          ? <EditMemberShip member={member} />
          : <CgProfile  className="text-white w-6 h-6 transform transition-transform hover:scale-150" />
        }
        </div>
      </div>

    </div>
  );
}
async function getChannelFirstMembers(channelId: string): Promise<MemberShip[] | []> {
  const res = await fetch(`http://localhost:3001/chat/chanAvatar/${channelId}`, {
    method: "GET",
    credentials: "include",
  });
  const members = res.json();

  return members;
}
async function getChannel(channelId: string): Promise<Channel | undefined> {
  const res = await fetch(`http://localhost:3001/chat/channel/${channelId}`, {
    method: "GET",
    credentials: "include",
  });
  const channel = res.json();

  return channel;
}
async function getChannelMessages(channelId: string): Promise<ChannelMessage[] | []> {
  const res = await fetch(`http://localhost:3001/chat/channels/messages/${channelId}`,
    {
      method: "GET",
      credentials: "include"
    },
  );
  const messages = res.json();

  return messages;
}

const MemberCards = ({ members }: any) => {
  return (
    <div>
      {
        members?.map((member: any, index: number) => (
          <MemberCard key={index} member={member} />
        )
        )
      }
    </div>
  )
}
const ChannelAvatar = ({ firstMembers }: any) => {
  return (
    <AvatarGroup className="justify-center items-center ">
      {firstMembers &&
        firstMembers.map((member: MemberShip, index: number) => (
          <Avatar key={index} src={member.Avatar} ></Avatar>
        ))
      }
      <Avatar>+N</Avatar>
    </AvatarGroup>
  )
}
const ChannelDashBoard = ({ channelId }: any) => {
  const [query, setQuery] = useState('');
  const [firstMembers, setFirstMembers] = useState<MemberShip[] | []>();
  const [members, setmembers] = useState<MemberShip[] | []>();
  useEffect(() => {
    const fetchAvatar = async () => {
      const members = await getChannelFirstMembers(channelId);
      setFirstMembers(members);
    }
    fetchAvatar();
  }, [])
  useEffect(() => {
    const search = async () => {
      if (query){

        const members = await searchMember(query, channelId);
        setmembers(members);
      } 
    }
    search();
  }, [query])
  const context = useAppContext();
  return (
    <div className="flex flex-col border w-full  lg:w-1/5 overflow-hidden ">
      <IoMdArrowBack className="text-white w-8 h-8 hover:cursor-pointer hover:w-10 hover:h-10  justify-center items-center xl:hidden" onClick={() => context.setComponent("conversation")} />
      <div className="p-4 mt-20">
        {firstMembers && <ChannelAvatar firstMembers={firstMembers} />}
      </div>
      <div className='justify-center items-center text-white  border p-4'>
        <h1 className="text-center">{channelId}</h1>
      </div>
      <div className="info-card text-white p-4 m-5 border ">
        <h1 className="text-start"> Members :</h1>
      </div>
      <div className="info-search members text-white border p-4 m-5 w-fit">
        <label className=" flex flex-grow ">
          <input
            id="searchField"
            name={`inputValue${Math.random()}`}
            type="text"
            value={query}
            placeholder="Search ..."
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            className="  bg-[#1E2028] items-center justify-center p-2 rounded-lg border-opacity-40 border-2 border-slate-300  text-sm outline-none text-white"
          />
        </label>
      </div>
      <div className="desplay-members">
        {members && <MemberCards members={members} />}
      </div>
    </div>
  );
}

const ChannelRoom: FC<PageProps> = ({ params }: PageProps) => {
  const [channel, setChannel] = useState<Channel | undefined>();
  const [messages, setMessages] = useState<ChannelMessage[] | []>([]); // Provide a type for the messages state
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const context = useAppContext();
  const [firstMembers, setFirstMembers] = useState<MemberShip[] | []>();
  useEffect(() => {
    const fetchAvatar = async () => {
      const members = await getChannelFirstMembers(params.channelId);
      setFirstMembers(members);
    }
    fetchAvatar();
  }, [])
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!context.userData) {
          const userData: User | undefined = await getCurrentUser();
          if (userData === undefined) {
            throw ('you need to login first');
          }
          context.setUserData(userData);
        }
        const chan: Channel | undefined = await getChannel(params.channelId);
        if (chan === undefined) {
          throw ('no such channel')
        }
        setChannel(chan);
        const ChannelMessages = await getChannelMessages(params.channelId);
        if (ChannelMessages) {
          console.log(ChannelMessages);
          setMessages(ChannelMessages);
        }
        if (!context.socket) {
          const chatNameSpace = `${process.env.NEXT_PUBLIC_API_URL}:3002/chat`;
          const cookie = new Cookies();
          const newSocket = io(chatNameSpace, {
            query: { user: cookie.get('jwt') },
          });
          context.setSocket(newSocket);
        }
        setLoading(false);
      }
      catch (e) {
        e === "you need to login first"
          ? toast.error("you need to login first")
          : e === "no such channel"
            ? toast.error("no such channel") : true;
      }
    }
    fetchData();
  }, [])
  const broadCastMessage = () => {
    if (context.socket && channel && messageText.trimStart().trimEnd()) {
      console.log("salam 3alikom")
      context.socket.emit('channelBroadcast', { to: channel.name, message: messageText, senderId: context.userData.intraId });
      setMessages((prevMessages: ChannelMessage[]) => {
        const newMessages = Array.isArray(prevMessages) ? [...prevMessages] : [];

        let currentDateVariable: Date = new Date();

        const singleMsg: ChannelMessage = {
          id: 0,
          sender: context.userData?.intraId,
          recipient: "",
          content: messageText,
          createdAt: currentDateVariable,
          channelId: params.channelId,
        };

        newMessages.push(singleMsg);

        return newMessages;
      }
      );
      setMessageText('');
    }
  };
  const handleKeyPress = (event: any) => {
    if (event.key === 'Enter') {
      broadCastMessage();
    }
  }
  if (loading) {
    return (
      <Loading />
    )
  }
  const desplayedMessages: ChannelMessage[] = messages.length ? messages.toReversed() : [];
  return (
    <>
      <div className=" min-h-screen w-screen  bg-[#12141A]">
        <Navbar isProfileOwner={false} />
        <div className="flex ">
          {context.isSidebarVisible && (
            <div className="w-16 custom-height ">
              <div
                className={`transition-all duration-500 ease-in-out ${context.isSidebarVisible ? "w-16 opacity-100" : "w-0 opacity-0"
                  }`}
              >
                <Sidebar />
              </div>
            </div>
          )}
          <div className="flex-1 overflow-y-auto">
            <div className="flex custom-height">
              <Conversations />
              <div className="flex-1 p:2  lg:flex  justify-between flex flex-col custom-height">
                <div className="flex sm:items-center justify-between p-1 bg-slate-900 ">
                  <div className="relative flex items-center space-x-4">
                    <div className="relative p-4">
                      {firstMembers && <ChannelAvatar firstMembers={firstMembers} />}                    </div>
                    <div className="flex flex-col leading-tight">
                      <div className="text-2xl mt-1 flex items-center">
                        <span className="text-white mr-3">{channel?.name}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="chat-message  h-screen  flex flex-col-reverse p-2 overflow-x-auto overflow-y-auto bg-slate-650  border-white scrollbar-thin  scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {desplayedMessages?.map((msg: any, index: number) => (
                    (msg.sender === context.userData?.intraId && <SingleMessageSent key={index} message={msg.content} />) ||
                    (msg.sender !== context.userData?.intraId && channel ? <SingleMessageReceived key={index} message={msg.content} /> : null)
                  ))}
                </div>
                <div className=" ">
                  <div className="relative flex">
                    <input
                      type="text"
                      placeholder="Write your message!"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="w-full focus:outline-none focus:placeholder-gray-400  placeholder-gray-600 pl-12  rounded-md p-3 bg-gray-800 text-white" />
                    <div className="absolute right-0 items-center inset-y-0">
                      <button type="button" className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-gray-600">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                        </svg>
                      </button>
                      <button type="button" style={{ display: messageText.length ? "" : "none" }} onClick={broadCastMessage} className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none">
                        {/* <span className="font-bold hidden sm:block">Send</span> */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6 ml-2 transform rotate-90">
                          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <ChannelDashBoard channelId={params.channelId} />
            </div>
          </div>
        </div>
        <Toaster />
      </div>
    </>
  )
}

export default ChannelRoom;