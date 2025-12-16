"use client";

import React from "react";
import { ThemeProvider } from "./components/ThemeProvider";
import Header from "./components/Header";
import Footer from "./components/Footer";
import GlobalStyles from "src/styles/GlobalStyles";
import StyledComponentsRegistry from "lib/registry";
import Provider from "./StoreProvider";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "./lib/store";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <Provider>
          <PersistGate persistor={persistor} loading={null}>
            <StyledComponentsRegistry>
              <GlobalStyles />

              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
              >
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <main className="flex-1 p-3">{children}</main>
                  <Footer />
                </div>
              </ThemeProvider>
            </StyledComponentsRegistry>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
