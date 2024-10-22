import { Counter } from "@/components/counter";
import { Layout } from "@/components/layout";
import { Root } from "@/pages/root";

export function CounterPage({ count }: { count: number }) {
  return (
    <Root title="Counter - Project Bun">
      <Layout title="Counter">
        <div className="max-w-xl mx-auto">
          <p className="text-sm text-gray-500 mb-10">
            This component shows a simple counter that is updated via a
            traditional form POST, all rendered via Bun and React on the server.
          </p>
          <div className="flex justify-center mt-4">
            <Counter count={count} />
          </div>
        </div>
      </Layout>
    </Root>
  );
}
