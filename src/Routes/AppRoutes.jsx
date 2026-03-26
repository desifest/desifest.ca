import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '@/Layouts/MainLayout'
import CustomLayout from '@/Layouts/CustomLayout'

import HomePage from '@/Pages/HomePage'
import AboutPage from '@/Pages/AboutPage'
import CommunityPage from '@/Pages/CommunityPage'
import BookingPage from '@/Pages/BookingPage'
import ConcertPage from '@/Pages/ConcertPage'
import MediaPage from '@/Pages/MediaPage'
import PressKitPage from '@/Pages/PressKitPage'
import NotFoundPage from '@/Pages/NotFoundPage'
import UmaFoundationPage from '@/Pages/UmaFoundationPage'

import OpenMic from '@/Pages/Community/OpenMic'
import SofaSession from '@/Pages/Community/SofaSession'
import OurArtists from '@/Pages/ArtistPage'

import ArtistSignUp from '@/Components/Concerts/ArtistSignUp'
import Volunteer2026 from '@/Components/Concerts/Volunteer2026'

import ShopPage from '@/Pages/ShopPage'
import BlogPost from '@/Components/Media/BlogPost'
import Sponsorship from '@/Pages/Sponsorship'
import AdminPage from '@/Pages/AdminPage'
import LegalPage from '@/Pages/LegalPage'
import ArtistProfilePage from '@/Pages/ArtistProfilePage'
import ArtistDirectoryPage from '@/Pages/ArtistDirectoryPage'
import LoginPage from '@/Pages/LoginPage'
import SignupPage from '@/Pages/SignupPage'
import DashboardPage from '@/Pages/DashboardPage'

const isUmaDomain = ['umafoundation.org', 'www.umafoundation.org'].includes(
    window.location.hostname
)

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<CustomLayout footerColor="#022195" />}>
                <Route path="open-mic" element={<OpenMic />} />
            </Route>

            <Route element={<CustomLayout footerColor="#6108AA" />}>
                <Route path="sofa-session" element={<SofaSession />} />
            </Route>

            <Route element={<CustomLayout footerColor="#CEBDE6" />}>
                <Route path="our-artists" element={<OurArtists />} />
            </Route>

            <Route path="admin" element={<AdminPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
            <Route path="dashboard" element={<DashboardPage />} />

            <Route element={<MainLayout />}>
                <Route index element={isUmaDomain ? <UmaFoundationPage /> : <HomePage />} />
                <Route path="umafoundation" element={<UmaFoundationPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="concerts" element={<ConcertPage />} />
                <Route path="media" element={<MediaPage />} />
                <Route path="press-kit" element={<PressKitPage />} />
                <Route path="shop" element={<ShopPage />} />
                <Route path="artistsignup" element={<ArtistSignUp />} />
                <Route path="volunteersignup" element={<Volunteer2026 />} />
                <Route path="sponsorship" element={<Sponsorship />} />
                <Route path="community" element={<CommunityPage />} />
                <Route path="booking" element={<BookingPage />} />
                <Route path="blog" element={<Navigate to="/media" replace />} />
                <Route path="blog/:slug" element={<BlogPost />} />
                <Route path="artists" element={<ArtistDirectoryPage />} />
                <Route path="artists/:slug" element={<ArtistProfilePage />} />
                <Route path="legal/:slug" element={<LegalPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    )
}
