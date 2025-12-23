"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setUser, setSession, setLoading, setError, signOut } from "../features/authSlice";
import { supabase } from "@/lib/supabase";
import type { AuthError } from "@supabase/supabase-js";

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
        // Extract error message - Supabase errors have different structures
        // Wrap in try-catch to prevent errors when accessing error properties
        let errorMessage = "An error occurred during sign in";
        let userFriendlyMessage = "Invalid email or password. Please check your credentials and try again.";
        
        try {
          // Try multiple ways to extract the error message safely
          if (typeof signInError === "string") {
            errorMessage = signInError;
          } else if (signInError && typeof signInError === "object") {
            // Safely access message property
            try {
              const authError = signInError as AuthError & { error_description?: string; error?: string };
              errorMessage = authError.message || authError.error_description || authError.error || String(signInError);
            } catch {
              // If accessing properties throws, use string conversion
              try {
                errorMessage = JSON.stringify(signInError);
              } catch {
                errorMessage = String(signInError);
              }
            }
          } else if (signInError) {
            errorMessage = String(signInError);
          }
          
          // Provide more specific error messages
          const lowerMessage = errorMessage.toLowerCase();
          
          // Check for specific error types
          if (lowerMessage.includes("invalid login credentials") || 
              lowerMessage.includes("invalid credentials") ||
              lowerMessage.includes("email or password")) {
            userFriendlyMessage = "Invalid email or password. Please check your credentials and try again.";
          } else if (lowerMessage.includes("email not confirmed") ||
                     lowerMessage.includes("not confirmed") ||
                     lowerMessage.includes("email verification")) {
            userFriendlyMessage = "Please verify your email address. Check your inbox for the confirmation link.";
          } else if (lowerMessage.includes("user not found")) {
            userFriendlyMessage = "No account found with this email. Please sign up first.";
          } else if (lowerMessage.includes("too many requests") ||
                     lowerMessage.includes("rate limit")) {
            userFriendlyMessage = "Too many login attempts. Please try again later.";
          } else {
            // Use the extracted error message if no specific match
            userFriendlyMessage = errorMessage;
          }
        } catch (extractError) {
          // If error extraction fails, use default message
          console.error("Error extracting error message:", extractError);
          userFriendlyMessage = "Invalid email or password. Please check your credentials and try again.";
        }
        
        // Set error in Redux and return
        dispatch(setError(userFriendlyMessage));
        dispatch(setLoading(false));
        return { error: { message: userFriendlyMessage } };
      }

      dispatch(setUser(data.user));
      dispatch(setSession(data.session));
      dispatch(setLoading(false));
      return { user: data.user, session: data.session };
    } catch (err: unknown) {
      // Safely extract error message
      let errorMessage = "An error occurred during sign in";
      
      try {
        if (err instanceof Error) {
          errorMessage = err.message;
        } else if (typeof err === "string") {
          errorMessage = err;
        } else if (err && typeof err === "object") {
          try {
            const errObj = err as { message?: string; error?: string };
            errorMessage = errObj.message || errObj.error || JSON.stringify(err);
          } catch {
            errorMessage = String(err);
          }
        } else {
          errorMessage = String(err);
        }
        
        // Provide user-friendly message for common errors
        const lowerMessage = errorMessage.toLowerCase();
        if (lowerMessage.includes("invalid login credentials") || 
            lowerMessage.includes("invalid credentials")) {
          errorMessage = "Invalid email or password. Please check your credentials and try again.";
        }
      } catch {
        // If all else fails, use default message
        errorMessage = "Invalid email or password. Please check your credentials and try again.";
      }
      
      dispatch(setError(errorMessage));
      dispatch(setLoading(false));
      return { error: { message: errorMessage } };
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
