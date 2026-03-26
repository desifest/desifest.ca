import { useState, useEffect } from 'react'

const cache = {}

export default function usePageContent(pageSlug, defaults = {}) {
    const cached = cache[pageSlug]
    const [content, setContent] = useState(cached || defaults)
    const [loaded, setLoaded] = useState(!!cached)

    useEffect(() => {
        if (cache[pageSlug]) {
            setContent(cache[pageSlug])
            setLoaded(true)
            return
        }
        fetch(`/api/page-content/${pageSlug}`, {
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache' }
        })
            .then(r => r.json())
            .then(data => {
                if (data && typeof data === 'object' && !data.error) {
                    cache[pageSlug] = data
                    setContent(data)
                }
                setLoaded(true)
            })
            .catch(() => setLoaded(true))
    }, [pageSlug])

    return { content, loaded }
}
