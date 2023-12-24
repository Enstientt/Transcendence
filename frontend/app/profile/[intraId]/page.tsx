"use client";

import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { useAppContext, AppProvider, User } from "../../AppContext";
import { CiCirclePlus } from "react-icons/ci";
import { CiSaveUp2 } from "react-icons/ci";
import { CiEdit } from "react-icons/ci";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { TbFriends } from "react-icons/tb";
import { MdOutlineBlock } from "react-icons/md";
import { BiMessageRounded } from "react-icons/bi";
import { IoGameControllerOutline } from "react-icons/io5";
import toast, { Toaster } from "react-hot-toast";
import { CiSearch } from "react-icons/ci";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import pong from "../../../public/pong.svg";
import onepeice from "../../../public/one.jpg";
import { IoMenuOutline } from "react-icons/io5";
import { CiLogout } from "react-icons/ci";
import { RiPingPongLine } from "react-icons/ri";
import { IoChatbubblesOutline } from "react-icons/io5";
import { GrGroup } from "react-icons/gr";
import { FaUserFriends } from "react-icons/fa";
import { GrAchievement } from "react-icons/gr";
import { MdLeaderboard } from "react-icons/md";
import { FiUserPlus } from "react-icons/fi";
import { IoHome } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { CgProfile } from "react-icons/cg";

export function Loading() {
  return (
    <div className="bg-[#12141A] custom-height flex items-center justify-center">
      <span className="loading loading-dots loading-lg"></span>
    </div>
  );
}

