// src/styles/GlobalStyles.tsx
"use client";
import React from "react";
import { createGlobalStyle } from "styled-components";
import tw, { theme, GlobalStyles as BaseStyles } from "twin.macro";

const CustomStyles = createGlobalStyle({
  html: {
    minHeight: "100%",
  },
  body: {
    WebkitTapHighlightColor: theme`colors.customTheme`,
    minHeight: "100vh",
    backgroundAttachment: "fixed",

    background: `
      radial-gradient(
        circle at 15% 20%,
        rgba(250, 228, 228, 0.9) 0%,
        transparent 45%
      ),
      radial-gradient(
        circle at 85% 25%,
        rgba(224, 242, 254, 0.9) 0%,
        transparent 45%
      ),
      radial-gradient(
        circle at 30% 80%,
        rgba(255, 241, 242, 0.9) 0%,
        transparent 50%
      ),
      linear-gradient(
        to right,
        #f8f6dbe5 0%,
        #fafbff 100%
      )
    `,

    ...tw`antialiased`,
  },
});

const GlobalStyles = () => (
  <>
    <BaseStyles />
    <CustomStyles />
  </>
);

export default GlobalStyles;
