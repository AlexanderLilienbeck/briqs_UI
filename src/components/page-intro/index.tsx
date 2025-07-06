import SwiperCore, { EffectFade, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion } from "framer-motion";

const PageIntro = () => {
  SwiperCore.use([EffectFade, Navigation]);

  return (
    <section className="page-intro">
      <Swiper navigation effect="fade" className="swiper-wrapper">
        <SwiperSlide>
          <div
            className="page-intro__slide"
            style={{ backgroundImage: "url('/images/slide-1.jpg')" }}
          >
            <div className="container">
              <div className="page-intro__slide__content">
                <h2>Turn a Week of Emails into a 2-Minute Deal.</h2>
                <h3 className="">
                  BRIQS is the AI-powered marketplace that negotiates your industrial supply deals for you. Brick-solid deals, lightning fast.
                </h3>
                
                {/* Pulsierender Button */}
                <motion.a 
                  href="/negotiation" 
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '240px',
                    height: '40px',
                    backgroundColor: 'var(--color-accent)',
                    color: 'var(--color-accent-text)',
                    textDecoration: 'none',
                    borderRadius: '10px',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                  animate={{
                    scale: [1, 1.05, 1],
                    boxShadow: [
                      '0 0 0 0 rgba(251, 245, 239, 0)',
                      '0 0 0 8px rgba(251, 245, 239, 0.3)',
                      '0 0 0 0 rgba(251, 245, 239, 0)'
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <i className="icon-right" style={{ marginRight: '8px' }} />
                  Start negotiating
                </motion.a>
              </div>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div
            className="page-intro__slide"
            style={{ backgroundImage: "url('/images/slide-2.jpg')" }}
            >
            <div className="container">
              <div className="page-intro__slide__content">
                <h2> </h2>
                <h3 className="">
                 
                </h3>
                
                {/* Pulsierender Button */}
                <motion.a 
                  href="/negotiation" 
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '240px',
                    height: '40px',
                    backgroundColor: 'var(--color-accent)',
                    color: 'var(--color-accent-text)',
                    textDecoration: 'none',
                    borderRadius: '10px',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                  animate={{
                    scale: [1, 1.05, 1],
                    boxShadow: [
                      '0 0 0 0 rgba(251, 245, 239, 0)',
                      '0 0 0 8px rgba(251, 245, 239, 0.3)',
                      '0 0 0 0 rgba(251, 245, 239, 0)'
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <i className="icon-right" style={{ marginRight: '8px' }} />
                  Start negotiating
                </motion.a>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>

      <div className="shop-data">
        <div className="container">
          <ul className="shop-data__items">
            <li>
              <i>1</i>
              <div className="data-item__content">
                <h4>Tell us your perfect Deal</h4>
                <p>
                  Describe the desired product, price range and your preferred terms and compromis positions.
                </p>
              </div>
            </li>

            <li>
              <i>2</i>
              <div className="data-item__content">
                <h4>AI Agents Start negotiating</h4>
                <p>
                  The Buyers' AI Agents starts negotiating with the Agents of the Sellers and try to agree on a deal that meets the Desired terms.
                </p>
              </div>
            </li>

            <li>
              <i>3</i>
              <div className="data-item__content">
                <h4>Accept and Sign or Decline</h4>
                <p>
                  In minutes Your agent will present you with the deals he was able to achieve. Select the best one for you and sign online.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default PageIntro;
