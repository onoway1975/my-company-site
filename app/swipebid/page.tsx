'use client'

import { useState, useEffect } from 'react'
import SwipeBidClient from './SwipeBidClient'

export default function SwipeBidPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null
  return <SwipeBidClient />
}
