import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Home() {
  const router = useRouter()
  useEffect(() => {
    if(localStorage.getItem('TOKEN'))
      router.push('/dashboard')
    else
    router.push('/auth/signin')
  }, [])
  return <div></div>
}
