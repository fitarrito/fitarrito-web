"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setUser, setSession, setLoading, setError, signOut } from "../features/authSlice";
import { supabase } from "@/lib/supabase";

export function useAuth() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, session, loading, error } = useAppSelector((state) => state.auth);

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        dispatch(setSession(session));
        dispatch(setUser(session?.user ?? null));
        dispatch(setLoading(false));
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        dispatch(setSession(session));
        dispatch(setUser(session?.user ?? null));
        dispatch(setLoading(false));
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [dispatch]);

  const signIn = async (phoneOrEmail: string, password: string) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      let email = phoneOrEmail;

      // Check if input is a phone number (doesn't contain @)
      const isPhoneNumber = !phoneOrEmail.includes("@") && /^[\d\s\+\-\(\)]+$/.test(phoneOrEmail);

      // If it's a phone number, look up the email
      if (isPhoneNumber) {
        try {
          // Normalize phone number (remove spaces, dashes, etc.)
          const normalizedPhone = phoneOrEmail.replace(/[\s\-\(\)]/g, "");
          
          const response = await fetch("/api/auth/lookup-email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ phone: normalizedPhone }),
          });

          const data = await response.json();

          if (!response.ok || !data.email) {
            // If lookup fails, try with original phone number format as well
            if (normalizedPhone !== phoneOrEmail) {
              const retryResponse = await fetch("/api/auth/lookup-email", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ phone: phoneOrEmail }),
              });
              
              const retryData = await retryResponse.json();
              
              if (retryResponse.ok && retryData.email) {
                email = retryData.email;
              } else {
                dispatch(setError(data.error || "No account found with this phone number. Please try signing in with your email address instead."));
                dispatch(setLoading(false));
                return { error: data.error || "Account not found" };
              }
            } else {
              // Check if it's a server configuration error (missing service key)
              if (response.status === 500 && data.error?.includes("Server configuration")) {
                dispatch(setError("Phone number login is not available. Please sign in with your email address instead."));
                dispatch(setLoading(false));
                return { error: "Service unavailable" };
              }
              
              dispatch(setError(data.error || "No account found with this phone number. Please try signing in with your email address instead."));
              dispatch(setLoading(false));
              return { error: data.error || "Account not found" };
            }
          } else {
            email = data.email;
          }
        } catch (error) {
          console.error("Phone lookup error:", error);
          dispatch(setError("Failed to lookup account. Please try signing in with your email address instead."));
          dispatch(setLoading(false));
          return { error: "Lookup failed" };
        }
      }

      // Sign in with email (either original or looked up)
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        // Extract error message from Supabase error object
        const errorMessage = signInError.message || signInError.toString() || "An error occurred during sign in";
        const errorStatus = signInError.status || "unknown";
        
        // Provide more specific error messages
        let userFriendlyMessage = errorMessage;
        
        // Check for specific error types
        if (errorMessage.toLowerCase().includes("invalid login credentials") || 
            errorMessage.toLowerCase().includes("invalid credentials")) {
          userFriendlyMessage = "Invalid email or password. Please check your credentials and try again.";
        } else if (errorMessage.toLowerCase().includes("email not confirmed") ||
                   errorMessage.toLowerCase().includes("not confirmed")) {
          userFriendlyMessage = "Please verify your email address. Check your inbox for the confirmation link.";
        } else if (errorMessage.toLowerCase().includes("user not found")) {
          userFriendlyMessage = "No account found with this email. Please sign up first.";
        } else if (errorMessage.toLowerCase().includes("too many requests")) {
          userFriendlyMessage = "Too many login attempts. Please try again later.";
        }
        
        // Log error for debugging - log the raw error first
        console.error("Sign in error (raw):", signInError);
        console.error("Sign in error (parsed):", {
          error: signInError,
          message: errorMessage,
          status: errorStatus,
          email: email,
          errorType: typeof signInError,
          errorKeys: signInError ? Object.keys(signInError) : [],
        });
        
        dispatch(setError(userFriendlyMessage));
        dispatch(setLoading(false));
        return { error: signInError };
      }

      dispatch(setUser(data.user));
      dispatch(setSession(data.session));
      dispatch(setLoading(false));
      return { user: data.user, session: data.session };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      dispatch(setError(errorMessage));
      dispatch(setLoading(false));
      return { error: err };
    }
  };

  const signUp = async (email: string, password: string, metadata?: { name?: string; phone?: string }) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (signUpError) {
        // Extract error message from Supabase error object
        const errorMessage = signUpError.message || signUpError.toString() || "An error occurred during sign up";
        
        // Provide more specific error messages
        let userFriendlyMessage = errorMessage;
        
        if (errorMessage.toLowerCase().includes("user already registered") ||
            errorMessage.toLowerCase().includes("already registered")) {
          userFriendlyMessage = "An account with this email already exists. Please sign in instead.";
        } else if (errorMessage.toLowerCase().includes("password")) {
          userFriendlyMessage = "Password must be at least 6 characters long.";
        } else if (errorMessage.toLowerCase().includes("email")) {
          userFriendlyMessage = "Please enter a valid email address.";
        }
        
        // Log error for debugging - log the raw error first
        console.error("Sign up error (raw):", signUpError);
        console.error("Sign up error (parsed):", {
          error: signUpError,
          message: errorMessage,
          errorType: typeof signUpError,
          errorKeys: signUpError ? Object.keys(signUpError) : [],
        });
        
        dispatch(setError(userFriendlyMessage));
        dispatch(setLoading(false));
        return { error: signUpError };
      }

      dispatch(setUser(data.user));
      dispatch(setSession(data.session));
      dispatch(setLoading(false));
      return { user: data.user, session: data.session };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      dispatch(setError(errorMessage));
      dispatch(setLoading(false));
      return { error: err };
    }
  };

  const signOutUser = async () => {
    dispatch(setLoading(true));
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        dispatch(setError(error.message));
        return { error };
      }
      dispatch(signOut());
      router.push("/signin");
      return { success: true };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      dispatch(setError(errorMessage));
      return { error: err };
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    user,
    session,
    loading,
    error,
    signIn,
    signUp,
    signOut: signOutUser,
    isAuthenticated: !!user,
  };
}
