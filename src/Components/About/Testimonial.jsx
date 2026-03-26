import { useEffect, useRef } from 'react'
import quote from '../../Assets/about/quote.svg'

export default function TestimonialCarousel() {
    const scrollRef = useRef(null)

    // ✅ TESTIMONIAL DATA (same file)
    const testimonials = [
        {
            quote: 'Awesome show last night. we had a great time listening to all those hits. Pratik Rao you were awesome, as usual ..... may your tribe increase.',
            name: 'Ed Daniel',
            role: 'March 27, 2022',
            highlights: ['Pratik Rao'],
        },
        {
            quote: 'Kudos and much respect to Team DesiFEST for brining the celebrations online. Bringing artists & DJs all around the world together to showcase their talents and to entertain the masses as well. Amazing initiative.',
            name: 'Pradeep Sidhu',
            role: 'July 9, 2021',
            highlights: ['Team DesiFEST'],
        },
        {
            quote: 'Desifest is the best place for amazing talents and all positive energy for various musicians. Sofa sessions have been great and now a habit. Love you team. Highly recommend.',
            name: 'Sharmila Ganesh',
            role: 'June 11, 2020',
            highlights: ['Sofa sessions'],
        },
        {
            quote: "DesiFEST has reignited my passion for music, with it's amazing platform and incredible community built by Sathish and Michelle. Every summer DesiFEST hosts the largest Canadian South Asian concert and festival in Toronto, however this year this format has been pushed online via the daily Sofa Sessions which feature tremendous local and international artists. Also deeply valued are the variety of resources available to artists including webinars, community engagement as well as networking opportunities.",
            name: 'Zohra Kassam',
            role: 'June 5, 2020',
            highlights: ['Sathish', 'Michelle', 'Sofa Sessions'],
        },
        {
            quote: 'DesiFEST is a great platform for upcoming artists. The team is amazing and very creative. Prior to Covid19 situation, my band Desirootz Music and I absolutely loved participating at the monthly Open stage concerts in downtown Toronto. Thanks to them, I have met some amazing artists and collaborators. I support their vision.',
            name: 'Himaani Bee',
            role: 'June 3, 2020',
            highlights: ['Desirootz Music', 'Open stage concerts'],
        },
        {
            quote: "I highly recommend Desifest, as a multicultural platform for artists around the world, to come and share their unique abilities and talents. The creators of this group Sathish Bala and Michelle Bala are kind, conscientious, hard working and very encouraging. They genuinely support artists and music in all it's forms.",
            name: 'Seema Maraj',
            role: 'June 2, 2020',
            highlights: ['Sathish Bala', 'Michelle Bala'],
        },
        {
            quote: 'desiFEST provides an amazing platform for aspiring artists to display their skills. Thanks a lot Satish and Michelle for this wonderful platform.',
            name: 'Ravi Yedery',
            role: 'June 2, 2020',
            highlights: ['Satish', 'Michelle'],
        },
        {
            quote: 'DesiFest is a huge platform for south Asian artists for showcasing their talent! The team is amazing and so productive. They are absolutely passionate about what they do and always give their 100000% in performing at any platform DesiFest provides.',
            name: 'Rushna Imran',
            role: 'June 2, 2020',
            highlights: ['DesiFest'],
        },
        {
            quote: 'An excellent platform for artists from all over the globe to showcase their talent. Great efforts put in by Michelle and Sathish to bring the audience a great show and provide participants with a very encouraging and supportive environment!',
            name: 'Ritu Verma',
            role: 'June 2, 2020',
            highlights: ['Michelle', 'Sathish'],
        },
        {
            quote: 'Great platform to promote any talent. Team desifest is dedicated to help local talents to give them opportunity to become bigger and better. Not just helping them professionally but on a personal level too. They go above and beyond to make sure the talent is equipped with all the required tools to be successful. Wish team Desifest nothing but the best.',
            name: 'Pratik Peters',
            role: 'June 2, 2020',
            highlights: ['Team desifest'],
        },
        {
            quote: 'I came across desiFest through pure serendipity. I am however forever grateful to Sathish and Michelle for not only welcoming me like family but also for their zest to inculcate and entertain such varied artists from across the world. To anyone trying to find their footing in the Hindi music arena within Toronto, look no further than desiFest - the best platform in the city to showcase your talent. Thank you again to the desiFest family.',
            name: 'Akxay Sharma',
            role: 'June 2, 2020',
            highlights: ['Sathish', 'Michelle', 'desiFest'],
        },
        {
            quote: 'Desifest has very quickly become a leader in helping new artists bring their talent to the masses. During these tough times (COVID-19) Desifest has created a platform for live performers to continue following their dreams. 5 stars!',
            name: 'Bobby Gulati',
            role: 'June 2, 2020',
            highlights: ['Desifest'],
        },
    ]

    // ✅ SMOOTH AUTO SCROLL (NO LAG / NO REVERSE)
    useEffect(() => {
        const container = scrollRef.current
        if (!container) return

        const speed = 1 // smoother & visible
        let intervalId

        intervalId = setInterval(() => {
            container.scrollLeft += speed

            if (container.scrollLeft >= container.scrollWidth / 2) {
                container.scrollLeft = 0
            }
        }, 16) // ~60fps

        return () => clearInterval(intervalId)
    }, [])

    const highlightText = (text, highlights) => {
        if (!highlights.length) return text

        const regex = new RegExp(`(${highlights.join('|')})`, 'gi')

        return text.split(regex).map((part, index) =>
            highlights.some((h) => h.toLowerCase() === part.toLowerCase()) ? (
                <span key={index} className="text-neon-yellow helva font-bold">
                    {part}
                </span>
            ) : (
                part
            )
        )
    }

    return (
        <div className="w-full gap-5 overflow-hidden bg-[#120822] py-16">
            <h2 className="mb-10 text-center font-[OSWALD] text-4xl font-medium text-white">
                WHAT PEOPLE SAY ABOUT US...
            </h2>

            <div ref={scrollRef} className="no-scrollbar flex gap-6 overflow-x-scroll px-10">
                {[...testimonials, ...testimonials].map((item, index) => (
                    <div
                        key={index}
                        className="flex max-w-105 min-w-105 flex-col justify-between rounded-xl bg-[#1c1033] p-6 text-white shadow-lg"
                    >
                        <div className="">
                            <img src={quote} className="mb-3" alt="" />
                            <p className="helva text-[20px] leading-relaxed text-gray-300">
                                {highlightText(item.quote, item.highlights || [])}
                            </p>
                        </div>

                        <div className="border-neon-yellow mt-6 flex items-center gap-4 border-t pt-4">
                            {/* <div className="w-10 h-10 bg-purple-300 rounded-md" /> */}
                            <div className="dm-sans-400">
                                <p className="text-[24px]">{item.name}</p>
                                <p className="text-[16px]">{item.role}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

/* Add this once in your global CSS file
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
*/
