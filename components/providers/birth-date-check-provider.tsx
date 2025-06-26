"use client"

import { useBirthDateCheck } from "@/hooks/use-birth-date-check"

export function BirthDateCheckProvider() {
  const { BirthDateCheck } = useBirthDateCheck()
  
  return <BirthDateCheck />
}