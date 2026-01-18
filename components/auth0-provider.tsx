"use client"

import React from "react"
import { Auth0Provider as Auth0ProviderBase } from "@auth0/nextjs-auth0/client"

export function Auth0Provider({ children }: { children: React.ReactNode }) {
  return <Auth0ProviderBase>{children}</Auth0ProviderBase>
}
