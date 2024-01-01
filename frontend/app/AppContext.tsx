import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { io, Socket } from "socket.io-client";
import Cookies from "universal-cookie";

export interface Message {
  id: number;
  sender: string;
  recipient: string;
  content: string;
  createdAt: Date;
  privateRommName: string;
}

export interface Room {
  id: number;
  name: string;
  paraticipants: string[];
  participants: User[];
  messages: Message[];
  createdAt:      Date
  updated_at:    Date
}

export type User = {
  intraId: string;
  fullname: string;
  login: string;
  email: string;
  Avatar: string;
  isRegistred: boolean;
  isTfaEnabled: boolean;
  created_at: Date;
  updated_at: Date;
  status: string;
};

export type AppContextProps = {
  isDivVisible: boolean;
  toggleDivVisibility: () => void;
  setDivVisible: (isDivVisible: boolean) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  isSidebarVisible: boolean;
  setisSidebarVisible: (isSidebarVisible: boolean) => void;
  toggleSidebarVisibleVisibility: () => void;
  recipientUserId: string;
  setRecipientLogin: (recipientUserId: string) => void;
  setUserData: (userData: any) => void;
  friendsData: any;
  setFriends: (userData: any) => void;
  userData: any;
  setMessages: (messages: Message[]) => void;
  messages: Message[];
  messageText: string;
  setMessageText: (messageText: string) => void;
  socket: Socket | null;
  setSocket: (socket: Socket | null) => void;
};

const AppContext = createContext<AppContextProps | undefined>(undefined);

type AppProviderProps = {
  children: ReactNode;
};

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [isDivVisible, setDivVisible] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarVisible, setisSidebarVisible] = useState<boolean>(true);
  const [recipientUserId, setRecipientLogin] = useState<string>('');
  const [userData, setUserData] = useState(null);
  const [friendsData, setFriends] = useState(null);
  const [messages, setMessages] = useState<Message[]>([]); // Provide a type for the messages state
  const [messageText, setMessageText] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);

  const toggleDivVisibility = () => {
    setDivVisible((prev) => !prev);
  };

  const toggleSidebarVisibleVisibility = () => {
    setisSidebarVisible((prev) => !prev);
  };
  const contextValue: AppContextProps = {
    socket,
    setSocket,
    messages,
    setMessages,
    messageText,
    setMessageText,
    setFriends,
    friendsData,
    setUserData,
    userData,
    recipientUserId,
    setRecipientLogin,
    isDivVisible,
    toggleDivVisibility,
    setDivVisible,
    user,
    setUser,
    isSidebarVisible,
    setisSidebarVisible,
    toggleSidebarVisibleVisibility,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
