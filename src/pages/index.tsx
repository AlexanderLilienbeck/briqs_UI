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
            <h3>Over time briq learns from you.</h3>
              <p>
                Your AI agents will remain within the guardrail of your negotiation playbook. Whenever they are faced with a position that requires to find a more bespoke compromise position it takes your past signed deals and commonly used positions into account.
              </p>
              <a href="/negotiation" className="btn btn--rounded">
                Start Your First Negotiation
              </a>
            </div>
          </article>

          <article className="featured-item featured-item-small-first">
            <div className="featured-item__content">
              <h3>Voice First.</h3>
              <p>
                Describe your product specs and preferred terms just as you would tell your procurement team.
              </p>
              <a href="/negotiation" className="btn btn--rounded">
                Try Voice Input
              </a>
            </div>
          </article>

          <article className="featured-item featured-item-small">
            <div className="featured-item__content">
              <h3>No disclosure.</h3>
              <p>
                Your AI Agent keeps your negoiation strategies and arguments private. Just the closed deal will visible to human.
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
                <h4>Quickest Deal closing</h4>
                <p>
                  Our AI agents handle complex B2B negotiations 24/7 and super fast, securing
                  the best terms in less time while you focus on your business operations.
                </p>
              </div>
            </li>

            <li>
              <i className="icon-payment" />
              <div className="data-item__content">
                <h4>Best deals possible</h4>
                <p>
                  The negotiation agents will finde the best possible deal for you, learning from your previouse activity. But you have the final word to accept or reject that.
                </p>
              </div>
            </li>

            <li>
              <i className="icon-materials" />
              <div className="data-item__content">
                <h4>No borders. No limits.</h4>
                <p>
                  Worldwide negotiations, no language or cultural borders anymore. 
                </p>
              </div>
            </li>

            <li>
              <i className="icon-cash" />
              <div className="data-item__content">
                <h4>Saves time & money.</h4>
                <p>
                  You used to spend days with email back and forth, discussing fineprint, just to find the dealbreaker last minute. Let an AI Agent negotiate with your negotiation guidelines and playbook.
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
