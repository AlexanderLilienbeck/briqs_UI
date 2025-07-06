import Footer from "@/components/footer";
import PageIntro from "@/components/page-intro";
import ProductsFeatured from "@/components/products-featured";
import Subscribe from "@/components/subscribe";

import Layout from "../layouts/Main";

const IndexPage = () => {
  return (
    <Layout>
      <PageIntro />

            {/* Featured Products Section */}
            <ProductsFeatured />


      {/* How It Works Section */}
      <section className="featured">
        <div className="container">
          <article className="featured-item featured-item-large">
            <div className="featured-item__content">
              <h3>How AI Negotiation Works</h3>
              <ol style={{ textAlign: "left", marginBottom: "20px" }}>
                <li>Submit your procurement request via voice or text</li>
                <li>AI agents instantly match you with qualified suppliers</li>
                <li>Watch real-time negotiations between AI agents</li>
                <li>Review and approve final contract terms</li>
              </ol>
              <a href="/negotiation" className="btn btn--rounded">
                Start Your First Negotiation
              </a>
            </div>
          </article>

          <article className="featured-item featured-item-small-first">
            <div className="featured-item__content">
              <h3>Voice-Enabled Requests</h3>
              <p>
                Describe your needs in German or English - our AI understands
                complex B2B requirements.
              </p>
              <a href="/negotiation" className="btn btn--rounded">
                Try Voice Input
              </a>
            </div>
          </article>

          <article className="featured-item featured-item-small">
            <div className="featured-item__content">
              <h3>24/7 AI Agents</h3>
              <p>
                Never miss a deal - our AI negotiates around the clock across
                global time zones.
              </p>
              <a href="/negotiation" className="btn btn--rounded">
                Get Started
              </a>
            </div>
          </article>
        </div>
      </section>
      
      {/* Value Propositions Section */}
      <section className="section">
        <div className="container">
          <header className="section__intro">
            <h4>Why Choose Our AI-Powered B2B Marketplace?</h4>
          </header>

          <ul className="shop-data-items">
            <li>
              <i className="icon-shipping" />
              <div className="data-item__content">
                <h4>Autonomous AI Negotiation</h4>
                <p>
                  Our AI agents handle complex B2B negotiations 24/7, securing
                  the best terms while you focus on your business operations.
                </p>
              </div>
            </li>

            <li>
              <i className="icon-payment" />
              <div className="data-item__content">
                <h4>Real-Time Transparency</h4>
                <p>
                  Watch negotiations unfold in real-time with complete
                  visibility into offers, counteroffers, and decision-making
                  processes.
                </p>
              </div>
            </li>

            <li>
              <i className="icon-cash" />
              <div className="data-item__content">
                <h4>Optimized Commercial Terms</h4>
                <p>
                  AI analyzes market data and negotiation patterns to secure
                  optimal pricing, delivery schedules, and payment terms.
                </p>
              </div>
            </li>

            <li>
              <i className="icon-materials" />
              <div className="data-item__content">
                <h4>Quality Assurance</h4>
                <p>
                  Verified suppliers with comprehensive certifications and
                  quality standards ensure reliable B2B partnerships.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </section>
      <Subscribe />
      <Footer />
    </Layout>
  );
};

export default IndexPage;
