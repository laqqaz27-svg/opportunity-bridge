import CommunityImpact from '../components/CommunityImpact'
import Hero from '../components/Hero'
import ImpactStats from '../components/ImpactStats'
import SuccessStories from '../components/SuccessStories'
import ValueGrid from '../components/ValueGrid'

function HomePage() {
  return (
    <main>
      <Hero />
      <ValueGrid />
      <ImpactStats />
      <SuccessStories />
      <CommunityImpact />
    </main>
  )
}

export default HomePage
