import heroArtist from '@/Assets/home/Artist.png'
import heroArrow from '@/Assets/home/image.png'
import contactDesktop from '@/Assets/home/Contact_us_bg.png'
import contactMobile from '@/Assets/home/image copy 2.png'

import artistImg1 from '@/Assets/home/animation/image1.png'
import artistImg2 from '@/Assets/home/animation/image2.png'
import artistImg3 from '@/Assets/home/animation/image3.png'

import canadalogo from '@/Assets/COMPANIES/canadalogo.svg'
import canadalogoinvert from '@/Assets/COMPANIES/canadalogoinvert.svg'
import canadianheritagelogo from '@/Assets/COMPANIES/canadianheritagelogo.svg'
import canadianheritagelogoinvert from '@/Assets/COMPANIES/canadianheritagelogoinvert.svg'
import factorlogo from '@/Assets/COMPANIES/factorlogo.svg'
import factorlogoinvert from '@/Assets/COMPANIES/factorlogoinvert.svg'
import mississaugalogo from '@/Assets/COMPANIES/mississaugalogo.svg'
import mississaugalogoinvert from '@/Assets/COMPANIES/mississaugalogoinvert.svg'
import ontarioartslogo from '@/Assets/COMPANIES/ontarioartslogo.svg'
import ontarioartslogoinvert from '@/Assets/COMPANIES/ontarioartslogoinvert.svg'
import ontariologo from '@/Assets/COMPANIES/ontariologo.svg'
import ontariologoinvert from '@/Assets/COMPANIES/ontariologoinvert.svg'

export const heroContent = {
    headline: {
        line1: 'Where South asian',
        line2: 'culture meets',
        line3: 'Meets the World.',
    },
    description: "Canada's largest South Asian music and arts festival— uniting generations, genres, and voices on one iconic stage.",
    event: {
        year: '2026',
        dates: 'June 19 – 20',
        venue: 'Sankofa Square, Canada',
        anniversary: '20th',
    },
    images: {
        artist: heroArtist,
        arrow: heroArrow,
    },
}

export const contactImages = {
    desktop: contactDesktop,
    mobile: contactMobile,
}

export const artistCards = [
    { image: artistImg1, title: "alumni\nartists" },
    { image: artistImg2, title: "Community Artists" },
    { image: artistImg3, title: "" },
]

export const governmentSponsors = [
    { name: 'Government of Canada', logo: canadalogo, logoInvert: canadalogoinvert },
    { name: 'Canadian Heritage', logo: canadianheritagelogo, logoInvert: canadianheritagelogoinvert },
    { name: 'FACTOR', logo: factorlogo, logoInvert: factorlogoinvert },
    { name: 'City of Mississauga', logo: mississaugalogo, logoInvert: mississaugalogoinvert },
    { name: 'Ontario Arts Council', logo: ontarioartslogo, logoInvert: ontarioartslogoinvert },
    { name: 'Government of Ontario', logo: ontariologo, logoInvert: ontariologoinvert },
]

export const socialLinks = {
    facebook: 'https://www.facebook.com/desifestmusic',
    instagram: 'https://www.instagram.com/desifestmusic',
    youtube: 'https://www.youtube.com/@desifestmusic',
    tiktok: 'https://www.tiktok.com/@desifestmusic',
}
