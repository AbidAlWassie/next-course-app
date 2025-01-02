// src/components/ui/EnrollButton.tsx
"use client"

import { removeCourse } from "@/actions/actions"
import React from "react"

interface EnrollButtonProps {
  courseId: string
  userEmail: string
}

const RemoveCourseButton: React.FC<EnrollButtonProps> = ({
  courseId,
  userEmail,
}) => {
  const handleEnroll = async () => {
    try {
      await removeCourse(courseId, userEmail)
      // alert('Removed course successfully');
      window.location.reload()
    } catch (error) {
      console.error("Error enrolling in course:", error)
      // alert('Failed to remove course');
    }
  }

  return (
    <button
      onClick={handleEnroll}
      className="float-right px-3 py-1 bg-red-600 text-white rounded"
    >
      Remove
    </button>
  )
}

export default RemoveCourseButton
