// app/ui.tsx
"use client"
import { useSession } from "next-auth/react"

import { Navbar } from "@/components/layouts/Navbar"

// import { Badge } from "@/components/ui/badge"
// import { MdMessage, MdPeopleAlt } from 'react-icons/md'
import Link from "next/link"
import Footer from "../components/layouts/Footer"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"

export default function Home() {
  const { status } = useSession()
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <Navbar />

      <div className="max-w-6xl mx-auto py-8 px-4">
        {status === "loading" && <p className="text-center">Loading...</p>}

        {status === "unauthenticated" && (
          <div className="text-center">
            <p className="mb-4">Please sign in to access the chat rooms.</p>
            <Button
              asChild
              className="bg-indigo-600 text-indigo-50 hover:bg-indigo-700"
            >
              <Link href="/api/auth/signin">Sign In</Link>
            </Button>
            <Footer />
          </div>
        )}

        {status === "authenticated" && (
          <Card className="bg-slate-800 border-slate-700 pt-6 pb-0">
            <CardContent className="h-[80vh]"></CardContent>
          </Card>
        )}
        <p className="font-bold text-center mt-6">
          Developed by{" "}
          <span className="text-indigo-400 hover:text-indigo-500">
            <Link href="https://abidalwassie.me/" target="_blank">
              Abid Al Wassie
            </Link>
          </span>
        </p>
      </div>
    </div>
  )
}
