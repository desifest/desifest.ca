import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import SEO from '@/Components/SEO'

const legalContent = {
  'trademark-guidelines': {
    title: 'Trademark Guidelines',
    lastUpdated: 'February 2026',
    sections: [
      {
        heading: 'Overview',
        text: 'DESIFEST and the DESIFEST logo are registered trademarks of DESIFEST Inc. These guidelines govern the use of our trademarks by third parties, including sponsors, partners, media outlets, and the general public.'
      },
      {
        heading: 'Permitted Use',
        text: 'You may use the DESIFEST name and logo for the following purposes, provided you comply with these guidelines:',
        list: [
          'Editorial or news coverage referencing DESIFEST events',
          'Approved sponsor and partner communications, as outlined in your partnership agreement',
          'Personal, non-commercial social media posts about DESIFEST events',
          'Academic or research purposes with proper attribution'
        ]
      },
      {
        heading: 'Prohibited Use',
        text: 'The following uses of DESIFEST trademarks are strictly prohibited without prior written consent:',
        list: [
          'Using the DESIFEST name or logo to imply endorsement or affiliation where none exists',
          'Altering, distorting, or modifying the DESIFEST logo in any way',
          'Using DESIFEST trademarks on merchandise, products, or services not officially authorized',
          'Registering domain names, social media accounts, or business names that include DESIFEST or confusingly similar variations',
          'Using DESIFEST trademarks in any manner that is misleading, defamatory, or otherwise objectionable'
        ]
      },
      {
        heading: 'Logo Usage',
        text: 'When using the DESIFEST logo with permission, please adhere to the following standards:',
        list: [
          'Maintain clear space around the logo equal to the height of the "D" in DESIFEST',
          'Do not place the logo on busy or cluttered backgrounds that reduce legibility',
          'Use only the official logo files provided by DESIFEST — do not recreate or approximate the logo',
          'The minimum display size for the logo is 100px wide for digital use and 1 inch wide for print'
        ]
      },
      {
        heading: 'Brand Name Usage',
        text: 'DESIFEST should always be written in all capital letters. Do not use "Desifest," "desifest," "Desi Fest," or any other variation. When referring to the festival in full, use "DESIFEST — Canada\'s Largest South Asian Music & Arts Festival."'
      },
      {
        heading: 'Requesting Permission',
        text: 'For trademark usage requests or to obtain official brand assets, please contact us at info@desifest.ca with a description of your intended use. We aim to respond to all inquiries within 5 business days.'
      }
    ]
  },
  'privacy-policy': {
    title: 'Privacy Policy',
    lastUpdated: 'February 2026',
    sections: [
      {
        heading: 'Introduction',
        text: 'DESIFEST Inc. ("DESIFEST," "we," "us," or "our") is committed to protecting the privacy of our festival attendees, website visitors, artists, volunteers, and partners. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information in accordance with Canadian privacy legislation, including the Personal Information Protection and Electronic Documents Act (PIPEDA).'
      },
      {
        heading: 'Information We Collect',
        text: 'We may collect the following types of personal information:',
        list: [
          'Contact information: name, email address, phone number, mailing address',
          'Artist application details: performance history, genre, social media links, biography, audio/video samples',
          'Volunteer application details: availability, skills, areas of interest, emergency contact',
          'Newsletter subscription: email address',
          'Website usage data: IP address, browser type, pages visited, referring URL (collected via cookies and analytics tools)',
          'Event attendance and ticket purchase information',
          'Photos and videos captured at DESIFEST events'
        ]
      },
      {
        heading: 'How We Use Your Information',
        text: 'We use your personal information for the following purposes:',
        list: [
          'To process and respond to contact form submissions, artist applications, and volunteer sign-ups',
          'To send newsletters and event updates to subscribers who have opted in',
          'To coordinate event logistics, including artist scheduling and volunteer management',
          'To improve our website, services, and festival experience',
          'To comply with legal obligations and enforce our terms',
          'To share event highlights, recaps, and promotional content featuring festival activities'
        ]
      },
      {
        heading: 'Cookies and Analytics',
        text: 'Our website uses cookies and third-party analytics tools (such as Google Analytics and Meta Pixel) to understand how visitors interact with our site. These tools collect anonymized usage data to help us improve the user experience. You can manage cookie preferences through your browser settings.'
      },
      {
        heading: 'Sharing Your Information',
        text: 'We do not sell your personal information. We may share your information with:',
        list: [
          'Trusted service providers who assist in operating our website and delivering our events (e.g., email services, payment processors)',
          'Government agencies or law enforcement when required by law',
          'Event sponsors and partners, only with your explicit consent'
        ]
      },
      {
        heading: 'Data Retention',
        text: 'We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, or as required by law. You may request deletion of your personal data at any time by contacting us.'
      },
      {
        heading: 'Your Rights',
        text: 'Under Canadian privacy law, you have the right to:',
        list: [
          'Access the personal information we hold about you',
          'Request correction of inaccurate or incomplete information',
          'Withdraw consent for the collection or use of your information',
          'Request deletion of your personal data',
          'File a complaint with the Office of the Privacy Commissioner of Canada'
        ]
      },
      {
        heading: 'Photography and Video at Events',
        text: 'By attending DESIFEST events, you acknowledge that photography and videography will take place. Images and footage may be used for promotional purposes, social media, and media coverage. If you do not wish to be photographed, please notify our event staff.'
      },
      {
        heading: 'Contact Us',
        text: 'For privacy-related inquiries or to exercise your rights, please contact us at info@desifest.ca.'
      }
    ]
  },
  'copyright-notice': {
    title: 'Copyright Notice',
    lastUpdated: 'February 2026',
    sections: [
      {
        heading: 'Ownership',
        text: 'All content on this website, including but not limited to text, graphics, logos, images, audio clips, video clips, data compilations, and software, is the property of DESIFEST Inc. or its content suppliers and is protected by Canadian and international copyright laws.'
      },
      {
        heading: 'Website Content',
        text: 'The design, layout, and look and feel of the DESIFEST website are the exclusive property of DESIFEST Inc. Reproduction, modification, distribution, or republication of any content without prior written permission is strictly prohibited.'
      },
      {
        heading: 'Artist and Performance Content',
        text: 'Performance recordings, artist photographs, and related media published on this website are used with the permission of the respective artists and rights holders. Unauthorized reproduction, distribution, or use of this content is prohibited and may violate copyright, trademark, and other applicable laws.'
      },
      {
        heading: 'User-Submitted Content',
        text: 'By submitting content to DESIFEST (including artist applications, volunteer forms, and contact messages), you grant DESIFEST Inc. a non-exclusive, royalty-free, worldwide license to use, reproduce, and display the submitted content for purposes related to the festival and its promotion.'
      },
      {
        heading: 'Fair Use',
        text: 'Limited use of DESIFEST content may be permitted under fair dealing provisions of the Canadian Copyright Act for purposes such as research, private study, criticism, review, or news reporting, provided proper attribution is given.'
      },
      {
        heading: 'Digital Millennium Copyright Act (DMCA)',
        text: 'If you believe that content on our website infringes your copyright, please contact us at info@desifest.ca with the following information:',
        list: [
          'A description of the copyrighted work you claim has been infringed',
          'The URL or location on our website where the infringing material is located',
          'Your contact information (name, email, phone number)',
          'A statement that you have a good faith belief the use is not authorized',
          'A statement, under penalty of perjury, that the information in your notice is accurate'
        ]
      },
      {
        heading: 'Copyright Notice',
        text: 'Copyright \u00a9 2026 DESIFEST Inc. All rights reserved. No part of this website may be reproduced, distributed, or transmitted in any form or by any means without the prior written permission of DESIFEST Inc.'
      }
    ]
  },
  'terms-of-use': {
    title: 'Terms of Use',
    lastUpdated: 'February 2026',
    sections: [
      {
        heading: 'Acceptance of Terms',
        text: 'By accessing and using the DESIFEST website (desifest.ca), you accept and agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our website.'
      },
      {
        heading: 'Use of the Website',
        text: 'You agree to use this website only for lawful purposes and in a manner that does not infringe on the rights of others or restrict their use and enjoyment of the site. Prohibited conduct includes:',
        list: [
          'Attempting to gain unauthorized access to any part of the website or its servers',
          'Using the website to transmit harmful, threatening, or offensive content',
          'Scraping, data mining, or using automated tools to collect information from the website',
          'Impersonating any person or entity, or falsely stating or misrepresenting your affiliation',
          'Interfering with the proper functioning of the website'
        ]
      },
      {
        heading: 'Account and Submissions',
        text: 'When you submit information through our forms (contact, artist sign-up, volunteer sign-up, newsletter), you agree that all information provided is accurate and complete. You are responsible for the content you submit and agree not to submit any content that is false, misleading, defamatory, or unlawful.'
      },
      {
        heading: 'Intellectual Property',
        text: 'All intellectual property on this website, including trademarks, copyrights, and other proprietary rights, belongs to DESIFEST Inc. or its licensors. Use of any DESIFEST intellectual property without authorization is prohibited. Please refer to our Trademark Guidelines and Copyright Notice for more details.'
      },
      {
        heading: 'Third-Party Links',
        text: 'Our website may contain links to third-party websites and services. DESIFEST is not responsible for the content, privacy policies, or practices of any third-party sites. We encourage you to review the terms and privacy policies of any external sites you visit.'
      },
      {
        heading: 'Event Attendance',
        text: 'By attending DESIFEST events, you agree to comply with all event rules and regulations, including:',
        list: [
          'Following the directions of event staff and security personnel',
          'Not bringing prohibited items (weapons, illegal substances, professional recording equipment without authorization)',
          'Assuming responsibility for your own safety and well-being',
          'Acknowledging that outdoor events are subject to weather conditions and schedule changes',
          'Consenting to being photographed and filmed for promotional and media purposes'
        ]
      },
      {
        heading: 'Limitation of Liability',
        text: 'DESIFEST Inc. provides this website and its content on an "as is" basis. We make no warranties, express or implied, regarding the accuracy, reliability, or availability of the website. To the fullest extent permitted by law, DESIFEST Inc. shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of this website or attendance at our events.'
      },
      {
        heading: 'Indemnification',
        text: 'You agree to indemnify and hold harmless DESIFEST Inc., its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from your use of the website or violation of these Terms of Use.'
      },
      {
        heading: 'Changes to These Terms',
        text: 'DESIFEST reserves the right to modify these Terms of Use at any time. Changes will be posted on this page with an updated "Last Updated" date. Your continued use of the website after changes are posted constitutes your acceptance of the revised terms.'
      },
      {
        heading: 'Governing Law',
        text: 'These Terms of Use are governed by and construed in accordance with the laws of the Province of Ontario and the federal laws of Canada applicable therein. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts of Ontario, Canada.'
      },
      {
        heading: 'Contact',
        text: 'If you have any questions about these Terms of Use, please contact us at info@desifest.ca.'
      }
    ]
  }
}

