import React from 'react'

const jobs = [
    { title: 'Program Director', location: 'Toronto, ON', type: 'Part Time' },
    {
        title: 'Volunteer Coordinator',
        location: 'Toronto, ON',
        type: 'Part Time',
    },
    { title: 'Program Director', location: 'Toronto', type: 'Internship' },
]

export default function Jobs() {
    return (
        <section className="py-20 pl-8">
            <div className="">
                <div className="mb-12 flex items-center gap-6">
                    <h2 className="font-[OSWALD] text-[36px] font-medium tracking-wide whitespace-nowrap text-white md:text-[64px]">
                        VIEW OUR JOBS
                    </h2>
                    <div className="h-1 flex-1 bg-white" />
                </div>

                <div className="grid grid-cols-1 gap-8 pr-5 font-[DmSans] md:grid-cols-2 lg:grid-cols-3">
                    {jobs.map((job, index) => (
                        <div
                            key={index}
                            className="hover:bg-midnight-purple flex flex-col justify-between border border-white p-6"
                        >
                            <div>
                                <div className="dm-sans-600 text-xl font-semibold text-white uppercase">
                                    {job.title}
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col gap-1">
                                        <p className="dm-sans-300 text-sm text-white">
                                            Location: {job.location}
                                        </p>
                                        <p className="dm-sans-500 text-sm text-white">{job.type}</p>
                                    </div>
                                    <button
                                        className="oswald-500 hover:bg-midnight-purple mt-6 self-end border-2 border-white px-6 py-2 text-sm font-medium tracking-wide text-white"
                                        type="button"
                                    >
                                        APPLY
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
