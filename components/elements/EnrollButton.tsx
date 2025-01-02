"use client"

import { enrollCourse } from "@/actions/actions"
import React, { useState } from "react"

interface EnrollButtonProps {
  courseId: string
  userEmail: string
}

const EnrollButton: React.FC<EnrollButtonProps> = ({ courseId, userEmail }) => {
  const [message, setMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<"success" | "error" | null>(
    null
  )

  const handleEnroll = async () => {
    try {
      await enrollCourse(courseId, userEmail)
      setMessage("Enrolled successfully ✔️")
      setMessageType("success")
      window.location.reload()
    } catch (error) {
      console.error("Error enrolling in course:", error)
      setMessage("Already added ❌")
      setMessageType("error")
    }
  }

  return (
    <div className="flex">
      {message && (
        <div
          className={`p-2 rounded mr-2 justify-start items-start ${
            messageType === "success" ? "bg-blue-600" : "bg-red-600"
          } text-white`}
        >
          {message}
        </div>
      )}
      <button
        onClick={handleEnroll}
        className="float-right px-3 py-2 bg-indigo-600 text-white rounded"
      >
        Enroll
      </button>
    </div>
  )
}

export default EnrollButton
