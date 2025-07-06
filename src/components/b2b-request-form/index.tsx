import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import type { BuyerRequest } from "../../types/b2b";

// Speech recognition types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}

interface B2BRequestFormProps {
  onSubmit: (request: BuyerRequest) => void;
  onMatchingRequest?: (request: BuyerRequest) => void;
}

const B2BRequestForm: React.FC<B2BRequestFormProps> = ({
  onSubmit,
  onMatchingRequest,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [language, setLanguage] = useState<"en-US" | "de-DE">("en-US");
  const [formData, setFormData] = useState<Partial<BuyerRequest>>({
    title: "",
    description: "",
    category: "",
    subcategory: "",
    specifications: {},
    quantity: { min: 1, max: 1, unit: "pieces" },
    budget: { min: 0, max: 0, currency: "EUR" },
    deliveryRequirements: {
      location: { city: "", country: "Germany" },
      deadline: new Date(),
      terms: "dap",
    },
    paymentPreferences: { terms: "net_30" },
    additionalRequirements: "",
    urgency: "medium",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = language;

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript((prev) => prev + " " + finalTranscript);
          setFormData((prev) => ({
            ...prev,
            description: (prev.description || "") + " " + finalTranscript,
          }));
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [language]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition not supported in this browser");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleInputChange = (field: keyof BuyerRequest, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleNestedInputChange = (
    parent: keyof BuyerRequest,
    field: string,
    value: any,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: { ...(prev[parent] as any), [field]: value },
    }));
  };

  const handleSpecificationChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      specifications: { ...prev.specifications, [key]: value },
    }));
  };

  const addSpecification = () => {
    const key = `spec_${Date.now()}`;
    handleSpecificationChange(key, "");
  };

  const removeSpecification = (key: string) => {
    setFormData((prev) => {
      const newSpecs = { ...prev.specifications };
      delete newSpecs[key];
      return { ...prev, specifications: newSpecs };
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description?.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.category?.trim()) {
      newErrors.category = "Category is required";
    }

    if (!formData.quantity?.min || formData.quantity.min <= 0) {
      newErrors.quantity = "Minimum quantity must be greater than 0";
    }

    if (!formData.budget?.max || formData.budget.max <= 0) {
      newErrors.budget = "Maximum budget must be greater than 0";
    }

    if (!formData.deliveryRequirements?.location?.city?.trim()) {
      newErrors.location = "Delivery city is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const request: BuyerRequest = {
        id: uuidv4(),
        buyerId: "current-user", // TODO: Get from auth context
        title: formData.title!,
        description: formData.description!,
        category: formData.category!,
        subcategory: formData.subcategory || "",
        specifications: formData.specifications || {},
        quantity: formData.quantity!,
        budget: formData.budget!,
        deliveryRequirements: formData.deliveryRequirements!,
        paymentPreferences: formData.paymentPreferences!,
        additionalRequirements: formData.additionalRequirements || "",
        urgency: formData.urgency!,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Additional validation could be added here
      console.log("Submitting request:", request);

      onSubmit(request);

      // Trigger matching if callback provided
      if (onMatchingRequest) {
        onMatchingRequest(request);
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      setErrors({ form: "Failed to submit request. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="b2b-request-form">
      <div className="container">
        <div className="form-header">
          <h2>Submit Your B2B Procurement Request</h2>
          <p>
            Describe what you need and let our AI agents find the best suppliers
            and negotiate on your behalf.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="request-form">
          {/* Voice Input Section */}
          <div className="form-section voice-section">
            <div className="voice-controls">
              <h3>Voice Input (Optional)</h3>
              <div className="voice-actions">
                <select
                  value={language}
                  onChange={(e) =>
                    setLanguage(e.target.value as "en-US" | "de-DE")
                  }
                  className="language-select"
                  aria-label="Voice input language"
                >
                  <option value="en-US">English</option>
                  <option value="de-DE">Deutsch</option>
                </select>
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`voice-btn ${isListening ? "listening" : ""}`}
                >
                  <i
                    className={`icon-${isListening ? "pause" : "microphone"}`}
                  />
                  {isListening ? "Stop Recording" : "Start Voice Input"}
                </button>
              </div>
              {transcript && (
                <div className="transcript">
                  <small>Transcript: {transcript}</small>
                </div>
              )}
            </div>
          </div>

          {/* Basic Information */}
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title">Request Title *</label>
                <input
                  type="text"
                  id="title"
                  value={formData.title || ""}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="e.g., Need 1000 industrial bolts M8x50"
                  className={errors.title ? "error" : ""}
                />
                {errors.title && (
                  <span className="error-text">{errors.title}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="description">Detailed Description *</label>
                <textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Describe your requirements in detail..."
                  rows={4}
                  className={errors.description ? "error" : ""}
                />
                {errors.description && (
                  <span className="error-text">{errors.description}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  value={formData.category || ""}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  className={errors.category ? "error" : ""}
                >
                  <option value="">Select Category</option>
                  <option value="Industrial Hardware">
                    Industrial Hardware
                  </option>
                  <option value="Office Furniture">Office Furniture</option>
                  <option value="Industrial Equipment">
                    Industrial Equipment
                  </option>
                  <option value="Electronics">Electronics</option>
                  <option value="Raw Materials">Raw Materials</option>
                  <option value="Other">Other</option>
                </select>
                {errors.category && (
                  <span className="error-text">{errors.category}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="subcategory">Subcategory</label>
                <input
                  type="text"
                  id="subcategory"
                  value={formData.subcategory || ""}
                  onChange={(e) =>
                    handleInputChange("subcategory", e.target.value)
                  }
                  placeholder="e.g., Fasteners, Seating, Lighting"
                />
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="form-section">
            <h3>Technical Specifications</h3>
            <div className="specifications">
              {Object.entries(formData.specifications || {}).map(
                ([key, value]) => (
                  <div key={key} className="spec-row">
                    <input
                      type="text"
                      placeholder="Specification name"
                      value={key.startsWith("spec_") ? "" : key}
                      onChange={(e) => {
                        const newSpecs = { ...formData.specifications };
                        delete newSpecs[key];
                        newSpecs[e.target.value || key] = value;
                        setFormData((prev) => ({
                          ...prev,
                          specifications: newSpecs,
                        }));
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={value}
                      onChange={(e) =>
                        handleSpecificationChange(key, e.target.value)
                      }
                    />
                    <button
                      type="button"
                      onClick={() => removeSpecification(key)}
                      className="remove-btn"
                    >
                      ×
                    </button>
                  </div>
                ),
              )}
              <button
                type="button"
                onClick={addSpecification}
                className="add-spec-btn"
              >
                + Add Specification
              </button>
            </div>
          </div>

          {/* Quantity & Budget */}
          <div className="form-section">
            <h3>Quantity & Budget</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Quantity Range *</label>
                <div className="quantity-inputs">
                  <input
                    type="number"
                    placeholder="Min"
                    value={formData.quantity?.min || ""}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "quantity",
                        "min",
                        parseInt(e.target.value) || 0,
                      )
                    }
                    className={errors.quantity ? "error" : ""}
                  />
                  <span>to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={formData.quantity?.max || ""}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "quantity",
                        "max",
                        parseInt(e.target.value) || 0,
                      )
                    }
                  />
                  <select
                    value={formData.quantity?.unit || "pieces"}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "quantity",
                        "unit",
                        e.target.value,
                      )
                    }
                    aria-label="Quantity unit"
                  >
                    <option value="pieces">Pieces</option>
                    <option value="kg">Kilograms</option>
                    <option value="tons">Tons</option>
                    <option value="liters">Liters</option>
                    <option value="m2">Square Meters</option>
                    <option value="m3">Cubic Meters</option>
                  </select>
                </div>
                {errors.quantity && (
                  <span className="error-text">{errors.quantity}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Budget Range *</label>
                <div className="budget-inputs">
                  <input
                    type="number"
                    placeholder="Min Budget"
                    value={formData.budget?.min || ""}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "budget",
                        "min",
                        parseFloat(e.target.value) || 0,
                      )
                    }
                  />
                  <span>to</span>
                  <input
                    type="number"
                    placeholder="Max Budget"
                    value={formData.budget?.max || ""}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "budget",
                        "max",
                        parseFloat(e.target.value) || 0,
                      )
                    }
                    className={errors.budget ? "error" : ""}
                  />
                  <select
                    value={formData.budget?.currency || "EUR"}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "budget",
                        "currency",
                        e.target.value,
                      )
                    }
                    aria-label="Budget currency"
                  >
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
                {errors.budget && (
                  <span className="error-text">{errors.budget}</span>
                )}
              </div>
            </div>
          </div>

          {/* Delivery Requirements */}
          <div className="form-section">
            <h3>Delivery Requirements</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">Delivery City *</label>
                <input
                  type="text"
                  id="city"
                  value={formData.deliveryRequirements?.location?.city || ""}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "deliveryRequirements",
                      "location",
                      {
                        ...formData.deliveryRequirements?.location,
                        city: e.target.value,
                      },
                    )
                  }
                  placeholder="e.g., Berlin, Munich, Hamburg"
                  className={errors.location ? "error" : ""}
                />
                {errors.location && (
                  <span className="error-text">{errors.location}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="country">Country</label>
                <select
                  id="country"
                  value={
                    formData.deliveryRequirements?.location?.country ||
                    "Germany"
                  }
                  onChange={(e) =>
                    handleNestedInputChange(
                      "deliveryRequirements",
                      "location",
                      {
                        ...formData.deliveryRequirements?.location,
                        country: e.target.value,
                      },
                    )
                  }
                >
                  <option value="Germany">Germany</option>
                  <option value="Austria">Austria</option>
                  <option value="Switzerland">Switzerland</option>
                  <option value="Netherlands">Netherlands</option>
                  <option value="Belgium">Belgium</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="deadline">Required By</label>
                <input
                  type="date"
                  id="deadline"
                  value={
                    formData.deliveryRequirements?.deadline
                      ?.toISOString()
                      .split("T")[0] || ""
                  }
                  onChange={(e) =>
                    handleNestedInputChange(
                      "deliveryRequirements",
                      "deadline",
                      new Date(e.target.value),
                    )
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="deliveryTerms">Delivery Terms</label>
                <select
                  id="deliveryTerms"
                  value={formData.deliveryRequirements?.terms || "dap"}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "deliveryRequirements",
                      "terms",
                      e.target.value,
                    )
                  }
                >
                  <option value="ex_works">EXW - Ex Works</option>
                  <option value="fob">FOB - Free on Board</option>
                  <option value="cif">CIF - Cost, Insurance & Freight</option>
                  <option value="dap">DAP - Delivered at Place</option>
                  <option value="ddp">DDP - Delivered Duty Paid</option>
                </select>
              </div>
            </div>
          </div>

          {/* Payment & Additional Info */}
          <div className="form-section">
            <h3>Payment & Additional Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="paymentTerms">Preferred Payment Terms</label>
                <select
                  id="paymentTerms"
                  value={formData.paymentPreferences?.terms || "net_30"}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "paymentPreferences",
                      "terms",
                      e.target.value,
                    )
                  }
                >
                  <option value="immediate">Immediate Payment</option>
                  <option value="net_7">Net 7 Days</option>
                  <option value="net_30">Net 30 Days</option>
                  <option value="net_60">Net 60 Days</option>
                  <option value="net_90">Net 90 Days</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="urgency">Urgency Level</label>
                <select
                  id="urgency"
                  value={formData.urgency || "medium"}
                  onChange={(e) => handleInputChange("urgency", e.target.value)}
                >
                  <option value="low">Low - Flexible timeline</option>
                  <option value="medium">Medium - Standard priority</option>
                  <option value="high">High - Urgent requirement</option>
                  <option value="critical">Critical - Immediate need</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="additional">Additional Requirements</label>
                <textarea
                  id="additional"
                  value={formData.additionalRequirements || ""}
                  onChange={(e) =>
                    handleInputChange("additionalRequirements", e.target.value)
                  }
                  placeholder="Any special requirements, certifications needed, preferred suppliers, etc."
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Submit Section */}
          <div className="form-section submit-section">
            {Object.keys(errors).length > 0 && (
              <div className="validation-summary" style={{
                background: '#fff3cd',
                border: '1px solid #ffeaa7',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '20px',
                color: '#856404'
              }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
                  <i className="icon-warning" /> Please complete the following required fields:
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {errors.title && <li>Request Title</li>}
                  {errors.description && <li>Detailed Description</li>}
                  {errors.category && <li>Category</li>}
                  {errors.quantity && <li>Quantity (minimum must be greater than 0)</li>}
                  {errors.budget && <li>Budget (maximum must be greater than 0)</li>}
                  {errors.location && <li>Delivery City</li>}
                  {errors.form && <li>{errors.form}</li>}
                </ul>
              </div>
            )}
            <button
              type="submit"
              className="btn btn--rounded btn--yellow"
              disabled={isSubmitting}
              style={{ 
                fontSize: '14px',
                padding: '15px 30px',
                fontWeight: '600',
                textTransform: 'none',
                minWidth: '280px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isSubmitting ? (
                <>
                  <i className="icon-loading" />
                  Submitting Request...
                </>
              ) : (
                <>
                  <i className="icon-search" />
                  Find Suppliers & Start Negotiation
                </>
              )}
            </button>
            <p className="submit-note">
              Our AI agents will immediately start searching for matching
              suppliers and begin negotiations on your behalf.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default B2BRequestForm;
