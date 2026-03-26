import { useState } from 'react'
import desktopImageFallback from '@/Assets/home/Contact_us_bg.png'
import mobileImageFallback from '@/Assets/home/image copy 2.png'
import toast from 'react-hot-toast'

const ContactForm = ({ pageContent = {}, source = '' }) => {
    const desktopImage = pageContent.contact_bg_desktop || desktopImageFallback
    const mobileImage = pageContent.contact_bg_mobile || mobileImageFallback

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone_code: '+1',
        phone: '',
        message: '',
        consent: false,
        website_url: '',
    })

    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.name || !formData.email || !formData.message) {
            toast.error('Please fill all required fields')
            return
        }

        setLoading(true)
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, source }),
            })
            const data = await res.json()
            if (res.ok) {
                toast.success('Message sent successfully!')
                setFormData({ name: '', email: '', phone_code: '+1', phone: '', message: '', consent: false })
            } else {
                toast.error(data.error || 'Failed to send message')
            }
        } catch (err) {
            toast.error('Failed to send message')
        }
        setLoading(false)
    }

    return (
        <section className="relative flex flex-col items-center justify-center overflow-hidden bg-transparent px-4 py-20 text-white">
            <img
                src={desktopImage}
                alt=""
                className="pointer-events-none absolute inset-0 hidden h-full w-full object-cover opacity-30 sm:block"
            />
            <img
                src={mobileImage}
                alt=""
                className="pointer-events-none absolute inset-0 block h-full w-full object-cover opacity-30 sm:hidden"
            />

            <div className="relative z-10 w-full max-w-xl">
                <h2 className="oswald mb-2 text-center text-5xl font-semibold text-white uppercase sm:text-6xl">
                    {pageContent.contact_heading || 'Get In Touch'}
                </h2>

                <p className="dm-sans-400 mb-10 text-center text-sm text-gray-300">
                    {pageContent.contact_subtitle || "Have questions, collaboration ideas, or feedback? We'd love to hear from you."}
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', height: 0, overflow: 'hidden', tabIndex: -1 }}>
                        <label htmlFor="website_url">Website</label>
                        <input
                            type="text"
                            id="website_url"
                            name="website_url"
                            value={formData.website_url}
                            onChange={handleChange}
                            autoComplete="off"
                        />
                    </div>
                    <div>
                        <label className="dm-sans-400 mb-1 block text-sm">Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border-b border-white/40 bg-transparent px-1 py-2 text-white placeholder-white/50 outline-none focus:border-[#D5FF00]"
                            placeholder="Your Name"
                        />
                    </div>

                    <div>
                        <label className="dm-sans-400 mb-1 block text-sm">Email *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border-b border-white/40 bg-transparent px-1 py-2 text-white placeholder-white/50 outline-none focus:border-[#D5FF00]"
                            placeholder="your@email.com"
                        />
                    </div>

                    <div>
                        <label className="dm-sans-400 mb-1 block text-sm">Phone</label>
                        <div className="flex items-center gap-2 border-b border-white/40 py-2 focus-within:border-[#D5FF00]">
                            <select
                                name="phone_code"
                                value={formData.phone_code}
                                onChange={handleChange}
                                className="bg-transparent text-sm text-white outline-none"
                            >
                                <option value="+1" className="text-black">+1</option>
                                <option value="+91" className="text-black">+91</option>
                                <option value="+44" className="text-black">+44</option>
                            </select>
                            <span className="text-white/40">|</span>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="flex-1 bg-transparent px-1 text-white placeholder-white/50 outline-none"
                                placeholder="Your phone number"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="dm-sans-400 mb-1 block text-sm">Message *</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows={4}
                            className="w-full border-b border-white/40 bg-transparent px-1 py-2 text-white placeholder-white/50 outline-none focus:border-[#D5FF00]"
                            placeholder="Write your message..."
                        />
                    </div>

                    <div className="flex items-start gap-2">
                        <input
                            type="checkbox"
                            name="consent"
                            checked={formData.consent}
                            onChange={handleChange}
                            className="mt-1"
                        />
                        <label className="dm-sans-400 text-xs text-gray-300">
                            I agree to receive communications from DesiFest.
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#D5FF00] py-3 font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
                    >
                        {loading ? 'Sending...' : 'Send Message'}
                    </button>
                </form>
            </div>
        </section>
    )
}

export default ContactForm
