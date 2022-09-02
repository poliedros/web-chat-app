import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Layout from "components/Layout";
import useUser from "lib/useUser";
import { io, Socket } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

type Message = {
  _id: string;
  username: string;
  date: Date;
  message: string;
};

function getMessages(): Message[] {
  return [];
}

let socket: Socket = io("https://api.chat.czar.dev");

const Home: NextPage = () => {
  const [messages, setMessages] = useState<Message[]>(getMessages());
  const { user } = useUser({ redirectTo: "/login" });

  useEffect(() => socketInitializer());

  const socketInitializer = () => {
    socket.on("message", function (message: Message) {
      if (!messages.some((m) => m._id === message._id))
        setMessages([...messages, message]);
    });

    return () => {
      socket.off("message");
    };
  };

  if (!user || user.isLoggedIn === false) {
    return <div>Loading...</div>;
  }

  function onMessageSent(message: Message) {
    setMessages([...messages, message]);
    socket.emit("message", message);
  }

  return (
    <div>
      <Layout>
        <Messages data={messages} />
        <MessageInput onMessageSent={onMessageSent} />
      </Layout>
    </div>
  );
};

export default Home;

function Messages({ data }: { data: Message[] }) {
  return (
    <div>
      {data.map((message) => (
        <div
          key={message._id}
          className="flex justify-between items-center py-2 px-3 p-4 text-sm text-gray-700 bg-gray-100 rounded-lg dark:bg-gray-700 dark:text-gray-300"
        >
          <span className="font-medium">{message.username}</span>
          {message.message}
          <MessageAttachs />
        </div>
      ))}
    </div>
  );
}

function MessageAttachs() {
  return (
    <div className="flex pl-0 space-x-1 sm:pl-2">
      <button
        type="button"
        className="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
      >
        <svg
          aria-hidden="true"
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
            clipRule="evenodd"
          ></path>
        </svg>
        <span className="sr-only">Attach file</span>
      </button>
      <button
        type="button"
        className="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
      >
        <svg
          aria-hidden="true"
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
            clipRule="evenodd"
          ></path>
        </svg>
        <span className="sr-only">Set location</span>
      </button>
      <button
        type="button"
        className="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
      >
        <svg
          aria-hidden="true"
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
            clipRule="evenodd"
          ></path>
        </svg>
        <span className="sr-only">Upload image</span>
      </button>
    </div>
  );
}

type MessageInputProps = {
  onMessageSent: (message: Message) => void;
};

function MessageInput({ onMessageSent }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const { user } = useUser({ redirectTo: "/login" });

  function sendMessage() {
    const messageObj: Message = {
      _id: uuidv4(),
      date: new Date(),
      message: message,
      username: user?.username!,
    };

    setMessage("");
    onMessageSent(messageObj);
  }

  return (
    <div className="mb-4 w-full bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
      <div className="py-2 px-4 bg-white rounded-t-lg dark:bg-gray-800">
        <textarea
          id="comment"
          rows={4}
          className="px-0 w-full text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
          placeholder="Write a message..."
          required
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        ></textarea>
      </div>

      <div className="flex justify-between items-center py-2 px-3 border-t dark:border-gray-600">
        <button
          type="submit"
          className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
          onClick={sendMessage}
        >
          Send message
        </button>

        <MessageAttachs />
      </div>
    </div>
  );
}
