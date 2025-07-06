import Head from "next/head";
import React, { useState } from "react";

import SupplierProductForm from "../components/supplier-product-form";
import Layout from "../layouts/Main";
import type { B2BProduct } from "../types/b2b";
import { sampleB2BProducts } from "../utils/data/b2b-products";

interface SupplierStats {
  totalProducts: number;
  activeNegotiations: number;
  completedDeals: number;
  totalRevenue: number;
  averageRating: number;
}

const mockSupplierStats: SupplierStats = {
  totalProducts: 12,
  activeNegotiations: 5,
  completedDeals: 28,
  totalRevenue: 485750,
  averageRating: 4.8,
};

const SupplierDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "products" | "add-product" | "negotiations" | "analytics"
  >("overview");
  const [supplierProducts, setSupplierProducts] = useState<B2BProduct[]>(
    sampleB2BProducts.slice(0, 3),
  );
  const [stats, setStats] = useState<SupplierStats>(mockSupplierStats);
  const [showProductForm, setShowProductForm] = useState(false);

  // Handle new product submission
  const handleProductSubmit = (
    productData: Omit<B2BProduct, "id" | "createdAt" | "updatedAt">,
  ) => {
    const newProduct: B2BProduct = {
      ...productData,
      id: `prod_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setSupplierProducts((prev) => [newProduct, ...prev]);
    setStats((prev) => ({ ...prev, totalProducts: prev.totalProducts + 1 }));
    setShowProductForm(false);
    setActiveTab("products");
  };

  // Toggle product active status
  const toggleProductStatus = (productId: string) => {
    setSupplierProducts((prev) =>
      prev.map((product) =>
        product.id === productId
          ? { ...product, isActive: !product.isActive, updatedAt: new Date() }
          : product,
      ),
    );
  };

  return (
    <>
      <Head>
        <title>Supplier Dashboard - B2B AI Marketplace</title>
        <meta
          name="description"
          content="Manage your B2B products, negotiations, and analytics"
        />
      </Head>

      <Layout>
        <div className="supplier-dashboard">
          {/* Header */}
          <div className="dashboard-header">
            <div className="supplier-info">
              <h1>🏭 Supplier Dashboard</h1>
              <p>Premium Steel Solutions GmbH</p>
            </div>
            <div className="quick-actions">
              <button
                className="add-product-btn"
                onClick={() => {
                  setShowProductForm(true);
                  setActiveTab("add-product");
                }}
              >
                + Add Product
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="tab-navigation">
            <button
              className={`tab ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              📊 Overview
            </button>
            <button
              className={`tab ${activeTab === "products" ? "active" : ""}`}
              onClick={() => setActiveTab("products")}
            >
              📦 Products ({supplierProducts.length})
            </button>
            <button
              className={`tab ${activeTab === "add-product" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("add-product");
                setShowProductForm(true);
              }}
            >
              ➕ Add Product
            </button>
            <button
              className={`tab ${activeTab === "negotiations" ? "active" : ""}`}
              onClick={() => setActiveTab("negotiations")}
            >
              🤝 Negotiations ({stats.activeNegotiations})
            </button>
            <button
              className={`tab ${activeTab === "analytics" ? "active" : ""}`}
              onClick={() => setActiveTab("analytics")}
            >
              📈 Analytics
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="overview-content">
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">📦</div>
                    <div className="stat-info">
                      <h3>{stats.totalProducts}</h3>
                      <p>Total Products</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">🤝</div>
                    <div className="stat-info">
                      <h3>{stats.activeNegotiations}</h3>
                      <p>Active Negotiations</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">✅</div>
                    <div className="stat-info">
                      <h3>{stats.completedDeals}</h3>
                      <p>Completed Deals</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">💰</div>
                    <div className="stat-info">
                      <h3>€{stats.totalRevenue.toLocaleString()}</h3>
                      <p>Total Revenue</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">⭐</div>
                    <div className="stat-info">
                      <h3>{stats.averageRating}/5.0</h3>
                      <p>Average Rating</p>
                    </div>
                  </div>
                </div>

                <div className="recent-activity">
                  <h2>📋 Recent Activity</h2>
                  <div className="activity-list">
                    <div className="activity-item">
                      <span className="activity-icon">🤝</span>
                      <div className="activity-details">
                        <p>
                          <strong>New negotiation started</strong>
                        </p>
                        <p>Industrial bolts - 5,000 units - €227,500</p>
                        <span className="activity-time">2 hours ago</span>
                      </div>
                    </div>

                    <div className="activity-item">
                      <span className="activity-icon">✅</span>
                      <div className="activity-details">
                        <p>
                          <strong>Deal completed</strong>
                        </p>
                        <p>Office chairs - 50 units - €15,750</p>
                        <span className="activity-time">1 day ago</span>
                      </div>
                    </div>

                    <div className="activity-item">
                      <span className="activity-icon">📦</span>
                      <div className="activity-details">
                        <p>
                          <strong>Product updated</strong>
                        </p>
                        <p>LED lighting systems - Price adjusted</p>
                        <span className="activity-time">2 days ago</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="quick-insights">
                  <h2>💡 Quick Insights</h2>
                  <div className="insights-grid">
                    <div className="insight-card">
                      <h4>🔥 Top Performing Product</h4>
                      <p>Industrial Stainless Steel Bolts</p>
                      <span className="insight-metric">
                        8 negotiations this month
                      </span>
                    </div>

                    <div className="insight-card">
                      <h4>📈 Growth Trend</h4>
                      <p>Negotiations increased by 35%</p>
                      <span className="insight-metric">
                        Compared to last month
                      </span>
                    </div>

                    <div className="insight-card">
                      <h4>⚡ AI Performance</h4>
                      <p>92% negotiation success rate</p>
                      <span className="insight-metric">
                        Above marketplace average
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === "products" && (
              <div className="products-content">
                <div className="products-header">
                  <h2>📦 Your Products</h2>
                  <button
                    className="add-product-btn"
                    onClick={() => {
                      setShowProductForm(true);
                      setActiveTab("add-product");
                    }}
                  >
                    + Add New Product
                  </button>
                </div>

                <div className="products-grid">
                  {supplierProducts.map((product) => (
                    <div
                      key={product.id}
                      className={`product-card ${!product.isActive ? "inactive" : ""}`}
                    >
                      <div className="product-header">
                        <h3>{product.name}</h3>
                        <div className="product-actions">
                          <button
                            className={`status-toggle ${product.isActive ? "active" : "inactive"}`}
                            onClick={() => toggleProductStatus(product.id)}
                          >
                            {product.isActive ? "Active" : "Inactive"}
                          </button>
                        </div>
                      </div>

                      <p className="product-description">
                        {product.description}
                      </p>

                      <div className="product-details">
                        <div className="detail-row">
                          <span>Category:</span>
                          <span>{product.category}</span>
                        </div>
                        <div className="detail-row">
                          <span>SKU:</span>
                          <span>{product.sku}</span>
                        </div>
                        <div className="detail-row">
                          <span>Price Range:</span>
                          <span>
                            €
                            {Math.min(
                              ...product.commercialTerms.pricing.map(
                                (p) => p.unitPrice,
                              ),
                            ).toFixed(2)}{" "}
                            - €
                            {Math.max(
                              ...product.commercialTerms.pricing.map(
                                (p) => p.unitPrice,
                              ),
                            ).toFixed(2)}
                          </span>
                        </div>
                        <div className="detail-row">
                          <span>Lead Time:</span>
                          <span>
                            {product.commercialTerms.leadTime.min}-
                            {product.commercialTerms.leadTime.max}{" "}
                            {product.commercialTerms.leadTime.unit}
                          </span>
                        </div>
                      </div>

                      <div className="product-stats">
                        <div className="stat">
                          <span className="stat-value">3</span>
                          <span className="stat-label">
                            Active Negotiations
                          </span>
                        </div>
                        <div className="stat">
                          <span className="stat-value">12</span>
                          <span className="stat-label">Total Views</span>
                        </div>
                        <div className="stat">
                          <span className="stat-value">85%</span>
                          <span className="stat-label">Match Score</span>
                        </div>
                      </div>

                      <div className="product-actions-footer">
                        <button className="edit-btn">✏️ Edit</button>
                        <button className="view-btn">👁️ View Details</button>
                        <button className="analytics-btn">📊 Analytics</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add Product Tab */}
            {activeTab === "add-product" && showProductForm && (
              <div className="add-product-content">
                <SupplierProductForm
                  onProductSubmit={handleProductSubmit}
                  onCancel={() => {
                    setShowProductForm(false);
                    setActiveTab("products");
                  }}
                />
              </div>
            )}

            {/* Negotiations Tab */}
            {activeTab === "negotiations" && (
              <div className="negotiations-content">
                <h2>🤝 Active Negotiations</h2>

                <div className="negotiations-list">
                  <div className="negotiation-card">
                    <div className="negotiation-header">
                      <h3>Industrial Stainless Steel Bolts</h3>
                      <span className="status-badge active">Active</span>
                    </div>

                    <div className="negotiation-details">
                      <div className="detail-row">
                        <span>Buyer:</span>
                        <span>Industrial Manufacturing Corp.</span>
                      </div>
                      <div className="detail-row">
                        <span>Quantity:</span>
                        <span>5,000 units</span>
                      </div>
                      <div className="detail-row">
                        <span>Current Offer:</span>
                        <span>€45.50 per unit</span>
                      </div>
                      <div className="detail-row">
                        <span>Progress:</span>
                        <span>Round 3 of 8</span>
                      </div>
                    </div>

                    <div className="negotiation-progress">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: "37.5%" }}
                        ></div>
                      </div>
                      <span>37.5% Complete</span>
                    </div>

                    <div className="negotiation-actions">
                      <button className="view-btn">👁️ View Details</button>
                      <button className="monitor-btn">📡 Monitor Live</button>
                    </div>
                  </div>

                  <div className="negotiation-card">
                    <div className="negotiation-header">
                      <h3>Premium Office Chairs</h3>
                      <span className="status-badge pending">
                        Pending Response
                      </span>
                    </div>

                    <div className="negotiation-details">
                      <div className="detail-row">
                        <span>Buyer:</span>
                        <span>Corporate Solutions Ltd.</span>
                      </div>
                      <div className="detail-row">
                        <span>Quantity:</span>
                        <span>100 units</span>
                      </div>
                      <div className="detail-row">
                        <span>Current Offer:</span>
                        <span>€285.00 per unit</span>
                      </div>
                      <div className="detail-row">
                        <span>Progress:</span>
                        <span>Round 1 of 8</span>
                      </div>
                    </div>

                    <div className="negotiation-progress">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: "12.5%" }}
                        ></div>
                      </div>
                      <span>12.5% Complete</span>
                    </div>

                    <div className="negotiation-actions">
                      <button className="view-btn">👁️ View Details</button>
                      <button className="respond-btn">💬 Respond</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === "analytics" && (
              <div className="analytics-content">
                <h2>📈 Analytics & Performance</h2>

                <div className="analytics-grid">
                  <div className="analytics-card">
                    <h3>💰 Revenue Trends</h3>
                    <div className="chart-placeholder">
                      <p>📊 Revenue chart would go here</p>
                      <div className="trend-info">
                        <span className="trend-up">↗️ +23% this month</span>
                      </div>
                    </div>
                  </div>

                  <div className="analytics-card">
                    <h3>🤝 Negotiation Success Rate</h3>
                    <div className="chart-placeholder">
                      <div className="success-rate">
                        <span className="rate-value">92%</span>
                        <span className="rate-label">Success Rate</span>
                      </div>
                      <p>Above marketplace average of 78%</p>
                    </div>
                  </div>

                  <div className="analytics-card">
                    <h3>📦 Product Performance</h3>
                    <div className="product-rankings">
                      <div className="ranking-item">
                        <span className="rank">1.</span>
                        <span className="product">Industrial Bolts</span>
                        <span className="performance">8 deals</span>
                      </div>
                      <div className="ranking-item">
                        <span className="rank">2.</span>
                        <span className="product">Office Chairs</span>
                        <span className="performance">5 deals</span>
                      </div>
                      <div className="ranking-item">
                        <span className="rank">3.</span>
                        <span className="product">LED Lighting</span>
                        <span className="performance">3 deals</span>
                      </div>
                    </div>
                  </div>

                  <div className="analytics-card">
                    <h3>⭐ Customer Satisfaction</h3>
                    <div className="satisfaction-metrics">
                      <div className="metric">
                        <span className="metric-value">4.8/5.0</span>
                        <span className="metric-label">Average Rating</span>
                      </div>
                      <div className="metric">
                        <span className="metric-value">95%</span>
                        <span className="metric-label">On-time Delivery</span>
                      </div>
                      <div className="metric">
                        <span className="metric-value">98%</span>
                        <span className="metric-label">Quality Score</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <style jsx>{`
          .supplier-dashboard {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
            font-family:
              -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          }

          .dashboard-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid var(--color-border-light);
          }

          .supplier-info h1 {
            font-size: 2.5rem;
            margin-bottom: 5px;
            color: #2c3e50;
          }

          .supplier-info p {
            color: #6c757d;
            font-size: 1.1rem;
            margin: 0;
          }

          .add-product-btn {
            padding: 12px 24px;
            background: #28a745;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            font-size: 1rem;
            transition: all 0.3s;
          }

          .add-product-btn:hover {
            background: #218838;
            transform: translateY(-2px);
          }

          .tab-navigation {
            display: flex;
            gap: 5px;
            margin-bottom: 30px;
            border-bottom: 1px solid #dee2e6;
          }

          .tab {
            padding: 15px 25px;
            background: none;
            border: none;
            border-bottom: 3px solid transparent;
            cursor: pointer;
            font-weight: 600;
            color: #6c757d;
            transition: all 0.3s;
          }

          .tab.active {
            color: #007bff;
            border-bottom-color: #007bff;
          }

          .tab:hover:not(.active) {
            color: #495057;
          }

          .tab-content {
            min-height: 600px;
          }

          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
          }

          .stat-card {
            background: white;
            padding: 25px;
            border-radius: 10px;
            border: 1px solid #dee2e6;
            display: flex;
            align-items: center;
            gap: 15px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s;
          }

          .stat-card:hover {
            transform: translateY(-3px);
          }

          .stat-icon {
            font-size: 2.5rem;
          }

          .stat-info h3 {
            margin: 0 0 5px 0;
            font-size: 2rem;
            color: #2c3e50;
          }

          .stat-info p {
            margin: 0;
            color: #6c757d;
            font-weight: 600;
          }

          .recent-activity {
            background: white;
            padding: 30px;
            border-radius: 10px;
            border: 1px solid #dee2e6;
            margin-bottom: 30px;
          }

          .recent-activity h2 {
            margin-top: 0;
            margin-bottom: 25px;
            color: #2c3e50;
          }

          .activity-list {
            display: flex;
            flex-direction: column;
            gap: 15px;
          }

          .activity-item {
            display: flex;
            align-items: flex-start;
            gap: 15px;
            padding: 15px;
            background: var(--color-background);
            border-radius: 8px;
          }

          .activity-icon {
            font-size: 1.5rem;
            margin-top: 2px;
          }

          .activity-details p {
            margin: 0 0 5px 0;
          }

          .activity-time {
            color: #6c757d;
            font-size: 0.9rem;
          }

          .quick-insights {
            background: white;
            padding: 30px;
            border-radius: 10px;
            border: 1px solid #dee2e6;
          }

          .quick-insights h2 {
            margin-top: 0;
            margin-bottom: 25px;
            color: #2c3e50;
          }

          .insights-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
          }

          .insight-card {
            padding: 20px;
            background: var(--color-background);
            border-radius: 8px;
            border-left: 4px solid #007bff;
          }

          .insight-card h4 {
            margin: 0 0 10px 0;
            color: #495057;
          }

          .insight-card p {
            margin: 0 0 5px 0;
            font-weight: 600;
            color: #2c3e50;
          }

          .insight-metric {
            color: #6c757d;
            font-size: 0.9rem;
          }

          .products-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
          }

          .products-header h2 {
            margin: 0;
            color: #2c3e50;
          }

          .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 25px;
          }

          .product-card {
            background: white;
            padding: 25px;
            border-radius: 10px;
            border: 1px solid #dee2e6;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            transition: all 0.3s;
          }

          .product-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }

          .product-card.inactive {
            opacity: 0.6;
          }

          .product-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 15px;
          }

          .product-header h3 {
            margin: 0;
            color: #2c3e50;
            flex: 1;
          }

          .status-toggle {
            padding: 5px 12px;
            border: none;
            border-radius: 15px;
            font-size: 0.8rem;
            font-weight: 600;
            cursor: pointer;
          }

          .status-toggle.active {
            background: #e8f5e8;
            color: #155724;
          }

          .status-toggle.inactive {
            background: #f8d7da;
            color: #721c24;
          }

          .product-description {
            color: #6c757d;
            margin-bottom: 20px;
            line-height: 1.5;
          }

          .product-details {
            margin-bottom: 20px;
          }

          .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 0.9rem;
          }

          .detail-row span:first-child {
            color: #6c757d;
          }

          .detail-row span:last-child {
            font-weight: 600;
            color: #495057;
          }

          .product-stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin-bottom: 20px;
            padding: 15px;
            background: var(--color-background);
            border-radius: 8px;
          }

          .stat {
            text-align: center;
          }

          .stat-value {
            display: block;
            font-size: 1.2rem;
            font-weight: 600;
            color: #2c3e50;
          }

          .stat-label {
            font-size: 0.8rem;
            color: #6c757d;
          }

          .product-actions-footer {
            display: flex;
            gap: 10px;
          }

          .edit-btn,
          .view-btn,
          .analytics-btn {
            flex: 1;
            padding: 8px 12px;
            border: 1px solid #dee2e6;
            background: white;
            border-radius: 5px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: all 0.2s;
          }

          .edit-btn:hover {
            background: #007bff;
            color: white;
            border-color: #007bff;
          }

          .view-btn:hover {
            background: #28a745;
            color: white;
            border-color: #28a745;
          }

          .analytics-btn:hover {
            background: #ffc107;
            color: #212529;
            border-color: #ffc107;
          }

          .negotiations-list {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }

          .negotiation-card {
            background: white;
            padding: 25px;
            border-radius: 10px;
            border: 1px solid #dee2e6;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .negotiation-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }

          .negotiation-header h3 {
            margin: 0;
            color: #2c3e50;
          }

          .status-badge {
            padding: 5px 12px;
            border-radius: 15px;
            font-size: 0.8rem;
            font-weight: 600;
          }

          .status-badge.active {
            background: #e8f5e8;
            color: #155724;
          }

          .status-badge.pending {
            background: #fff3cd;
            color: #856404;
          }

          .negotiation-details {
            margin-bottom: 20px;
          }

          .negotiation-progress {
            margin-bottom: 20px;
          }

          .progress-bar {
            width: 100%;
            height: 8px;
            background: var(--color-border-light);
            border-radius: 4px;
            overflow: hidden;
            margin-bottom: 5px;
          }

          .progress-fill {
            height: 100%;
            background: #007bff;
            transition: width 0.3s ease;
          }

          .negotiation-actions {
            display: flex;
            gap: 10px;
          }

          .monitor-btn,
          .respond-btn {
            padding: 8px 16px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 600;
          }

          .monitor-btn {
            background: #17a2b8;
            color: white;
          }

          .respond-btn {
            background: #ffc107;
            color: #212529;
          }

          .analytics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 25px;
          }

          .analytics-card {
            background: white;
            padding: 25px;
            border-radius: 10px;
            border: 1px solid #dee2e6;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .analytics-card h3 {
            margin-top: 0;
            margin-bottom: 20px;
            color: #2c3e50;
          }

          .chart-placeholder {
            text-align: center;
            padding: 40px 20px;
            background: var(--color-background);
            border-radius: 8px;
            color: #6c757d;
          }

          .trend-up {
            color: #28a745;
            font-weight: 600;
          }

          .success-rate {
            margin-bottom: 15px;
          }

          .rate-value {
            display: block;
            font-size: 3rem;
            font-weight: 600;
            color: #28a745;
          }

          .rate-label {
            color: #6c757d;
          }

          .product-rankings {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          .ranking-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            background: var(--color-background);
            border-radius: 5px;
          }

          .rank {
            font-weight: 600;
            color: #007bff;
          }

          .performance {
            color: #28a745;
            font-weight: 600;
          }

          .satisfaction-metrics {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
            gap: 20px;
          }

          .metric {
            text-align: center;
          }

          .metric-value {
            display: block;
            font-size: 1.5rem;
            font-weight: 600;
            color: #2c3e50;
          }

          .metric-label {
            font-size: 0.9rem;
            color: #6c757d;
          }

          @media (max-width: 768px) {
            .dashboard-header {
              flex-direction: column;
              gap: 15px;
              text-align: center;
            }

            .tab-navigation {
              flex-wrap: wrap;
            }

            .stats-grid,
            .insights-grid,
            .products-grid,
            .analytics-grid {
              grid-template-columns: 1fr;
            }

            .product-actions-footer {
              flex-direction: column;
            }

            .negotiation-actions {
              flex-direction: column;
            }
          }
        `}</style>
      </Layout>
    </>
  );
};

export default SupplierDashboard;
