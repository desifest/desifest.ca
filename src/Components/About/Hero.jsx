import React from 'react'
import usePageContent from '@/hooks/usePageContent'

const Hero = () => {
  const { content } = usePageContent('about')
  return (
    <div className='h-[500px] justify-center items-center w-full   flex flex-col z-30 gap-5 text-white leading-none'>
        <div className='font-medium'>{content.hero_label || 'ABOUT US'}</div>
        <h1 className='text-soft-lavender text-[40px] md:text-[100px] uppercase font-medium oswald'>{content.hero_line1 || 'showing up for'} <span className='text-neon-yellow font-medium text-nowrap uppercase text-[60px] md:text-[120px] special-gothic-one-regular'>{content.hero_line2 || '20 years'}</span></h1>
    </div>
  )
}

export default Hero