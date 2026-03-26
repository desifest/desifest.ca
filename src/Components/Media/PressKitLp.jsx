import { useEffect, useRef, useCallback } from 'react'

import Blackandwhite from '@/Assets/media/bw.svg'
import Rgbbg from '@/Assets/media/color.svg'
// ---------------------------------------------------------------------------
// Images — 5 columns, 5-6 images each
// ---------------------------------------------------------------------------
const col1 = [Blackandwhite, Rgbbg, Blackandwhite, Rgbbg, Blackandwhite]

const col2 = [Rgbbg, Blackandwhite, Rgbbg, Blackandwhite, Rgbbg, Blackandwhite]

const col3 = [Blackandwhite, Rgbbg, Blackandwhite, Rgbbg, Blackandwhite]

const columns = [col1, col2, col3]

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
                    <div ref={galleryRef} className="relative flex md:h-[200vh] h-[150vh] gap-6 bg-transparent">
                        {columns.map((imgs, i) => (
                            <div key={i} className="md:w-[300px] w-[150px]  shrink-0">
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
