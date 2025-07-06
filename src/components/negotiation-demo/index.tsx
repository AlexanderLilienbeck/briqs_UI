import React, { useCallback, useEffect, useState } from "react";

import type { B2BProduct, BuyerRequest } from "../../types/b2b";
import type { NegotiationStrategy } from "../../types/negotiation";
import {
  sampleB2BProducts,
  sampleBuyerRequests,
} from "../../utils/data/b2b-products";
import {
  enhancedNegotiationEngine,
  type NegotiationResult,
} from "../../utils/enhanced-negotiation-engine";
import type { NegotiationUpdateMessage } from "../../utils/websocket-service";
import { webSocketService } from "../../utils/websocket-service";

interface NegotiationDemoProps {
  className?: string;
}

const NegotiationDemo: React.FC<NegotiationDemoProps> = ({
  className = "",
}) => {
  const [isNegotiating, setIsNegotiating] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<BuyerRequest>(
    sampleBuyerRequests[0] as unknown as BuyerRequest,
  );
  const [selectedProduct, setSelectedProduct] = useState<B2BProduct>(
    sampleB2BProducts[0] as unknown as B2BProduct,
  );
  const [buyerStrategy, setBuyerStrategy] =
    useState<NegotiationStrategy>("balanced");
  const [negotiationResult, setNegotiationResult] =
    useState<NegotiationResult | null>(null);
  const [liveEvents, setLiveEvents] = useState<string[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [wsConnected, setWsConnected] = useState(false);
  const [activeNegotiationId, setActiveNegotiationId] = useState<string | null>(
    null,
  );
  const [realTimeUpdates, setRealTimeUpdates] = useState<string[]>([]);

  // WebSocket connection and real-time updates
  useEffect(() => {
    const connectWebSocket = async () => {
      try {
        const connected = await webSocketService.connect();
        setWsConnected(connected);
        console.log("WebSocket connection status:", connected);
      } catch (error) {
        console.error("Failed to connect WebSocket:", error);
        setWsConnected(false);
      }
    };

    connectWebSocket();

    return () => {
      if (activeNegotiationId) {
        webSocketService.leaveNegotiationRoom(activeNegotiationId);
      }
      webSocketService.disconnect();
    };
  }, [activeNegotiationId]);

  // Handle real-time negotiation updates
  const handleNegotiationUpdate = useCallback(
    (update: NegotiationUpdateMessage) => {
      const timestamp = new Date().toLocaleTimeString();
      const eventMessage = `[${timestamp}] 📡 ${update.data.event.message}`;

      setRealTimeUpdates((prev) => [...prev.slice(-9), eventMessage]); // Keep last 10 events
      setCurrentRound(update.data.progress.currentRound);
    },
    [],
  );

  // Handle WebSocket events
  useEffect(() => {
    if (!wsConnected) return;

    const unsubscribeUpdate = webSocketService.onNegotiationUpdate(
      handleNegotiationUpdate,
    );

    const unsubscribeThinking = webSocketService.onAgentThinking((data) => {
      const timestamp = new Date().toLocaleTimeString();
      const agentIcon = data.agentType === "buyer" ? "🛒" : "🏭";
      const message = `[${timestamp}] ${agentIcon} ${data.agentType} agent: ${data.message}`;
      setRealTimeUpdates((prev) => [...prev.slice(-9), message]);
    });

    const unsubscribeOffer = webSocketService.onOfferMade((data) => {
      const timestamp = new Date().toLocaleTimeString();
      const agentIcon = data.agentType === "buyer" ? "🛒" : "🏭";
      const message = `[${timestamp}] ${agentIcon} ${data.agentType} made an offer`;
      setRealTimeUpdates((prev) => [...prev.slice(-9), message]);
    });

    return () => {
      unsubscribeUpdate();
      unsubscribeThinking();
      unsubscribeOffer();
    };
  }, [wsConnected, handleNegotiationUpdate]);

  // Subscribe to local negotiation engine events
  useEffect(() => {
    const handleEvent = (event: any) => {
      const timestamp = new Date().toLocaleTimeString();
      const eventMessage = `[${timestamp}] ${event.message}`;
      setLiveEvents((prev) => [...prev.slice(-4), eventMessage]); // Keep last 5 events

      if (event.type === "round_started") {
        const roundNumber = parseInt(
          event.message.match(/Round (\d+)/)?.[1] || "0",
        );
        setCurrentRound(roundNumber);
      }

      // Broadcast to WebSocket if connected and in a negotiation room
      if (wsConnected && activeNegotiationId) {
        webSocketService.emitNegotiationEvent(activeNegotiationId, event);
      }
    };

    enhancedNegotiationEngine.addEventListener(handleEvent);
    return () => enhancedNegotiationEngine.removeEventListener(handleEvent);
  }, [wsConnected, activeNegotiationId]);

  const startNegotiation = async () => {
    setIsNegotiating(true);
    setNegotiationResult(null);
    setLiveEvents([]);
    setRealTimeUpdates([]);
    setCurrentRound(0);

    // Generate unique negotiation ID
    const negotiationId = `nego_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setActiveNegotiationId(negotiationId);

    // Join WebSocket room for real-time updates
    if (wsConnected) {
      const joined = await webSocketService.joinNegotiationRoom(negotiationId);
      if (joined) {
        setRealTimeUpdates((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] 📡 Connected to live negotiation room`,
        ]);
      }
    }

    try {
      const result = await enhancedNegotiationEngine.startAutomatedNegotiation(
        selectedRequest,
        selectedProduct,
        buyerStrategy,
      );
      setNegotiationResult(result);

      if (wsConnected && activeNegotiationId) {
        setRealTimeUpdates((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] 📡 Negotiation completed - final result broadcast`,
        ]);
      }
    } catch (error) {
      console.error("Negotiation failed:", error);
      setLiveEvents((prev) => [
        ...prev,
        `[ERROR] Negotiation failed: ${error}`,
      ]);
      setRealTimeUpdates((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] ❌ Negotiation error: ${error}`,
      ]);
    } finally {
      setIsNegotiating(false);

      // Leave WebSocket room
      if (wsConnected && activeNegotiationId) {
        webSocketService.leaveNegotiationRoom(activeNegotiationId);
        setActiveNegotiationId(null);
      }
    }
  };

  return (
    <div className={`negotiation-demo ${className}`}>
      <div className="demo-header">
        <h2>🤖 AI Negotiation Demo</h2>
        <p>Watch AI agents negotiate in real-time</p>
        <div className="connection-status">
          <span
            className={`status-indicator ${wsConnected ? "connected" : "disconnected"}`}
          >
            {wsConnected ? "🟢" : "🔴"} WebSocket{" "}
            {wsConnected ? "Connected" : "Disconnected"}
          </span>
          {activeNegotiationId && (
            <span className="negotiation-id">
              📡 Room: {activeNegotiationId.split("_").pop()}
            </span>
          )}
        </div>
      </div>

      {/* Configuration Section */}
      <div className="demo-config">
        <div className="config-row">
          <div className="config-item">
            <label htmlFor="buyer-request">Buyer Request:</label>
            <select
              id="buyer-request"
              value={selectedRequest.id}
              onChange={(e) => {
                const request = sampleBuyerRequests.find(
                  (r) => r.id === e.target.value,
                );
                if (request)
                  setSelectedRequest(request as unknown as BuyerRequest);
              }}
              disabled={isNegotiating}
            >
              {sampleBuyerRequests.map((request) => (
                <option key={request.id} value={request.id}>
                  {request.title}
                </option>
              ))}
            </select>
          </div>

          <div className="config-item">
            <label htmlFor="product">Supplier Product:</label>
            <select
              id="product"
              value={selectedProduct.id}
              onChange={(e) => {
                const product = sampleB2BProducts.find(
                  (p) => p.id === e.target.value,
                );
                if (product) setSelectedProduct(product);
              }}
              disabled={isNegotiating}
            >
              {sampleB2BProducts.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          <div className="config-item">
            <label htmlFor="strategy">Buyer Strategy:</label>
            <select
              id="strategy"
              value={buyerStrategy}
              onChange={(e) =>
                setBuyerStrategy(e.target.value as NegotiationStrategy)
              }
              disabled={isNegotiating}
            >
              <option value="balanced">Balanced</option>
              <option value="aggressive">Aggressive</option>
              <option value="price_focused">Price Focused</option>
              <option value="time_sensitive">Time Sensitive</option>
              <option value="quality_focused">Quality Focused</option>
              <option value="conservative">Conservative</option>
            </select>
          </div>
        </div>

        <button
          className="start-negotiation-btn"
          onClick={startNegotiation}
          disabled={isNegotiating}
        >
          {isNegotiating ? "🔄 Negotiating..." : "🚀 Start AI Negotiation"}
        </button>
      </div>

      {/* Live Updates Section */}
      {(isNegotiating ||
        liveEvents.length > 0 ||
        realTimeUpdates.length > 0) && (
        <div className="live-updates">
          <div className="updates-container">
            {/* Local Engine Updates */}
            <div className="local-updates">
              <h3>🔧 Local Engine Updates</h3>
              {isNegotiating && (
                <div className="current-round">
                  <strong>Current Round: {currentRound}</strong>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${(currentRound / 8) * 100}%` }}
                    />
                  </div>
                </div>
              )}
              <div className="event-log">
                {liveEvents.map((event, index) => (
                  <div key={index} className="event-item">
                    {event}
                  </div>
                ))}
                {isNegotiating && (
                  <div className="event-item typing">
                    <span className="typing-indicator">
                      AI agents are thinking...
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Real-time WebSocket Updates */}
            {wsConnected && (
              <div className="realtime-updates">
                <h3>📡 Real-time Updates</h3>
                <div className="event-log">
                  {realTimeUpdates.map((update, index) => (
                    <div key={index} className="event-item realtime">
                      {update}
                    </div>
                  ))}
                  {isNegotiating && activeNegotiationId && (
                    <div className="event-item typing realtime">
                      <span className="typing-indicator">
                        📡 Broadcasting live...
                      </span>
                    </div>
                  )}
                  {realTimeUpdates.length === 0 && !isNegotiating && (
                    <div className="event-item placeholder">
                      Waiting for real-time updates...
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Results Section */}
      {negotiationResult && (
        <div className="negotiation-results">
          <h3>
            {negotiationResult.success
              ? "✅ Agreement Reached!"
              : "❌ Negotiation Failed"}
          </h3>

          <div className="results-summary">
            <div className="result-item">
              <strong>Outcome:</strong> {negotiationResult.reason}
            </div>
            <div className="result-item">
              <strong>Duration:</strong>{" "}
              {negotiationResult.totalDuration.toFixed(1)} minutes
            </div>
            <div className="result-item">
              <strong>Rounds:</strong> {negotiationResult.rounds.length}
            </div>
          </div>

          {negotiationResult.success && negotiationResult.finalOffer && (
            <div className="final-deal">
              <h4>📋 Final Deal Terms</h4>
              <div className="deal-terms">
                <div className="term">
                  <strong>Price:</strong> €
                  {negotiationResult.finalOffer.pricePerUnit.toFixed(2)} per
                  unit
                </div>
                <div className="term">
                  <strong>Quantity:</strong>{" "}
                  {negotiationResult.finalOffer.quantity.toLocaleString()} units
                </div>
                <div className="term">
                  <strong>Total Value:</strong> €
                  {(
                    negotiationResult.finalOffer.pricePerUnit *
                    negotiationResult.finalOffer.quantity
                  ).toLocaleString()}
                </div>
                <div className="term">
                  <strong>Delivery:</strong>{" "}
                  {negotiationResult.finalOffer.deliveryDays} days
                </div>
                <div className="term">
                  <strong>Payment:</strong>{" "}
                  {negotiationResult.finalOffer.paymentTerms}
                </div>
              </div>
            </div>
          )}

          {negotiationResult.metrics && (
            <div className="negotiation-metrics">
              <h4>📊 Negotiation Analytics</h4>
              <div className="metrics-grid">
                <div className="metric">
                  <div className="metric-label">Buyer Savings</div>
                  <div className="metric-value">
                    {negotiationResult.metrics.priceMovement.buyerSavings.toFixed(
                      1,
                    )}
                    %
                  </div>
                </div>
                <div className="metric">
                  <div className="metric-label">Supplier Margin</div>
                  <div className="metric-value">
                    {negotiationResult.metrics.priceMovement.supplierMargin.toFixed(
                      1,
                    )}
                    %
                  </div>
                </div>
                <div className="metric">
                  <div className="metric-label">Convergence Rate</div>
                  <div className="metric-value">
                    {(negotiationResult.metrics.convergenceRate * 100).toFixed(
                      0,
                    )}
                    %
                  </div>
                </div>
                <div className="metric">
                  <div className="metric-label">Buyer Satisfaction</div>
                  <div className="metric-value">
                    {(
                      negotiationResult.metrics.satisfactionScores.buyer * 100
                    ).toFixed(0)}
                    %
                  </div>
                </div>
              </div>
            </div>
          )}

          {negotiationResult.finalContract && (
            <div className="generated-contract">
              <h4>📄 Generated Contract</h4>
              <div className="contract-preview">
                <pre>{negotiationResult.finalContract.legalDocument}</pre>
              </div>
            </div>
          )}

          {/* Negotiation History */}
          <div className="negotiation-history">
            <h4>🔄 Negotiation Rounds</h4>
            <div className="rounds-list">
              {negotiationResult.rounds.map((round, index) => (
                <div key={index} className="round-item">
                  <div className="round-header">
                    <strong>Round {round.roundNumber}</strong>
                    <span className="round-time">
                      {round.startTime.toLocaleTimeString()}
                    </span>
                  </div>

                  {round.buyerOffer && (
                    <div className="offer buyer-offer">
                      <div className="offer-header">💼 Buyer Offer</div>
                      <div className="offer-details">
                        €{round.buyerOffer.pricePerUnit.toFixed(2)} ×{" "}
                        {round.buyerOffer.quantity} units (
                        {round.buyerOffer.deliveryDays} days)
                      </div>
                      <div className="offer-reasoning">
                        {round.buyerOffer.reasoning}
                      </div>
                    </div>
                  )}

                  {round.supplierOffer && (
                    <div className="offer supplier-offer">
                      <div className="offer-header">
                        🏭 Supplier Counter-Offer
                      </div>
                      <div className="offer-details">
                        €{round.supplierOffer.pricePerUnit.toFixed(2)} ×{" "}
                        {round.supplierOffer.quantity} units (
                        {round.supplierOffer.deliveryDays} days)
                      </div>
                      <div className="offer-reasoning">
                        {round.supplierOffer.reasoning}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .negotiation-demo {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family:
            -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .demo-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .demo-header h2 {
          font-size: 2rem;
          margin-bottom: 10px;
          color: var(--color-text-primary);
        }

        .connection-status {
          display: flex;
          gap: 15px;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 15px;
        }

        .status-indicator {
          padding: 5px 12px;
          border-radius: 15px;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .status-indicator.connected {
          background: #e8f5e8;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .status-indicator.disconnected {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .negotiation-id {
          padding: 5px 10px;
          background: var(--color-border-light);
          color: var(--color-text-primary);
          border-radius: 15px;
          font-size: 0.8rem;
          font-family: monospace;
        }

        .demo-config {
          background: var(--color-background);
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 20px;
        }

        .config-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }

        .config-item {
          display: flex;
          flex-direction: column;
        }

        .config-item label {
          font-weight: 600;
          margin-bottom: 5px;
          color: var(--color-text-primary);
        }

        .config-item select {
          padding: 8px 12px;
          border: 1px solid var(--color-border);
          border-radius: 5px;
          background: white;
        }

        .start-negotiation-btn {
          width: 100%;
          padding: 15px 30px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .start-negotiation-btn:hover:not(:disabled) {
          background: #0056b3;
        }

        .start-negotiation-btn:disabled {
          background: var(--color-text-secondary);
          cursor: not-allowed;
        }

        .live-updates {
          background: var(--color-background);
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 20px;
        }

        .updates-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .local-updates,
        .realtime-updates {
          background: white;
          padding: 15px;
          border-radius: 8px;
          border: 1px solid #c3e6cb;
        }

        .realtime-updates {
          border-color: #007bff;
        }

        .live-updates h3 {
          margin-top: 0;
          color: #155724;
          font-size: 1.1rem;
        }

        .realtime-updates h3 {
          color: #007bff;
        }

        .event-item.realtime {
          color: #007bff;
          border-left: 3px solid #007bff;
          padding-left: 10px;
        }

        .event-item.placeholder {
          color: var(--color-text-secondary);
          font-style: italic;
          text-align: center;
        }

        .current-round {
          margin-bottom: 15px;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: #c3e6cb;
          border-radius: 4px;
          overflow: hidden;
          margin-top: 5px;
        }

        .progress-fill {
          height: 100%;
          background: #28a745;
          transition: width 0.3s ease;
        }

        .event-log {
          max-height: 200px;
          overflow-y: auto;
          background: white;
          padding: 15px;
          border-radius: 5px;
          border: 1px solid #c3e6cb;
        }

        .event-item {
          padding: 5px 0;
          font-family: monospace;
          font-size: 0.9rem;
          border-bottom: 1px solid #f1f3f4;
        }

        .event-item:last-child {
          border-bottom: none;
        }

        .event-item.typing {
          color: var(--color-text-secondary);
          font-style: italic;
        }

        .typing-indicator::after {
          content: "...";
          animation: typing 1.5s infinite;
        }

        @keyframes typing {
          0%,
          60% {
            content: "...";
          }
          20% {
            content: ".";
          }
          40% {
            content: "..";
          }
        }

        .negotiation-results {
          background: white;
          padding: 25px;
          border-radius: 10px;
          border: 1px solid var(--color-border);
        }

        .negotiation-results h3 {
          margin-top: 0;
          font-size: 1.5rem;
        }

        .results-summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 25px;
        }

        .result-item {
          padding: 15px;
          background: var(--color-background);
          border-radius: 5px;
        }

        .final-deal {
          margin-bottom: 25px;
          padding: 20px;
          background: var(--color-background);
          border-radius: 8px;
        }

        .deal-terms {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 10px;
          margin-top: 15px;
        }

        .term {
          padding: 10px;
          background: white;
          border-radius: 5px;
        }

        .negotiation-metrics {
          margin-bottom: 25px;
          padding: 20px;
          background: #fff3cd;
          border-radius: 8px;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
          margin-top: 15px;
        }

        .metric {
          text-align: center;
          padding: 15px;
          background: white;
          border-radius: 5px;
        }

        .metric-label {
          font-size: 0.9rem;
          color: var(--color-text-secondary);
          margin-bottom: 5px;
        }

        .metric-value {
          font-size: 1.5rem;
          font-weight: bold;
          color: var(--color-text-primary);
        }

        .generated-contract {
          margin-bottom: 25px;
        }

        .contract-preview {
          background: var(--color-background);
          padding: 20px;
          border-radius: 5px;
          border: 1px solid var(--color-border);
          max-height: 300px;
          overflow-y: auto;
        }

        .contract-preview pre {
          margin: 0;
          white-space: pre-wrap;
          font-size: 0.85rem;
          line-height: 1.4;
        }

        .negotiation-history h4 {
          margin-bottom: 15px;
        }

        .rounds-list {
          max-height: 400px;
          overflow-y: auto;
        }

        .round-item {
          margin-bottom: 20px;
          padding: 15px;
          border: 1px solid var(--color-border);
          border-radius: 8px;
          background: var(--color-surface);
        }

        .round-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 1px solid var(--color-border-light);
        }

        .round-time {
          color: var(--color-text-secondary);
          font-size: 0.9rem;
        }

        .offer {
          margin-bottom: 10px;
          padding: 15px;
          border-radius: 5px;
        }

        .buyer-offer {
          background: var(--color-background);
          border-left: 4px solid #2196f3;
        }

        .supplier-offer {
          background: var(--color-background);
          border-left: 4px solid #ff9800;
        }

        .offer-header {
          font-weight: 600;
          margin-bottom: 8px;
        }

        .offer-details {
          font-weight: 600;
          margin-bottom: 8px;
          color: var(--color-text-primary);
        }

        .offer-reasoning {
          font-size: 0.9rem;
          color: var(--color-text-secondary);
          font-style: italic;
        }

        @media (max-width: 768px) {
          .config-row {
            grid-template-columns: 1fr;
          }

          .results-summary,
          .deal-terms,
          .metrics-grid {
            grid-template-columns: 1fr;
          }

          .updates-container {
            grid-template-columns: 1fr;
          }

          .connection-status {
            flex-direction: column;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default NegotiationDemo;
