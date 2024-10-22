import { useState, useEffect, useRef } from "react";

export function Chat() {
  const [messages, setMessages] = useState<
    {
      type: "join" | "message" | "leave";
      message: string;
      username: string;
      userCount?: number;
    }[]
  >([]);
  const [inputMessage, setInputMessage] = useState("");
  const [username, setUsername] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const websocketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const storedUsername = localStorage.getItem("chatUsername");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    if (!username) return;

    const connectWebSocket = () => {
      const ws = new WebSocket(`ws://${window.location.host}/chat/ws`);
      websocketRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        ws.send(JSON.stringify({ type: "join", username }));
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data.toString());

        if (data.userCount) {
          setUserCount(data.userCount);
        }

        setMessages((prevMessages) => [
          ...prevMessages,
          JSON.parse(event.data.toString()),
        ]);
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
        setIsConnected(false);
        setTimeout(connectWebSocket, 3000);
      };
    };

    connectWebSocket();

    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, [username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && websocketRef.current) {
      websocketRef.current.send(
        JSON.stringify({
          type: "message",
          message: inputMessage,
        })
      );
      setInputMessage("");
    }
  };

  const handleSetUsername = (e: React.FormEvent) => {
    e.preventDefault();
    const usernameInput = (e.target as HTMLFormElement).username.value.trim();
    if (usernameInput) {
      setUsername(usernameInput);
      localStorage.setItem("chatUsername", usernameInput);
    }
  };

  const handleLogout = () => {
    if (websocketRef.current) {
      websocketRef.current.close();
    }
    setUsername("");
    localStorage.removeItem("chatUsername");
    setMessages([]);
  };

  return (
    <>
      {!username ? (
        <form onSubmit={handleSetUsername} className="mb-4">
          <input
            name="username"
            type="text"
            placeholder="Enter your username"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
          />
          <button
            type="submit"
            className="w-full mt-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Join Chat
          </button>
        </form>
      ) : (
        <>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="h-96 overflow-y-auto p-4 space-y-2">
              {messages.map((msg, index) => (
                <div key={index} className="bg-gray-100 rounded-lg p-2 text-sm">
                  <span className="font-bold">{msg.username}: </span>
                  {msg.message}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
                <button
                  type="submit"
                  className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
          <div className="mt-2 flex justify-between items-center px-2">
            <p className="text-sm text-gray-500">
              {isConnected ? (
                <>
                  <span className="inline-flex items-center gap-x-1.5 rounded-md text-xs font-medium text-green-700">
                    <svg
                      viewBox="0 0 6 6"
                      aria-hidden="true"
                      className="h-1.5 w-1.5 fill-green-500"
                    >
                      <circle r={3} cx={3} cy={3} />
                    </svg>
                    <div className="inline-flex items-center">
                      <div className="mr-0.5">Connected</div>
                      {userCount > 0 && (
                        <div className="text-xs text-gray-500">
                          ({userCount} users)
                        </div>
                      )}
                    </div>
                  </span>
                </>
              ) : (
                <span className="inline-flex items-center gap-x-1.5 rounded-md text-xs font-medium text-red-700">
                  <svg
                    viewBox="0 0 6 6"
                    aria-hidden="true"
                    className="h-1.5 w-1.5 fill-red-500"
                  >
                    <circle r={3} cx={3} cy={3} />
                  </svg>
                  Disconnected
                </span>
              )}
            </p>
            <button
              onClick={handleLogout}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Logout
            </button>
          </div>
        </>
      )}
    </>
  );
}
