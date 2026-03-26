import React from 'react'
import phone from '../../Assets/media/email.svg'
import email from '../../Assets/media/phone.svg'
import usePageContent from '@/hooks/usePageContent'

const PeopleOfContact = () => {
    const { content } = usePageContent('media')
    return (
        <section className="w-full py-20">
            <div className="mx-auto max-w-7xl px-6">
                {/* Heading */}
                <h2 className="oswaldd mb-14 text-center text-3xl font-medium tracking-wide text-white md:text-4xl">
                    {content.contacts_heading || 'PEOPLE OF CONTACT'}
                </h2>

                {/* Cards */}
                <div className="dm-sans-400 grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Card */}
                    <div className="border border-white/60 p-6 text-white">
                        <h3 className="text-[28px] font-medium tracking-wide">{content.contact1_name || "PERSON'S NAME"}</h3>
                        <p className="mb-6 text-sm font-light text-white uppercase">{content.contact1_designation || 'DESIGNATION'}</p>

                        <div className="flex flex-col gap-3 text-sm">
                            <div className="flex items-center gap-3">
                                <img src={phone} className="h-5 w-5" alt="Email" />
                                <span>{content.contact1_phone || '+1234567890'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <img src={email} className="h-5 w-5" alt="Phone" />
                                <span>{content.contact1_email || 'abcdesifest@gmail.com'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Card */}
                    <div className="border border-white/60 p-6 text-white">
                        <h3 className="text-[28px] font-medium tracking-wide">{content.contact2_name || "PERSON'S NAME"}</h3>
                        <p className="mb-6 text-sm font-light text-white uppercase">{content.contact2_designation || 'DESIGNATION'}</p>

                        <div className="flex flex-col gap-3 text-sm">
                            <div className="flex items-center gap-3">
                                <img src={phone} className="h-5 w-5" alt="Email" />
                                <span>{content.contact2_phone || '+1234567890'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <img src={email} className="h-5 w-5" alt="Phone" />
                                <span>{content.contact2_email || 'abcdesifest@gmail.com'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Card */}
                    <div className="border border-white/60 p-6 text-white">
                        <h3 className="text-[28px] font-medium tracking-wide">{content.contact3_name || "PERSON'S NAME"}</h3>
                        <p className="mb-6 text-sm font-light text-white uppercase">{content.contact3_designation || 'DESIGNATION'}</p>

                        <div className="flex flex-col gap-3 text-sm">
                            <div className="flex items-center gap-3">
                                <img src={phone} className="h-5 w-5" alt="Email" />
                                <span>{content.contact3_phone || '+1234567890'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <img src={email} className="h-5 w-5" alt="Phone" />
                                <span>{content.contact3_email || 'abcdesifest@gmail.com'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default PeopleOfContact
