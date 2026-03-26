// import React from 'react'
// import lineup from '../../Assets/concerts/artistlineupwb.svg'
// import lineupbg from '../../Assets/concerts/artistlineupbg.svg'
// import { useEffect, useRef } from 'react'
// const ArtistLineup = ({ scrollY }) => {
//     const cardRefs = useRef([])
//     // Artist data - replace image paths with your actual images
//     const artists = [
//         {
//             id: 1,
//             name: 'MUSE BOX',
//             handle: '@musebox.photographer',
//             image: lineup,
//             top: '15%',
//             left: '0%',
//         },
//         {
//             id: 2,
//             name: 'MUSE BOX',
//             handle: '@musebox.photographer',
//             image: lineup,
//             top: '5%',
//             right: '0%',
//         },
//         {
//             id: 3,
//             name: 'MUSE BOX',
//             handle: '@musebox.photographer',
//             image: lineup,
//             top: '23%',
//             right: '12%',
//         },
//         {
//             id: 4,
//             name: 'MUSE BOX',
//             handle: '@musebox.photographer',
//             image: lineup,
//             top: '32%',
//             left: '0%',
//         },
//         {
//             id: 5,
//             name: 'MUSE BOX',
//             handle: '@musebox.photographer',
//             image: lineup,
//             top: '40%',
//             right: '5%',
//         },
//         {
//             id: 6,
//             name: 'MUSE BOX',
//             handle: '@musebox.photographer',
//             image: lineup,
//             top: '52%',
//             left: '15%',
//         },
//         {
//             id: 7,
//             name: 'MUSE BOX',
//             handle: '@musebox.photographer',
//             image: lineup,
//             top: '60%',
//             right: '0%',
//         },
//         {
//             id: 8,
//             name: 'MUSE BOX',
//             handle: '@musebox.photographer',
//             image: lineup,
//             top: '66%',
//             left: '5%',
//         },
//         {
//             id: 9,
//             name: 'MUSE BOX',
//             handle: '@musebox.photographer',
//             image: lineup,
//             top: '75%',
//             right: '5%',
//         },
//         {
//             id: 10,
//             name: 'MUSE BOX',
//             handle: '@musebox.photographer',
//             image: lineup,
//             top: '84%',
//             left: '6%',
//         },
//         {
//             id: 11,
//             name: 'MUSE BOX',
//             handle: '@musebox.photographer',
//             image: lineup,
//             top: '89%',
//             right: '0%',
//         },
//         {
//             id: 12,
//             name: 'MUSE BOX',
//             handle: '@musebox.photographer',
//             image: lineup,
//             top: '98%',
//             left: '12%',
//         },
//     ]
//     useEffect(() => {
//         const y = scrollY ?? 0

//         cardRefs.current.forEach((el, i) => {
//             if (!el) return

//             // subtle different speeds for depth
//             const speed = 0.1

//             const translate = y * speed

//             el.style.transform = `translateY(-${translate}px)`
//         })
//     }, [scrollY])
//     return (
//         <div className="relative min-h-screen w-full overflow-hidden">
//             {/* Checkered Background Pattern */}
//             <div className="absolute inset-0 opacity-10" />

//             {/* Header */}
//             <section className="px-12">
//                 <div className="flex items-center gap-6">
//                     {/* Left title */}
//                     <h2 className="oswaldd text-3xl font-medium tracking-wide whitespace-nowrap text-white md:text-[100px]">
//                         ARTIST LINEUP
//                     </h2>

//                     {/* Divider line */}
//                     <div className="h-1 flex-1 bg-white" />

//                     {/* Right text */}
//                     <p className="oswald-500 text-sm tracking-widest whitespace-nowrap text-white md:text-2xl">
//                         2026 LINEUP IS <span className="text-neon-yellow">COMING SOON</span>
//                     </p>
//                 </div>
//                 <div className="oswald-300 my-4 text-start text-2xl text-white uppercase">
//                     our 2025 lineUp was.....
//                 </div>
//             </section>

//             {/* MOBILE – vertical list */}
//             <div className="mt-12 block space-y-10 px-4 md:hidden">
//                 {artists.map((artist) => (
//                     <div key={artist.id} className="flex flex-col items-center gap-4 text-center">
//                         <img
//                             src={artist.image}
//                             alt={artist.name}
//                             className="h-[260px] w-[260px] rounded-3xl object-cover"
//                         />

//                         <div>
//                             <h3 className="text-xl font-bold text-white">{artist.name}</h3>
//                             <p className="text-base text-white opacity-80">{artist.handle}</p>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {/* Artist Cards Container */}
//             <div className="relative mx-auto mb-48 hidden h-[2800px] w-full max-w-5xl md:block">
//                 <img
//                     src={lineupbg}
//                     alt="background"
//                     className="absolute inset-0 z-0 h-full w-full object-cover"
//                 />
//                 {artists.map((artist, i) => (
//                     <div
//                         key={artist.id}
//                         ref={(el) => (cardRefs.current[i] = el)}
//                         className="absolute will-change-transform"
//                         style={{
//                             top: artist.top,
//                             left: artist.left,
//                             right: artist.right,
//                         }}
//                     >
//                         <div className="group flex items-center gap-4">
//                             {/* IMAGE WRAPPER */}
//                             <div className="relative rounded-[28px] shadow-none transition-[border-radius,box-shadow] duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:rounded-[140px] group-hover:shadow-xl">
//                                 {/* IMAGE */}
//                                 <div className="relative overflow-hidden rounded-[75px] border-4 border-white transition-[border-radius] duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:rounded-[150px]">
//                                     <img
//                                         src={artist.image}
//                                         alt={artist.name}
//                                         className="h-[280px] w-[280px] object-cover transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105"
//                                     />

//                                     {/* TEXT INSIDE IMAGE */}
//                                 </div>
//                                 <div className="absolute -right-8 bottom-4 z-10 flex translate-y-4 flex-col overflow-visible bg-[#10042299] text-left opacity-0 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-y-0 group-hover:opacity-100 group-hover:delay-150">
//                                     <div className="text-neon-yellow dm-sans-600 text-2xl leading-tight drop-shadow-lg">
//                                         {artist.name}
//                                     </div>
//                                     <div className="dm-sans-400 text-lg text-white drop-shadow-lg">
//                                         {artist.handle}
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* RIGHT TEXT */}
//                             <div className="translate-x-0 border-l-2 border-[#D9D9D9] px-2 text-white opacity-100 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-4 group-hover:opacity-0">
//                                 <h3 className="dm-sans-400 text-2xl font-bold">{artist.name}</h3>
//                                 <p className="dm-sans-400 text-lg">{artist.handle}</p>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     )
// }

// export default ArtistLineup
import React from 'react'
import lineupbg from '../../Assets/concerts/artistlineupbg.svg'

const ArtistLineup = () => {
  return (
    <div className=" relative min-h-screen  flex flex-col items-center justify-center text-white oswaldd overflow-hidden">
      
      {/* Background Image */}
      <img
        src={lineupbg}
        alt="bg"
        className="absolute inset-0 w-full h-full object-contain"
      />

      <div className="text-[80px] font-medium">2026</div>
      <div className="text-[48px] font-medium">ARTIST LINEUP IS</div>
      <div className="text-neon-yellow text-[70px] md:text-[100px] font-medium">
        COMING SOON
      </div>
    </div>
  )
}

export default ArtistLineup
