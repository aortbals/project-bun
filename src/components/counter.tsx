export function Counter({ count }: { count: number }) {
  return (
    <form method="POST">
      <span className="isolate inline-flex rounded-md shadow-sm">
        <button
          name="diff"
          value="-1"
          aria-label="decrement"
          className="relative inline-flex items-center rounded-l-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
        >
          -
        </button>
        <output className="relative -ml-px inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-500 ring-1 ring-inset ring-gray-300 focus:z-10">
          {count}
        </output>
        <button
          name="diff"
          value="+1"
          aria-label="increment"
          className="relative -ml-px inline-flex items-center rounded-r-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
        >
          +
        </button>
      </span>
    </form>
  );
}
