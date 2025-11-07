'use client'
import { useEffect} from "react"
import { useRouter } from "next/navigation"
import { isAuthEnabled } from "@/lib/auth"

const HomePage = () => {
  const router = useRouter()
  useEffect(() => {
    if (isAuthEnabled()) {
      router.push('/login')
    } else {
      router.push('/dashboard')
    }
  }, [])
  return (
    <div>HomePage</div>
  )
}

export default HomePage