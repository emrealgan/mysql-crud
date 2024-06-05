import '../styles/global.css'
import React from 'react';
export const metadata = {
  title: "MHRS",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body >{children}</body>
    </html>
  );
}
