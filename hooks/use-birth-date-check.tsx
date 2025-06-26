"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import axios from "axios"
import { BirthDateModal } from "@/components/arcana/auth/birth-date-modal"

export function useBirthDateCheck() {
  const { data: session, status } = useSession()
  const [showBirthDateModal, setShowBirthDateModal] = useState(false)
  const [isChecking, setIsChecking] = useState(false)

  useEffect(() => {
    // Only check if user is authenticated and not already checking
    if (status === "authenticated" && !isChecking) {
      checkUserBirthDate()
    }
  }, [status])

  const checkUserBirthDate = async () => {
    // Don't check if modal is already dismissed in this session
    const hasUserDismissedModal = localStorage.getItem("birthDateModalDismissed") === "true"
    if (hasUserDismissedModal) {
      return
    }

    try {
      setIsChecking(true)
      const response = await axios.get("/api/user/astrology")

      if (response.data.success) {
        // If user doesn't have a profile or doesn't have a date of birth, show the modal
        if (!response.data.data || !response.data.data.dateOfBirth) {
          setShowBirthDateModal(true)
        }
      }
    } catch (error) {
      console.error("Error checking user birth date:", error)
    } finally {
      setIsChecking(false)
    }
  }

  // Component to be rendered in layout
  const BirthDateCheck = () => {
    return (
      <BirthDateModal 
        open={showBirthDateModal} 
        onOpenChange={setShowBirthDateModal} 
      />
    )
  }

  return {
    BirthDateCheck,
    isChecking
  }
}