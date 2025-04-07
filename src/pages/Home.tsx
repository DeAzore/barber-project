import Hero from '@/components/Hero';
import FeaturedServices from '@/components/FeaturedServices';
import FeaturedStylists from '@/components/FeaturedStylists';
import Testimonials from '@/components/Testimonials';
import BookingCTA from '@/components/BookingCTA';

const Home = () => {
  return (
    <div>
      <Hero />
      <FeaturedServices />
      <FeaturedStylists />
      <Testimonials />
      <BookingCTA />
    </div>
  );
};

export default Home;
