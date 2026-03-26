import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import leftarrow from '../../Assets/sofa_session/leftarrow.svg'
import rightarrow from '../../Assets/sofa_session/rightarrow.svg'

const SLOTS = [
    { x: -720, scale: 0.6, opacity: 0.4, zIndex: 1 },
    { x: -380, scale: 0.75, opacity: 0.7, zIndex: 2 },
    { x: 0, scale: 1, opacity: 1, zIndex: 3 },
    { x: 380, scale: 0.75, opacity: 0.7, zIndex: 2 },
    { x: 720, scale: 0.6, opacity: 0.4, zIndex: 1 },
]

const OFF_LEFT = -1100
const OFF_RIGHT = 1100

function mod(n, m) {
    return ((n % m) + m) % m
}

export default function RealCarousel({ pageContent, loaded }) {
    const content = pageContent || {}
    const allSlots = [
        content.carousel_img1,
        content.carousel_img2,
        content.carousel_img3,
        content.carousel_img4,
        content.carousel_img5,
        content.carousel_img6,
        content.carousel_img7,
        content.carousel_img8,
    ]
    const images = allSlots.filter(Boolean)
    const n = images.length
    const [step, setStep] = useState(0)
    const [dir, setDir] = useState(1)

    const next = () => {
        setDir(1)
        setStep((p) => p + 1)
    }
    const prev = () => {
        setDir(-1)
        setStep((p) => p - 1)
    }

    const visible = useMemo(() => {
        if (n === 0) return []
        return [-2, -1, 0, 1, 2].map((offset) => {
            const logicalPos = step + offset
            const idx = mod(logicalPos, n)
            return { key: logicalPos, src: images[idx], slot: offset + 2 }
        })
    }, [step, n])

    const enterFrom = dir === 1 ? OFF_RIGHT : OFF_LEFT
    const exitTo = dir === 1 ? OFF_LEFT : OFF_RIGHT

    if (!loaded || n === 0) {
        return (
            <div className="mt-10 flex w-full flex-col items-center justify-center" style={{ minHeight: '500px' }} />
        )
    }

    return (
        <div className="relative z-10 mt-10 flex w-full flex-col items-center justify-center overflow-hidden">
            <div className="relative mt-10 flex min-h-125 w-full items-center justify-center overflow-hidden">
                <AnimatePresence initial={false}>
                    {visible.map(({ key, src, slot }) => {
                        const s = SLOTS[slot]

                        return (
                            <motion.img
                                key={key}
                                src={src}
                                alt=""
                                className="absolute rounded-2xl object-contain drop-shadow-2xl"
                                style={{ zIndex: s.zIndex, width: '360px', height: '360px' }}
                                initial={{ x: enterFrom, scale: s.scale, opacity: 0 }}
                                animate={{ x: s.x, scale: s.scale, opacity: s.opacity }}
                                exit={{ x: exitTo, scale: s.scale, opacity: 0 }}
                                transition={{
                                    duration: 0.5,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                            />
                        )
                    })}
                </AnimatePresence>
            </div>

            <div className="mt-10 flex">
                <button onClick={prev} className="px-4 py-2">
                    <img src={leftarrow} alt="left" />
                </button>
                <button onClick={next} className="px-4 py-2">
                    <img src={rightarrow} alt="right" />
                </button>
            </div>
        </div>
    )
}
