import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useMediaQuery } from '@mui/material';
import { lazy, useState } from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import donationImage1 from '../../assets/blog/images/donationImage1.jpg';
import donationImage2 from '../../assets/blog/images/donationImage2.jpg';
import { businessImages } from '../../assets/images.js';
import {
  ceoMessage,
  dummyBusinessPosts,
  introSubtitle,
  introText,
  services,
} from '../../components/business/business_post/buisnessData.jsx';
import {
  BusinessPostItem,
  ClientReview,
  PartnerWithUs,
  ServiceHighlights,
  SocialLinks,
  testimonials,
} from '../../components/business/landing_page/BusinessItem';
import ServiceUpdateTicker from '../../components/business/landing_page/ServiceUpdateTicker';
import YoutubeEmbed from '../../components/business/landing_page/YoutubeEmbed';
import Footer from '../../components/Footer/Footer';
import { useGetBusinessPostsQuery } from '../../services/api';
import styles from '../blog/blog.module.scss';

const GradientCard = lazy(() => import('../../components/blog/GradientCard/GradientCard'));
const DonateSection = lazy(() => import('../../components/blog/DonateSection/DonateSection'));

const HomePage = () => {
  const { data: businessPosts = [], isLoading, isError } = useGetBusinessPostsQuery();
  const [showAllPosts, setShowAllPosts] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [fade, setFade] = useState(true);

  const isBelow1100 = useMediaQuery('(max-width:1100px)');
  const isSmallScreen = useMediaQuery('(max-width:768px)');
  const isMediumScreen = useMediaQuery('(max-width:900px)');
  const postsToShow = !isError && businessPosts.length > 0 ? businessPosts : dummyBusinessPosts;
  const postsToDisplay = isSmallScreen
    ? postsToShow
    : showAllPosts
      ? postsToShow
      : postsToShow.slice(0, 4);

  // Testimonials Carousel Settings
  const testimonialSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: isSmallScreen ? 1 : isMediumScreen ? 2 : 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    cssEase: 'ease-in-out',
    arrows: false,
  };
  return (
    <div
      className="home-page-business"
      style={{
        height: isSmallScreen ? '635px' : isMediumScreen ? '800px' : '800px',
        margin: '0 auto',
        backgroundSize: 'cover',
      }}
    >
      {/* Hero Section */}
      <div
        style={{
          position: 'relative',
          height: '800px',
          overflow: 'hidden',
        }}
      >
        <video
          className="hero-bg"
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '800px',
            marginTop: '4rem',
            objectFit: 'cover',
            zIndex: -1,
            opacity: fade ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
          }}
        >
          <source src="/videos/nimiVid.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="hero-overlay"></div>
        <div className="hero-text">
          <h1 style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {' '}
            We believe in harnessing technology to drive business success.
          </h1>
          <p
            style={{
              color: 'white',
              fontSize: isSmallScreen ? '1rem' : isMediumScreen ? '1.2rem' : '1.5rem',
              textAlign: 'left',
              marginBottom: '20px',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
            }}
          >
            Our aim is to deliver innovative, efficient, and scalable solutions that empower our
            clients to thrive in an ever-evolving digital landscape
          </p>

          <button
            className={`custom-button ${isSmallScreen ? 'small' : isMediumScreen ? 'medium' : 'large'}`}
            // style={{
            //   position: 'absolute',
            //   top: isSmallScreen ? '460px' : isMediumScreen ? '450px' : '590px',
            // }}
          >
            <a
              href="/contact-us"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '20px 30px',
                color: 'white',
                borderRadius: '30px',
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 'bold',
                fontSize: isSmallScreen ? '0.9rem' : isMediumScreen ? '1rem' : '1.2rem',
                textDecoration: 'none',
              }}
            >
              BOOK A FREE CONSULTATION
              <ArrowBackIcon />
            </a>
          </button>
        </div>
      </div>

      {/* partner with us */}
      <div>
        {/* Partner With Us Section */}
        <PartnerWithUs services={services} />
      </div>

      {/* Service updates */}
      <div
        style={{
          display: 'flex',
          flexDirection: isSmallScreen ? 'column' : isMediumScreen ? 'row' : 'row',
          alignItems: 'center',
          padding: '20px',
          borderRadius: '16px',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
          margin: '20px 0',
          gap: '20px',
          flexWrap: 'wrap', // Ensures wrapping on small screens
        }}
      >
        <span
          className="bounce-on-hover"
          style={{
            padding: '10px 20px',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            color: '#fff',
            backgroundColor: 'rgb(0, 8, 10, 93%)',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            border: 'none',
            borderRadius: '30px 30px 0 30px',
            cursor: 'pointer',
            fontFamily: 'Montserrat, sans-serif',
            flexShrink: 0,
          }}
        >
          Explore our IT services
        </span>

        <div
          style={{
            flex: 1,
            background: 'none',
            border: '1px solid #ccc',
            borderRadius: '12px',
            width: '90%',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center', // Ensure content is centered
            boxShadow: '0 8px 16px rgba(48, 48, 48, 0.1)',
            marginTop: '10px',
            flexWrap: 'wrap', // Allow content to adjust for mobile
          }}
        >
          <ServiceUpdateTicker posts={postsToShow} />
        </div>
      </div>

      {/* Courses */}
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          padding: isSmallScreen ? '0' : isMediumScreen ? '10px' : '20px',
          width: '100%',
          margin: 0,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          fontFamily: 'Montserrat, sans-serif',
        }}
      >
        <h1
          style={{
            textAlign: 'center',
            marginBottom: isSmallScreen ? '0' : '60px',
            padding: isSmallScreen ? '20px' : '20px',
            color: '#433c4c',
          }}
        >
          Our Services
        </h1>
        <div
          style={{
            display: 'flex',
            flexDirection: isSmallScreen ? 'column' : isMediumScreen ? 'column' : 'row',
            gap: '40px',
            // maxWidth: '1200px',
            padding: isSmallScreen ? '0' : isMediumScreen ? '30x' : '50px',
          }}
        >
          <div>
            <div
              className="business-posts-container"
              style={{
                display: 'grid',
                gridTemplateColumns: isSmallScreen
                  ? '1fr'
                  : isMediumScreen
                    ? 'repeat(2, 2fr)'
                    : 'repeat(2, 1fr)',
                gridAutoRows: 'minmax(200px, auto)',
                gap: '20px',
                alignItems: 'center',
                justifyItems: 'center',
                paddingTop: isSmallScreen ? '70px' : '0',
              }}
            >
              {postsToDisplay.map((post) => (
                <BusinessPostItem
                  id={post.id}
                  key={post.id}
                  title={post.title}
                  content={post.content}
                  image={post.image}
                  summary={post.summary}
                />
              ))}
            </div>
            {!isSmallScreen && postsToShow.length > 4 && (
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button
                  onClick={() => setShowAllPosts(!showAllPosts)}
                  style={{
                    background: '#88199a',
                    color: '#FFF',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    padding: '16px',
                    marginTop: '16px',
                    fontWeight: 'bold',
                    textDecoration: 'none',
                    borderRadius: '16px',
                  }}
                  className="contact-btn"
                >
                  {showAllPosts ? 'Show Less' : 'click to view more'}
                </button>
              </div>
            )}
          </div>
          {/* 📌 Left Side: Text & List Block */}
          <div style={{ width: '100%' }}>
            {/* <h2
              style={{
                fontSize: isSmallScreen ? '1.4rem' : '2rem',
                padding: isSmallScreen ? '20px' : '20px',
                color: '#7b7979',
                marginTop: '20px',
                marginBottom: '10px',
              }}
            >
              {introTitle}
            </h2> */}
            <h1
              style={{
                fontSize: isSmallScreen ? '1.8rem' : '2.4rem',
                padding: isSmallScreen ? '20px' : '0',
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: '400',
                color: '#2e0135',
                marginBottom: '20px',
              }}
            >
              {introSubtitle}
            </h1>
            <p
              style={{
                fontSize: isSmallScreen ? '1rem' : '1.2rem',
                padding: isSmallScreen ? '20px 20px 0 20px' : '20px 0 0 0',
                lineHeight: '1.7',
                color: '#444',
                fontFamily: 'Montserrat, sans-serif',
              }}
            >
              {introText}
            </p>
            <div style={{ padding: isSmallScreen ? '20px' : '0' }}>
              <ServiceHighlights />
            </div>
          </div>
        </div>
      </div>

      {/* Services */}
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          padding: isSmallScreen ? '0' : isMediumScreen ? '0' : '0',
          maxWidth: '100%',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: isBelow1100 ? 'column' : 'column',
            gap: '40px',
          }}
        >
          {/* 📸 Right Side: Full-Size Image */}
          <div
            className="service-img-container"
            style={{
              position: 'relative',
              margin: isSmallScreen ? '0 0 2rem 0' : '0 0 4rem 0',
              borderRadius: isSmallScreen ? '0' : isMediumScreen ? '0' : '0',
              overflow: 'hidden',
              boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
            }}
          >
            <img
              src={businessImages.hero2}
              alt="Manager Section Visual"
              className="image-hover"
              style={{
                width: '100%',
                height: isSmallScreen ? '300px' : '500px',
                objectFit: 'cover',
                display: 'block',
              }}
            />

            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: '100%',
                background: 'rgba(0, 0, 0, 0.4)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px',
                textAlign: 'center',
              }}
            >
              <h1
                style={{
                  color: 'white',
                  fontSize: isSmallScreen ? '1.5rem' : '2.5rem',
                  fontWeight: 'bold',
                  textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
                  fontFamily: 'Montserrat, sans-serif',
                  maxWidth: '90%',
                }}
              >
                Innovate. Grow. Thrive
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Youtube Channel Section */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Blurred Background Image */}
        <img
          src={businessImages.WD_image} // Replace with your image path
          alt="background"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'blur(8px)',
            zIndex: 0,
          }}
        />

        {/* Foreground Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '40px',
            background: 'none', // Optional: semi-transparent layer for contrast
            padding: '40px 20px',
            borderRadius: '16px',
            margin: '20px auto',
            maxWidth: '1200px',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ flex: '1 1 400px', minWidth: '300px' }}>
            <YoutubeEmbed videoId="fWk0YKyVGBk" />
          </div>

          <div style={{ flex: '1 1 300px', minWidth: '250px' }}>
            <h3
              fontFamily="Montserrat, sans-serif"
              fontWeight="400px"
              style={{
                marginTop: isSmallScreen ? '10px' : isMediumScreen ? '0' : '0',
                marginBottom: '10px',
                color: '#fff',
              }}
            >
              Follow us on
            </h3>
            <SocialLinks />
          </div>
        </div>
      </div>

      {/* message from the ceo */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '16px',
          margin: '40px 20px',
        }}
      >
        {/* Foreground Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            background: 'rgba(255, 255, 255, 0.8)',
            padding: '40px 30px',
            borderRadius: '16px',
            maxWidth: '1000px',
            margin: '0 auto',
            textAlign: 'center',
            fontFamily: 'Montserrat, sans-serif',
          }}
        >
          <img
            src={businessImages.CEO_image}
            alt="CEO Busay Bright"
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              objectFit: 'cover',
              marginBottom: '20px',
              border: '3px solid #4a4a4a',
            }}
          />
          <h2
            style={{
              fontSize: '24px',
              marginBottom: '10px',
              color: '#333',
              fontFamily: 'Montserrat, sans-serif',
            }}
          >
            A Message from Our CEO
          </h2>

          {ceoMessage.map((text, index) => (
            <p
              key={index}
              style={{
                fontSize: '16px',
                lineHeight: '1.6',
                color: index === 2 ? '#444' : '#222',
                maxWidth: '800px',
                fontFamily: 'Montserrat, sans-serif',
                margin: index === 2 ? '30px auto 0' : '20px auto 0',
                fontWeight: index === 2 ? 'bold' : 'normal',
              }}
            >
              {text}
            </p>
          ))}
        </div>
      </div>
      {/* donate */}
      <section className={styles.donation}>
        <GradientCard imageSrc={donationImage2} imagePosition="left" />
        <DonateSection
          images={[donationImage1, donationImage2, donationImage1]}
          onDonateClick={() => window.open('https://www.example.com/donate', '_blank')}
        />
      </section>
      {/* Support Our Mission Section */}
      <div
        style={{
          backgroundColor: '#f5f5f5',
          padding: '60px 20px',
          borderRadius: '16px',
          margin: '40px auto',
          maxWidth: '1000px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '30px',
            fontFamily: 'Montserrat, sans-serif',
          }}
        >
          Support Our Mission
        </h2>
        <p
          style={{
            fontSize: '16px',
            color: '#555',
            lineHeight: '1.6',
            maxWidth: '800px',
            margin: '0 auto 20px',
            fontFamily: 'Montserrat, sans-serif',
          }}
        >
          Nimitech IT is committed to providing impactful digital solutions and empowering
          businesses with the tools to succeed. Your support helps us grow and serve more
          communities. You can support us through the details below.
        </p>
        {/* Additional Mission */}
        <div
          style={{
            position: 'relative',
            backgroundColor: '#fff',
            padding: '30px',
            borderRadius: '12px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            marginBottom: '30px',
            maxWidth: '800px',
            marginLeft: 'auto',
            marginRight: 'auto',
            textAlign: 'left',
          }}
        >
          <img
            src={businessImages.cloud1} // Replace with your image path
            alt="background"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'blur(8px)',
              zIndex: 0,
            }}
          />
          <div style={{ position: 'relative', overflow: 'hidden' }}>
            <h3
              style={{
                color: '#ac00d6',
                fontWeight: 'bold',
                marginBottom: '15px',
                fontFamily: 'Montserrat, sans-serif',
              }}
            >
              Help Feed Hungry Kids in Africa — Support Nimitech’s Fight Against Malnutrition
            </h3>
            <p
              style={{
                fontFamily: 'Montserrat, sans-serif',
                color: '#fff',
                fontWeight: '600',
                lineHeight: '1.6',
                fontSize: '16px',
              }}
            >
              At <strong>Nimitech IT</strong>, we believe in using technology and community to make
              a real difference. Every day, millions of children in Africa suffer from hunger and
              malnutrition, threatening their health and future. By donating as little as{' '}
              <strong>$1 a day</strong>, you can help provide nutritious meals and essential support
              to vulnerable kids, giving them a chance to thrive.
            </p>
            <p
              style={{
                color: '#fff',
                fontWeight: '600',
                lineHeight: '1.6',
                fontSize: '16px',
                marginTop: '10px',
                fontFamily: 'Montserrat, sans-serif',
              }}
            >
              Join us in this vital mission—your small contribution can create a big impact.
              Together, we can fight hunger, nourish hope, and build brighter futures.
            </p>
            <p style={{ fontWeight: 'bold', color: '#fff', marginTop: '15px' }}>
              Donate today and be a part of the change. Every dollar counts!
            </p>
          </div>
        </div>
      </div>
      {/* Testimonials Slider */}
      <div style={{ padding: isSmallScreen ? '50px 20px' : '70px 40px' }}>
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={20}
          slidesPerView={isSmallScreen ? 1 : isMediumScreen ? 2 : 3}
          autoplay={{ delay: 5000 }}
          pagination={{ clickable: true }}
          dir="rtl" // Right to left
          loop={true}
          style={{ paddingBottom: '40px' }}
        >
          {testimonials.map((item, index) => (
            <SwiperSlide key={index}>
              <ClientReview
                image={item.image}
                course={item.course}
                name={item.name}
                review={item.review}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
