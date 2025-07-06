import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "@/store/reducers/user";
import { UserRole } from "@/types";

// Validation schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["supplier", "buyer", "admin"], {
    required_error: "Please select your role",
  }),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface B2BLoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
  className?: string;
}

const B2BLoginForm: React.FC<B2BLoginFormProps> = ({
  onSuccess,
  onSwitchToRegister,
  className = "",
}) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      role: "buyer", // Default to buyer
      rememberMe: false,
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    dispatch(loginStart());

    try {
      // TODO: Replace with actual API call
      // For now, simulate authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      const mockUser = {
        id: `user-${Date.now()}`,
        email: data.email,
        name: data.email.split("@")[0],
        role: data.role as UserRole,
        isB2BUser: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockCompany = data.role !== "admin" ? {
        id: `company-${Date.now()}`,
        name: `${data.role === "supplier" ? "Supplier" : "Buyer"} Company`,
        taxId: "DE123456789",
        address: {
          street: "Sample Street 123",
          city: "Berlin",
          postalCode: "10115",
          country: "Germany",
        },
        contactPerson: {
          name: mockUser.name,
          email: mockUser.email,
          phone: "+49 30 12345678",
          position: data.role === "supplier" ? "Sales Manager" : "Procurement Manager",
        },
        industry: data.role === "supplier" ? "Manufacturing" : "Construction",
        verified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      } : undefined;

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
      dispatch(loginFailure(error instanceof Error ? error.message : "Login failed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`b2b-login-form ${className}`}>
      <div className="form-header">
        <h2>B2B Marketplace Login</h2>
        <p>Access your professional procurement platform</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="login-form">
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

        {/* Email */}
        <div className="form-group">
          <label className="form-label" htmlFor="email">
            Business Email
          </label>
          <input
            id="email"
            type="email"
            className={`form-input ${errors.email ? "error" : ""}`}
            placeholder="your.email@company.com"
            {...register("email")}
          />
          {errors.email && <span className="error-message">{errors.email.message}</span>}
        </div>

        {/* Password */}
        <div className="form-group">
          <label className="form-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className={`form-input ${errors.password ? "error" : ""}`}
            placeholder="Enter your password"
            {...register("password")}
          />
          {errors.password && <span className="error-message">{errors.password.message}</span>}
        </div>

        {/* Remember Me */}
        <div className="form-group checkbox-group">
          <label className="checkbox-wrapper">
            <input
              type="checkbox"
              {...register("rememberMe")}
            />
            <span className="checkbox-custom">
              <span className="checkbox-tick">✓</span>
            </span>
            <span>Keep me logged in</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn--rounded btn--yellow submit-btn"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>

        {/* Additional Links */}
        <div className="form-footer">
          <a href="/forgot-password" className="forgot-password-link">
            Forgot your password?
          </a>
          
          {onSwitchToRegister && (
            <p className="switch-form">
              Don't have an account?{" "}
              <button
                type="button"
                className="link-button"
                onClick={onSwitchToRegister}
              >
                Register here
              </button>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default B2BLoginForm; 