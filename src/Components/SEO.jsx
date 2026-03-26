import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const DEFAULT_IMAGE = 'https://desifest.ca/og-image.png'

export default function SEO({ title, description, image, type }) {
    const location = useLocation()
    const fullTitle = title
        ? `${title} | DESIFEST 2026`
        : "DESIFEST 2026 | Toronto's Largest South Asian Music & Arts Festival | June 18-20"
    const desc = description || "Join DESIFEST 2026, Canada's largest South Asian music and arts festival. Celebrating 20 years of uniting generations, genres, and voices on one iconic stage. June 18-20 at Sankofa Square, Toronto."
    const ogImage = image || DEFAULT_IMAGE
    const canonicalUrl = `https://desifest.ca${location.pathname}`
    const ogType = type || 'website'

    useEffect(() => {
        document.title = fullTitle

        const setMeta = (attr, key, content) => {
            let el = document.querySelector(`meta[${attr}="${key}"]`)
            if (el) {
                el.setAttribute('content', content)
            }
        }

        setMeta('name', 'description', desc)
        setMeta('property', 'og:title', fullTitle)
        setMeta('property', 'og:description', desc)
        setMeta('property', 'og:image', ogImage)
        setMeta('property', 'og:url', canonicalUrl)
        setMeta('property', 'og:type', ogType)
        setMeta('name', 'twitter:title', fullTitle)
        setMeta('name', 'twitter:description', desc)
        setMeta('name', 'twitter:image', ogImage)

        let canonical = document.querySelector('link[rel="canonical"]')
        if (canonical) {
            canonical.setAttribute('href', canonicalUrl)
        }
    }, [fullTitle, desc, ogImage, canonicalUrl, ogType])

    return null
}
