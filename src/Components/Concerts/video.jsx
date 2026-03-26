import YouTubeBackground from '@/Components/shared/YouTubeBackground.jsx'

export default function Video({ pageContent = {} }) {
    return (
        <YouTubeBackground
            videoUrl={pageContent.video_url}
            height="800px"
            containerClassName="flex h-220 w-full items-center justify-center"
            topGradient={<div className="absolute inset-0 z-10 h-40 bg-gradient-to-b from-[#100422] to-transparent"></div>}
            bottomGradient={<div className="absolute inset-0 top-160 z-10 h-40 bg-gradient-to-t from-[#100422] to-transparent"></div>}
        />
    )
}
