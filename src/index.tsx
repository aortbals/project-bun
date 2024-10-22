import { createTask, deleteTask, listTasks } from "@/db/queries";
import { renderToReadableStream } from "react-dom/server";
import { CounterPage } from "@/pages/counter";
import TasksPage from "@/pages/tasks";
import { ChatPage } from "@/pages/chat";
import { Root } from "@/pages/root";
import type { ServerWebSocket } from "bun";

let count = 0;

const GLOBAL_CHAT_CHANNEL = "global";

type WebSocketData = {
  username: string;
};

const server = Bun.serve({
  port: 3000,
  async fetch(req, server) {
    const { pathname } = new URL(req.url);
    switch (pathname) {
      case "/":
        if (req.method === "POST") {
          let body = await req.formData();
          let diff = body.get("diff");
          if (diff) {
            count += parseInt(diff as string);
          }
          return new Response("", {
            status: 303,
            headers: { location: "/" },
          });
        } else {
          const stream = await renderToReadableStream(
            <CounterPage count={count} />
          );
          return new Response(stream, {
            headers: { "Content-Type": "text/html" },
          });
        }
      case "/tasks":
        if (req.method === "POST") {
          let body = await req.formData();
          let task = body.get("task");
          if (task) {
            createTask(task as string);
          }
          return new Response("", {
            status: 303,
            headers: { location: "/tasks" },
          });
        } else if (req.method === "DELETE") {
          console.log("DELETE");
          let body = await req.formData();
          let id = body.get("id");
          if (id) {
            deleteTask(parseInt(id as string));
          }
          return new Response("", {
            status: 303,
            headers: { location: "/tasks" },
          });
        } else {
          const tasks = listTasks();
          const stream = await renderToReadableStream(
            <TasksPage tasks={tasks} />
          );
          return new Response(stream, {
            headers: { "Content-Type": "text/html" },
          });
        }
      case "/tasks/delete":
        if (req.method === "POST") {
          let body = await req.formData();
          let id = body.get("id");
          if (id) {
            deleteTask(parseInt(id as string));
          }
          return new Response("", {
            status: 303,
            headers: { location: "/tasks" },
          });
        } else {
          return new Response("Not found", { status: 404 });
        }
      case "/chat":
        const stream = await renderToReadableStream(
          <Root title="Chat - Project Bun">
            <ChatPage />
          </Root>
        );
        return new Response(stream, {
          headers: { "Content-Type": "text/html" },
        });
      case "/chat/ws":
        const success = server.upgrade(req, {
          data: { username: req.headers.get("sec-websocket-protocol") },
        });
        return success
          ? undefined
          : new Response("WebSocket upgrade error", { status: 400 });
      case "/client.js":
        const clientJs = await Bun.build({
          entrypoints: ["./src/client.tsx"],
          outdir: "./out",
        });
        if (clientJs.success) {
          return new Response(clientJs.outputs[0], {
            headers: { "Content-Type": "application/javascript" },
          });
        } else {
          console.error(clientJs.logs);
          return new Response("Internal server error", { status: 500 });
        }
      default:
        return new Response("Not found", { status: 404 });
    }
  },
  websocket: {
    perMessageDeflate: true,
    open(ws: ServerWebSocket<WebSocketData>) {
      ws.subscribe(GLOBAL_CHAT_CHANNEL);
    },
    message(ws: ServerWebSocket<WebSocketData>, message: string | Buffer) {
      try {
        const data = JSON.parse(message.toString());
        if (data.type === "join") {
          ws.data.username = data.username;
          server.publish(
            GLOBAL_CHAT_CHANNEL,
            JSON.stringify({
              type: "join",
              message: `${ws.data.username} connected`,
              username: "server",
              userCount: server.subscriberCount(GLOBAL_CHAT_CHANNEL) - 1,
            })
          );
        } else if (data.type === "message") {
          server.publish(
            GLOBAL_CHAT_CHANNEL,
            JSON.stringify({
              type: "message",
              message: data.message,
              username: ws.data.username,
            })
          );
        }
      } catch (error) {
        console.error("Error processing message:", error);
      }
    },
    close(ws: ServerWebSocket<WebSocketData>) {
      if (ws.data.username) {
        ws.unsubscribe(GLOBAL_CHAT_CHANNEL);
        server.publish(
          GLOBAL_CHAT_CHANNEL,
          JSON.stringify({
            type: "leave",
            message: `${ws.data.username} disconnected`,
            username: ws.data.username,
            userCount: server.subscriberCount(GLOBAL_CHAT_CHANNEL) - 1,
          })
        );
      }
    },
  },
});

console.log(`Listening on http://localhost:${server.port}`);
