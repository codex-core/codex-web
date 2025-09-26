"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { PasswordlessContextProvider } from '@/lib/cognito-react';
import { Passwordless } from '@/lib/cognito-react/common'

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export function PasswordlessProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  Passwordless.configure({
      cognitoIdpEndpoint: process.env.NEXT_PUBLIC_COGNITO_IDP_ENDPOINT ?? 'us-east-1',
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID as string,
      fido2: {
        baseUrl: process.env.NEXT_PUBLIC_FIDO2_BASE_URL as string,
        authenticatorSelection: {
          userVerification: "required",
        },
      },
      debug: console.debug,
    });
  return (
    <PasswordlessContextProvider>
      {children}
    </PasswordlessContextProvider>
  );
}