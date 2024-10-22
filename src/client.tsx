import * as ReactDOM from "react-dom/client";
import { ChatPage } from "@/pages/chat";

const pathname = window.location.pathname;

switch (pathname) {
  case "/chat":
    ReactDOM.hydrateRoot(document.getElementById("root")!, <ChatPage />);
    break;
}
