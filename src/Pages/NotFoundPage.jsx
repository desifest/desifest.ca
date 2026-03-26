import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import SEO from '@/Components/SEO'

import img1 from '@/Assets/artist/Silder/Silder1.png'
import img2 from '@/Assets/artist/Silder/Silder3.png'
import img3 from '@/Assets/artist/Silder/Silder5.png'
import img4 from '@/Assets/artist/Silder/Silder11.png'
import img5 from '@/Assets/artist/Silder/Silder13.png'
import img6 from '@/Assets/artist/Silder/Silder2.1.png'
import img7 from '@/Assets/artist/Silder/Silder2.2.png'
import img8 from '@/Assets/artist/Silder/Silder2.3.png'
import img9 from '@/Assets/artist/Silder/Silder4.1.png'
import img10 from '@/Assets/artist/Silder/Silder4.2.png'
import img11 from '@/Assets/artist/Silder/Silder6.1.png'
import img12 from '@/Assets/artist/Silder/Silder6.2.png'
import img13 from '@/Assets/artist/Silder/Silder10.1.png'
import img14 from '@/Assets/artist/Silder/Silder10.2.png'
import img15 from '@/Assets/artist/Silder/Silder12.1.png'
import img16 from '@/Assets/artist/Silder/Silder12.2.png'
import img17 from '@/Assets/artist/Featured/image 1.png'
import img18 from '@/Assets/artist/Featured/image 2.png'
import img19 from '@/Assets/artist/Featured/image 3.png'
import img20 from '@/Assets/about/col2img.png'
import img21 from '@/Assets/about/col3img.png'
import img22 from '@/Assets/about/image.png'
import img23 from '@/Assets/artist/Silder/Silder4.3.png'
import img24 from '@/Assets/artist/Silder/Silder6.3.png'
import img25 from '@/Assets/artist/Silder/Silder10.3.png'
import img26 from '@/Assets/artist/Silder/Silder2.4.png'
import img27 from '@/Assets/artist/Silder/Silder4.4.png'
import img28 from '@/Assets/artist/Silder/Silder12.3.png'

const allImages = [
    img1, img2, img3, img4, img5, img6, img7, img8, img9, img10,
    img11, img12, img13, img14, img15, img16, img17, img18, img19, img20,
    img21, img22, img23, img24, img25, img26, img27, img28,
]

const FOUR_1 = [
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [0, 0, 0, 1],
    [0, 0, 0, 1],
]

const ZERO = [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
]

const FOUR_2 = FOUR_1

const DIGITS = [FOUR_1, ZERO, FOUR_2]

const rotations = [
    'rotate-[-3deg]', 'rotate-[2deg]', 'rotate-[-1deg]', 'rotate-[3deg]',
    'rotate-[-2deg]', 'rotate-[1deg]', 'rotate-[-4deg]', 'rotate-[2deg]',
    'rotate-[0deg]', 'rotate-[-3deg]', 'rotate-[4deg]', 'rotate-[-1deg]',
    'rotate-[2deg]', 'rotate-[-2deg]', 'rotate-[3deg]', 'rotate-[-3deg]',
]

export default function NotFoundPage() {
    const cells = useMemo(() => {
        let imgIndex = 0
        const result = []
        DIGITS.forEach((digit, dIdx) => {
            digit.forEach((row, rIdx) => {
                row.forEach((cell, cIdx) => {
                    if (cell === 1) {
                        result.push({
                            key: `${dIdx}-${rIdx}-${cIdx}`,
                            col: dIdx * 5 + cIdx,
                            row: rIdx,
                            img: allImages[imgIndex % allImages.length],
                            rot: rotations[imgIndex % rotations.length],
                        })
                        imgIndex++
                    }
                })
            })
        })
        return result
    }, [])

    return (
        <div className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden bg-[#100422] px-4 pt-28 pb-16 text-center sm:pt-32 sm:pb-20">
            <SEO title="Page Not Found" description="The page you're looking for doesn't exist or has been moved." />
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/6 blur-[150px]" />
                <div className="absolute top-1/4 right-1/3 h-[300px] w-[300px] rounded-full bg-purple-600/8 blur-[100px]" />
                <div className="absolute bottom-1/3 left-1/3 h-[250px] w-[250px] rounded-full bg-blue-500/6 blur-[80px]" />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-8 sm:gap-10">
                <div className="relative">
                    <div className="pointer-events-none absolute -inset-10 rounded-3xl bg-white/8 blur-[60px]" />
                    <div
                        className="relative grid gap-1.5 sm:gap-2"
                    style={{
                        gridTemplateColumns: `repeat(14, 1fr)`,
                        gridTemplateRows: `repeat(5, 1fr)`,
                    }}
                >
                    {Array.from({ length: 14 * 5 }).map((_, i) => {
                        const col = i % 14
                        const row = Math.floor(i / 14)

                        let digitIdx, localCol
                        if (col < 4) {
                            digitIdx = 0
                            localCol = col
                        } else if (col === 4) {
                            return <div key={i} className="h-8 w-8 sm:h-12 sm:w-12 md:h-14 md:w-14" />
                        } else if (col < 9) {
                            digitIdx = 1
                            localCol = col - 5
                        } else if (col === 9) {
                            return <div key={i} className="h-8 w-8 sm:h-12 sm:w-12 md:h-14 md:w-14" />
                        } else {
                            digitIdx = 2
                            localCol = col - 10
                        }

                        const isFilled = DIGITS[digitIdx]?.[row]?.[localCol] === 1

                        if (!isFilled) {
                            return <div key={i} className="h-8 w-8 sm:h-12 sm:w-12 md:h-14 md:w-14" />
                        }

                        const cell = cells.find(
                            (c) => c.col === (digitIdx * 5 + localCol) && c.row === row
                        )
                        if (!cell) return <div key={i} className="h-8 w-8 sm:h-12 sm:w-12 md:h-14 md:w-14" />

                        return (
                            <div
                                key={i}
                                className={`h-8 w-8 overflow-hidden rounded-sm shadow-lg shadow-black/40 sm:h-12 sm:w-12 sm:rounded-md md:h-14 md:w-14 ${cell.rot}`}
                            >
                                <img
                                    src={cell.img}
                                    alt=""
                                    className="h-full w-full object-cover"
                                    loading="eager"
                                />
                            </div>
                        )
                    })}
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <h1 className="oswald-500 text-2xl tracking-wide text-white uppercase sm:text-3xl">
                        Page not found
                    </h1>
                    <p className="dm-sans-400 max-w-md text-base text-white/60 sm:text-lg">
                        The page you're looking for doesn't exist or has been moved. Let's get you back to the festival.
                    </p>
                </div>

                <Link
                    to="/"
                    className="oswald-500 inline-block rounded-sm bg-[#EEFE08] px-10 py-3 text-lg tracking-wider text-[#100422] uppercase transition-all hover:bg-[#d4e000] hover:shadow-[0_0_30px_rgba(238,254,8,0.3)]"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    )
}
