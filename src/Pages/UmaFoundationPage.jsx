import { useState } from 'react'
import SEO from '@/Components/SEO'
import ContactForm from '@/Components/Home/ContactForm'
import toast from 'react-hot-toast'
import heroImg from '@/Assets/uma_centre/render1.jpg'
import whoImg from '@/Assets/uma_centre/desifest_crowd.jpg'
import impactImg from '@/Assets/openmic/Featured/image1.png'
import centreRender1 from '@/Assets/uma_centre/render1.jpg'
import centreRender2 from '@/Assets/uma_centre/render2.jpg'
import centreRender3 from '@/Assets/uma_centre/render3.jpg'
import centreCollage from '@/Assets/uma_centre/render_collage.jpg'

function SectionHeading({ children, light = false, center = false }) {
    return (
        <div className={`mb-8 flex flex-col gap-3 ${center ? 'items-center' : 'items-start'}`}>
            <h2 className={`oswaldd text-3xl tracking-wide sm:text-4xl uppercase ${light ? 'text-white' : 'text-[#1B3A2D]'}`}>
                {children}
            </h2>
            <div className="h-0.5 w-16 bg-[#6B8F71]" />
        </div>
    )
}

function BulletItem({ children, light = false }) {
    return (
        <li className="flex items-start gap-3">
            <span className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${light ? 'bg-[#A8C5A0]' : 'bg-[#6B8F71]'}`} />
            <span className={`dm-sans-400 text-base ${light ? 'text-white/80' : 'text-[#3D5C47]'}`}>
                {children}
            </span>
        </li>
    )
}

const currentInitiatives = [
    'Continuous cultural programming and workshops',
    'Artist mentorship and professional development',
    'Micro funding support for independent curators and community organizers',
    'Community engagement events and collaborative programming',
    'Creative economic development pathways',
]

const impactStats = [
    { label: 'Years of Programming', value: '20+' },
    { label: 'Government Funding Partners', value: 'Active' },
    { label: 'Corporate Sponsors', value: 'Growing' },
    { label: 'Year Round Activity', value: 'Ongoing' },
]

const impactStatsRow2 = [
    { label: 'Program and Sponsorship Investment Secured', value: '$3M+' },
    { label: 'Artists and Creatives Supported', value: '1000+' },
    { label: 'Community Events and Activations Produced', value: '100+' },
    { label: 'Programming Across Ontario', value: 'Province Wide' },
]

const centreFeatures = [
    { title: 'Rehearsal Studios', desc: 'Sound treated spaces for practice, performance prep, and creative development' },
    { title: 'Recording Infrastructure', desc: 'Professional recording capabilities for artist development and content production' },
    { title: 'Learning Pods', desc: 'Modular education spaces for daytime learning via Schoolio partnership' },
    { title: 'Artist Lounges', desc: 'Collaborative workspace and community gathering areas for creatives' },
    { title: 'Hybrid Operations', desc: 'Daytime education programming, evening and weekend cultural events' },
    { title: 'Professional Management', desc: 'Structured, professionally managed operations with transparent governance' },
]

const centreImpacts = [
    'Increase access to safe creative space',
    'Expand youth engagement and mentorship',
    'Strengthen creative economic development',
    'Provide stable, professional arts infrastructure',
    'Anchor cultural identity while moving culture forward',
]

const inviteeTypes = [
    'Institutional Funder',
    'Corporate Partner',
    'Community Leader',
    'Founding Donor',
    'Strategic Collaborator',
]

function FoundingCircleForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        organization: '',
        interest_type: '',
        website_url: '',
    })
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.name || !formData.email) {
            toast.error('Please provide your name and email')
            return
        }
        setLoading(true)
        try {
            const payload = {
                name: formData.name,
                email: formData.email,
                phone_code: '+1',
                phone: '',
                message: `Founding Circle Interest\nOrganization: ${formData.organization || 'Not provided'}\nInterest Type: ${formData.interest_type || 'Not specified'}`,
                consent: true,
                website_url: formData.website_url,
                source: 'UMA Founding Circle',
            }
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })
            const data = await res.json()
            if (res.ok) {
                toast.success('Thank you for your interest!')
                setSubmitted(true)
                setFormData({ name: '', email: '', organization: '', interest_type: '', website_url: '' })
            } else {
                toast.error(data.error || 'Something went wrong')
            }
        } catch {
            toast.error('Failed to submit. Please try again.')
        }
        setLoading(false)
    }

    if (submitted) {
        return (
            <div className="rounded-lg border border-[#6B8F71]/30 bg-[#264D38] p-8 text-center sm:p-12">
                <div className="mb-4 text-4xl">&#10003;</div>
                <h3 className="oswaldd mb-3 text-2xl text-white uppercase">Welcome to the Founding Circle</h3>
                <p className="dm-sans-400 text-base text-white/70">
                    We will be in touch with updates on funding rounds and partnership opportunities.
                </p>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', height: 0, overflow: 'hidden', tabIndex: -1 }}>
                <label htmlFor="fc_website_url">Website</label>
                <input type="text" id="fc_website_url" name="website_url" value={formData.website_url} onChange={handleChange} autoComplete="off" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
                <div>
                    <label className="dm-sans-500 mb-1.5 block text-sm text-white/60 uppercase tracking-wider">Name *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border border-white/20 bg-white/5 rounded px-4 py-3 text-white placeholder-white/30 outline-none focus:border-[#6B8F71] transition-colors"
                        placeholder="Your name"
                    />
                </div>
                <div>
                    <label className="dm-sans-500 mb-1.5 block text-sm text-white/60 uppercase tracking-wider">Email *</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border border-white/20 bg-white/5 rounded px-4 py-3 text-white placeholder-white/30 outline-none focus:border-[#6B8F71] transition-colors"
                        placeholder="your@email.com"
                    />
                </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
                <div>
                    <label className="dm-sans-500 mb-1.5 block text-sm text-white/60 uppercase tracking-wider">Organization</label>
                    <input
                        type="text"
                        name="organization"
                        value={formData.organization}
                        onChange={handleChange}
                        className="w-full border border-white/20 bg-white/5 rounded px-4 py-3 text-white placeholder-white/30 outline-none focus:border-[#6B8F71] transition-colors"
                        placeholder="Organization name"
                    />
                </div>
                <div>
                    <label className="dm-sans-500 mb-1.5 block text-sm text-white/60 uppercase tracking-wider">Interest</label>
                    <select
                        name="interest_type"
                        value={formData.interest_type}
                        onChange={handleChange}
                        className="w-full border border-white/20 bg-white/5 rounded px-4 py-3 text-white outline-none focus:border-[#6B8F71] transition-colors appearance-none"
                    >
                        <option value="" className="text-black">Select your role</option>
                        {inviteeTypes.map((type) => (
                            <option key={type} value={type} className="text-black">{type}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="pt-2">
                <button
                    type="submit"
                    disabled={loading}
                    className="dm-sans-600 w-full rounded bg-[#6B8F71] px-8 py-3.5 text-sm tracking-wider text-white uppercase transition-all hover:bg-[#5A7D5E] disabled:opacity-50"
                >
                    {loading ? 'Submitting...' : 'Join the Founding Circle'}
                </button>
            </div>
        </form>
    )
}

export default function UmaFoundationPage() {
    return (
        <div className="bg-[#F5F7F4] text-[#1B3A2D]">
            <SEO title="UMA Foundation" description="UMA Foundation — a cultural initiative powering DESIFEST and advancing South Asian arts, youth development, and community connection across Ontario." />

            {/* ==================== SECTION 1: HERO ==================== */}
            <section className="relative flex min-h-[90vh] items-center overflow-hidden">
                <div className="absolute inset-0">
                    <img src={heroImg} alt="Community gathering" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1B3A2D]/92 via-[#1B3A2D]/78 to-[#1B3A2D]/45" />
                </div>
                <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-32 sm:px-12">
                    <h1 className="oswaldd mb-3 text-5xl leading-none text-white sm:text-6xl md:text-7xl uppercase">
                        UMA
                    </h1>
                    <p className="oswaldd mb-6 text-xl tracking-[0.15em] text-[#A8C5A0] uppercase sm:text-2xl">
                        Culture. Forward.
                    </p>
                    <p className="dm-sans-500 mb-8 text-sm tracking-[0.15em] text-white/60 uppercase">
                        A Cultural Initiative of UMA Foundation — Ontario Non-Profit
                    </p>
                    <div className="mb-8 h-0.5 w-20 bg-[#6B8F71]" />
                    <p className="dm-sans-400 mb-4 max-w-xl text-lg leading-relaxed text-white/90 italic sm:text-xl">
                        Every immigrant story begins with sacrifice.
                    </p>
                    <p className="dm-sans-400 mb-10 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
                        UMA is an anchor for identity and a bridge to community, connection and opportunity.
                    </p>
                    <a
                        href="#uma-today"
                        className="dm-sans-600 inline-block border-2 border-[#6B8F71] bg-[#6B8F71] px-8 py-3 text-sm tracking-wider text-white uppercase transition-all hover:bg-transparent hover:text-white"
                    >
                        Explore UMA
                    </a>
                </div>
            </section>

            {/* ==================== SECTION 2: UMA TODAY ==================== */}
            <section id="uma-today" className="mx-auto max-w-6xl px-6 py-20 sm:px-12 sm:py-28">
                <div className="grid items-stretch gap-12 md:grid-cols-2 md:gap-16">
                    <div>
                        <SectionHeading>UMA Today</SectionHeading>
                        <div className="dm-sans-400 space-y-5 text-base leading-relaxed text-[#3D5C47] sm:text-lg">
                            <p>
                                UMA is an active cultural organization operating under UMA Foundation, an incorporated Ontario non-profit.
                            </p>
                            <p>
                                We deliver year round programming that advances South Asian arts, supports youth development, and strengthens community connection across Ontario.
                            </p>
                            <p className="dm-sans-500 text-[#1B3A2D]">
                                Our current initiatives include:
                            </p>
                        </div>
                        <ul className="mt-5 space-y-3">
                            {currentInitiatives.map((item, i) => (
                                <BulletItem key={i}>{item}</BulletItem>
                            ))}
                        </ul>
                        <div className="mt-8 rounded-lg border-l-4 border-[#6B8F71] bg-[#E8EDE6] p-6 sm:p-8">
                            <h3 className="oswaldd mb-3 text-xl text-[#1B3A2D] uppercase">
                                Flagship Platform: DESIFEST
                            </h3>
                            <div className="dm-sans-400 space-y-4 text-base leading-relaxed text-[#3D5C47]">
                                <p>
                                    UMA powers DESIFEST, Canada's leading South Asian music festival. With nearly two decades of programming, DESIFEST has supported hundreds of artists, engaged national audiences, and built strong public and corporate partnerships.
                                </p>
                                <p className="dm-sans-500 text-[#1B3A2D] italic">
                                    DESIFEST demonstrates UMA's proven capacity to deliver large scale, high impact cultural programming.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex-1 overflow-hidden rounded-lg shadow-xl min-h-[400px]">
                            <img src={whoImg} alt="DESIFEST crowd at Toronto Eaton Centre" className="h-full w-full object-cover" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== SECTION 3: IMPACT & LEADERSHIP ==================== */}
            <section id="impact" className="relative overflow-hidden bg-[#1B3A2D] py-20 sm:py-28">
                <div className="absolute inset-0 opacity-10">
                    <img src={impactImg} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-12">
                    <SectionHeading light>Impact & Leadership</SectionHeading>
                    <p className="dm-sans-400 mb-10 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
                        UMA operates as a cultural engine with a demonstrated track record of impact and institutional capacity.
                    </p>
                    <div className="mb-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {impactStats.map((stat, i) => (
                            <div key={i} className="rounded-lg border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm">
                                <p className="oswaldd mb-1 text-3xl text-[#A8C5A0] sm:text-4xl">{stat.value}</p>
                                <p className="dm-sans-400 text-sm tracking-wider text-white/60 uppercase">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {impactStatsRow2.map((stat, i) => (
                            <div key={i} className="rounded-lg border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm">
                                <p className="oswaldd mb-1 text-3xl text-[#A8C5A0] sm:text-4xl">{stat.value}</p>
                                <p className="dm-sans-400 text-sm tracking-wider text-white/60 uppercase">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                    <div className="grid gap-8 md:grid-cols-2">
                        <div className="dm-sans-400 space-y-5 text-base leading-relaxed text-white/80 sm:text-lg">
                            <p>
                                Through two decades of programming via DESIFEST, UMA has built deep relationships with government funding bodies, corporate sponsors, and cultural institutions.
                            </p>
                            <p>
                                Our year round artist development activity sustains a growing network of curators, educators, and creatives across Ontario.
                            </p>
                        </div>
                        <div className="rounded-lg border border-white/10 bg-white/5 p-6 sm:p-8">
                            <p className="dm-sans-400 text-base leading-relaxed text-white/80 sm:text-lg">
                                Through micro funding and mentorship, UMA strengthens grassroots cultural leadership and expands ecosystem capacity beyond a single event.
                            </p>
                            <p className="dm-sans-500 mt-5 text-base text-[#A8C5A0] italic">
                                UMA is not starting from zero. We are building on proven infrastructure.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== SECTION 4: UMA CENTRE 2027 ==================== */}
            <section id="uma-centre" className="relative py-20 sm:py-28" style={{ background: 'linear-gradient(180deg, #F0F2EF 0%, #E8EDE6 100%)' }}>
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: 'linear-gradient(#1B3A2D 1px, transparent 1px), linear-gradient(90deg, #1B3A2D 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                }} />
                <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-12">
                    <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                        <SectionHeading>The UMA Centre</SectionHeading>
                        <span className="dm-sans-600 -mt-4 sm:mt-0 inline-block self-start rounded-full border border-dashed border-[#6B8F71] px-4 py-1.5 text-xs tracking-wider text-[#6B8F71] uppercase">
                            Planned 2027 Launch
                        </span>
                    </div>
                    <div className="dm-sans-400 mb-12 max-w-3xl space-y-5 text-base leading-relaxed text-[#3D5C47] sm:text-lg">
                        <p>
                            Building on our established programming and leadership, UMA is developing a permanent physical cultural space scheduled for launch in 2027.
                        </p>
                        <p>
                            The UMA Centre will serve as year round cultural infrastructure combining education, music, and community programming under one roof.
                        </p>
                    </div>
                    <div className="mb-12">
                        <div className="overflow-hidden rounded-lg shadow-lg">
                            <img src={centreCollage} alt="UMA Centre conceptual rendering — multiple views" className="h-full w-full object-cover" />
                        </div>
                        <div className="mt-5 grid gap-4 sm:grid-cols-3">
                            <div className="overflow-hidden rounded-lg shadow-md">
                                <img src={centreRender1} alt="UMA Centre exterior rendering — evening view" className="h-48 w-full object-cover" />
                            </div>
                            <div className="overflow-hidden rounded-lg shadow-md">
                                <img src={centreRender2} alt="UMA Centre exterior rendering — corner view" className="h-48 w-full object-cover" />
                            </div>
                            <div className="overflow-hidden rounded-lg shadow-md">
                                <img src={centreRender3} alt="UMA Centre community entrance rendering" className="h-48 w-full object-cover" />
                            </div>
                        </div>
                        <p className="dm-sans-400 mt-3 text-center text-xs tracking-wider text-[#5A7D5E]/70 uppercase italic">Conceptual Renderings — UMA Centre 2027</p>
                    </div>

                    <p className="dm-sans-500 mb-6 text-sm tracking-wider text-[#5A7D5E] uppercase">Planned Features</p>
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {centreFeatures.map((feature, i) => (
                            <div
                                key={i}
                                className="rounded-lg border border-dashed border-[#1B3A2D]/15 bg-white/60 p-6 transition-all hover:border-[#6B8F71]/40 hover:bg-white/80 hover:shadow-sm"
                            >
                                <h3 className="oswaldd mb-2 text-lg text-[#1B3A2D] uppercase">{feature.title}</h3>
                                <p className="dm-sans-400 text-sm leading-relaxed text-[#3D5C47]/80">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-12 rounded-lg border border-[#1B3A2D]/10 bg-white/40 p-6 sm:p-8">
                        <p className="dm-sans-400 text-base leading-relaxed text-[#3D5C47] sm:text-lg">
                            The Centre will operate as a hybrid model, supporting education during daytime hours and cultural programming in the evenings and weekends.
                        </p>
                        <p className="dm-sans-500 mt-4 text-base text-[#1B3A2D] italic">
                            This expansion transforms UMA from a programming based organization into permanent cultural infrastructure.
                        </p>
                    </div>
                </div>
            </section>

            {/* ==================== SECTION 5: WHY THIS MATTERS ==================== */}
            <section id="why-it-matters" className="mx-auto max-w-6xl px-6 py-20 sm:px-12 sm:py-28">
                <div className="grid items-start gap-12 md:grid-cols-2 md:gap-16">
                    <div>
                        <SectionHeading>Why This Matters</SectionHeading>
                        <div className="dm-sans-400 space-y-5 text-base leading-relaxed text-[#3D5C47] sm:text-lg">
                            <p className="dm-sans-500 text-lg text-[#1B3A2D] sm:text-xl">
                                UMA represents the evolution from event based programming to sustainable cultural institution.
                            </p>
                            <p className="dm-sans-500 text-[#1B3A2D]">
                                The UMA Centre will:
                            </p>
                        </div>
                        <ul className="mt-5 space-y-3">
                            {centreImpacts.map((item, i) => (
                                <BulletItem key={i}>{item}</BulletItem>
                            ))}
                        </ul>
                    </div>
                    <div className="flex items-center">
                        <div className="rounded-lg border-l-4 border-[#6B8F71] bg-[#E8EDE6] p-8 sm:p-10">
                            <p className="dm-sans-400 text-base leading-relaxed text-[#3D5C47] sm:text-lg">
                                From two decades of festival programming to year round artist development, from micro funding grassroots curators to planning permanent infrastructure — UMA's trajectory is clear.
                            </p>
                            <p className="dm-sans-500 mt-6 text-base text-[#1B3A2D] italic">
                                Culture is not only remembered. It is advanced.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== SECTION 6: FOUNDING SUPPORTERS ==================== */}
            <section id="founding-circle" className="bg-[#1B3A2D] py-20 sm:py-28">
                <div className="mx-auto max-w-6xl px-6 sm:px-12">
                    <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
                        <div>
                            <SectionHeading light>Join the Founding Circle</SectionHeading>
                            <div className="dm-sans-400 space-y-5 text-base leading-relaxed text-white/80 sm:text-lg">
                                <p>
                                    As we prepare to launch the UMA Centre in 2027, we are building a founding circle of partners, advisors, and early supporters.
                                </p>
                                <p>
                                    Donation rounds and capital partnerships will open soon.
                                </p>
                                <p className="dm-sans-500 text-white">
                                    We invite:
                                </p>
                            </div>
                            <ul className="mt-5 space-y-3">
                                {inviteeTypes.map((type, i) => (
                                    <BulletItem key={i} light>{type}</BulletItem>
                                ))}
                            </ul>
                            <p className="dm-sans-400 mt-8 text-base text-white/70">
                                to join us in building permanent cultural infrastructure.
                            </p>
                            <p className="dm-sans-400 mt-4 text-base text-white/60">
                                Register your interest below to receive updates on funding rounds and partnership opportunities.
                            </p>
                        </div>
                        <div className="lg:pt-4">
                            <FoundingCircleForm />
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== SECTION 7: GOVERNANCE ==================== */}
            <section id="governance" className="bg-[#E8EDE6] py-16 sm:py-20">
                <div className="mx-auto max-w-6xl px-6 sm:px-12">
                    <div className="mx-auto max-w-3xl text-center">
                        <SectionHeading center>Governance</SectionHeading>
                        <div className="dm-sans-400 space-y-5 text-base leading-relaxed text-[#3D5C47] sm:text-lg">
                            <p>
                                UMA operates under UMA Foundation, an Ontario non-profit governed by a Board of Directors with transparent financial oversight and regulatory compliance.
                            </p>
                            <p className="dm-sans-500 text-sm tracking-wider text-[#5A7D5E] uppercase">
                                Full governance documentation available upon request.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== CONTACT FORM ==================== */}
            <div className="bg-[#1B3A2D] py-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-12 text-center">
                        <h2 className="oswaldd text-3xl text-white mb-2 uppercase tracking-wide">UMA / Culture. Forward.</h2>
                        <p className="text-white/70 dm-sans-400">Have questions or want to connect? Send us a message below.</p>
                    </div>
                    <ContactForm pageContent={{}} source="UMA Foundation" />
                </div>
            </div>
        </div>
    )
}
