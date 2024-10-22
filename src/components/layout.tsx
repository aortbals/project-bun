import { BunLogo } from "@/components/bun";

const navigation = [
  { title: "Counter", href: "/" },
  { title: "Tasks", href: "/tasks" },
  { title: "Chat", href: "/chat" },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function Layout({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <div className="min-h-full flex flex-col justify-between">
      <nav className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="inline-flex items-center">
              <div className="flex-shrink-0 text-white text-sm inline-flex items-center">
                <BunLogo />
              </div>
              <div>
                <div className="ml-10 flex items-baseline space-x-4">
                  {navigation.map((item) => (
                    <a
                      key={item.title}
                      href={item.href}
                      aria-current={item.title === title ? "page" : undefined}
                      className={classNames(
                        item.title === title
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "rounded-md px-3 py-2 text-sm font-medium"
                      )}
                    >
                      {item.title}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      <div className="text-center text-sm text-gray-500 p-4">
        Project Bun is an experiment exploring a minimal Bun app that uses core
        Bun APIs and as few dependencies as possible.
      </div>
    </div>
  );
}
