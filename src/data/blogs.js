import blog1 from '@/Assets/home/Media/image1.png'
import blog2 from '@/Assets/home/Media/image2.png'
import blog3 from '@/Assets/home/Media/image3.png'

const blogs = [
    {
        id: 'desifest-press-release',
        title: 'DESIFEST 2025 "We are Canadian" return...',
        fullTitle: 'DESIFEST 2025 Returns to Sankofa Square with Bold "We Are Canadian" Vision',
        date: 'May 15, 2025',
        author: 'Sathish Bala',
        category: 'Press Release',
        description: 'DESIFEST 2025 Doubles Down on Canadian South Asian Talent with Bold "We Are Canadian" Return to Sankofa Square...',
        image: blog1,
        link: '/blog/desifest-press-release',
        badge: 'FOR IMMEDIATE RELEASE',
        meta: { location: 'Toronto, ON', type: 'Press Release' },
        sections: [
            {
                type: 'intro',
                text: "Canada's largest South Asian music festival returns for its 19th year — stronger, louder, and more proudly Canadian than ever.",
            },
            {
                type: 'paragraph',
                text: 'DESIFEST returns to Sankofa Square on Saturday, June 14, 2025, continuing its mission of empowering homegrown South Asian artists and reshaping Canada\'s cultural narrative. After its historic all-Canadian lineup in 2024, this year\'s edition doubles down on investing in local talent.',
            },
            {
                type: 'heading',
                text: 'A National Cultural Moment',
            },
            {
                type: 'paragraph',
                text: 'Presented by TD Bank Group, the festival runs from 11 AM to 11 PM under the powerful theme "We Are Canadian." In a milestone year where South Asian music earned formal recognition at the JUNO Awards, DESIFEST continues to lead — not just reflecting representation, but actively building the platform.',
            },
            {
                type: 'heading',
                text: '19 Years of Impact',
            },
            {
                type: 'paragraph',
                text: 'Since 2006, DESIFEST has supported over 1,000 artists, invested more than $3 million into cultural development, and hosted over 60,000 attendees annually. In 2024 alone, the festival reached over 45 million people digitally.',
            },
            {
                type: 'heading',
                text: 'More Than Music',
            },
            {
                type: 'paragraph',
                text: "With curated stages spanning Bollywood, Punjabi, Bangla, Carnatic Fusion, Hip Hop, and R&B, DESIFEST is more than a music festival — it's a movement. The event features 20+ food vendors, interactive exhibits, kids' zones, and inclusive spaces for all ages.",
            },
            {
                type: 'contact-card',
                name: 'Sathish Bala',
                role: 'Founder & CEO, DESIFEST',
                email: 'sbala@desifest.ca',
                phone: '416-302-9321',
                website: 'www.desifest.ca',
                location: 'Sankofa Square, Toronto',
            },
        ],
        socialLinks: {
            twitter: 'https://x.com/intent/post?text=DESIFEST%202025%20Returns%20to%20Sankofa%20Square&url=https%3A%2F%2Fdesifest.ca%2Fdesifest-2025%2F',
            facebook: 'https://www.facebook.com/sharer/sharer.php?u=https://desifest.ca/desifest-2025/',
            linkedin: 'https://www.linkedin.com/feed/?shareActive=true&shareUrl=https%3A%2F%2Fdesifest.ca%2Fdesifest-2025%2F',
        },
    },
    {
        id: 'open-mic-unplugged',
        title: 'Open Mic Unplugged Brings Back...',
        fullTitle: 'Open Mic Unplugged Brings South Asian Music Back to Gerrard Street',
        date: 'May 17, 2025',
        author: 'Sathish Bala',
        category: 'MUSIC',
        description: 'Open Mic Unplugged Brings South Asian Music Back to the Heart of Gerrard Street May 31...',
        image: blog2,
        link: '/blog/open-mic-unplugged',
        badge: 'FOR IMMEDIATE RELEASE',
        meta: { location: 'Toronto, ON', type: 'MUSIC' },
        sections: [
            {
                type: 'event-details',
                venue: 'Lahore Tikka House, Gerrard Street East, Toronto',
                date: 'Saturday, May 31, 2025',
                time: '7:00 PM – 10:00 PM',
            },
            {
                type: 'intro',
                text: 'As part of South Asian Heritage Month, DESIFEST launches a new acoustic concert series rooted in storytelling, culture, and community.',
            },
            {
                type: 'paragraph',
                text: "This inaugural edition takes place at one of Toronto's most iconic venues — Lahore Tikka House. More than a restaurant, it stands as a cultural landmark in Little India, symbolizing resilience and belonging.",
            },
            {
                type: 'quote',
                text: '"This isn\'t just about a show — it\'s about honouring our roots, elevating emerging voices, and making sure culture lives in our neighborhoods."',
                attribution: 'Sathish Bala',
            },
            {
                type: 'heading',
                text: 'The Experience',
            },
            {
                type: 'paragraph',
                text: "Curated by Dee Devan and hosted by SatsB, Open Mic Unplugged features Bollywood ballads, Tamil acoustic sets, Indie Fusion, R&B, and spoken word — spotlighting artists who have grown through DESIFEST's open mic ecosystem.",
            },
            {
                type: 'heading',
                text: 'Food & Atmosphere',
            },
            {
                type: 'paragraph',
                text: 'Lahore Tikka House will serve a special curated menu including:',
            },
            {
                type: 'list',
                items: [
                    'Chicken & Paneer Tikka',
                    'Fresh naan & Tandoori platters',
                    'Samosas, Pakoras & Street-style snacks',
                    'Mango lassi, Chai & Classic desserts',
                ],
            },
            {
                type: 'heading',
                text: 'Tickets',
            },
            {
                type: 'pricing',
                tiers: [
                    { label: 'Early Bird', price: '$20' },
                    { label: 'General', price: '$25' },
                    { label: 'At the Door', price: '$35' },
                ],
            },
            {
                type: 'paragraph',
                text: 'Limited seating available — reserve early to guarantee your spot.',
                italic: true,
            },
            {
                type: 'heading',
                text: 'About Gerrard India Bazaar',
            },
            {
                type: 'paragraph',
                text: "Known as \"Little India,\" Gerrard India Bazaar remains one of Toronto's most vibrant cultural corridors — a space where South Asian identity, food, art, and tradition thrive.",
            },
        ],
        socialLinks: {
            twitter: '#',
            facebook: '#',
            linkedin: '#',
        },
    },
    {
        id: 'a-typographic-legend',
        title: 'A Typographic Legend: Jan Middendorp',
        fullTitle: 'A Typographic Legend: Jan Middendorp',
        date: 'January 7, 2024',
        author: 'andrealeksen',
        category: 'Tribute',
        description: 'Jan Middendorp (4/9/56–12/8/23) contributed an incredible wealth of knowledge to the field of typography...',
        image: blog3,
        link: '/blog/a-typographic-legend',
        badge: 'In Memoriam',
        meta: { type: 'Tribute' },
        sections: [
            {
                type: 'intro',
                text: 'Jan Middendorp (1956–2023) leaves behind a legacy that shaped modern typography and touched countless designers around the world.',
            },
            {
                type: 'paragraph',
                text: 'I met Jan at my first TypeCon conference in Milwaukee in 2012. He quickly became one of my earliest mentors — offering business advice, type critiques, and introductions that opened doors across the global typography community.',
            },
            {
                type: 'heading',
                text: 'A Teacher & Author',
            },
            {
                type: 'paragraph',
                text: 'Jan authored numerous typography books that were not only rich in knowledge, but beautifully designed and written with warmth and accessibility. His textbook "Shaping Text" became a staple in my Intro to Typography courses — thoughtful, thorough, and filled with inviting chapter titles like "Seducing with Type."',
            },
            {
                type: 'heading',
                text: 'Beyond the Conference Stage',
            },
            {
                type: 'paragraph',
                text: 'Conferences were where ideas were exchanged — but the real magic often happened afterward. Whether it was paella on a beach in Barcelona, dancing in Amsterdam, or rooftop gatherings across Europe, Jan was always present — thoughtful, observant, and quietly joyful.',
            },
            {
                type: 'quote',
                text: 'A bright light in the international type community has dimmed — but the influence, generosity, and knowledge he shared will endure.',
            },
            {
                type: 'paragraph',
                text: "Our community is small, but deeply connected. Jan's impact on my professional journey — and personal life — is immeasurable. May your memory live on, dear Jan.",
            },
            {
                type: 'tribute-card',
                text: 'Thank you for the mentorship, the wisdom, and the inspiration.',
                years: '1956 – 2023',
            },
        ],
        socialLinks: {
            twitter: 'https://x.com/intent/post?text=A%20Typographic%20Legend%3A%20Jan%20Middendorp&url=https%3A%2F%2Fdesifest.ca%2Fa-typographic-legend-jan-middendorp%2F',
            facebook: 'https://www.facebook.com/sharer/sharer.php?u=https://desifest.ca/a-typographic-legend-jan-middendorp/',
            linkedin: 'https://www.linkedin.com/feed/?shareActive=true&shareUrl=https%3A%2F%2Fdesifest.ca%2Fa-typographic-legend-jan-middendorp%2F',
        },
    },
]

export default blogs
