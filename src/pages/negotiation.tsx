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
  NegotiationDeal,
  NegotiationResultApiResponse,
  DealReachedResponse,
  NoDealReachedResponse,
  ContinueNegotiationResponse
} from "@/types/negotiation";
import { MockTranscriptionService } from "@/utils/mock-transcription-service";

// Standard Playbook Interface
interface StandardPlaybook {
  tradables: {
    primaryGoal: string;
    get: string[];
    give: string[];
  };
  paymentTerms: {
    ideal: string;
    fallbackPosition: string;
  };
  warranty: {
    ideal: string;
    fallbackPosition: string;
  };
  delivery: {
    ideal: string;
    fallbackPosition: string;
  };
}

// Static fallback data for text input route (MVP limitation)
const staticPlaybookData = {
  product_type: "excavator",
  product_details: {
    seller_playbook: {
      Criteria: {
        Product: {
          "Walk-Away-Price (USD)": 172500.0,
          "Target Price (USD)": 180000.0,
          "Starting Price (USD)": 195000.0
        },
        Buyer: {
          "Credit Worthiness": "Mandatory credit check performed by a third-party agency for ALL customers seeking any form of credit terms (i.e., not paying 100% upfront).",
          "History": "Is this a repeat customer? If so, review their full payment and service history. Only a multi-year, perfect record qualifies for the best terms.",
          risk_profile_definition: {
            low_risk: "Established company with a multi-year, perfect payment history with us. Strong credit report and a history of multiple equipment purchases.",
            medium_risk: "A repeat customer with an excellent, but short (< 2 years), payment history, or an established company with impeccable credit but who is new to us.",
            high_risk: "All new businesses, any customer with a limited or poor credit history, or any customer with a single instance of late payment in their history with us."
          }
        }
      },
      "Negotiation rules": [
        "Prioritize securing favorable payment terms over achieving the absolute maximum price. A secure deal at a slightly lower price is better than a risky deal at the Target Price.",
        "When a buyer asks for a concession, always ask for a concession in return that reduces our risk (e.g., larger down payment, shorter terms).",
        "Always anchor the negotiation with the Target Price. Never reveal the Walk-Away-Price.",
        "Maintain a professional, firm, and principled tone. Our terms are based on prudent financial management, not a lack of trust.",
        "If a buyer's initial offer is below the Walk-Away-Price, state that it is significantly below our valuation and we cannot proceed on that basis. Invite a revised offer.",
        "If a high-risk buyer will not pre-pay 100% or provide an Irrevocable Letter of Credit, politely and firmly end the negotiation. There is no fallback.",
        "Any request for credit terms beyond Net 30, regardless of buyer risk profile, requires management approval."
      ],
      Tradables: {
        "Primary Goal": "Secure 100% of the agreed price with minimal to zero payment risk. Achieving the Target Price is secondary to ensuring payment is guaranteed. Building a long-term relationship is contingent on the buyer accepting our risk-mitigation terms.",
        "Give (Low-cost to us)": [
          "Free local delivery (within a 50-mile radius, logistics permitting).",
          "A small toolkit or set of high-quality, company-branded merchandise (e.g., jackets, hats).",
          "Priority scheduling for their first paid service."
        ],
        "Get (High value to us)": [
          "Pre-payment in full, even from low-risk customers.",
          "A larger-than-required, non-refundable down payment.",
          "Agreement to a pre-paid, multi-year service and maintenance contract.",
          "A formal, signed waiver of consequential damages, limiting our liability strictly to the standard equipment warranty.",
          "Commitment to act as a formal, positive reference for future potential buyers."
        ]
      },
      "Ideal & Acceptable Terms": {
        "High risk buyer": {
          "Payment Terms": {
            Ideal: "100% of payment via cleared funds prior to the machine being prepared for delivery.",
            "Fallback Position": ""
          },
          "Collateral for Payment Default": {
            Ideal: "Seller retains full legal title until payment is irrevocably confirmed.",
            "Fallback Position": "An Irrevocable Letter of Credit (ILOC) from a top-tier bank, confirmed by our bank, for 100% of the value. No other terms are acceptable."
          },
          Warranties: null
        },
        "Medium risk buyer": {
          "Payment Terms": {
            Ideal: "Minimum 50% non-refundable down payment, balance due via cleared funds upon delivery (before offloading).",
            "Fallback Position": "Increase down payment to 60%. Alternatively, we will hold the 50% down payment and accept an ILOC or Bank Guarantee for the final 50%."
          },
          "Collateral for Payment Default": null,
          Warranties: null
        },
        "Low risk buyer": {
          Ideal: null,
          "Fallback Position": null,
          "Payment Terms": {
            Ideal: "Minimum 10% down payment with an approved Purchase Order, balance due Net 30. Standard warranty and liability terms apply.",
            "Fallback Position": "If Net 45 terms are requested, it will only be considered in exchange for a 1.5% price increase to cover the cost of capital OR a pre-paid 2-year service contract. Net 60 is not offered."
          }
        }
      }
    },
    buyer_playbook: {
      "Negotiation Strategy": [
        "Never reveal your Maximum Budget. Always anchor the negotiation to your Target Purchase Price or lower.",
        "An aggressive but realistic opening offer can significantly lower the final price.",
        "Question the value of every seller 'concession'. Unbundle their packages to understand the true cost and benefit of each item.",
        "Always bundle your requests. For example, 'If you can meet our price, we'll also need you to include the extended warranty and free delivery.'",
        "Always be professional and polite, but be prepared to walk away if your core requirements on price and terms are not met."
      ],
      Tradables: {
        "Primary Goal": "Achieve the lowest possible Total Cost of Ownership (TCO). The sticker price is important, but favorable terms, an extended warranty, and included service are equally critical for minimizing long-term expenses.",
        "Get (High value to us)": [
          "A significant discount off the list price.",
          "A comprehensive, multi-year warranty (especially on powertrain and hydraulics).",
          "The first 2-3 scheduled maintenance services included (parts and labor).",
          "Favorable payment terms (e.g., Net 60 or Net 90) to improve cash flow.",
          "Free delivery to our primary worksite."
        ],
        "Give (Low-cost to us)": [
          "A public, positive customer testimonial or case study.",
          "A commitment to a future parts & service contract (if the rates are competitive).",
          "Flexibility on the delivery date (if our project schedule allows).",
          "A slightly larger-than-standard down payment in exchange for a major price discount or extended warranty."
        ]
      },
      "Ideal & Acceptable Terms": {
        Price: {
          "Target Purchase Price (USD)": 160000.0,
          "Maximum Budget (USD)": 170000.0,
          Ideal: "A final price at or below our Target Purchase Price of $160,000.",
          "Fallback Position": "A price up to our Maximum Budget of $170,000, but only if it includes significant 'Gets' like a 3-year warranty."
        },
        "Payment Terms": {
          Ideal: "Net 60 terms with 0% down payment required.",
          "Fallback Position": "Net 30 terms with no more than a 5% down payment required to secure the machine."
        },
        Warranty: {
          Ideal: "3-year / 3,000-hour comprehensive warranty. First two scheduled services (250hr, 500hr) fully included.",
          "Fallback Position": "Minimum 2-year / 2,000-hour powertrain warranty. First scheduled service included (labor only)."
        },
        Delivery: {
          Ideal: "Free delivery to our site",
          "Fallback Position": "Delivery cost capped at a pre-agreed, reasonable flat fee."
        }
      }
    }
  },
  buyer_profile: {
    "Buyer ID": 1,
    "Credit Worthiness": 8,
    "Recurring Customer": true
  }
};