export default function LegalPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const page = legalContent[slug]

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!page) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1a0a2e] text-white">
        <h1 className="text-2xl">Page not found</h1>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1a0a2e] px-6 py-24 text-white md:px-20 lg:px-40">
      <SEO title={page.title} description={`DESIFEST ${page.title} — read our official ${page.title.toLowerCase()} for using the DESIFEST website and attending our events.`} />
      <div className="mx-auto max-w-4xl">
        <button
          onClick={() => navigate(-1)}
          className="dm-sans-400 mb-6 flex items-center gap-2 text-sm text-gray-300 transition hover:text-white"
        >
          <span>&larr;</span> Go Back
        </button>
        <h1 className="oswaldd mb-2 text-4xl font-bold md:text-5xl">{page.title}</h1>
        <p className="dm-sans-400 mb-12 text-sm text-gray-300">Last updated: {page.lastUpdated}</p>

        <div className="space-y-10">
          {page.sections.map((section, i) => (
            <div key={i}>
              <h2 className="oswaldd mb-3 text-xl font-semibold text-[#D2FF00] md:text-2xl">
                {section.heading}
              </h2>
              <p className="dm-sans-400 leading-relaxed text-gray-200">{section.text}</p>
              {section.list && (
                <ul className="dm-sans-400 mt-3 list-disc space-y-1.5 pl-6 text-gray-300">
                  {section.list.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
