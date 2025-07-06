import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Breadcrumb from "@/components/breadcrumb";
import Footer from "@/components/footer";
import Layout from "../layouts/Main";
import { 
  NegotiationData, 
  VoiceRecordingState, 
  NegotiationProgress,
  mockNegotiationResults,
  mockContractPositions,
  negotiationSteps,
  ContractPosition,
  NegotiationDeal
} from "@/types/negotiation";

const NegotiationPage: React.FC = () => {
  const router = useRouter();
  
  // Main state management
  const [negotiationData, setNegotiationData] = useState<NegotiationData>({
    step: 1,
    applyStandardTerms: true,
    requirements: [],
    deals: []
  });
  
  // Voice recording state
  const [voiceState, setVoiceState] = useState<VoiceRecordingState>({
    isRecording: false,
    isProcessing: false,
    transcript: "",
    confidence: 0
  });
  
  // Negotiation progress state
  const [progressState, setProgressState] = useState<NegotiationProgress>({
    currentStep: "Initializing...",
    progress: 0,
    suppliersContacted: 0,
    responsesReceived: 0,
    activeNegotiations: 0,
    completedDeals: 0,
    estimatedTimeRemaining: "2-3 minutes",
    statusMessages: []
  });
  
  // Loading states
  const [isNegotiating, setIsNegotiating] = useState(false);
  const [editingRequirement, setEditingRequirement] = useState<string | null>(null);

  // Voice recording functions
  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        setVoiceState(prev => ({
          ...prev,
          isRecording: false,
          audioBlob,
          audioUrl,
          mediaRecorder: undefined
        }));
        
        // Also try speech recognition if available
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
          const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
          const recognition = new SpeechRecognition();
          
          recognition.continuous = false;
          recognition.interimResults = false;
          recognition.lang = 'en-US';
          
          recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            const confidence = event.results[0][0].confidence;
            
            setVoiceState(prev => ({
              ...prev,
              transcript,
              confidence: Math.round(confidence * 100)
            }));
            
            setNegotiationData(prev => ({
              ...prev,
              voiceInput: transcript
            }));
          };
          
          recognition.onerror = (event) => {
            setVoiceState(prev => ({
              ...prev,
              error: 'Voice recognition failed, but audio was recorded.'
            }));
          };
          
          // Create audio element and play for recognition
          const audio = new Audio(audioUrl);
          audio.play();
          recognition.start();
        }
        
        // Clean up stream
        stream.getTracks().forEach(track => track.stop());
      };
      
      setVoiceState(prev => ({
        ...prev,
        isRecording: true,
        error: undefined,
        mediaRecorder
      }));
      
      mediaRecorder.start();
      
    } catch (error) {
      setVoiceState(prev => ({
        ...prev,
        error: 'Microphone access denied. Please use text input.'
      }));
    }
  };

  const stopVoiceRecording = () => {
    if (voiceState.mediaRecorder && voiceState.mediaRecorder.state === 'recording') {
      voiceState.mediaRecorder.stop();
      // Auto-advance directly to step 3 after voice recording
      setTimeout(() => {
        if (negotiationData.step === 1) {
          setNegotiationData(prev => ({ ...prev, step: 3 }));
        }
      }, 1000); // Longer delay to allow for speech recognition processing
    }
  };

  // Step navigation
  const goToStep = (step: number) => {
    setNegotiationData(prev => ({ ...prev, step }));
  };

  const nextStep = () => {
    if (negotiationData.step < 5) {
      // If we're on step 1 and have voice transcript, skip step 2 and go to step 3
      if (negotiationData.step === 1 && voiceState.transcript) {
        setNegotiationData(prev => ({ ...prev, step: 3 }));
      } else {
        setNegotiationData(prev => ({ ...prev, step: prev.step + 1 }));
      }
    }
  };

  // Requirement editing
  const updateRequirement = (id: string, newValue: string) => {
    setNegotiationData(prev => ({
      ...prev,
      requirements: prev.requirements.map(req => 
        req.id === id ? { ...req, value: newValue } : req
      )
    }));
  };

  const deleteRequirement = (id: string) => {
    setNegotiationData(prev => ({
      ...prev,
      requirements: prev.requirements.filter(req => req.id !== id)
    }));
  };

  // Start AI negotiation simulation
  const startNegotiation = () => {
    setIsNegotiating(true);
    setNegotiationData(prev => ({ 
      ...prev, 
      step: 4,
      requirements: mockContractPositions 
    }));
    
    // Simulate negotiation progress
    simulateNegotiationProgress();
  };

  const simulateNegotiationProgress = () => {
    const steps = [
      { step: "Analyzing requirements...", progress: 10, suppliers: 0 },
      { step: "Contacting suppliers...", progress: 25, suppliers: 15 },
      { step: "Receiving initial offers...", progress: 40, suppliers: 15 },
      { step: "AI agents negotiating terms...", progress: 60, suppliers: 15 },
      { step: "Finalizing best deals...", progress: 80, suppliers: 15 },
      { step: "Negotiation complete!", progress: 100, suppliers: 15 }
    ];
    
    let currentStepIndex = 0;
    
    const interval = setInterval(() => {
      if (currentStepIndex < steps.length) {
        const currentStep = steps[currentStepIndex];
        setProgressState(prev => ({
          ...prev,
          currentStep: currentStep.step,
          progress: currentStep.progress,
          suppliersContacted: currentStep.suppliers,
          responsesReceived: Math.min(currentStep.suppliers, Math.floor(currentStep.progress / 10)),
          activeNegotiations: currentStep.progress < 80 ? Math.floor(currentStep.progress / 20) : 0,
          completedDeals: currentStep.progress === 100 ? 3 : 0
        }));
        
        currentStepIndex++;
      } else {
        clearInterval(interval);
        setIsNegotiating(false);
        setNegotiationData(prev => ({ 
          ...prev, 
          step: 5,
          deals: mockNegotiationResults 
        }));
      }
    }, 2000);
  };

  // Deal approval
  const approveDeal = (dealId: string) => {
    setNegotiationData(prev => ({
      ...prev,
      deals: prev.deals.map(deal => 
        deal.id === dealId ? { ...deal, status: 'approved' as const } : deal
      )
    }));
  };

  const declineDeal = (dealId: string) => {
    setNegotiationData(prev => ({
      ...prev,
      deals: prev.deals.map(deal => 
        deal.id === dealId ? { ...deal, status: 'declined' as const } : deal
      )
    }));
  };

  // Download voice recording for debugging
  const downloadVoiceRecording = () => {
    if (voiceState.audioBlob) {
      const url = URL.createObjectURL(voiceState.audioBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `voice-recording-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Layout>
      <Breadcrumb />
      
      <section className="negotiation-flow">
        <div className="container">
          
          {/* Step Progress Indicator */}
          {/* <div className="step-progress">
            <div className="step-progress-header">
              <h1>AI-Powered Negotiation</h1>
              <p>Let our AI agents find and negotiate the best deals for you</p>
            </div>
            
            <div className="step-indicators">
              {negotiationSteps.map((step, index) => (
                <div 
                  key={step.id}
                  className={`step-indicator ${negotiationData.step === step.id ? 'active' : ''} ${negotiationData.step > step.id ? 'completed' : ''}`}
                >
                  <div className="step-number">{step.id}</div>
                  <div className="step-info">
                    <h4>{step.title}</h4>
                    <p>{step.description}</p>
                  </div>
                </div>
              ))}
            </div> 
          </div>*/}

          {/* Step 1: Voice Input */}
          {negotiationData.step === 1 && (
            <div className="negotiation-step voice-input-step">
              <div className="step-content">
                <div className="voice-section">
                  <h2>Tell us what product you are looking for</h2>
                  <p>Describe the product you need, your price range, important terms, and where you could make compromises.</p>
                  
                  <div className="voice-controls">
                    <div className="voice-recording-container">
                      <motion.button
                        className="voice-recording-btn"
                        onClick={startVoiceRecording}
                        disabled={voiceState.isRecording}
                        animate={{
                          scale: voiceState.isRecording ? [1, 1.05, 1] : 1,
                          boxShadow: voiceState.isRecording ? [
                            '0 0 0 0 rgba(251, 176, 59, 0)',
                            '0 0 0 8px rgba(251, 176, 59, 0.3)',
                            '0 0 0 0 rgba(251, 176, 59, 0)'
                          ] : 'none'
                        }}
                        transition={{
                          duration: 2,
                          repeat: voiceState.isRecording ? Infinity : 0,
                          ease: "easeInOut"
                        }}
                      >
                        <div className="microphone-icon">
                          <div className="mic-capsule"></div>
                          <div className="mic-stand"></div>
                          <div className="mic-base"></div>
                        </div>
                        {voiceState.isRecording ? 'Recording...' : 'Start'}
                      </motion.button>
                      
                      {voiceState.isRecording && (
                        <button 
                          className="stop-recording-btn"
                          onClick={stopVoiceRecording}
                        >
                          Stop Recording
                        </button>
                      )}
                    </div>
                    
                    {voiceState.transcript && (
                      <div className="transcript-display">
                        <h4>Your Request:</h4>
                        <p>"{voiceState.transcript}"</p>
                        <small>Confidence: {voiceState.confidence}%</small>
                        {voiceState.audioBlob && (
                          <button 
                            className="download-audio-btn"
                            onClick={downloadVoiceRecording}
                            title="Download audio file for debugging"
                          >
                            <i className="icon-download" />
                            Download Audio
                          </button>
                        )}
                      </div>
                    )}
                    
                    {voiceState.error && (
                      <div className="error-message">
                        <p>{voiceState.error}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="standard-terms">
                    <label className="checkbox-wrapper">
                      <input
                        type="checkbox"
                        checked={negotiationData.applyStandardTerms}
                        onChange={(e) => setNegotiationData(prev => ({ 
                          ...prev, 
                          applyStandardTerms: e.target.checked 
                        }))}
                      />
                      <span className="checkbox-custom">
                        {negotiationData.applyStandardTerms && <span className="checkbox-tick">✓</span>}
                      </span>
                      <span>Apply your standard terms</span>
                    </label>
                    <button className="adjust-terms-btn">adjust standard terms</button>
                  </div>
                  
                  <div className="step-actions">
                    <button 
                      className="btn btn--rounded"
                      onClick={() => goToStep(2)}
                    >
                      Continue without voice
                    </button>
                    {!voiceState.transcript && (
                      <button 
                        className="btn btn--rounded btn--yellow"
                        onClick={nextStep}
                        disabled={true}
                      >
                        Next
                      </button>
                    )}
                    {voiceState.transcript && (
                      <div className="voice-complete-message">
                        <p>✓ Voice recording complete! Proceeding to review...</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Text Input */}
          {negotiationData.step === 2 && (
            <div className="negotiation-step text-input-step">
              <div className="step-content">
                <h2>Describe your requirements</h2>
                <p>Please enter what product you are looking for, what price and terms are important for you, and where you could make a compromise.</p>
                
                <div className="text-input-section">
                  <textarea
                    placeholder="Example: I need 50 tons of cold-rolled steel coil, SPCC grade, 1.0mm thickness. Target price around €850/ton. Delivery within 2-3 weeks to Hamburg. Payment terms Net 30 preferred but can do Net 45 for better pricing..."
                    value={negotiationData.textInput || ''}
                    onChange={(e) => setNegotiationData(prev => ({ 
                      ...prev, 
                      textInput: e.target.value 
                    }))}
                    rows={6}
                  />
                  
                  <div className="standard-terms">
                    <label className="checkbox-wrapper">
                      <input
                        type="checkbox"
                        checked={negotiationData.applyStandardTerms}
                        onChange={(e) => setNegotiationData(prev => ({ 
                          ...prev, 
                          applyStandardTerms: e.target.checked 
                        }))}
                      />
                      <span className="checkbox-custom">
                        {negotiationData.applyStandardTerms && <span className="checkbox-tick">✓</span>}
                      </span>
                      <span>Apply your standard terms</span>
                    </label>
                    <button className="adjust-terms-btn">adjust standard terms</button>
                  </div>
                  
                  <div className="step-actions">
                    <button 
                      className="btn btn--rounded"
                      onClick={() => goToStep(1)}
                    >
                      Back
                    </button>
                    <button 
                      className="btn btn--rounded btn--yellow"
                      onClick={nextStep}
                      disabled={!negotiationData.textInput?.trim()}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review Requirements */}
          {negotiationData.step === 3 && (
            <div className="negotiation-step requirements-review-step">
              <div className="step-content">
                <h2>Review Contract Positions</h2>
                <p>We've analyzed your request and identified these key contract positions. You can edit any of them before we start negotiating.</p>
                
                <div className="requirements-list">
                  {mockContractPositions.map((requirement) => (
                    <div key={requirement.id} className="requirement-item">
                      <div className="requirement-header">
                        <h4>{requirement.title}</h4>
                        <div className="requirement-actions">
                          <button 
                            className="edit-btn"
                            onClick={() => setEditingRequirement(requirement.id)}
                          >
                            Edit
                          </button>
                          <button 
                            className="delete-btn"
                            onClick={() => deleteRequirement(requirement.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      
                      {editingRequirement === requirement.id ? (
                        <div className="requirement-editor">
                          <textarea
                            value={requirement.value}
                            onChange={(e) => updateRequirement(requirement.id, e.target.value)}
                            rows={2}
                            placeholder="Edit requirement details..."
                            aria-label={`Edit ${requirement.title}`}
                          />
                          <div className="editor-actions">
                            <button 
                              className="btn btn--rounded"
                              onClick={() => setEditingRequirement(null)}
                            >
                              Cancel
                            </button>
                            <button 
                              className="btn btn--rounded btn--yellow"
                              onClick={() => setEditingRequirement(null)}
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="requirement-value">
                          <p>{requirement.value}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="step-actions">
                  <button 
                    className="btn btn--rounded"
                    onClick={() => goToStep(voiceState.transcript ? 1 : 2)}
                  >
                    Back
                  </button>
                  <button 
                    className="btn btn--rounded btn--yellow"
                    onClick={startNegotiation}
                  >
                    Let AI Agent Negotiate
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: AI Negotiation Loading */}
          {negotiationData.step === 4 && (
            <div className="negotiation-step negotiation-loading-step">
              <div className="step-content">
                <div className="loading-header">
                  <h2>Your AI Agent is Negotiating Deals</h2>
                  <p>Your AI agent is negotiating with every seller on the marketplace, trying to match your preferred terms. This will take a few minutes.</p>
                </div>
                
                <div className="negotiation-progress">
                  <div className="progress-overview">
                    <div className="progress-stats">
                      <div className="stat">
                        <span className="stat-number">{progressState.suppliersContacted}</span>
                        <span className="stat-label">Suppliers Contacted</span>
                      </div>
                      <div className="stat">
                        <span className="stat-number">{progressState.responsesReceived}</span>
                        <span className="stat-label">Responses Received</span>
                      </div>
                      <div className="stat">
                        <span className="stat-number">{progressState.activeNegotiations}</span>
                        <span className="stat-label">Active Negotiations</span>
                      </div>
                    </div>
                    
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${progressState.progress}%` }}
                      />
                    </div>
                    
                    <div className="progress-status">
                      <p className="current-step">{progressState.currentStep}</p>
                      <p className="time-remaining">Estimated time: {progressState.estimatedTimeRemaining}</p>
                    </div>
                  </div>
                  
             {/*      <div className="negotiation-animation">
                    <div className="agent-avatars">
                      <div className="agent buyer-agent">
                        <div className="avatar buyer-avatar"></div>
                        <span>Your Agent</span>
                      </div>
                      <div className="negotiation-waves">
                        <div className="wave"></div>
                        <div className="wave"></div>
                        <div className="wave"></div>
                      </div>
                      <div className="agent seller-agent">
                        <div className="avatar supplier-avatar"></div>
                        <span>Supplier Agents</span>
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Deal Approval */}
          {negotiationData.step === 5 && (
            <div className="negotiation-step deal-approval-step">
              <div className="step-content">
                <div className="deals-header">
                  <h2>Negotiated Deals</h2>
                  <p>Your AI agent has successfully negotiated these deals. Review and approve the ones that work best for you.</p>
                </div>
                
                <div className="deals-list">
                  {negotiationData.deals.map((deal) => (
                    <div key={deal.id} className={`deal-card ${deal.status}`}>
                      <div className="deal-header">
                        <div className="supplier-info">
                          <h3>{deal.supplier.name}</h3>
                          <div className="supplier-meta">
                            <span className="rating">⭐ {deal.supplier.rating}</span>
                            <span className="location">📍 {deal.supplier.location}</span>
                          </div>
                        </div>
                        <div className="deal-status">
                          <span className="confidence">Confidence: {deal.confidence}%</span>
                          <span className="expires">Expires: {deal.expiresIn}</span>
                        </div>
                      </div>
                      
                      <div className="deal-content">
                        <div className="product-info">
                          <h4>{deal.product.name}</h4>
                          <div className="specifications">
                            {deal.product.specifications.map((spec, index) => (
                              <span key={index} className="spec-tag">{spec}</span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="deal-terms">
                          <div className="terms-grid">
                            <div className="term">
                              <span className="term-label">Price:</span>
                              <span className="term-value">
                                {deal.terms.price} {deal.terms.priceUnit}
                                <span className="savings">(-{deal.negotiationDetails.savingsPercentage}%)</span>
                              </span>
                            </div>
                            <div className="term">
                              <span className="term-label">Quantity:</span>
                              <span className="term-value">{deal.terms.quantity} {deal.terms.quantityUnit}</span>
                            </div>
                            <div className="term">
                              <span className="term-label">Delivery:</span>
                              <span className="term-value">{deal.terms.deliveryTime}</span>
                            </div>
                            <div className="term">
                              <span className="term-label">Payment:</span>
                              <span className="term-value">{deal.terms.paymentTerms}</span>
                            </div>
                            <div className="term">
                              <span className="term-label">Total Value:</span>
                              <span className="term-value total">€{deal.terms.totalValue.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="deal-actions">
                        <button className="show-details-btn">Show Deal Details</button>
                        <div className="approval-buttons">
                          <button 
                            className={`approve-btn ${deal.status === 'approved' ? 'active' : ''}`}
                            onClick={() => approveDeal(deal.id)}
                          >
                            ✓ Approve
                          </button>
                          <button 
                            className={`decline-btn ${deal.status === 'declined' ? 'active' : ''}`}
                            onClick={() => declineDeal(deal.id)}
                          >
                            ✗ Decline
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="step-actions">
                  <button 
                    className="btn btn--rounded"
                    onClick={() => goToStep(3)}
                  >
                    Back to Requirements
                  </button>
                  <button 
                    className="btn btn--rounded btn--yellow"
                    onClick={() => router.push('/dashboard')}
                  >
                    Complete Negotiation
                  </button>
                </div>
              </div>
            </div>
          )}
          
        </div>
      </section>
      
      <Footer />
    </Layout>
  );
};

export default NegotiationPage;


