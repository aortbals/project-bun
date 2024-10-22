import { Chat } from "@/components/chat";
import { Layout } from "@/components/layout";

export function ChatPage() {
  return (
    <Layout title="Chat">
      <div className="max-w-xl mx-auto">
        <p className="text-sm text-gray-500 mb-4">
          This uses the built-in WebSocket support in Bun to create a simple
          chat application. It also has a minimal client-side React bundle using
          Bun's build API.
        </p>
        <Chat />
      </div>
    </Layout>
  );
}
