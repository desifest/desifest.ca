import { useState } from 'react'
import toast from 'react-hot-toast'

const initialFormState = {
    event: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneCode: '+1',
    phone: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    country: '',
    facebook: '',
    youtube: '',
    instagram: '',
    tiktok: '',
    spotify: '',
    website: '',
    genre: '',
    otherGenre: '',
    performanceLanguage: '',
    isBand: '',
    performedBefore: '',
    performanceType: '',
    socanRegistered: '',
    managerFirstName: '',
    managerLastName: '',
    managerEmail: '',
    managerPhoneCode: '+1',
    managerPhone: '',
    pastLink1: '',
    pastLink2: '',
    pastLink3: '',
    pastLink4: '',
    ideas: '',
    consent: false,
    website_url: '',
    bio: '',
    pressPhoto: '',
    lookingFor: [],
    availableForGigs: false,
}

const lookingForOptions = ['Collaborators', 'Producer', 'Vocalist', 'Live Band', 'Videographer']

const events = ['Hip Hop Showcase', 'DJ Showcase', 'Desifest 2026', 'She Rocks EP4']
const genres = [
    'BOLLYWOOD', 'HIP-HOP', 'ROCK', 'BHANGRA', 'RnB', 'PUNJABI',
    'TAMIL FUSION', 'CARNATIC FUSION', 'CLASSICAL (HINDUSTANI/CARNATIC)',
    'SUFI / FOLK', 'OTHER',
]