export function Navbar({ isProfileOwner }: { isProfileOwner: boolean }) {
  const {
    user,
    setUser,
    isDivVisible,
    toggleDivVisibility,
    setDivVisible,
    isSidebarVisible,
    setisSidebarVisible,
    toggleSidebarVisibleVisibility,
  } = useAppContext();

  const [inputValue, setInputValue] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:3001/users`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      if (!response.ok) {
        toast.error("User not found");
        console.log("User not found");
        return;
      }

      const users: User[] = await response.json();
      console.log(users);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="bg-[#1F212A] flex flex-row  w-[100vw]">
      <div className="w-16 h-16 bg-[#292D39]">
        <Image
          src={pong}
          alt="Description of the image"
          priority={true}
          width={100}
          height={100}
          sizes=""
          style={{ filter: "invert(100%)" }}
        />
      </div>

      <div className="flex-grow">
        <div className="">
          <div className="flex-row flex justify-betweenh-16">
            <div className="flex-row flex justify-between">
              <div className="flex items-center p-3 md:hidden">
                <button onClick={toggleSidebarVisibleVisibility}>
                  <IoMenuOutline size="30" className="text-white" />
                </button>
              </div>
              <div className="flex items-center md:p-3">
                <Link href={`${process.env.NEXT_PUBLIC_API_URL}:3000/search`}>
                  <CiSearch size="30" className="text-slate-400 " />
                </Link>
              </div>
            </div>
            <div className="flex justify-end p-4 flex-grow">
              {!isDivVisible && isProfileOwner && (
                <button onClick={toggleDivVisibility}>
                  <CiEdit className="text-white" size="25" />
                </button>
              )}
              {isDivVisible && isProfileOwner && (
                <button onClick={toggleDivVisibility}>
                  <IoIosCloseCircleOutline className="text-white" size="25" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const UserLevelCard = ({
  value,
  intraId,
}: {
  value: string;
  intraId: string | undefined;
}) => {
  return (
    <div className="flex items-center justify-center h-[7vh] text-gray-900">
      <div
        className="flex items-center justify-center p-4
        rounded-md"
      >
        <div className="text-base-100  days left"> {value} </div>
      </div>
    </div>
  );
};

const UserDetailsCard = ({
  value,
  intraId,
}: {
  value: string;
  intraId: string | undefined;
}) => {
  const { user, setUser } = useAppContext();
  const { isDivVisible, toggleDivVisibility } = useAppContext();
  const [newLoginInput, setNewLoginInput] = useState("");

  const updateLogin = async () => {
    if (newLoginInput.trim() !== "" && intraId !== undefined) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}:3001/users/${intraId}/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ newLogin: newLoginInput }),
          }
        );
        let updatedUser = { ...user, login: newLoginInput };
        setUser(updatedUser as User);

        const data = await response.json();
        if (data.success === false) {
          const msg = "Failed to update login : " + newLoginInput;
          toast.error(msg);
          console.log(newLoginInput, ": -maybe- not unique");
        } else {
          toast.success("Login updated successfully");
          console.log(newLoginInput, ": updated successfully");
        }
      } catch (error: any) {
        const msg = "Error updating login: " + newLoginInput;
        toast.error(msg);
        console.error("Error updating login:", error.message);
      }
      setNewLoginInput("");
    } else {
      toast.error("Please enter a valid login");
      console.log("Please enter a valid login");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      updateLogin();
      toggleDivVisibility();
    }
  };

  return (
    <div className="flex items-center justify-center h-[7vh] ">
      <div
        className="flex items-center justify-center p-4
        rounded-md"
      >
        <div className="text-2xl font-medium font-sans days left text-white">
          {value}&nbsp;
        </div>
        {isDivVisible && (
          <div className="">
            &nbsp;
            <input
              type="text"
              placeholder=" the new login"
              value={newLoginInput}
              onChange={(e) => setNewLoginInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className={`rounded-lg border-opacity-50 border-2 ${
                newLoginInput !== "" ? "border-green-500" : "border-slate-300"
              } bg-[#1F212A] text-sm outline-none text-white`}
            />
            &nbsp;
            <button
              onClick={() => {
                updateLogin();
                toggleDivVisibility();
              }}
              className=""
            >
              <CiSaveUp2 className="text-slate-400 inline-block" size="24" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const UserProfileImage = ({
  src,
  intraId,
}: {
  src: string;
  intraId: string | undefined;
}) => {
  const {
    user,
    setUser,
    isDivVisible,
    toggleDivVisibility,
    setDivVisible,
    isSidebarVisible,
    setisSidebarVisible,
    toggleSidebarVisibleVisibility,
  } = useAppContext();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  useEffect(() => {
    setImagePreview(src);
  }, [src]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);

      const previewURL = URL.createObjectURL(file);
      setImagePreview(previewURL);
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("avatar", selectedFile);

      console.log("formData", formData);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}:3001/users/${intraId}/avatar`,
          {
            method: "POST",
            body: formData,
            credentials: "include",
          }
        );
        const data = await response.json();
        if (data.success === false) {
          toast.error("Failed to update login avatar");
          console.log("Failed to update login avatar");
        } else {
          toast.success("avatar updated successfully");
          console.log("avatar updated successfully");
        }
      } catch (error) {
        toast.error("Failed to update avatar");
        console.error("Error during POST request:", error);
      }
      setSelectedFile(null);
    } else {
      toast.error("Please select a file");
      console.log("Please select a file");
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center">
        <div
          className={`${
            isSidebarVisible ? "backgroundDiv" : "backgroundDivNotVisible"
          } backgroundDiv  md:h-80 h-48 flex justify-center`}
        >
          <div
            className="w-[20vh] h-[20vh] md:mt-36 mt-16"
            style={{ position: "relative", display: "inline-block" }}
          >
            {imagePreview && (
              <Image
                src={imagePreview}
                alt="image Preview"
                width={300}
                height={300}
                priority={true}
                quality={100}
                className="rounded-full border-2 border-black"
                style={{ width: "20vh", height: "20vh" }}
                onError={(e: any) => {
                  e.target.onerror = null;
                }}
              />
            )}
            {selectedFile && isDivVisible && (
              <div
                style={{
                  position: "absolute",
                  display: "inline-block",
                  width: "20vh",
                  height: "20vh",
                }}
                className="top-0 left-0 flex flex-col items-center justify-center rounded-full
                animate-moveLeftAndRight"
              >
                <button
                  onClick={() => {
                    handleUpload();
                    toggleDivVisibility();
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      display: "inline-block",
                      width: "20vh",
                      height: "20vh",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                    className="bg-black rounded-full opacity-50 font-sans text-white text-lg font-medium"
                  >
                    <div
                      style={{
                        position: "absolute",
                        display: "inline-block",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      save &nbsp;
                      <CiSaveUp2
                        className="text-white inline-block"
                        size="22"
                      />
                    </div>
                  </div>
                </button>
              </div>
            )}
            <div>
              {isDivVisible && (
                <div
                  className=""
                  style={{ position: "absolute", bottom: 0, right: 0 }}
                >
                  <label htmlFor="avatar" className="cursor-pointer">
                    <div className="bg-slate-300 mb-[1.9vh] mr-[1.9vh] md:mb-[2.2vh] md:mr-[2.2vh] rounded-full">
                      <CiCirclePlus
                        className="text-black "
                        size="25"
                        onChange={handleFileChange}
                      />
                    </div>

                    <input
                      type="file"
                      id="avatar"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="inset-0 cursor-pointer bg-black hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Sidebar = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkJwtCookie = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}:3001/auth/user`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        var data: User = await response.json();

        if (data !== null) {
          setUser(data);
        }
      } catch (error: any) {
        const msg = "Error during login" + error.message;
        toast.error(msg);
        console.error("Error during login:", error);
      }
    };
    checkJwtCookie();
  }, [user]);

  return (
    <div className="relative custom-height bg-[#292D39] ">
      <div className="absolute buttom-0 left-0">
        <div className=" custom-height fixed text-black ">
          <ul className="list-none text-center justify-center items-center w-[64px]">
            <div className="flex flex-col justify-between custom-height">
              <div className="">
                <li>
                  <IoHome size="30" className="text-slate-400 mx-auto m-8" />
                </li>
                <li>
                  <Link
                    href={`${process.env.NEXT_PUBLIC_API_URL}:3000/profile/${user?.intraId}`}
                  >
                    <CgProfile
                      size="30"
                      className="text-slate-400 mx-auto m-8"
                    />
                  </Link>
                </li>
                <li>
                  <Link href={`${process.env.NEXT_PUBLIC_API_URL}:3000/notif`}>
                    <IoMdNotificationsOutline
                      size="30"
                      className="text-slate-400 mx-auto m-8"
                    />
                  </Link>
                </li>
                <li>
                  <MdLeaderboard
                    size="30"
                    className="text-slate-400 mx-auto m-8"
                  />
                </li>
                <li>
                  <GrAchievement
                    size="30"
                    className="text-slate-400 mx-auto m-8"
                  />
                </li>
                <li>
                  <FaUserFriends
                    size="30"
                    className="text-slate-400 mx-auto m-8"
                  />
                </li>
                <li>
                  <GrGroup size="30" className="text-slate-400 mx-auto m-8" />
                </li>
                <li>
                  <IoChatbubblesOutline
                    size="30"
                    className="text-slate-400 mx-auto m-8"
                  />
                </li>
                <li>
                  <RiPingPongLine
                    size="30"
                    className="text-slate-400 mx-auto m-8"
                  />
                </li>
              </div>

              <div>
                <li className="">
                  <Link
                    href={`${process.env.NEXT_PUBLIC_API_URL}:3001/auth/logout`}
                  >
                    <CiLogout
                      size="30"
                      className="text-slate-400 mx-auto m-8"
                    />
                  </Link>
                </li>
              </div>
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
};

