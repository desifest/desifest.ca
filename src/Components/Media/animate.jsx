import { useEffect, useRef, useCallback } from 'react'

import Blackandwhite from '@/Assets/media/bw.svg'
import Rgbbg from '@/Assets/media/color.svg'

import achanteMusic1 from '@/Assets/media/images30/achante music1.jpg'
import achanteMusic2 from '@/Assets/media/images30/achante music2.jpg'
import achante3 from '@/Assets/media/images30/achante3.jpg'

import bollywoodDuets1 from '@/Assets/media/images30/bollywood duets1.jpg'
import bollywoodDuets2 from '@/Assets/media/images30/bollywood duets2.jpg'
import bollywoodDuets3 from '@/Assets/media/images30/bollywood duets3.jpg'

import desiriff1 from '@/Assets/media/images30/desiriff1.jpg'
import desiriff2 from '@/Assets/media/images30/desiriff2.jpg'
import desiriff3 from '@/Assets/media/images30/desiriff3.jpg'

import kalakaar1 from '@/Assets/media/images30/kalakaar1.jpg'
import kalakaar2 from '@/Assets/media/images30/kalakaar2.jpg'
import kalakaar3 from '@/Assets/media/images30/kalakaar3.jpg'

import landygarcia1 from '@/Assets/media/images30/landygarcia1.jpg'
import landygarcia2 from '@/Assets/media/images30/landygarcia2.jpg'
import landygarcia3 from '@/Assets/media/images30/landygarcia3.jpg'

import masterD1 from '@/Assets/media/images30/masterD1.jpg'
import masterD2 from '@/Assets/media/images30/masterd2.jpg'
import masterD3 from '@/Assets/media/images30/masterd3.jpg'

import musebox1 from '@/Assets/media/images30/musebox1.jpg'
import musebox2 from '@/Assets/media/images30/musebox2.jpg'
import musebox3 from '@/Assets/media/images30/musebox3.jpg'

import queensOfBollywood1 from '@/Assets/media/images30/queens of bollywood1.jpg'
import queensOfBollywood2 from '@/Assets/media/images30/queens of bollywood2.jpg'
import queensOfBollywood3 from '@/Assets/media/images30/queens of bollywood3.jpg'

import spitty1 from '@/Assets/media/images30/spitty1.jpg'
import spitty2 from '@/Assets/media/images30/spitty2.jpg'
import spitty3 from '@/Assets/media/images30/spitty3.jpg'

import yanchan1 from '@/Assets/media/images30/yanchan1.jpg'
import yanchan2 from '@/Assets/media/images30/yanchan2.jpg'
import yanchan3 from '@/Assets/media/images30/yanchan3.jpg'

// ---------------------------------------------------------------------------
// Images — 5 columns, 5-6 images each
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Images — 5 columns, 6 images each (random distribution)
// ---------------------------------------------------------------------------

const col1 = [achanteMusic1, bollywoodDuets2, desiriff3, kalakaar1, landygarcia2, spitty3]

const col2 = [musebox1, masterD2, queensOfBollywood3, yanchan1, bollywoodDuets1, kalakaar3]

const col3 = [desiriff1, achanteMusic2, landygarcia1, masterD3, musebox2, spitty1]

const col4 = [queensOfBollywood1, yanchan2, bollywoodDuets3, kalakaar2, desiriff2, achante3]

const col5 = [masterD1, musebox3, landygarcia3, spitty2, queensOfBollywood2, yanchan3]

const columns = [col1, col2, col3, col4, col5]

// ---------------------------------------------------------------------------
// How far each column is pulled UP initially (staggered look)
// ---------------------------------------------------------------------------
const INITIAL_OFFSETS_PX = [300, 600, 250, 500, 380]

// Parallax speed multiplier per column
const SPEEDS = [1.8, 3.0, 1.2, 2.7, 2.1]

// ---------------------------------------------------------------------------
// Column
// ---------------------------------------------------------------------------
const Column = ({ images, colRef }) => (
    <div ref={colRef} className="flex flex-col gap-3" style={{ willChange: 'transform' }}>
        {images.map((src, i) => (
            <div
                key={i}
                className={`w-full shrink-0 overflow-hidden ${i % 2 === 0 ? 'h-96' : 'h-80'}`}
            >
                <img
                    src={src}
                    alt="gallery"
                    draggable={false}
                    className="pointer-events-none h-full w-full object-cover"
                />
            </div>
        ))}
    </div>
)

// ---------------------------------------------------------------------------
// Hint
// ---------------------------------------------------------------------------
const Hint = ({ label }) => (
    <div className="absolute top-[10%] left-1/2 -translate-x-1/2 text-center">
        <span className="relative inline-block max-w-[12ch] text-xs leading-tight tracking-widest text-black uppercase opacity-40">
            {label}
            <span className="absolute top-full left-1/2 mt-3 h-16 w-px -translate-x-1/2 bg-gradient-to-b from-black to-transparent" />
        </span>
    </div>
)

// ---------------------------------------------------------------------------
// Skiper30
// ---------------------------------------------------------------------------
const Skiper30 = () => {
    const galleryRef = useRef(null)
    const colRefs = useRef([])
    const rafRef = useRef(null)

    const tick = useCallback(() => {
        const gallery = galleryRef.current
        if (!gallery) {
            rafRef.current = requestAnimationFrame(tick)
            return
        }

        const rect = gallery.getBoundingClientRect()
        const vh = window.innerHeight

        const progress = Math.max(0, Math.min(1, -rect.top / (rect.height + vh)))

        colRefs.current.forEach((el, i) => {
            if (!el) return

            // Amount gallery has moved upward
            const galleryOffset = -rect.top

            // Parallax: column moves slower than gallery
            const translateY = -INITIAL_OFFSETS_PX[i] + galleryOffset * (SPEEDS[i] * 0.2)

            el.style.transform = `translateY(${translateY}px)`
        })
        rafRef.current = requestAnimationFrame(tick)
    }, [])

    useEffect(() => {
        rafRef.current = requestAnimationFrame(tick)
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
        }
    }, [tick])

    return (
        <main className="w-full overflow-x-hidden text-black">
            <div className="relative w-full overflow-hidden">
                {/* Centering container */}
                <div className="flex justify-center">
                    <div
                        ref={galleryRef}
                        className="relative flex h-[100vh] gap-6 bg-transparent md:h-[200vh]"
                    >
                        {columns.map((imgs, i) => (
                            <div key={i} className="w-[150px] shrink-0 md:w-[300px]">
                                <Column images={imgs} colRef={(el) => (colRefs.current[i] = el)} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Skiper30
