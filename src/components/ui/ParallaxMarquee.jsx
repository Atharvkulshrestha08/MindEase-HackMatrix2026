import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring, useVelocity, useAnimationFrame, useMotionValue } from 'framer-motion'

// Simple wrap function to replace @motionone/utils
const wrap = (min, max, v) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

function ParallaxText({ children, baseVelocity = 100 }) {
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  })
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false
  })

  // Magic numbers for wrapping based on text length and repetitions.
  // We wrap between -20% and -45% so the infinite scroll works smoothly.
  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`)
  const directionFactor = useRef(1)

  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000)

    // Change direction if scroll velocity goes opposite
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get()
    baseX.set(baseX.get() + moveBy)
  })

  return (
    <div className="parallax-marquee overflow-hidden m-0 whitespace-nowrap flex flex-nowrap" style={{ letterSpacing: '-2px', lineHeight: '0.8' }}>
      <motion.div className="scroller flex flex-nowrap gap-12 font-bold uppercase text-[6rem] md:text-[10rem]" style={{ x, color: 'var(--on-surface)', opacity: 0.05 }}>
        <span className="block mr-12">{children}</span>
        <span className="block mr-12">{children}</span>
        <span className="block mr-12">{children}</span>
        <span className="block mr-12">{children}</span>
      </motion.div>
    </div>
  )
}

const MentalHealthWall = () => {
  return (
    <section className="relative py-24 overflow-hidden rounded-[40px] mt-12 bg-[#08060d] text-white">
      {/* Decorative gradient orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px] pointer-events-none" 
           style={{ background: 'radial-gradient(circle, rgba(170, 59, 255, 0.15) 0%, rgba(0, 100, 145, 0.15) 100%)' }} />
           
      <div className="relative z-10">
        <ParallaxText baseVelocity={-2}>AWARENESS &bull; HEALING &bull; RESILIENCE &bull;</ParallaxText>
        <ParallaxText baseVelocity={2}>MINDFULNESS &bull; EMPATHY &bull; GROWTH &bull;</ParallaxText>
        <ParallaxText baseVelocity={-2}>STRENGTH &bull; CONNECTION &bull; BALANCE &bull;</ParallaxText>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
        <h2 className="text-3xl md:text-5xl font-bold text-center tracking-tight text-white mix-blend-overlay">
          Break The Stigma
        </h2>
        <p className="mt-4 text-white/60 max-w-lg text-center mix-blend-overlay">
          1 in 4 people will be affected by mental or neurological disorders at some point in their lives. You are not alone.
        </p>
      </div>
    </section>
  )
}

export default MentalHealthWall
