// app/layout.js
import '../styles/global.css';
import React from 'react';
import SessionProviderWrapper from '@/components/Provider';

export const metadata = {
  title: "MHRS",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProviderWrapper>
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
