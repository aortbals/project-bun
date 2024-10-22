import { Layout } from "@/components/layout";
import { Tasks } from "@/components/tasks";
import { listTasks, type Task } from "@/db/queries";
import { Root } from "@/pages/root";

export default function TasksPage({ tasks }: { tasks: Task[] }) {
  return (
    <Root title="Tasks - Project Bun">
      <Layout title="Tasks">
        <div className="max-w-xl mx-auto">
          <p className="text-sm text-gray-500 mb-10">
            This component shows a simple list of tasks that are managed via a
            traditional form POST and stored in a SQLite database.
          </p>
          <Tasks tasks={tasks} />
        </div>
      </Layout>
    </Root>
  );
}