const TwoFactorAuth = ({
  intraId,
  isTfa,
}: {
  intraId: string | undefined;
  isTfa: boolean;
}) => {
  const { isDivVisible, toggleDivVisibility } = useAppContext();
  const [isChecked, setIsChecked] = useState(isTfa);

  const handleCheckboxChange = async (event: any) => {
    setIsChecked((prev) => {
      return !prev;
    });

    if (event.target.checked) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:3001/users/${intraId}/enableOtp`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const res = await response.json();

      if (res.sucess) {
        toast.success("2FA is enabled");
        console.log("2FA is enabled");
      } else {
        toast.error("Error in enabling 2FA");
        console.log("Error in enabling 2FA");
      }
    } else {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:3001/users/${intraId}/disableOtp`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const res = await response.json();

      if (res.sucess) {
        toast.success("2FA is disabled");
        console.log("2FA is disabled");
      } else {
        toast.error("Error in disabling 2FA");
        console.log("Error in disabling 2FA");
      }
    }
  };

  return (
    <div>
      {isDivVisible && (
        <div>
          <div className="flex flex-col items-center justify-center">
            <div>
              <span className="label-text font-sans text-white text-base inline-block">
                Enable 2FA &nbsp;
              </span>
              <div className="inline-block">
                <input
                  type="checkbox"
                  checked={isChecked}
                  className="toggle [--tglbg:black] bg-white 
                 hover:bg-slate-500 border-bg-slate-800 "
                  style={{ transform: "scale(0.9)", verticalAlign: "middle" }}
                  onChange={handleCheckboxChange}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Friend = ({
  isProfileOwner,
  userId,
  friendId,
}: {
  isProfileOwner: boolean;
  userId: string | undefined;
  friendId: string;
}) => {
  const addfriend = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:3001/users/addfriend`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            friendShipStatus: "PENDING",
            userId: `${userId}`,
            friendId: `${friendId}`,
          }),
        }
      );

      const data = await response.json();

      if (data.success === false) {
        toast.error("You are already friends");
      } else if (data.isFriend === false) {
        toast.success("Friend added successfully");
      } else if (data.isFriend === true) {
        toast.error("You are already friends");
      }
    } catch (error: any) {
      const msg = "Error adding friend: " + friendId;
      toast.error(msg);
      console.error("Error adding friend:", error.message);
    }
  };
  return (
    <div>
      {!isProfileOwner && (
        <div className="flex items-center justify-center text-white">
          <button className="mx-2" onClick={addfriend}>
            <FiUserPlus size="25" />
          </button>
          <button className="mx-2">
            <MdOutlineBlock size="25" />
          </button>
          <button className="mx-2">
            <BiMessageRounded size="25" />
          </button>
          <button className="mx-2">
            <IoGameControllerOutline size="25" />
          </button>
        </div>
      )}
    </div>
  );
};

const ShowFriends = ({
  login,
  intraId,
}: {
  login: string;
  intraId: string | undefined;
}) => {
  const { user, setUser } = useAppContext();
  const [friends, setFriends] = useState<User[] | null>(null);
  // send a get request to get all friends

  useEffect(() => {
    // I should edit this to get only friends friendshipStatus: "ACCEPTED"

    const getFriends = async () => {
      try {
        const response: any = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}:3001/users/${intraId}/friends`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        const data = await response.json();

        if (response.success === false) {
          const msg = "Error getting friends";
          toast.error(msg);
          console.log(msg);
        }
        if (data.friends) {
          setFriends(data.friends);
        }
      } catch (error: any) {
        const msg = "Error getting friends: " + error.message;
        toast.error(msg);
        console.error("Error getting friends:", error.message);
      }
    };
    getFriends();
  }, []);

  return (
    <div>
      <div className="text-white font-sans m-5">Your friends : </div>

      <div className="flex flex-row items-center justify-evenly">
        {friends &&
          friends?.map((friend: User) => (
            <div
              key={friend?.intraId}
              className="flex flex-row items-center justify-center "
            >
              <div className="flex flex-row items-center justify-center">
                <div className="w-[5vh] h-[5vh]">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={friend?.Avatar}
                    alt=""
                  />
                </div>
              </div>
              <div className="text-slate-100 font-sans ">{friend?.login}</div>
            </div>
          ))}
      </div>
    </div>
  );
};

