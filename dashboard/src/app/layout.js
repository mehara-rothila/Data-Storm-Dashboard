export const metadata = {
  title: 'Data Storm Dashboard - Insurance Agent NILL Prediction',
  description: 'Advanced dashboard for insurance agent NILL prediction analysis',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
          rel="stylesheet"
        />
      </head>
      <body className="bg-gray-50">
        {children}
      </body>
    </html>
  );
}