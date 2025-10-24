    import Header from '../../components/landingpage/Header';
    import Hero from '../../components/landingpage/Hero';
    import Features from '../../components/landingpage/Features';
    import Portfolio from '../../components/landingpage/Portfolio';
    import Testimonials from '../../components/landingpage/Testimonials';
    import Pricing from '../../components/landingpage/Pricing';
    import Contact from '../../components/landingpage/Contact';
    import Footer from '../../components/landingpage/Footer';

    export default function Home() {
      return (
        <>
          <Header />
          <main className='min-h-screen w-full flex flex-col'>
            <Hero /> 
            <Features />
            <Portfolio />
            <Testimonials />
             <Pricing /> 
            <Contact />
          </main>
          <Footer />
          </>
        
      );
    }