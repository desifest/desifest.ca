import YouTubeBackground from '@/Components/shared/YouTubeBackground.jsx'

export default function Videosp({ pageContent = {} }) {
    return (
        <YouTubeBackground
            videoUrl={pageContent.video1_url}
            height="600px"
            containerClassName="flex h-160 mt-22 w-full items-center justify-center"
            topGradient={<div className="absolute inset-0 z-10 h-40 bg-gradient-to-b from-[#05010a] to-transparent"></div>}
            bottomGradient={<div className="absolute inset-0 top-90 z-10 h-60 bg-gradient-to-t from-[#07020f] to-transparent"></div>}
        />
    )
}
