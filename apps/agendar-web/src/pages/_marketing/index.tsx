import { createFileRoute } from "@tanstack/react-router"

import { About } from "./-components/about"
import { FAQ } from "./-components/faq"
import { Features } from "./-components/features"
import { Footer } from "./-components/footer"
import { Hero } from "./-components/hero"
import { MarketingHeader } from "./-components/marketing-header"
import { Pricing } from "./-components/pricing"
import { TrainingVideos } from "./-components/training-videos"
import { WhyUse } from "./-components/why-use"

export const Route = createFileRoute("/_marketing/")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col min-h-svh w-full">
      <MarketingHeader />

      <Hero />

      <div id="about">
        <About />
      </div>

      <div id="features">
        <Features />
      </div>

      <div id="why-use">
        <WhyUse />
      </div>

      <div id="pricing">
        <Pricing />
      </div>

      <div id="training-videos">
        <TrainingVideos />
      </div>

      <div id="faq">
        <FAQ />
      </div>

      <Footer />
    </div>
  )
}
