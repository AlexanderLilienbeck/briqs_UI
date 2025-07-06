import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { remove } from "lodash";
import { ExtendedUserType, UserRole, CompanyProfile } from "@/types";

type ProductType = {
  id: string;
  name: string;
  thumb: string;
  price: string;
  count: number;
  color: string;
  size: string;
};

type ToggleFavType = {
  id: string;
};

type LoginPayload = {
  user: ExtendedUserType;
  company?: CompanyProfile;
  token?: string;
};

type UpdateProfilePayload = {
  name?: string;
  email?: string;
  role?: UserRole;
  companyId?: string;
};

interface UserSliceTypes {
  user: ExtendedUserType | null;
  company: CompanyProfile | null;
  isAuthenticated: boolean;
  token: string | null;
  favProducts: string[];
  isLoading: boolean;
  error: string | null;
}

const initialState = {
  user: null,
  company: null,
  isAuthenticated: false,
  token: null,
  favProducts: [],
  isLoading: false,
  error: null,
} as UserSliceTypes;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Authentication actions
    loginStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<LoginPayload>) {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.company = action.payload.company || null;
      state.token = action.payload.token || null;
      state.error = null;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.company = null;
      state.token = null;
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      state.company = null;
      state.isAuthenticated = false;
      state.token = null;
      state.error = null;
      state.favProducts = [];
    },
    
    // Profile management
    updateProfile(state, action: PayloadAction<UpdateProfilePayload>) {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
          updatedAt: new Date(),
        };
      }
    },
    
    updateCompany(state, action: PayloadAction<Partial<CompanyProfile>>) {
      if (state.company) {
        state.company = {
          ...state.company,
          ...action.payload,
          updatedAt: new Date(),
        };
      }
    },
    
    // Role switching (for admin users)
    switchRole(state, action: PayloadAction<UserRole>) {
      if (state.user && (state.user.role === "admin" || action.payload === "admin")) {
        state.user.role = action.payload;
      }
    },
    
    // Favorites management (backwards compatibility)
    toggleFavProduct(state, action: PayloadAction<ToggleFavType>) {
      const index = state.favProducts.includes(action.payload.id);

      if (!index) {
        state.favProducts.push(action.payload.id);
        return;
      }

      remove(state.favProducts, (id) => id === action.payload.id);
    },
    
    // Legacy action for backwards compatibility
    setUserLogged(state, action: PayloadAction<ProductType>) {
      // This action seems to be misnamed and handles favorites
      const index = state.favProducts.includes(action.payload.id);

      if (!index) {
        state.favProducts.push(action.payload.id);
        return;
      }

      remove(state.favProducts, (id) => id === action.payload.id);
    },
    
    // Error management
    clearError(state) {
      state.error = null;
    },
    
    // Loading states
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateProfile,
  updateCompany,
  switchRole,
  toggleFavProduct,
  setUserLogged, // Keep for backwards compatibility
  clearError,
  setLoading,
} = userSlice.actions;

export default userSlice.reducer;

// Selectors for easy access to user state
export const selectUser = (state: { user: UserSliceTypes }) => state.user.user;
export const selectCompany = (state: { user: UserSliceTypes }) => state.user.company;
export const selectIsAuthenticated = (state: { user: UserSliceTypes }) => state.user.isAuthenticated;
export const selectUserRole = (state: { user: UserSliceTypes }) => state.user.user?.role;
export const selectIsB2BUser = (state: { user: UserSliceTypes }) => state.user.user?.isB2BUser || false;
export const selectFavProducts = (state: { user: UserSliceTypes }) => state.user.favProducts;
export const selectUserLoading = (state: { user: UserSliceTypes }) => state.user.isLoading;
export const selectUserError = (state: { user: UserSliceTypes }) => state.user.error;