const ShowPendingInvite = ({
  login,
  intraId,
}: {
  login: string;
  intraId: string | undefined;
}) => {
  const { user, setUser } = useAppContext();
  const [friends, setFriends] = useState<User[] | null>(null);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const response: any = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}:3001/users/${intraId}/PendingInvite`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        const data = await response.json();

        if (data.success === false) {
          const msg = "Error getting friends";
          toast.error(msg);
          console.log(msg);
        }
        if (data.friendsDetails) {
          setFriends(data.friendsDetails);
        }
      } catch (error: any) {
        const msg = "Error getting friends: " + error.message;
        toast.error(msg);
        console.error("Error getting friends:", error.message);
      }
    };
    getFriends();
  }, [intraId, user]);

  return (
    <div>
      <div className="text-white font-sans m-5">Pending invitations : </div>

      <div className="flex flex-row items-center justify-evenly">
        {friends &&
          friends?.map((friend: User) => (
            <div
              key={friend?.intraId}
              className="flex flex-row items-center justify-center "
            >
              <div className="flex flex-row items-center justify-center">
                <div className="w-[5vh] h-[5vh]">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={friend?.Avatar}
                    alt=""
                  />
                </div>
              </div>
              <div className="text-slate-100 font-sans">{friend?.login}</div>
            </div>
          ))}
      </div>
    </div>
  );
};

const ShowFreindrequest = ({
  login,
  intraId,
}: {
  login: string;
  intraId: string | undefined;
}) => {
  const { user, setUser } = useAppContext();
  const [friends, setFriends] = useState<User[] | null>(null);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const response: any = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}:3001/users/${intraId}/freindrequest`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        const data = await response.json();

        if (data.success === false) {
          const msg = "Error getting friends";
          toast.error(msg);
          console.log(msg);
        }
        if (data.friendsDetails) {
          setFriends(data.friendsDetails);
        }
      } catch (error: any) {
        const msg = "Error getting friends: " + error.message;
        toast.error(msg);
        console.error("Error getting friends:", error.message);
      }
    };
    getFriends();
  }, [intraId, user]);

  return (
    <div>
      <Link href={`${process.env.NEXT_PUBLIC_API_URL}:3000/notif`}>
        <div className="text-white font-sans m-5">Freind request : </div>

        <div className="flex flex-row items-center justify-evenly">
          {friends &&
            friends?.map((friend: User) => (
              <div
                key={friend?.intraId}
                className="flex flex-row items-center justify-center "
              >
                <div className="flex flex-row items-center justify-center">
                  <div className="w-[5vh] h-[5vh]">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={friend?.Avatar}
                      alt=""
                    />
                  </div>
                </div>
                <div className="text-slate-100 font-sans">{friend?.login}</div>
              </div>
            ))}
        </div>
      </Link>
    </div>
  );
};

