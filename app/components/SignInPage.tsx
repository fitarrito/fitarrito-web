"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import tw from "twin.macro";
import styled from "styled-components";
import { useAuth } from "../lib/hooks/useAuth";
import { useAppDispatch } from "../lib/hooks";
import { setError } from "../lib/features/authSlice";
import { FaUser, FaLock } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import logo from "../images/logo.svg";
import textImage from "../images/fitarrito.svg";
import Button from "./ui/Button";

// Page Container
const PageContainer = tw.div`min-h-screen bg-white`;

// Header
const Header = tw.header`w-full bg-white shadow-sm`;
const HeaderContent = tw.div`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between`;
const LogoContainer = tw.div`flex items-center gap-3`;
const LogoImage = tw.div`flex items-center`;
const NavLinks = tw.nav`hidden md:flex items-center gap-8`;
const NavLink = tw(
  Link
)`text-gray-700 hover:text-customTheme font-medium transition-colors`;

// Main Content
const MainContent = tw.div`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20`;
const TwoColumnLayout = tw.div`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center`;

// Left Column (White - Form)
const LeftColumn = tw.div`w-full`;
const Headline = tw.div`mb-8`;
const HeadlinePart1 = tw.h1`text-5xl lg:text-6xl font-black text-customTheme mb-2`;
const HeadlinePart2 = tw.h1`text-5xl lg:text-6xl font-black text-gray-900 mb-6`;
const Description = tw.p`text-gray-600 text-lg leading-relaxed mb-8 max-w-lg`;

// Form
const FormContainer = tw.div`w-full max-w-md`;
const Form = tw.form`space-y-6`;
const InputContainer = tw.div`relative`;
const InputIcon = tw.div`absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400`;
const Input = tw.input`
  w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-full
  focus:ring-2 focus:ring-customTheme focus:border-customTheme
  text-gray-900 placeholder-gray-400 bg-white
  transition-all duration-200
`;
const ForgotPasswordLink = tw(
  Link
)`text-customTheme hover:text-primary-700 text-sm font-medium block mb-4`;
const ErrorMessage = tw.div`bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-full mb-4 text-sm`;
const SuccessMessage = tw.div`bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-full mb-4 text-sm`;
const SignUpLink = tw.div`text-center mt-6 text-sm text-gray-600`;
const SignUpLinkText = tw(
  Link
)`text-customTheme hover:text-primary-700 font-semibold`;

// Right Column (Theme color with Food Image)
const RightColumn = tw.div`hidden lg:block relative`;
const OrangeBackground = styled.div`
  ${tw`bg-customTheme rounded-3xl p-12 relative overflow-hidden`}
  min-height: 600px;
`;
const FoodImageContainer = tw.div`relative z-10 flex items-center justify-center h-full`;
const FoodImageWrapper = tw.div`relative w-full max-w-md`;
const DecorativeCircle = tw.div`absolute top-20 right-20 w-64 h-64 bg-white opacity-10 rounded-full`;
const DecorativeCircle2 = tw.div`absolute bottom-20 left-20 w-48 h-48 bg-white opacity-10 rounded-full`;

export default function SignInPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { signIn, loading, error } = useAuth();
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  // Clear error when component mounts
  useEffect(() => {
    dispatch(setError(null));
    setLocalError(null);
  }, [dispatch]);

  // Sync Redux error with local error state
  useEffect(() => {
    if (error) {
      setLocalError(error);
    } else {
      setLocalError(null);
    }
  }, [error]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setLocalError(null);
    // Clear any previous errors before attempting sign in
    dispatch(setError(null));

    const result = await signIn(phoneOrEmail, password);

    if (result.error) {
      // Error should be set in Redux by useAuth hook
      // But ensure it's displayed by checking and setting fallback if needed
      const errorMessage =
        result.error?.message ||
        (typeof result.error === "string" ? result.error : null) ||
        "Invalid email or password. Please check your credentials and try again.";

      // Set error in both Redux and local state to ensure it displays
      dispatch(setError(errorMessage));
      setLocalError(errorMessage);
      return;
    }

    if (result.user) {
      setSuccess("Successfully signed in! Redirecting...");
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1000);
    }
  };

  return (
    <PageContainer>
      {/* Header */}
      <Header>
        <HeaderContent>
          <LogoContainer>
            <LogoImage>
              <Image src={logo} alt="Fitarrito Logo" width={40} height={40} />
            </LogoImage>
            <Image
              src={textImage}
              alt="Fitarrito"
              width={120}
              height={40}
              className="ml-2"
            />
          </LogoContainer>
          <NavLinks>
            <NavLink href="/">Home</NavLink>
            <NavLink href="/about">About Us</NavLink>
            <NavLink href="/services">Services</NavLink>
          </NavLinks>
        </HeaderContent>
      </Header>

      {/* Main Content */}
      <MainContent>
        <TwoColumnLayout>
          {/* Left Column - Form */}
          <LeftColumn>
            <Headline>
              <HeadlinePart1>Hungry?</HeadlinePart1>
              <HeadlinePart2>Let&apos;s Fix That!</HeadlinePart2>
            </Headline>
            <Description>
              Welcome back! Sign in to your account to continue ordering your
              favorite meals and managing your food preferences.
            </Description>

            <FormContainer>
              <Form onSubmit={handleSignIn}>
                {(error || localError) && (
                  <ErrorMessage role="alert" aria-live="polite">
                    {error || localError}
                  </ErrorMessage>
                )}
                {success && <SuccessMessage>{success}</SuccessMessage>}

                <InputContainer>
                  <InputIcon>
                    <FaUser className="text-lg" />
                  </InputIcon>
                  <Input
                    type="tel"
                    placeholder="Phone Number"
                    value={phoneOrEmail}
                    onChange={(e) => setPhoneOrEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </InputContainer>

                <InputContainer>
                  <InputIcon>
                    <FaLock className="text-lg" />
                  </InputIcon>
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </InputContainer>

                <ForgotPasswordLink href="/forgot-password">
                  Forgot your password?
                </ForgotPasswordLink>

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Log in"}
                </Button>

                <SignUpLink>
                  Don&apos;t have an account?{" "}
                  <SignUpLinkText href="/signup">Sign Up</SignUpLinkText>
                </SignUpLink>
              </Form>
            </FormContainer>
          </LeftColumn>

          {/* Right Column - Theme Background with Food Image */}
          <RightColumn>
            <OrangeBackground>
              <DecorativeCircle />
              <DecorativeCircle2 />
              <FoodImageContainer>
                <FoodImageWrapper>
                  {/* Using food-illustration.png as placeholder - you can replace with actual food image */}
                  <div className="relative w-full h-96 flex items-center justify-center">
                    <Image
                      src="/food-illustration.png"
                      alt="Delicious Food"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                </FoodImageWrapper>
              </FoodImageContainer>
            </OrangeBackground>
          </RightColumn>
        </TwoColumnLayout>
      </MainContent>
    </PageContainer>
  );
}
