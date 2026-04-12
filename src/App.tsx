import { useState } from 'react'
import HomeScreen from './components/HomeScreen'
import Onboarding from './components/Onboarding'

export default function App() {
  const [onboardingDone, setOnboardingDone] = useState(
    () => localStorage.getItem('manna_onboarding_done') === 'true'
  )

  if (!onboardingDone) {
    return <Onboarding onComplete={() => setOnboardingDone(true)} />
  }

  return <HomeScreen />
}
