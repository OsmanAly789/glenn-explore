import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useGetApiAuthMe, usePostApiAuthRequestOtp, usePostApiAuthVerifyOtp, usePostApiAuthLogout } from '../api/generated/auth/auth';
import { UserProfileResponseDto } from '../api/generated/model/userProfileResponseDto';

interface AuthContextType {
  user: UserProfileResponseDto | null;
  hasCheckedUser: boolean;
  isLoading: boolean;
  isUserLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
  otpRequested: boolean;
  requestOtp: (email: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<void>;
  resendOtp: () => Promise<void>;
  logout: () => Promise<void>;
  currentEmail: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [hasCheckedUser, setHasCheckedUser] = useState(false);
  const [user, setUser] = useState<UserProfileResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [otpRequested, setOtpRequested] = useState(false);
  const [currentEmail, setCurrentEmail] = useState<string | null>(null);

  const { data: userData, isLoading: isUserLoading, error: userError } = useGetApiAuthMe({
    query: {
      retry: (failureCount, error: any) => {
        // Don't retry on 401 Unauthorized
        if (error?.response?.status === 401) return false;
        // Otherwise retry up to 3 times
        return failureCount < 3;
      }
    }
  });
  const { mutateAsync: requestOtpMutation } = usePostApiAuthRequestOtp();
  const { mutateAsync: verifyOtpMutation } = usePostApiAuthVerifyOtp();
  const { mutateAsync: logoutMutation } = usePostApiAuthLogout();

  useEffect(() => {
    if (userData) {
      setUser(userData);
      setError(null);
      setHasCheckedUser(true);
    } else if (userError) {
      setUser(null);
      // Don't set error state for 401, it's an expected state when not logged in
      if ((userError as any)?.response?.status !== 401) {
        setError(userError as Error);
      }
      setHasCheckedUser(true);
    }
    setIsLoading(false);
  }, [userData, userError]);

  const requestOtp = async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await requestOtpMutation({ data: { email } });
      setOtpRequested(true);
      setCurrentEmail(email);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (otp: string) => {
    if (!currentEmail) {
      throw new Error('No email provided for OTP verification');
    }

    setIsLoading(true);
    setError(null);
    try {
      await verifyOtpMutation({ 
        data: { 
          email: currentEmail,
          otpCode: otp,
          isLowPerformanceDevice: false
        } 
      });
      setOtpRequested(false);
      setCurrentEmail(null);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    if (!currentEmail) {
      throw new Error('No email to resend OTP to');
    }
    await requestOtp(currentEmail);
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutMutation();
      setUser(null);
      setError(null);
      setOtpRequested(false);
      setCurrentEmail(null);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading: isLoading || isUserLoading,
    isAuthenticated: !!user,
    hasCheckedUser,
    isUserLoading,
    error,
    otpRequested,
    requestOtp,
    verifyOtp,
    resendOtp,
    logout,
    currentEmail
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
