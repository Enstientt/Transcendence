'use client';
import { FC, use, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { User, useAppContext,Message, Room, AppContextProps} from '@/app/AppContext';
import { Navbar, Sidebar } from '@/app/profile/[intraId]/page';
import { Conversations } from '../page';
import toast, { Toaster } from 'react-hot-toast';
import { io } from 'socket.io-client';

interface PageProps {
  params: {
    roomId: string
  }
}

const SingleMessageReceived = ({ message }: any) => {
  const context = useAppContext();
  const user = context.friendsData?.friends?.find((friend: any) => friend.intraId === context.recipientUserId);
  return (
    <div className="flex items-end p-2 my-1">
      <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
        <div><span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">{message}</span></div>
      </div>
      <Image width={24} height={24} src={user?.Avatar} alt="My profile" className="w-6 h-6 rounded-full order-1" />
    </div>
  );
}
const SingleMessageSent = ({ message }: any) => {
  const context = useAppContext();
  return (
    <div className="flex items-end justify-end p-2 my-1">
      <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
        <div><span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">{message}</span></div>
      </div>
      <Image width={24} height={24} src={context.userData?.Avatar} alt="My profile" className="w-6 h-6 rounded-full order-1" />
    </div>
  );
}

// async function getRoom(userId: string, otherId:string): Promise<Room> {
//   const res = await fetch(`http://localhost:3001/chat/${roomId}`);
//   const room = await res.json();
//   return room;
// }
async function getMessages(roomId: string) : Promise<Message[]> {
  const res = await fetch(`http://localhost:3001/chat/${roomId}/messages`);
  const room =  res.json();
  return room;
}
// async function getRecipientData(userId: string): Promise<any> {
//   const res = await fetch(`http://localhost:3001/users/${userId}`);
//   const user = await res.json();
//   return user;
// }
const PrivateRoom: FC<PageProps> = ({ params }: PageProps) => {
  const [messages, setMessages] = useState<Message[]>([]); // Provide a type for the messages state
  const[messageText, setMessageText] = useState('');
  const context = useAppContext();

const directAcess = (roomId:string, context:AppContextProps) => {
  const checkJwtCookie = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:3001/auth/user`,
        {
          method: "GET",
          credentials: "include",
        }
        );
        var data: User = await response.json();
        
        if (data !== null) {
          context.setUserData(data);
        }
      } catch (error: any) {
        const msg = "Error during login" + error.message;
        toast.error(msg);
        console.error("Error during login:", error);
      }
    };
    checkJwtCookie();
    const chatNameSpace = `${process.env.NEXT_PUBLIC_API_URL}:3003/chat`;
    const newSocket = io(chatNameSpace, {
      query: { userId: context.userData.intraId },
    });
    context.setSocket(newSocket);
    const fetchFriends = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}:3001/users/${context.userData?.intraId}/friends`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        var data = await response.json();
        if (data !== null) {
          context.setFriends(data);
        }
      } catch (error: any) {
        const msg = "Error during login" + error.message;
        toast.error(msg);
        console.error("Error during login:", error);
      }
    };
    fetchFriends();
    const recipientUserId = roomId.replace(context.userData?.intraId, '');
    context.setRecipientLogin(recipientUserId);
    return context;
  }
  useEffect(() => {
    if (!context){
      directAcess(params.roomId, context);
    }
    const fetchData = async () => {
      try {
        const dataMessages = await getMessages(params.roomId);
        setMessages(dataMessages);
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchData();
  
    const handlePrivateChat = (message: Message) => {
      setMessages((prevMessages: Message[]) => [...prevMessages, message]);
    };
    if (context.socket) {
      context.socket.on('privateChat', handlePrivateChat);
    }
  
    // Cleanup function
    return () => {
      if (context.socket) {
        context.socket.off('privateChat', handlePrivateChat);
      }
    };
  }, [params.roomId]);

  const sendPrivateMessage = () => {
    if (context.socket && context.recipientUserId && messageText) {

      context.socket.emit('privateChat', { to: context.recipientUserId, message: messageText, senderId: context.userData?.intraId });
      setMessages((prevMessages:Message[]) =>{
        const newMessages = Array.isArray(prevMessages) ? [...prevMessages] : [];

        let currentDateVariable: Date = new Date();
        
        const singleMsg: Message = {
          id: 0,
          sender: context.userData?.intraId,
          recipient: context.recipientUserId,
          content: messageText,
          createdAt: currentDateVariable,
          privateRommName: params.roomId,
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
      sendPrivateMessage();
    }
  }
  const recipientData = context.friendsData?.friends?.find((friend: any) => friend.intraId === context.recipientUserId);
  const desplayedMessages :Message[] = messages.length ? messages.toReversed():[];
  return (
    <div className=" min-h-screen w-screen  bg-[#12141A]">
    <Navbar isProfileOwner={false} />
    <div className="flex ">
      {context.isSidebarVisible && (
        <div className="w-16 custom-height ">
          <div
            className={`transition-all duration-500 ease-in-out ${
              context.isSidebarVisible ? "w-16 opacity-100" : "w-0 opacity-0"
            }`}
          >
            <Sidebar />
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
      <div className="flex custom-height">
      <Conversations friends={context.friendsData} />
    <div className="flex-1 p:2  lg:flex  justify-between flex flex-col custom-height">
      <div className="flex sm:items-center justify-between p-1 bg-slate-900 ">
        <div className="relative flex items-center space-x-4">
          <div className="relative">
            <span style={{ display: recipientData?.status=="ONLINE"?"":"none" }} className="absolute text-green-500 right-0 bottom-0">
              <svg width="20" height="20">
                <circle cx="8" cy="8" r="8" fill="currentColor"></circle>
              </svg>
            </span>
            <Image width={144} height={144} src={recipientData?.Avatar} alt="" className="w-10 sm:w-16 h-10 sm:h-16 rounded-full" />
          </div>
          <div className="flex flex-col leading-tight">
            <div className="text-2xl mt-1 flex items-center">
              <span className="text-gray-700 mr-3">{recipientData?.login}</span>
            </div>
            <span style={{ display: recipientData?.status=="ONLINE"?"":"none" }} className="text-lg text-gray-600">Actif</span>
          </div>
        </div>
      </div>
      <div className="chat-message  h-screen  flex flex-col-reverse p-2 overflow-x-auto overflow-y-auto bg-slate-750">
        {desplayedMessages?.map((msg:any, index) => (
          (msg.sender == context.userData?.intraId && <SingleMessageSent key={index} message={msg.content} />) || (msg.sender != context.userData?.intraId && <SingleMessageReceived key={index} message={msg.content} />)
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
            <button type="button" onClick={sendPrivateMessage} className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none">
              <span className="font-bold hidden sm:block">Send</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6 ml-2 transform rotate-90">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
     </div>
       </div>
     </div>
     <Toaster />
   </div>
  );
}

export default PrivateRoom;