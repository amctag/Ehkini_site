import "./globals.css";

export const metadata = {
  title: "E7kini",
  description: "E7kini login"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
