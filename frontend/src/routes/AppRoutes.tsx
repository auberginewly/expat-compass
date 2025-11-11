import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import RootLayout from '@/layouts/RootLayout'
import PageSpinner from '@/components/feedback/PageSpinner'

const HomePage = lazy(() => import('@/pages/HomePage'))
const MedicalPage = lazy(() => import('@/pages/MedicalPage'))
const TransportPage = lazy(() => import('@/pages/TransportPage'))
const PaymentPage = lazy(() => import('@/pages/PaymentPage'))
const EducationPage = lazy(() => import('@/pages/EducationPage'))
const CulturePage = lazy(() => import('@/pages/CulturePage'))
const ForumPage = lazy(() => import('@/pages/ForumPage'))
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
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Suspense>
)

export default AppRoutes

