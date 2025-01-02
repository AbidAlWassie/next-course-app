import Loading from "@/components/Loading"
import SessionProvider from "@/components/SessionProvider"
import { Suspense } from "react"
import HomeUI from "./ui"

export default function Home() {
  return (
    <SessionProvider>
      <Suspense fallback={<Loading />}>
        <HomeUI />
      </Suspense>
    </SessionProvider>
  )
}