export default function ArtistSignupForm() {
    const [formData, setFormData] = useState(initialFormState)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const updateField = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        updateField(name, type === 'checkbox' ? checked : value)
    }

    const handleLookingForToggle = (option) => {
        setFormData((prev) => {
            const current = prev.lookingFor
            const updated = current.includes(option)
                ? current.filter((item) => item !== option)
                : [...current, option]
            return { ...prev, lookingFor: updated }
        })
    }

    const handlePressPhotoChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Press photo must be under 5MB')
            return
        }
        const reader = new FileReader()
        reader.onloadend = () => {
            updateField('pressPhoto', reader.result)
        }
        reader.readAsDataURL(file)
    }

    const emailError = formData.email.length > 0 && !formData.email.includes('@') ? 'Not a valid mailID' : ''

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.firstName || !formData.email || !formData.event) {
            toast.error('Please fill all required fields')
            return
        }

        if (!formData.consent) {
            toast.error('Please agree to be contacted')
            return
        }
        const toastId = toast.loading('Submitting artist application...')
        setIsSubmitting(true)

        const pastLinks = [formData.pastLink1, formData.pastLink2, formData.pastLink3, formData.pastLink4].filter(
            (link) => link.trim() !== ''
        )

        const submitData = { ...formData, pastLinks }
        delete submitData.pastLink1
        delete submitData.pastLink2
        delete submitData.pastLink3
        delete submitData.pastLink4

        try {
            const response = await fetch('/api/artist-signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submitData),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Submission failed')
            }

            toast.success('Application submitted successfully 🎉', { id: toastId })
            setFormData(initialFormState)
        } catch (error) {
            toast.error(error.message || 'Network error. Please try again ❌', { id: toastId })
            console.error('Submit error:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="text-blue-black mx-auto w-full bg-[#F6F3FA] p-6 md:p-10"
        >
            <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', height: 0, overflow: 'hidden', tabIndex: -1 }}>
                <label htmlFor="hp_website_url">Website</label>
                <input type="text" id="hp_website_url" name="website_url" value={formData.website_url} onChange={(e) => updateField('website_url', e.target.value)} autoComplete="off" />
            </div>
            {/* CHOOSE EVENT */}
            <div className="mb-8 flex flex-col items-center justify-start gap-10 md:flex-row">
                <div className="text-blue-black text-2xl font-medium uppercase">
                    Choose Your Event
                </div>

                <div className="flex flex-wrap gap-3">
                    {events.map((item) => (
                        <label
                            key={item}
                            className={
                                'flex cursor-pointer items-center gap-2 border-2 px-4 py-2 text-xs font-medium uppercase transition ' +
                                (formData.event === item
                                    ? 'bg-light-lavender text-blue-black border-blue-black'
                                    : 'border-blue-black text-blue-black hover:text-blue-black')
                            }
                        >
                            <input
                                type="radio"
                                name="event"
                                value={item}
                                checked={formData.event === item}
                                onChange={() => updateField('event', item)}
                                className="hidden"
                            />

                            <span
                                className={
                                    'flex h-3 w-3 items-center justify-center rounded-full border ' +
                                    (formData.event === item ? 'border-blue-black' : 'border-blue-black')
                                }
                            >
                                {formData.event === item && (
                                    <span className="bg-blue-black h-1.5 w-1.5 rounded-full" />
                                )}
                            </span>

                            {item}
                        </label>
                    ))}
                </div>
            </div>

            {/* BASIC INFO */}
            <div className="mb-10 grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2">
                <Input label="Name*" name="firstName" value={formData.firstName} onChange={handleChange} />
                <Input label="Last Name" name="lastName" placeholder="Enter your last name here" value={formData.lastName} onChange={handleChange} />
                <Input label="Work Email*" name="email" type="email" placeholder="abcd@gmail.com" value={formData.email} onChange={handleChange} error={emailError} />

                <div className="flex flex-col gap-1">
                    <label className="text-md text-blue-black">Phone</label>
                    <div className="flex items-center gap-2 border-b border-[#6F6486] py-2">
                        <select className="text-blue-black bg-transparent text-sm outline-none" name="phoneCode" value={formData.phoneCode} onChange={handleChange}>
                            <option>+91</option>
                            <option>+1</option>
                            <option>+44</option>
                        </select>
                        <span className="text-[#6F6486]">|</span>
                        <input type="tel" name="phone" placeholder="Enter your phone number here" className="text-blue-black flex-1 bg-transparent text-sm outline-none placeholder:text-[#9C92B3]" value={formData.phone} onChange={handleChange} />
                    </div>
                </div>

                <div className="flex flex-col gap-4 md:col-span-2">
                    <label className="text-md text-blue-black">Address</label>
                    <div className="grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-2">
                        <Input name="address" placeholder="Address Line*" value={formData.address} onChange={handleChange} />
                        <Input name="city" placeholder="Enter your City" value={formData.city} onChange={handleChange} />
                    </div>
                    <div className="grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-3">
                        <Input name="province" placeholder="Enter your Province" value={formData.province} onChange={handleChange} />
                        <Input name="postalCode" placeholder="Enter your Postal Code" value={formData.postalCode} onChange={handleChange} />
                        <div className="flex flex-col gap-1">
                            <select className="border-b border-[#6F6486] bg-transparent py-2 text-sm text-[#9C92B3] outline-none" name="country" value={formData.country} onChange={handleChange}>
                                <option value="">Choose your country</option>
                                <option>India</option>
                                <option>United States</option>
                                <option>Canada</option>
                                <option>United Kingdom</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* SOCIAL MEDIA */}
            <SectionTitle text="Including your social media helps our team in the selection process" />
            <div className="mb-10 grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2">
                <Input label="Facebook" name="facebook" placeholder="https://" value={formData.facebook} onChange={handleChange} />
                <Input label="Youtube" name="youtube" placeholder="https://" value={formData.youtube} onChange={handleChange} />
                <Input label="TikTok" name="tiktok" placeholder="https://" value={formData.tiktok} onChange={handleChange} />
                <Input label="Instagram" name="instagram" placeholder="https://" value={formData.instagram} onChange={handleChange} />
                <Input label="Spotify" name="spotify" placeholder="https://" value={formData.spotify} onChange={handleChange} />
                <Input label="Personal Website" name="website" placeholder="https://" value={formData.website} onChange={handleChange} />
            </div>

            {/* GENRE */}
            <div className="mb-5">
                <p className="text-blue-black mb-4 text-sm font-semibold tracking-widest uppercase">Genre</p>
                <div className="flex max-w-5xl flex-wrap items-center gap-3">
                    {genres.map((genre) => (
                        <button
                            key={genre}
                            type="button"
                            onClick={() => updateField('genre', genre)}
                            className={`border px-4 py-2 text-xs font-medium uppercase transition ${
                                formData.genre === genre
                                    ? 'bg-light-lavender text-blue-black border-blue-black'
                                    : 'border-blue-black text-blue-black hover:text-blue-black'
                            }`}
                        >
                            {genre}
                        </button>
                    ))}
                    {formData.genre === 'OTHER' && (
                        <input type="text" name="otherGenre" placeholder="OTHER :" value={formData.otherGenre} onChange={handleChange} className="border-blue-black placeholder:text-blue-black mt-2 w-full border-b bg-transparent py-2 text-sm focus:outline-none sm:mt-0 sm:ml-2 sm:w-60" />
                    )}
                </div>
            </div>

            {/* PERFORMANCE INFO */}
            <div className="py-12">
                <div className="flex w-full flex-col justify-between gap-x-24 gap-y-10 md:flex-row">
                    <div className="flex-1">
                        <label className="text-blue-black mb-3 block text-sm font-semibold">Performance Language*</label>
                        <input type="text" name="performanceLanguage" placeholder="Include each language and separate using.." className="border-blue-black placeholder:text-blue-black/50 w-full border-b bg-transparent py-2 text-sm focus:outline-none" value={formData.performanceLanguage} onChange={handleChange} />
                    </div>
                    <div className="flex-1">
                        <label className="text-blue-black mb-3 block text-sm font-semibold">Are You A Band?*</label>
                        <div className="flex items-start justify-between gap-6">
                            <div className="flex gap-4">
                                <RadioButton label="YES" checked={formData.isBand === 'YES'} onClick={() => updateField('isBand', 'YES')} />
                                <RadioButton label="NO" checked={formData.isBand === 'NO'} onClick={() => updateField('isBand', 'NO')} />
                                <p className="text-blue-black/60 max-w-xs text-xs">If you have multiple instruments, you are a band.<br />If you perform with a DJ, you are a solo artist.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-14 flex w-full flex-col justify-between gap-x-20 gap-y-10 md:flex-row">
                    <div className="flex-1">
                        <label className="text-blue-black mb-3 block text-sm font-semibold">Have You Performed At A Previous DESIFEST?*</label>
                        <div className="flex gap-4">
                            <RadioButton label="YES" checked={formData.performedBefore === 'YES'} onClick={() => updateField('performedBefore', 'YES')} />
                            <RadioButton label="NO" checked={formData.performedBefore === 'NO'} onClick={() => updateField('performedBefore', 'NO')} />
                        </div>
                    </div>
                    <div className="flex-1">
                        <label className="text-blue-black mb-3 block text-sm font-semibold">Type Of Performance?*</label>
                        <div className="flex gap-4">
                            <RadioButton label="SINGER/RAPPER" checked={formData.performanceType === 'SINGER/RAPPER'} onClick={() => updateField('performanceType', 'SINGER/RAPPER')} />
                            <RadioButton label="DANCE" checked={formData.performanceType === 'DANCE'} onClick={() => updateField('performanceType', 'DANCE')} />
                        </div>
                    </div>
                    <div className="flex-1">
                        <label className="text-blue-black mb-3 block text-sm font-semibold">Registered for SOCAN or BMI?*</label>
                        <div className="flex gap-4">
                            <RadioButton label="YES" checked={formData.socanRegistered === 'YES'} onClick={() => updateField('socanRegistered', 'YES')} />
                            <RadioButton label="NO" checked={formData.socanRegistered === 'NO'} onClick={() => updateField('socanRegistered', 'NO')} />
                        </div>
                    </div>
                </div>
            </div>

            {/* MANAGER */}
            <SectionTitle text="Do you have a Manager?" />
            <div className="mb-10">
                <div className="grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2">
                    <Input label="Name*" name="managerFirstName" value={formData.managerFirstName} onChange={handleChange} />
                    <Input label="Last Name" name="managerLastName" placeholder="Enter your last name here" value={formData.managerLastName} onChange={handleChange} />
                    <Input label="Manager Email*" name="managerEmail" type="email" placeholder="abcd@gmail.com" value={formData.managerEmail} onChange={handleChange} />

                    <div className="flex flex-col gap-1">
                        <label className="text-blue-black text-sm">Manager Phone Number*</label>
                        <div className="flex items-center gap-2 border-b border-[#6F6486] py-2">
                            <select className="text-blue-black bg-transparent text-sm outline-none" name="managerPhoneCode" value={formData.managerPhoneCode} onChange={handleChange}>
                                <option>+91</option>
                                <option>+1</option>
                                <option>+44</option>
                            </select>
                            <span className="text-[#6F6486]">|</span>
                            <input type="tel" name="managerPhone" placeholder="Enter your phone number here" className="text-blue-black flex-1 bg-transparent text-sm outline-none placeholder:text-[#9C92B3]" value={formData.managerPhone} onChange={handleChange} />
                        </div>
                    </div>

                    <Input label="Past Performance Links 1*" name="pastLink1" placeholder="https://" value={formData.pastLink1} onChange={handleChange} />
                    <Input label="Past Performance Links 2*" name="pastLink2" placeholder="https://" value={formData.pastLink2} onChange={handleChange} />
                    <Input label="Past Performance Links 3*" name="pastLink3" placeholder="https://" value={formData.pastLink3} onChange={handleChange} />
                    <Input label="Past Performance Links 4*" name="pastLink4" placeholder="https://" value={formData.pastLink4} onChange={handleChange} />
                </div>
            </div>

            <SectionTitle text="Artist Profile (Optional)" />
            <div className="mb-10 grid grid-cols-1 gap-x-10 gap-y-6">
                <div className="flex flex-col gap-1">
                    <label className="text-md text-blue-black">Tell us about yourself as an artist</label>
                    <textarea
                        rows={3}
                        name="bio"
                        placeholder="Share a short bio — your journey, your sound, what drives you..."
                        className="text-blue-black w-full resize-none border-b border-[#6F6486] bg-transparent py-2 text-sm outline-none placeholder:text-[#9C92B3]"
                        value={formData.bio}
                        onChange={handleChange}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-md text-blue-black">Press Photo</label>
                    <div className="flex items-center gap-4">
                        <label className="border-blue-black text-blue-black cursor-pointer border px-4 py-2 text-xs font-medium uppercase transition hover:bg-light-lavender">
                            {formData.pressPhoto ? 'Change Photo' : 'Upload Photo'}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handlePressPhotoChange}
                                className="hidden"
                            />
                        </label>
                        {formData.pressPhoto && (
                            <span className="text-xs text-green-600">Photo selected</span>
                        )}
                    </div>
                    <p className="text-blue-black/50 mt-1 text-xs">Max 5MB. JPG or PNG recommended.</p>
                </div>

                <div>
                    <label className="text-blue-black mb-3 block text-sm font-semibold">Looking For</label>
                    <div className="flex flex-wrap gap-3">
                        {lookingForOptions.map((option) => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => handleLookingForToggle(option)}
                                className={`border px-4 py-2 text-xs font-medium uppercase transition ${
                                    formData.lookingFor.includes(option)
                                        ? 'bg-light-lavender text-blue-black border-blue-black'
                                        : 'border-blue-black text-blue-black hover:text-blue-black'
                                }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>

                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        className="text-blue-black h-4 w-4 rounded border-gray-300"
                        name="availableForGigs"
                        checked={formData.availableForGigs}
                        onChange={handleChange}
                    />
                    <span className="text-blue-black text-sm">I am available for gigs</span>
                </label>
            </div>

            <label className="flex items-center py-10">
                <input type="checkbox" className="text-blue-black mr-2 h-4 w-4 rounded border-gray-300" name="consent" checked={formData.consent} onChange={handleChange} />
                I agree to be contacted about sponsorship opportunities
            </label>

            <div className="mb-10 flex flex-col gap-2">
                <label className="text-blue-black text-lg font-medium">
                    If you have any ideas on your set to help us put on a fantastic show, do share them here.
                </label>
                <textarea rows={2} name="ideas" className="text-blue-black w-full resize-none border-b border-[#6F6486] bg-transparent py-2 text-sm outline-none placeholder:text-[#9C92B3]" value={formData.ideas} onChange={handleChange} />
            </div>

            <button type="submit" disabled={isSubmitting} className="bg-neon-yellow p-3 text-xl font-bold uppercase shadow-md transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-50">
                {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>

            <div className="text-blue-black py-10 text-xl font-medium">
                Join our mailing list to learn about upcoming gigs, grants and workshops to help your music aspirations thrive.
            </div>
        </form>
    )
}

const RadioButton = ({ label, checked = false, onClick }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex items-center gap-2 border px-4 py-2 text-xs font-semibold uppercase transition ${
                checked ? 'bg-light-lavender border-blue-black text-blue-black' : 'border-blue-black text-blue-black'
            }`}
        >
            <span className={`border-blue-black flex h-3 w-3 items-center justify-center rounded-full border`}>
                {checked && <span className="bg-blue-black h-1.5 w-1.5 rounded-full" />}
            </span>
            {label}
        </button>
    )
}

function Input({ label, placeholder, error, type = 'text', value, onChange, name }) {
    return (
        <div className="flex flex-col gap-1">
            {label && <label className="text-md text-blue-black">{label}</label>}
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={
                    'text-blue-black border-b bg-transparent py-2 text-sm outline-none placeholder:text-[#9C92B3] ' +
                    (error ? 'border-red-500' : 'border-[#6F6486]')
                }
            />
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    )
}

function SectionTitle({ text }) {
    return <p className="text-blue-black mb-4 uppercase md:text-xl md:font-medium">{text}</p>
}
