import { Header } from '@/components/sections/Header'
import { Hero, HeroBackdrop } from '@/components/sections/Hero'
import { CardReveal } from '@/components/sections/CardReveal'
import { Features } from '@/components/sections/Features'
import { ExploreCards } from '@/components/sections/ExploreCards'
import { Steps } from '@/components/sections/Steps'
import { Cta } from '@/components/sections/Cta'
import { UseCases } from '@/components/sections/UseCases'
import { Socials } from '@/components/sections/Socials'
import { Faq } from '@/components/sections/Faq'
import { Footer } from '@/components/sections/Footer'

export default function App() {
  return (
    <>
      <Header />
      <main className="root">
        <div className="relative w-screen max-w-full">
          <HeroBackdrop />
          <Hero />
          <CardReveal />
          <Features />
          <ExploreCards />
          <Steps />
          <Cta />
          <UseCases />
          <Socials />
        </div>
      </main>
      <Faq />
      <Footer />
    </>
  )
}
