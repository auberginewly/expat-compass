import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import RootLayout from '@/layouts/RootLayout'
import PageSpinner from '@/components/feedback/PageSpinner'

const HomePage = lazy(() => import('@/pages/HomePage'))
const MedicalPage = lazy(() => import('@/pages/partition/MedicalPage'))
const TransportPage = lazy(() => import('@/pages/partition/TransportPage'))
const PaymentPage = lazy(() => import('@/pages/partition/PaymentPage'))
const EducationPage = lazy(() => import('@/pages/partition/EducationPage'))
const CulturePage = lazy(() => import('@/pages/partition/CulturePage'))
const ForumPage = lazy(() => import('@/pages/ForumPage'))
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const SignupPage = lazy(() => import('@/pages/auth/SignupPage'))
const ProfilePage = lazy(() => import('@/pages/ProfilePage'))
const AboutPage = lazy(() => import('@/pages/AboutPage'))
const PrivacyPage = lazy(() => import('@/pages/legal/PrivacyPage'))
const TermsPage = lazy(() => import('@/pages/legal/ServicePage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

const AppRoutes = () => (
  <Suspense fallback={<PageSpinner />}>
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/medical" element={<MedicalPage />} />
        <Route path="/transport" element={<TransportPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/education" element={<EducationPage />} />
        <Route path="/culture" element={<CulturePage />} />
        <Route path="/forum" element={<ForumPage />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Suspense>
)

export default AppRoutes
