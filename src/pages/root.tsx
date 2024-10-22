export function Root({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-gray-100">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://cdn.tailwindcss.com?plugins=forms"></script>
        <script src="/client.js" type="module" defer></script>
        <title>{title}</title>
      </head>
      <body className="h-full">
        <div className="h-full font-sans antialiased" id="root">
          {children}
        </div>
      </body>
    </html>
  );
}
