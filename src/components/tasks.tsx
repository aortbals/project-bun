import type { Task } from "@/db/queries";

export function Tasks({ tasks }: { tasks: Task[] }) {
  return (
    <>
      <form method="POST">
        <div>
          <div className="mt-2 flex rounded-md shadow-sm">
            <div className="relative flex flex-grow items-stretch focus-within:z-10">
              <input
                id="task"
                name="task"
                type="text"
                placeholder="Add task"
                className="block w-full rounded-none rounded-l-md border-0 px-2.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="bg-white relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 inline-flex items-center"
            >
              <div aria-hidden="true" className="text-gray-400">
                +
              </div>
              Add Task
            </button>
          </div>
        </div>
      </form>
      <form
        method="POST"
        action="/tasks/delete"
        className="mt-4 border border-gray-200 rounded-md overflow-hidden"
      >
        <ol className="divide-y divide-gray-200 bg-white">
          {tasks.map((t) => (
            <li key={t.id} className="flex justify-between px-3 py-2 text-sm">
              <div className="text-gray-900">{t.task}</div>
              <button name="id" value={t.id} aria-label="Remove task">
                &times;
              </button>
            </li>
          ))}
        </ol>
      </form>
    </>
  );
}
