import { useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import TrustBar from './components/TrustBar.jsx'
import Stats from './components/Stats.jsx'
import Services from './components/Services.jsx'
import HowItWorks from './components/HowItWorks.jsx'
import About from './components/About.jsx'
import Testimonials from './components/Testimonials.jsx'
import CtaBanner from './components/CtaBanner.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import BookCallModal from './components/BookCallModal.jsx'
import SOPBuilder from './sop/SOPBuilder.jsx'

export default function App() {
  const [modalOpen, setModalOpen] = useState(false)
  const [activePage, setActivePage] = useState('home')

  const goToPage = (page) => {
    setActivePage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <Navbar
        onBookCall={() => setModalOpen(true)}
        activePage={activePage}
        onPageChange={goToPage}
      />

      {activePage === 'sop' ? (
        <SOPBuilder onBack={() => goToPage('home')} />
      ) : (
        <>
          <Hero onBookCall={() => setModalOpen(true)} />
          <TrustBar />
          <Stats />
          <Services />
          <HowItWorks />
          <About />
          <Testimonials />
          <CtaBanner onBookCall={() => setModalOpen(true)} />
          <Contact />
          <Footer />
        </>
      )}

      <BookCallModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