export default function Profile(params: any) {
  const {
    user,
    setUser,
    isDivVisible,
    toggleDivVisibility,
    setDivVisible,
    isSidebarVisible,
    setisSidebarVisible,
    toggleSidebarVisibleVisibility,
  } = useAppContext();

  const [userFromRoutId, setuserFromRoutId] = useState<User | undefined>(
    undefined
  );
  const [isProfileOwner, setIsProfileOwner] = useState<boolean>(false);

  useEffect(() => {
    setisSidebarVisible(window.innerWidth > 768);
  }, []);

  const addLogin = (isRegistred: any) => {
    if (isRegistred === false && isProfileOwner === true) {
      toggleDivVisibility();
      toast.success("🌟 Please update your nickname and avatar.", {
        style: {
          border: "1px solid #713200",
          padding: "16px",
          color: "#713200",
        },
        iconTheme: {
          primary: "#713200",
          secondary: "#FFFAEE",
        },
      });
      console.log("🌟 Please update your nickname and avatar.");
    }
  };

  useEffect(() => {
    const checkJwtCookie = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}:3001/auth/user`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        var data: User = await response.json();

        if (data !== null) {
          setUser(data);
        }
      } catch (error: any) {
        const msg = "Error during login" + error.message;
        toast.error(msg);
        console.error("Error during login:", error);
      }
    };
    checkJwtCookie();
  }, [user?.login, isProfileOwner]);

  useEffect(() => {
    const getUserFromRoutId = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}:3001/users/${params.params.intraId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          toast.error("User not found");
          console.log("User not found");
          return;
        }
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
          var data: User = await response.json();
          setuserFromRoutId(data);
        } else {
          toast.error("User not found");
          console.log("User not found");
        }
      } catch (error: any) {
        const msg = "Error during login" + error.message;
        toast.error(msg);
        console.error("Error during login:", error);
      }
    };

    getUserFromRoutId();
  }, []);

  useEffect(() => {
    if (params.params.intraId === user?.intraId) {
      setIsProfileOwner(true);
    }
    let timeoutId: any;
    if (!user) {
      timeoutId = setTimeout(() => {
        toast.error("Please login first");
      }, 5000);
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [user]);

  useEffect(() => {
    addLogin(user?.isRegistred);
  }, [user?.isRegistred, isProfileOwner]);

  useEffect(() => {
    if (isProfileOwner === false) {
      setDivVisible(false);
    }
  }, []);

  if (!userFromRoutId) {
    return (
      <>
        <div className=" h-screen w-screen ">
          <Navbar isProfileOwner={isProfileOwner} />

          <div className="flex ">
            {isSidebarVisible && (
              <div className="w-16 custom-height ">
                <div
                  className={`transition-all duration-500 ease-in-out ${
                    isSidebarVisible ? "w-16 opacity-100" : "w-0 opacity-0"
                  }`}
                >
                  <Sidebar />
                </div>
              </div>
            )}
            <div className="flex-1 overflow-y-auto">
              <Loading />
            </div>
          </div>
          <Toaster />
        </div>
      </>
    );
  }

  let Login = "Login";
  let intraId = "";
  let FullName = "Full Name";
  let isTfaEnabled = false;
  let level = "Level 6.31";
  let email = "Email";
  let IntraPic =
    "http://m.gettywallpapers.com/wp-content/uploads/2023/05/Cool-Anime-Profile-Picture.jpg";

  if (isProfileOwner) {
    Login = user?.login || "Login";
    intraId = user?.intraId || "";
    FullName = user?.fullname || "Full Name";
    isTfaEnabled = user?.isTfaEnabled || false;
    level = "Level 6.31";
    email = user?.email || "Email";
    IntraPic = user?.Avatar || IntraPic;
  } else {
    Login = userFromRoutId?.login || "Login";
    intraId = userFromRoutId?.intraId || "";
    FullName = userFromRoutId?.fullname || "Full Name";
    isTfaEnabled = userFromRoutId?.isTfaEnabled || false;
    level = "Level 6.31";
    email = userFromRoutId?.email || "Email";
    IntraPic = userFromRoutId?.Avatar || IntraPic;
  }

  return (
    <div className=" min-h-screen w-screen bg-[#12141A]">
      <Navbar isProfileOwner={isProfileOwner} />

      <div className="flex ">
        {isSidebarVisible && (
          <div className="w-16 custom-height ">
            <div
              className={`transition-all duration-500 ease-in-out ${
                isSidebarVisible ? "w-16 opacity-100" : "w-0 opacity-0"
              }`}
            >
              <Sidebar />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          <UserProfileImage src={IntraPic} intraId={intraId} />
          <div className={`${isDivVisible ? "mt-20" : "mt-16"} p-10`}>
            <UserDetailsCard value={Login} intraId={intraId} />
            <Friend
              isProfileOwner={isProfileOwner}
              userId={user?.intraId}
              friendId={params.params.intraId}
            />
            <TwoFactorAuth intraId={intraId} isTfa={isTfaEnabled} />
            <ShowFriends login={Login} intraId={intraId} />
            <ShowPendingInvite login={Login} intraId={intraId} />
            <ShowFreindrequest login={Login} intraId={intraId} />
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}