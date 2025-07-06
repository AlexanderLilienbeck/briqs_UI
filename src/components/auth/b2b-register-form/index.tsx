import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "@/store/reducers/user";
import { UserRole } from "@/types";

// Validation schema
const registerSchema = z.object({
  // User Information
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  role: z.enum(["supplier", "buyer"], {
    required_error: "Please select your role",
  }),
  
  // Company Information
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  taxId: z.string().min(5, "Tax ID is required"),
  industry: z.string().min(2, "Industry is required"),
  website: z.string().url("Please enter a valid website URL").optional().or(z.literal("")),
  
  // Address Information
  street: z.string().min(5, "Street address is required"),
  city: z.string().min(2, "City is required"),
  postalCode: z.string().min(4, "Postal code is required"),
  country: z.string().min(2, "Country is required"),
  
  // Contact Information
  phone: z.string().min(10, "Phone number is required"),
  position: z.string().min(2, "Position is required"),
  
  // Terms and Conditions
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions",
  }),
  acceptPrivacy: z.boolean().refine(val => val === true, {
    message: "You must accept the privacy policy",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface B2BRegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
  className?: string;
}

const B2BRegisterForm: React.FC<B2BRegisterFormProps> = ({
  onSuccess,
  onSwitchToLogin,
  className = "",
}) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "buyer",
      country: "Germany",
    },
  });

  const selectedRole = watch("role");

  const nextStep = async () => {
    let isValid = false;
    
    if (currentStep === 1) {
      isValid = await trigger(["firstName", "lastName", "email", "password", "confirmPassword", "role"]);
    } else if (currentStep === 2) {
      isValid = await trigger(["companyName", "taxId", "industry", "website"]);
    } else if (currentStep === 3) {
      isValid = await trigger(["street", "city", "postalCode", "country", "phone", "position"]);
    }
    
    if (isValid) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    dispatch(loginStart());

    try {
      // TODO: Replace with actual API call
      // For now, simulate registration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful registration
      const mockUser = {
        id: `user-${Date.now()}`,
        email: data.email,
        name: `${data.firstName} ${data.lastName}`,
        role: data.role as UserRole,
        isB2BUser: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockCompany = {
        id: `company-${Date.now()}`,
        name: data.companyName,
        taxId: data.taxId,
        address: {
          street: data.street,
          city: data.city,
          postalCode: data.postalCode,
          country: data.country,
        },
        contactPerson: {
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          phone: data.phone,
          position: data.position,
        },
        industry: data.industry,
        website: data.website || undefined,
        verified: false, // New registrations need verification
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockToken = `mock-jwt-token-${Date.now()}`;

      dispatch(loginSuccess({
        user: mockUser,
        company: mockCompany,
        token: mockToken,
      }));

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      dispatch(loginFailure(error instanceof Error ? error.message : "Registration failed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`b2b-register-form ${className}`}>
      <div className="form-header">
        <h2>Join B2B Marketplace</h2>
        <p>Create your professional account to start trading</p>
        
        {/* Step Indicator */}
        <div className="step-indicator">
          <div className={`step ${currentStep >= 1 ? "active" : ""} ${currentStep > 1 ? "completed" : ""}`}>
            <span className="step-number">1</span>
            <span className="step-label">Account</span>
          </div>
          <div className={`step ${currentStep >= 2 ? "active" : ""} ${currentStep > 2 ? "completed" : ""}`}>
            <span className="step-number">2</span>
            <span className="step-label">Company</span>
          </div>
          <div className={`step ${currentStep >= 3 ? "active" : ""} ${currentStep > 3 ? "completed" : ""}`}>
            <span className="step-number">3</span>
            <span className="step-label">Contact</span>
          </div>
          <div className={`step ${currentStep >= 4 ? "active" : ""} ${currentStep > 4 ? "completed" : ""}`}>
            <span className="step-number">4</span>
            <span className="step-label">Review</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="register-form">
        {/* Step 1: Account Information */}
        {currentStep === 1 && (
          <div className="form-step">
            <h3>Account Information</h3>
            
            {/* Role Selection */}
            <div className="form-group role-selection">
              <label className="form-label">I am a:</label>
              <div className="role-options">
                <label className={`role-option ${selectedRole === "buyer" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    value="buyer"
                    {...register("role")}
                  />
                  <div className="role-card">
                    <div className="role-icon">🏢</div>
                    <div className="role-info">
                      <h4>Buyer</h4>
                      <p>I need to procure products and services</p>
                    </div>
                  </div>
                </label>
                
                <label className={`role-option ${selectedRole === "supplier" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    value="supplier"
                    {...register("role")}
                  />
                  <div className="role-card">
                    <div className="role-icon">🏭</div>
                    <div className="role-info">
                      <h4>Supplier</h4>
                      <p>I provide products and services</p>
                    </div>
                  </div>
                </label>
              </div>
              {errors.role && <span className="error-message">{errors.role.message}</span>}
            </div>

            {/* Name Fields */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="firstName">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  className={`form-input ${errors.firstName ? "error" : ""}`}
                  placeholder="John"
                  {...register("firstName")}
                />
                {errors.firstName && <span className="error-message">{errors.firstName.message}</span>}
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="lastName">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  className={`form-input ${errors.lastName ? "error" : ""}`}
                  placeholder="Doe"
                  {...register("lastName")}
                />
                {errors.lastName && <span className="error-message">{errors.lastName.message}</span>}
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Business Email
              </label>
              <input
                id="email"
                type="email"
                className={`form-input ${errors.email ? "error" : ""}`}
                placeholder="john.doe@company.com"
                {...register("email")}
              />
              {errors.email && <span className="error-message">{errors.email.message}</span>}
            </div>

            {/* Password Fields */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className={`form-input ${errors.password ? "error" : ""}`}
                  placeholder="Enter password"
                  {...register("password")}
                />
                {errors.password && <span className="error-message">{errors.password.message}</span>}
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  className={`form-input ${errors.confirmPassword ? "error" : ""}`}
                  placeholder="Confirm password"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword.message}</span>}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Company Information */}
        {currentStep === 2 && (
          <div className="form-step">
            <h3>Company Information</h3>
            
            <div className="form-group">
              <label className="form-label" htmlFor="companyName">
                Company Name
              </label>
              <input
                id="companyName"
                type="text"
                className={`form-input ${errors.companyName ? "error" : ""}`}
                placeholder="Your Company Ltd."
                {...register("companyName")}
              />
              {errors.companyName && <span className="error-message">{errors.companyName.message}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="taxId">
                  Tax ID / VAT Number
                </label>
                <input
                  id="taxId"
                  type="text"
                  className={`form-input ${errors.taxId ? "error" : ""}`}
                  placeholder="DE123456789"
                  {...register("taxId")}
                />
                {errors.taxId && <span className="error-message">{errors.taxId.message}</span>}
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="industry">
                  Industry
                </label>
                <input
                  id="industry"
                  type="text"
                  className={`form-input ${errors.industry ? "error" : ""}`}
                  placeholder="Manufacturing"
                  {...register("industry")}
                />
                {errors.industry && <span className="error-message">{errors.industry.message}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="website">
                Website (Optional)
              </label>
              <input
                id="website"
                type="url"
                className={`form-input ${errors.website ? "error" : ""}`}
                placeholder="https://www.yourcompany.com"
                {...register("website")}
              />
              {errors.website && <span className="error-message">{errors.website.message}</span>}
            </div>
          </div>
        )}

        {/* Step 3: Contact & Address */}
        {currentStep === 3 && (
          <div className="form-step">
            <h3>Contact & Address</h3>
            
            <div className="form-group">
              <label className="form-label" htmlFor="street">
                Street Address
              </label>
              <input
                id="street"
                type="text"
                className={`form-input ${errors.street ? "error" : ""}`}
                placeholder="123 Business Street"
                {...register("street")}
              />
              {errors.street && <span className="error-message">{errors.street.message}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="city">
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  className={`form-input ${errors.city ? "error" : ""}`}
                  placeholder="Berlin"
                  {...register("city")}
                />
                {errors.city && <span className="error-message">{errors.city.message}</span>}
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="postalCode">
                  Postal Code
                </label>
                <input
                  id="postalCode"
                  type="text"
                  className={`form-input ${errors.postalCode ? "error" : ""}`}
                  placeholder="10115"
                  {...register("postalCode")}
                />
                {errors.postalCode && <span className="error-message">{errors.postalCode.message}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="country">
                Country
              </label>
              <select
                id="country"
                className={`form-input ${errors.country ? "error" : ""}`}
                {...register("country")}
              >
                <option value="Germany">Germany</option>
                <option value="Austria">Austria</option>
                <option value="Switzerland">Switzerland</option>
                <option value="Netherlands">Netherlands</option>
                <option value="Belgium">Belgium</option>
                <option value="France">France</option>
              </select>
              {errors.country && <span className="error-message">{errors.country.message}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="phone">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  className={`form-input ${errors.phone ? "error" : ""}`}
                  placeholder="+49 30 12345678"
                  {...register("phone")}
                />
                {errors.phone && <span className="error-message">{errors.phone.message}</span>}
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="position">
                  Your Position
                </label>
                <input
                  id="position"
                  type="text"
                  className={`form-input ${errors.position ? "error" : ""}`}
                  placeholder="Procurement Manager"
                  {...register("position")}
                />
                {errors.position && <span className="error-message">{errors.position.message}</span>}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review & Terms */}
        {currentStep === 4 && (
          <div className="form-step">
            <h3>Review & Accept Terms</h3>
            
            <div className="registration-summary">
              <h4>Registration Summary</h4>
              <p><strong>Role:</strong> {selectedRole === "buyer" ? "Buyer" : "Supplier"}</p>
              <p><strong>Email:</strong> {watch("email")}</p>
              <p><strong>Company:</strong> {watch("companyName")}</p>
              <p><strong>Industry:</strong> {watch("industry")}</p>
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-wrapper">
                <input
                  type="checkbox"
                  {...register("acceptTerms")}
                />
                <span className="checkbox-custom">
                  <span className="checkbox-tick">✓</span>
                </span>
                <span>I accept the <a href="/terms" target="_blank">Terms and Conditions</a></span>
              </label>
              {errors.acceptTerms && <span className="error-message">{errors.acceptTerms.message}</span>}
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-wrapper">
                <input
                  type="checkbox"
                  {...register("acceptPrivacy")}
                />
                <span className="checkbox-custom">
                  <span className="checkbox-tick">✓</span>
                </span>
                <span>I accept the <a href="/privacy" target="_blank">Privacy Policy</a></span>
              </label>
              {errors.acceptPrivacy && <span className="error-message">{errors.acceptPrivacy.message}</span>}
            </div>
          </div>
        )}

        {/* Form Navigation */}
        <div className="form-navigation">
          {currentStep > 1 && (
            <button
              type="button"
              className="btn btn--rounded btn--outline"
              onClick={prevStep}
            >
              Previous
            </button>
          )}
          
          {currentStep < 4 ? (
            <button
              type="button"
              className="btn btn--rounded btn--yellow"
              onClick={nextStep}
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="btn btn--rounded btn--yellow submit-btn"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          )}
        </div>

        {/* Switch to Login */}
        {onSwitchToLogin && (
          <div className="form-footer">
            <p className="switch-form">
              Already have an account?{" "}
              <button
                type="button"
                className="link-button"
                onClick={onSwitchToLogin}
              >
                Sign in here
              </button>
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default B2BRegisterForm; 