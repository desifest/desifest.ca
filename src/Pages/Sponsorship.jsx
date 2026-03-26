import SEO from '@/Components/SEO'
import ContactForm from '@/Components/Home/ContactForm'
import Calendar from '@/Components/Sponsorship/Calendar'
import Videosp from '@/Components/Sponsorship/videosp'
import React from 'react'
import usePageContent from '@/hooks/usePageContent'

const Sponsorship = () => {
    const { content } = usePageContent('sponsorship')
    return (
        <div className='mx-auto px-2 flex flex-col w-full sm:pl-24'>
            <SEO title="Sponsorship" description="Partner with DESIFEST 2026, Toronto's largest South Asian music festival. Explore sponsorship opportunities and multicultural marketing with our award-winning event." />
            <h1 className='text-white px-4 oswald-500 text-4xl md:text-6xl uppercase tracking-wide mb-6'>Sponsorship</h1>
            <Videosp pageContent={content} />
            <div className='text-white px-4 dm-sans-400 text-2xl'>
            {content.description || 'We are excited to be back for our 18th annual DESIFEST – Toronto’s award winning South Asian Music Festival. This is a unique and proven marketing opportunity for your brand! Find a time below that work for us to get a on call and explore how you can tap into the power of multicultural marketing with DESIFEST 2024.'}
            </div>
            <Calendar pageContent={content} />
            <ContactForm />
        </div>
    )
}

export default Sponsorship