// Mock Standard Playbook Data
const mockStandardPlaybook: StandardPlaybook = {
  tradables: {
    primaryGoal: "Achieve the lowest possible Total Cost of Ownership (TCO). The sticker price is important, but favorable terms, an extended warranty, and included service are equally critical for minimizing long-term expenses.",
    get: [
      "A significant discount off the list price.",
      "A comprehensive, multi-year warranty (especially on powertrain and hydraulics).",
      "The first 2-3 scheduled maintenance services included (parts and labor).",
      "Favorable payment terms (e.g., Net 60 or Net 90) to improve cash flow.",
      "Free delivery to our primary worksite."
    ],
    give: [
      "A public, positive customer testimonial or case study.",
      "A commitment to a future parts & service contract (if the rates are competitive).",
      "Flexibility on the delivery date (if our project schedule allows).",
      "A slightly larger-than-standard down payment in exchange for a major price discount or extended warranty."
    ]
  },
  paymentTerms: {
    ideal: "Net 60 terms with 0% down payment required.",
    fallbackPosition: "Net 30 terms with no more than a 5% down payment required to secure the machine."
  },
  warranty: {
    ideal: "3-year / 3,000-hour comprehensive warranty. First two scheduled services (250hr, 500hr) fully included.",
    fallbackPosition: "Minimum 2-year / 2,000-hour powertrain warranty. First scheduled service included (labor only)."
  },
  delivery: {
    ideal: "Free delivery to our site",
    fallbackPosition: "Delivery cost capped at a pre-agreed, reasonable flat fee."
  }
};

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
  const [isPlaybookLoading, setIsPlaybookLoading] = useState(false);
  
  // Modal state
  const [showPlaybookModal, setShowPlaybookModal] = useState(false);
  
  // Negotiation result state
  const [negotiationResult, setNegotiationResult] = useState<NegotiationResultApiResponse | null>(null);
  
  // Network state (for console logging only)
  const [isOnline, setIsOnline] = useState(true);
  const [isClient, setIsClient] = useState(false);
  
  // Network detection - only run on client side
  useEffect(() => {
    // Set client flag and initial online status
    setIsClient(true);
    
    // Check if we're in a browser environment
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      setIsOnline(navigator.onLine);
      
      const handleOnline = () => {
        setIsOnline(true);
        console.log('🌐 Network connection restored');
      };
      
      const handleOffline = () => {
        setIsOnline(false);
        console.log('🔌 Network connection lost - using offline mode');
      };
      
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  // API transcription function with fallback
  const transcribeAudio = async (audioBlob: Blob): Promise<any> => {
    // Check network connectivity first (only if we're on client side)
    if (isClient && !isOnline) {
      console.log('🔌 No network connection - using mock transcription directly');
      return await MockTranscriptionService.simulateTranscription(audioBlob);
    }
    
    try {
      // First, try the real API
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.wav');
      formData.append('buyer_id', '1');
      
      console.log('🎤 Attempting API transcription...');
      
      // Set a timeout for the API call
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('API timeout')), 60000) // Increased to 60 seconds for transcription API
      );
      
      const apiPromise = fetch('https://web-u7lq49qv2x24.up-de-fra1-k8s-1.apps.run-on-seenode.com/api/transcribe', {
        method: 'POST',
        body: formData,
      });
      
      const response = await Promise.race([apiPromise, timeoutPromise]) as Response;
      
      if (!response.ok) {
        throw new Error(`Transcription API error: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('✅ API transcription successful');
      
      return result;
      
    } catch (error) {
      const errorMessage = `Transcription API failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.warn('⚠️', errorMessage);
      
      // Fallback to mock service
      console.log('🔄 Falling back to mock transcription service...');
      try {
        const mockResult = await MockTranscriptionService.simulateTranscription(audioBlob);
        console.log('✅ Mock transcription successful - using offline transcription as fallback');
        return mockResult;
      } catch (mockError) {
        const mockErrorMessage = 'Both API and mock transcription failed. Please try text input.';
        console.error('❌ Mock transcription also failed:', mockError);
        throw new Error(mockErrorMessage);
      }
    }
  };

  // Voice recording functions
  const startVoiceRecording = async () => {
    try {
      // Check if we're in a browser environment with media support
      if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Media recording not supported in this environment');
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        setVoiceState(prev => ({
          ...prev,
          isRecording: false,
          isProcessing: true,
          audioBlob,
          audioUrl,
          mediaRecorder: undefined
        }));
        
        // Set playbook loading when transitioning to step 3
        setIsPlaybookLoading(true);
        
        try {
          // Use API transcription with retry mechanism
          let retryCount = 0;
          const maxRetries = 2;
          let lastError: Error | null = null;
          
          while (retryCount <= maxRetries) {
            try {
              const result = await transcribeAudio(audioBlob);
              const transcript = result[0]; // First element is the transcript
              const playbookData = result[1]?.result; // Second element contains the structured data
              
              setVoiceState(prev => ({
                ...prev,
                isProcessing: false,
                transcript,
                confidence: 95 // Default confidence for API transcription
              }));
              
              setNegotiationData(prev => ({
                ...prev,
                voiceInput: transcript,
                playbookData: playbookData
              }));
              
              // Clear playbook loading when data is ready
              setIsPlaybookLoading(false);
              
              // Auto-advance to step 3 after successful transcription
              setTimeout(() => {
                if (negotiationData.step === 1) {
                  setNegotiationData(prev => ({ ...prev, step: 3 }));
                }
              }, 1000);
              
              // Success - break out of retry loop
              break;
              
            } catch (error) {
              lastError = error instanceof Error ? error : new Error('Unknown transcription error');
              retryCount++;
              
              if (retryCount <= maxRetries) {
                console.log(`🔄 Retrying transcription (attempt ${retryCount + 1}/${maxRetries + 1})...`);
                // Wait before retry
                await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
              }
            }
          }
          
          // If all retries failed, show final error
          if (retryCount > maxRetries && lastError) {
            throw lastError;
          }
          
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Transcription failed after retries';
          console.error('❌ Final transcription error:', errorMessage);
          
          setVoiceState(prev => ({
            ...prev,
            isProcessing: false,
            error: errorMessage
          }));
          
          // Clear playbook loading on error
          setIsPlaybookLoading(false);
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
      // Set loading state and auto-advance directly to step 3 after voice recording
      setIsPlaybookLoading(true);
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
      } else if (negotiationData.step === 2) {
        // When coming from step 2 (text input), use static data for MVP
        setNegotiationData(prev => ({ 
          ...prev, 
          step: 3,
          playbookData: staticPlaybookData
        }));
      } else {
        setNegotiationData(prev => ({ ...prev, step: prev.step + 1 }));
      }
    }
  };

  // Section editing for playbook data
  const updateRequirement = (id: string, newValue: string) => {
    // For playbook sections, this would update specific parts of the playbookData
    // For MVP, we'll show an alert that editing is not implemented
    alert('Edit functionality for playbook sections is not implemented in this MVP. This would update the specific section data.');
    setEditingRequirement(null);
  };

  const deleteRequirement = (id: string) => {
    // For playbook sections, this would hide/remove specific sections
    // For MVP, we'll show an alert that deletion is not implemented
    if (confirm('Are you sure you want to hide this section? (MVP - this would remove it from the negotiation strategy)')) {
      alert('Delete functionality for playbook sections is not implemented in this MVP. This would hide the section from the analysis.');
    }
  };

  // API call function (separated from progress simulation)
  const callNegotiationAPI = async (): Promise<NegotiationResultApiResponse> => {
    try {
      console.log('🤖 Starting API negotiation...');
      
      // Get the text input for the API call
      const textInput = negotiationData.voiceInput || negotiationData.textInput || '';
      
      if (!textInput.trim()) {
        throw new Error('No text input available for negotiation');
      }
      
      console.log('📤 Sending negotiation request:', {
        text_input: textInput.substring(0, 100) + '...', // Log truncated version for privacy
        buyer_id: 1
      });
      
      // Make the actual API call to the negotiation service with timeout
      const timeoutController = new AbortController();
      const timeoutId = setTimeout(() => timeoutController.abort(), 120000); // 2 minute timeout for negotiation API
      
      const negotiationResponse = await fetch('https://web-u7lq49qv2x24.up-de-fra1-k8s-1.apps.run-on-seenode.com/api/negotiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text_input: textInput,
          buyer_id: 1
        }),
        signal: timeoutController.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!negotiationResponse.ok) {
        const errorText = await negotiationResponse.text();
        throw new Error(`Negotiation API error: ${negotiationResponse.status} ${negotiationResponse.statusText}. Response: ${errorText}`);
      }
      
      const apiResult: NegotiationResultApiResponse = await negotiationResponse.json();
      console.log('✅ API negotiation call successful:', apiResult);
      
      // Validate the API response structure
      if (!apiResult.status) {
        throw new Error('Invalid API response: missing status field');
      }
      
      if (apiResult.status === 'DEAL_REACHED') {
        const dealResult = apiResult as DealReachedResponse;
        if (!dealResult.price || !dealResult.payment_terms || !dealResult.warranty || !dealResult.delivery) {
          throw new Error('Invalid DEAL_REACHED response: missing required fields');
        }
      } else {
        // Treat any non-DEAL_REACHED status as NO_DEAL_REACHED
        // This includes NO_DEAL_REACHED, CONTINUE, or any unknown status
        console.log(`📝 API returned status: "${apiResult.status}" - treating as NO_DEAL_REACHED`);
        
        // Try to extract reason from the response, regardless of the exact status
        const reason = (apiResult as any).reason;
        if (!reason) {
          console.warn('⚠️ No reason field found in non-deal response, using default message');
          // Add a default reason if none provided
          (apiResult as any).reason = `Negotiation status: ${apiResult.status}. No additional details provided.`;
        }
      }
      
      return apiResult;
      
    } catch (apiError) {
      console.warn('⚠️ Negotiation API failed, using mock data:', apiError);
      
      // Fallback to mock service for negotiation results
      const mockResult = MockTranscriptionService.getRandomNegotiationResult();
      return mockResult;
    }
  };
  

  // Start AI negotiation simulation
  const startNegotiation = () => {
    setIsNegotiating(true);
    setNegotiationData(prev => ({ 
      ...prev, 
      step: 4,
      requirements: mockContractPositions 
    }));
    
    // Start API call immediately and progress simulation in parallel
    simulateNegotiationProgress();
  };

  const simulateNegotiationProgress = () => {
    const steps = [
      { step: "Analyzing requirements...", progress: 8, suppliers: 0 },
      { step: "Searching marketplace...", progress: 15, suppliers: 5 },
      { step: "Contacting suppliers...", progress: 25, suppliers: 15 },
      { step: "Receiving initial offers...", progress: 35, suppliers: 15 },
      { step: "AI agents evaluating offers...", progress: 45, suppliers: 15 },
      { step: "Negotiating pricing terms...", progress: 55, suppliers: 15 },
      { step: "Negotiating delivery terms...", progress: 65, suppliers: 15 },
      { step: "Negotiating payment terms...", progress: 75, suppliers: 15 },
      { step: "Finalizing best deals...", progress: 85, suppliers: 15 },
      { step: "Reviewing contract terms...", progress: 95, suppliers: 15 },
      { step: "Negotiation complete!", progress: 100, suppliers: 15 }
    ];
    
    let currentStepIndex = 0;
    let apiCallCompleted = false;
    let apiResult: NegotiationResultApiResponse | null = null;
    
    // Start the API call immediately when negotiation begins
    const apiPromise = callNegotiationAPI().then(result => {
      apiResult = result;
      apiCallCompleted = true;
      console.log('🔄 API call completed, waiting for progress animation...');
      return result;
    });
    
    const interval = setInterval(async () => {
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
        
        // Wait for API call to complete if it hasn't already
        if (!apiCallCompleted) {
          console.log('⏳ Progress complete, waiting for API result...');
          setProgressState(prev => ({
            ...prev,
            currentStep: "Waiting for negotiation result...",
            progress: 100
          }));
          
          try {
            apiResult = await apiPromise;
          } catch (error) {
            console.error('❌ Error waiting for API result:', error);
            apiResult = MockTranscriptionService.getRandomNegotiationResult();
          }
        }
        
        // Set the final result and move to step 5
        if (apiResult) {
          setNegotiationResult(apiResult);
        }
        
        setNegotiationData(prev => ({ 
          ...prev, 
          step: 5
        }));
      }
    }, 4000); // Increased from 2s to 4s per step for longer loading experience
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

  // Modal handlers
  const openPlaybookModal = () => {
    setShowPlaybookModal(true);
  };

  const closePlaybookModal = () => {
    setShowPlaybookModal(false);
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
                  
                  <div className="mvp-voice-banner" style={{
                    background: 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)',
                    border: '2px solid #ffc107',
                    borderRadius: '12px',
                    marginBottom: '30px',
                    boxShadow: '0 4px 12px rgba(255, 193, 7, 0.2)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '6px',
                      height: '100%',
                      background: '#f39c12'
                    }}></div>
                    <div className="banner-content" style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '15px',
                      padding: '20px 20px 20px 30px'
                    }}>
                      <span className="banner-icon" style={{
                        fontSize: '24px',
                        lineHeight: 1,
                        flexShrink: 0,
                        marginTop: '2px'
                      }}>⚠️</span>
                      <div className="banner-text" style={{
                        fontSize: '15px',
                        lineHeight: 1.6,
                        color: '#856404'
                      }}>
                        <strong style={{
                          fontWeight: 700,
                          color: '#533102',
                          fontSize: '16px'
                        }}>MVP Note:</strong> Voice input currently only supports excavator products. 
                        Try saying: "I want an excavator <b><u>from the brand excavator</u></b>, maximum price 170,000 €, no upfront payments"
                      </div>
                    </div>
                  </div>
                  
                  <div className="voice-controls">
                    <div className="voice-recording-container">
                      <motion.button
                        className="voice-recording-btn"
                        onClick={startVoiceRecording}
                        disabled={voiceState.isRecording || voiceState.isProcessing}
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
                        {voiceState.isRecording ? 'Recording...' : 
                         voiceState.isProcessing ? 'Processing...' : 'Start'}
                      </motion.button>
                      
                      {voiceState.isRecording && (
                        <button 
                          className="stop-recording-btn"
                          onClick={stopVoiceRecording}
                        >
                          Stop Recording
                        </button>
                      )}
                      
                      {voiceState.isProcessing && (
                        <div className="processing-message">
                          <div className="spinner"></div>
                          <p>Transcribing your audio...</p>
                        </div>
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
                        {voiceState.audioBlob && (
                          <div className="error-actions">
                            <button 
                              className="retry-btn"
                              onClick={async () => {
                                setVoiceState(prev => ({ ...prev, error: undefined, isProcessing: true }));
                                setIsPlaybookLoading(true);
                                
                                try {
                                  const result = await transcribeAudio(voiceState.audioBlob!);
                                  const transcript = result[0];
                                  const playbookData = result[1]?.result;
                                  
                                  setVoiceState(prev => ({
                                    ...prev,
                                    isProcessing: false,
                                    transcript,
                                    confidence: 95,
                                    error: undefined
                                  }));
                                  
                                  setNegotiationData(prev => ({
                                    ...prev,
                                    voiceInput: transcript,
                                    playbookData: playbookData
                                  }));
                                  
                                  setIsPlaybookLoading(false);
                                  
                                  setTimeout(() => {
                                    if (negotiationData.step === 1) {
                                      setNegotiationData(prev => ({ ...prev, step: 3 }));
                                    }
                                  }, 1000);
                                  
                                } catch (retryError) {
                                  setVoiceState(prev => ({
                                    ...prev,
                                    isProcessing: false,
                                    error: retryError instanceof Error ? retryError.message : 'Retry failed'
                                  }));
                                  setIsPlaybookLoading(false);
                                }
                              }}
                              disabled={voiceState.isProcessing}
                            >
                              🔄 Retry Transcription
                            </button>
                          </div>
                        )}
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
                      <span>Apply your standard negotiation playbook</span>
                    </label>
                    <button className="adjust-terms-btn" onClick={openPlaybookModal}>(adjust)</button>
                  </div>
                  
                  <div className="step-actions">
                    <button 
                      className="btn btn--rounded"
                      onClick={() => goToStep(2)}
                    >
                      Continue without voice
                    </button>

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
                      <span>Apply your standard negotiation playbook</span>
                    </label>
                    <button className="adjust-terms-btn" onClick={openPlaybookModal}>(adjust)</button>
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

          {/* Step 3: Review Negotiation Analysis */}
          {negotiationData.step === 3 && (
            <div className="negotiation-step requirements-review-step">
              <div className="step-content">
                <h2>Negotiation Playbook</h2>
                {isPlaybookLoading ? (
                  <p>Analyzing your request and building negotiation strategy...</p>
                ) : (
                  <p>This is an overview of the product specs you are lookig for and the combined negotiation playbook from your input and your profile data.</p>
                )}
                
                {/* MVP Notice for text input */}
                {negotiationData.textInput && !negotiationData.voiceInput && (
                  <div className="mvp-notice">
                    <div className="notice-content">
                      <span className="notice-icon">⚠️</span>
                      <p><strong>MVP Note:</strong> This MVP version only supports voice input for AI analysis. You can continue with the following static data for demonstration purposes.</p>
                    </div>
                  </div>
                )}
                
                {/* Display original user input */}
                <div className="original-input-section">
                  {/* <h3>Original Request</h3> */}
                  <div className="original-input-display">
                    {isPlaybookLoading ? (
                      <div className="skeleton-loading">
                        <div className="skeleton-line skeleton-line-long"></div>
                        <div className="skeleton-line skeleton-line-medium"></div>
                        <div className="skeleton-line skeleton-line-short"></div>
                      </div>
                    ) : (
                      <>
                        <p>
                          {negotiationData.voiceInput || negotiationData.textInput || "No input provided"}
                        </p>
                        {negotiationData.voiceInput && (
                          <span className="input-source voice-source">Voice Input</span>
                        )}
                        {negotiationData.textInput && !negotiationData.voiceInput && (
                          <span className="input-source text-source">Text Input</span>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Playbook Analysis */}
                {isPlaybookLoading ? (
                  <div className="playbook-skeleton">
                    <div className="skeleton-section">
                      <div className="skeleton-header">
                        <div className="skeleton-line skeleton-line-medium"></div>
                        <div className="skeleton-buttons">
                          <div className="skeleton-button"></div>
                          <div className="skeleton-button"></div>
                        </div>
                      </div>
                      <div className="skeleton-content">
                        <div className="skeleton-line skeleton-line-long"></div>
                        <div className="skeleton-line skeleton-line-medium"></div>
                        <div className="skeleton-line skeleton-line-short"></div>
                      </div>
                    </div>
                    
                    <div className="skeleton-section">
                      <div className="skeleton-header">
                        <div className="skeleton-line skeleton-line-medium"></div>
                        <div className="skeleton-buttons">
                          <div className="skeleton-button"></div>
                          <div className="skeleton-button"></div>
                        </div>
                      </div>
                      <div className="skeleton-content">
                        <div className="skeleton-line skeleton-line-long"></div>
                        <div className="skeleton-line skeleton-line-medium"></div>
                        <div className="skeleton-line skeleton-line-long"></div>
                        <div className="skeleton-line skeleton-line-short"></div>
                      </div>
                    </div>
                  </div>
                ) : negotiationData.playbookData && (
                  <div className="playbook-analysis">
                    {/* Product Overview */}
                    <div className="analysis-section product-overview">
                      <div className="section-header">
                        <h3>Product Specs</h3>
                        <div className="section-actions">
                          <button className="edit-btn" onClick={() => setEditingRequirement('product-overview')}>Edit</button>
                          <button className="delete-btn" onClick={() => deleteRequirement('product-overview')}>Delete</button>
                        </div>
                      </div>
                      <div className="section-content">
                        <div className="product-type">
                          <strong>Product Type:</strong> {negotiationData.playbookData.product_type}
                        </div>

                      </div>
                    </div>

                   

                    {/* Buyer Strategy */}
                    {negotiationData.playbookData.product_details?.buyer_playbook && (
                      <div className="analysis-section buyer-strategy">
                        <div className="section-header">
                          <h3>Negotiation Strategy</h3>
                          <div className="section-actions">
                            <button className="edit-btn" onClick={() => setEditingRequirement('buyer-strategy')}>Edit</button>
                            <button className="delete-btn" onClick={() => deleteRequirement('buyer-strategy')}>Delete</button>
                          </div>
                        </div>
                        <div className="section-content">
                          <div className="strategy-goal">
                            <h4>Primary Goal:</h4>
                            <p>{negotiationData.playbookData.product_details.buyer_playbook.Tradables?.["Primary Goal"]}</p>
                          </div>
                          
                          {negotiationData.playbookData.product_details.buyer_playbook["Negotiation Strategy"] && (
                            <div className="strategy-rules">
                              <h4>Strategy Guidelines:</h4>
                              <ul>
                                {negotiationData.playbookData.product_details.buyer_playbook["Negotiation Strategy"].map((rule: string, index: number) => (
                                  <li key={index}>{rule}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {negotiationData.playbookData.product_details.buyer_playbook.Tradables && (
                            <div className="tradables-section">
                              <div className="tradables-get">
                                <h4>What We Want to Get (High Value to Us):</h4>
                                <ul>
                                  {negotiationData.playbookData.product_details.buyer_playbook.Tradables["Get (High value to us)"]?.map((item: string, index: number) => (
                                    <li key={index}>{item}</li>
                                  ))}
                                </ul>
                              </div>
                              <div className="tradables-give">
                                <h4>What We Can Give (Low Cost to Us):</h4>
                                <ul>
                                  {negotiationData.playbookData.product_details.buyer_playbook.Tradables["Give (Low-cost to us)"]?.map((item: string, index: number) => (
                                    <li key={index}>{item}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}

                          {negotiationData.playbookData.product_details.buyer_playbook["Ideal & Acceptable Terms"] && (
                            <div className="terms-section">
                              <h4>Ideal & Acceptable Terms:</h4>
                              {Object.entries(negotiationData.playbookData.product_details.buyer_playbook["Ideal & Acceptable Terms"]).map(([termType, termData]: [string, any]) => (
                                <div key={termType} className="term-category">
                                  <h5>{termType}:</h5>
                                  {typeof termData === 'object' && termData !== null && (
                                    <div className="term-details">
                                      {Object.entries(termData).map(([key, value]: [string, any]) => (
                                        <div key={key} className="term-item">
                                          <span className="term-label">{key}:</span>
                                          <span className="term-value">
                                            {typeof value === 'number' ? `$${value.toLocaleString()}` : value}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}


                  </div>
                )}
                
                <div className="step-actions">
                  <button 
                    className="btn btn--rounded"
                    onClick={() => goToStep(voiceState.transcript ? 1 : 2)}
                    disabled={isPlaybookLoading}
                  >
                    Back
                  </button>
                  <button 
                    className="btn btn--rounded btn--yellow"
                    onClick={startNegotiation}
                    disabled={isPlaybookLoading}
                  >
                    {isPlaybookLoading ? 'Processing...' : 'Let AI Agent Negotiate'}
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

          {/* Step 5: Negotiation Results */}
          {negotiationData.step === 5 && negotiationResult && (
            <div className="negotiation-step negotiation-results-step">
              <div className="step-content">
                {negotiationResult.status === "DEAL_REACHED" ? (
                  // Deal Reached Scenario
                  <div className="deal-reached-content">
                    <div className="result-header success">
                      <div className="result-icon">✓</div>
                      <h2>Deal Successfully Negotiated!</h2>
                      <p>Your AI agent has successfully negotiated a deal that meets your requirements. Please review the final terms below.</p>
                    </div>
                    
                    <div className="deal-summary-card">
                      <div className="deal-header">
                        <h3>Final Deal Terms</h3>
                        <div className="deal-status-badge success">Deal Reached</div>
                      </div>
                      
                      <div className="deal-terms-grid">
                        <div className="term-item">
                          <div className="term-details">
                            <span className="term-label">Price</span>
                            <span className="term-value">{negotiationResult.price}</span>
                          </div>
                        </div>
                        
                        <div className="term-item">
                          <div className="term-details">
                            <span className="term-label">Payment Terms</span>
                            <span className="term-value">{negotiationResult.payment_terms}</span>
                          </div>
                        </div>
                        
                        <div className="term-item">
                          <div className="term-details">
                            <span className="term-label">Warranty</span>
                            <span className="term-value">{negotiationResult.warranty}</span>
                          </div>
                        </div>
                        
                        <div className="term-item">
                          <div className="term-details">
                            <span className="term-label">Delivery</span>
                            <span className="term-value">{negotiationResult.delivery}</span>
                          </div>
                        </div>
                        
                        {negotiationResult.maintenance_services && (
                          <div className="term-item">
                            <div className="term-details">
                              <span className="term-label">Maintenance Services</span>
                              <span className="term-value">{negotiationResult.maintenance_services}</span>
                            </div>
                          </div>
                        )}
                        
                        {negotiationResult.additional_terms && (
                          <div className="term-item">
                            <div className="term-details">
                              <span className="term-label">Additional Terms</span>
                              <span className="term-value">{negotiationResult.additional_terms}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="deal-actions">
                      <div className="action-buttons">
                        <button 
                          className="btn btn--rounded btn--yellow"
                          onClick={() => {
                            alert('MVP: This would proceed to contract generation and finalization.');
                          }}
                        >
                          Accept Deal
                        </button>
                        <button 
                          className="btn btn--rounded btn--outline"
                          onClick={() => {
                            if (confirm('Are you sure you want to decline this deal?')) {
                              alert('MVP: Deal declined. You would be redirected to explore other options.');
                            }
                          }}
                        >
                          Decline Deal
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Any non-DEAL_REACHED scenario (NO_DEAL_REACHED, CONTINUE, or unknown status)
                  <div className="no-deal-content">
                    <div className="result-header failure">
                      <h2>
                        {negotiationResult.status === "CONTINUE" ? "Negotiation Continues" : 
                         negotiationResult.status === "NO_DEAL_REACHED" ? "No Deal Reached" : 
                         "Negotiation Update"}
                      </h2>
                      <p>
                        {negotiationResult.status === "CONTINUE" 
                          ? "The negotiation is ongoing. Here's what's happening with your request."
                          : negotiationResult.status === "NO_DEAL_REACHED"
                          ? "We were not able to settle a deal for a product with your specs along with your preferred contract terms."
                          : "Here's the latest update on your negotiation request."
                        }
                      </p>
                    </div>
                    
                    <div className="no-deal-details-card">
                      <div className="details-header">
                        <h3>What Happened?</h3>
                        <div className={`deal-status-badge ${negotiationResult.status === "CONTINUE" ? "continue" : "failure"}`}>
                          {negotiationResult.status === "CONTINUE" ? "In Progress" : 
                           negotiationResult.status === "NO_DEAL_REACHED" ? "No Deal" : 
                           "Status Update"}
                        </div>
                      </div>
                      
                      <div className="failure-reason">
                        <div className="reason-content">
                          <h4>
                            {negotiationResult.status === "CONTINUE" ? "Current Status" : 
                             negotiationResult.status === "NO_DEAL_REACHED" ? "Negotiation Breakdown" : 
                             "Details"}
                          </h4>
                          <p>{negotiationResult.reason}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="alternative-options">
                      <h3>What's Next?</h3>
                      <div className="options-grid">
                        <div className="option-card">
                          <h4>Adjust Requirements</h4>
                          <p>Modify your specifications or terms to find more flexible suppliers</p>
                          <button 
                            className="btn btn--rounded btn--yellow"
                            onClick={() => goToStep(3)}
                          >
                            Modify Terms
                          </button>
                        </div>
                        
                        <div className="option-card">
                          <h4>Broaden Search</h4>
                          <p>Expand your search criteria to include more suppliers and alternatives</p>
                          <button 
                            className="btn btn--rounded"
                            onClick={() => {
                              alert('MVP: This would restart the negotiation with broader criteria.');
                            }}
                          >
                            Expand Search
                          </button>
                        </div>
                        
                        <div className="option-card">
                          <h4>Manual Negotiation</h4>
                          <p>Connect directly with suppliers for custom negotiations</p>
                          <button 
                            className="btn btn--rounded"
                            onClick={() => {
                              alert('MVP: This would connect you with our negotiation specialists.');
                            }}
                          >
                            Contact Expert
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="step-navigation">
                  <button 
                    className="btn btn--rounded"
                    onClick={() => goToStep(3)}
                  >
                    Back to Requirements
                  </button>
                  <button 
                    className="btn btn--rounded"
                    onClick={() => {
                      // Reset the negotiation state for a new attempt
                      setNegotiationResult(null);
                      setNegotiationData(prev => ({ 
                        ...prev, 
                        step: 1,
                        voiceInput: '',
                        textInput: '',
                        requirements: [],
                        deals: []
                      }));
                      setVoiceState({
                        isRecording: false,
                        isProcessing: false,
                        transcript: "",
                        confidence: 0
                      });
                    }}
                  >
                    Start New Negotiation
                  </button>
                </div>
              </div>
            </div>
          )}
          
        </div>
      </section>
      
      {/* Standard Playbook Modal */}
      {showPlaybookModal && (
        <div className="modal-overlay" onClick={closePlaybookModal}>
          <div className="modal-content playbook-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Standard Negotiation Playbook</h2>
              <button className="modal-close" onClick={closePlaybookModal}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="playbook-section">
                <h3>Primary Goal</h3>
                <p className="playbook-goal">{mockStandardPlaybook.tradables.primaryGoal}</p>
              </div>
              
              <div className="playbook-section">
                <h3>What We Want to Get (High Value to Us)</h3>
                <ul className="playbook-list get-list">
                  {mockStandardPlaybook.tradables.get.map((item, index) => (
                    <li key={index}>
                      <span className="list-icon">✓</span>
                      <span>{item}</span>
                      <button className="edit-item-btn" title="Edit item (MVP - not functional)">
                        <i className="icon-edit"></i>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="playbook-section">
                <h3>What We Can Give (Low Cost to Us)</h3>
                <ul className="playbook-list give-list">
                  {mockStandardPlaybook.tradables.give.map((item, index) => (
                    <li key={index}>
                      <span className="list-icon">→</span>
                      <span>{item}</span>
                      <button className="edit-item-btn" title="Edit item (MVP - not functional)">
                        <i className="icon-edit"></i>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="playbook-terms">
                <div className="term-section">
                  <h3>Payment Terms</h3>
                  <div className="term-item">
                    <span className="term-label">Ideal:</span>
                    <span className="term-value">{mockStandardPlaybook.paymentTerms.ideal}</span>
                    <button className="edit-item-btn" title="Edit term (MVP - not functional)">
                      <i className="icon-edit"></i>
                    </button>
                  </div>
                  <div className="term-item">
                    <span className="term-label">Fallback:</span>
                    <span className="term-value">{mockStandardPlaybook.paymentTerms.fallbackPosition}</span>
                    <button className="edit-item-btn" title="Edit term (MVP - not functional)">
                      <i className="icon-edit"></i>
                    </button>
                  </div>
                </div>
                
                <div className="term-section">
                  <h3>Warranty</h3>
                  <div className="term-item">
                    <span className="term-label">Ideal:</span>
                    <span className="term-value">{mockStandardPlaybook.warranty.ideal}</span>
                    <button className="edit-item-btn" title="Edit term (MVP - not functional)">
                      <i className="icon-edit"></i>
                    </button>
                  </div>
                  <div className="term-item">
                    <span className="term-label">Fallback:</span>
                    <span className="term-value">{mockStandardPlaybook.warranty.fallbackPosition}</span>
                    <button className="edit-item-btn" title="Edit term (MVP - not functional)">
                      <i className="icon-edit"></i>
                    </button>
                  </div>
                </div>
                
                <div className="term-section">
                  <h3>Delivery</h3>
                  <div className="term-item">
                    <span className="term-label">Ideal:</span>
                    <span className="term-value">{mockStandardPlaybook.delivery.ideal}</span>
                    <button className="edit-item-btn" title="Edit term (MVP - not functional)">
                      <i className="icon-edit"></i>
                    </button>
                  </div>
                  <div className="term-item">
                    <span className="term-label">Fallback:</span>
                    <span className="term-value">{mockStandardPlaybook.delivery.fallbackPosition}</span>
                    <button className="edit-item-btn" title="Edit term (MVP - not functional)">
                      <i className="icon-edit"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn btn--rounded" onClick={closePlaybookModal}>
                Close
              </button>
              <button disabled className="btn btn--rounded btn--yellow" title="Save changes (MVP - not functional)">
                Save changes (is not funtional)
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </Layout>
  );
};

export default NegotiationPage;


