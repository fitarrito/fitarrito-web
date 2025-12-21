"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import tw from "twin.macro";
import styled from "styled-components";
import { useAuth } from "../lib/hooks/useAuth";
import { useAppDispatch } from "../lib/hooks";
import { setError } from "../lib/features/authSlice";
import { FaUser, FaLock, FaUserCog, FaEnvelope, FaPhone } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import logo from "../images/logo.svg";
import textImage from "../images/fitarrito.svg";
import Button from "./ui/Button";

// Styled Components (reusing from SignInPage)
const PageContainer = tw.div`min-h-screen bg-gray-100 flex items-center justify-center p-4`;
const MainCard = tw.div`bg-white rounded-2xl shadow-2xl w-full max-w-7xl overflow-hidden`;
const ContentWrapper = tw.div`flex flex-col lg:flex-row h-[90vh] lg:h-[85vh]`;

// Left Sidebar
const Sidebar = tw.div`w-full lg:w-64 bg-white border-r border-gray-200 p-6 lg:p-8 flex flex-col`;
const LogoContainer = tw.div`flex items-center gap-3 mb-8`;
const NavItem = styled.div<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  ${(props) =>
    props.$active
      ? "background-color: rgb(254 226 226); border-left: 4px solid #FC1E1E;"
      : "&:hover { background-color: rgb(249 250 251); }"}
`;
const NavIcon = tw.div`text-gray-600`;
const NavText = tw.span`font-medium text-gray-700`;

// Left Content Panel (Theme color)
const LeftPanel = tw.div`hidden lg:flex flex-1 bg-gradient-to-br from-customTheme to-red-500 p-12 flex flex-col justify-between relative overflow-hidden`;
const LeftContent = tw.div`flex flex-col z-10 relative`;
const Title = tw.h1`text-5xl font-black text-white mb-6 leading-tight`;
const Description = tw.p`text-white text-lg leading-relaxed mb-8`;
const IllustrationContainer = tw.div`flex-1 flex items-center justify-center relative z-10`;
const DotPattern = tw.div`absolute w-32 h-32 opacity-20`;
const DotPatternTop = tw(DotPattern)`top-0 right-0`;
const DotPatternBottom = tw(DotPattern)`bottom-0 left-0`;

// Right Panel (Form)
const RightPanel = tw.div`flex-1 p-8 lg:p-12 flex flex-col justify-center bg-white`;
const WelcomeSection = tw.div`mb-8`;
const WelcomeTitle = tw.h2`text-4xl font-black text-gray-900 mb-3`;
const WelcomeText = tw.p`text-gray-600 text-base leading-relaxed`;
const FormContainer = tw.div`max-w-md w-full`;
const InputContainer = tw.div`mb-6`;
const InputWrapper = tw.div`relative flex items-center`;
const InputIcon = tw.div`absolute left-4 text-gray-400 z-10`;
const Input = tw.input`
  w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg
  focus:ring-2 focus:ring-customTheme focus:border-customTheme
  text-gray-900 placeholder-gray-400 bg-white
  transition-all duration-200
`;
const ErrorMessage = tw.div`bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm`;
const SuccessMessage = tw.div`bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm`;
const SignInLink = tw.div`text-center mt-6 text-sm text-gray-600`;
const SignInLinkText = tw(
  Link
)`text-customTheme hover:text-primary-700 font-medium`;

export default function SignUpPage(): JSX.Element {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { signUp, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [success, setSuccess] = useState<string | null>(null);

  // Clear error when component mounts or when user starts typing
  useEffect(() => {
    dispatch(setError(null));
  }, [dispatch]);

  // Clear error when user starts typing
  useEffect(() => {
    if (error && (email || password || name || mobileNumber)) {
      dispatch(setError(null));
    }
  }, [email, password, name, mobileNumber, error, dispatch]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);

    const result = await signUp(email, password, { name, phone: mobileNumber });

    if (result.error) {
      return;
    }

    if (result.user) {
      setSuccess(
        "Account created successfully! Please check your email to verify your account."
      );
      // Redirect to sign in after a delay
      setTimeout(() => {
        router.push("/signin");
      }, 2000);
    }
  };

  return (
    <PageContainer>
      <MainCard>
        <ContentWrapper>
          {/* Left Sidebar */}
          <Sidebar>
            <LogoContainer>
              <Image src={logo} alt="Fitarrito Logo" width={50} height={50} />
              <Image
                src={textImage}
                alt="Fitarrito"
                width={120}
                height={40}
                className="ml-2"
              />
            </LogoContainer>
            <div className="flex flex-col gap-2">
              <NavItem $active>
                <NavIcon>
                  <FaUserCog className="text-customTheme" />
                </NavIcon>
                <NavText>Sign up</NavText>
              </NavItem>
            </div>
          </Sidebar>

          {/* Left Content Panel (Theme color) */}
          <LeftPanel>
            <DotPatternTop>
              <div className="grid grid-cols-4 gap-2">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-white rounded-full" />
                ))}
              </div>
            </DotPatternTop>

            <LeftContent>
              <Title>Start your journey</Title>
              <Description>
                Create an account and join our community to enjoy the best food
                experience.
              </Description>
            </LeftContent>

            <IllustrationContainer>
              <div className="relative w-full h-full flex items-center justify-center p-8">
                <div className="relative w-full h-full max-w-md bg-white/10 backdrop-blur-sm rounded-3xl p-8 flex items-center justify-center">
                  <Image
                    src="/signup-food-illustration.png"
                    alt="Delicious Food"
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                    style={{ filter: "brightness(1.1) contrast(1.1)" }}
                  />
                </div>
              </div>
            </IllustrationContainer>

            <DotPatternBottom>
              <div className="grid grid-cols-4 gap-2">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-white rounded-full" />
                ))}
              </div>
            </DotPatternBottom>
          </LeftPanel>

          {/* Right Panel (Form) */}
          <RightPanel>
            <WelcomeSection>
              <WelcomeTitle>Create Account!</WelcomeTitle>
              <WelcomeText>
                Sign up with your email to get started with Fitarrito
              </WelcomeText>
            </WelcomeSection>

            <FormContainer>
              <form onSubmit={handleSignUp}>
                {error && <ErrorMessage>{error}</ErrorMessage>}
                {success && <SuccessMessage>{success}</SuccessMessage>}

                <InputContainer>
                  <InputWrapper>
                    <InputIcon>
                      <FaUser className="text-lg" />
                    </InputIcon>
                    <Input
                      type="text"
                      placeholder="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={loading}
                    />
                  </InputWrapper>
                </InputContainer>

                <InputContainer>
                  <InputWrapper>
                    <InputIcon>
                      <FaEnvelope className="text-lg" />
                    </InputIcon>
                    <Input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </InputWrapper>
                </InputContainer>

                <InputContainer>
                  <InputWrapper>
                    <InputIcon>
                      <FaPhone className="text-lg" />
                    </InputIcon>
                    <Input
                      type="tel"
                      placeholder="Mobile Number"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </InputWrapper>
                </InputContainer>

                <InputContainer>
                  <InputWrapper>
                    <InputIcon>
                      <FaLock className="text-lg" />
                    </InputIcon>
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      disabled={loading}
                    />
                  </InputWrapper>
                </InputContainer>

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Sign up"}
                </Button>

                <SignInLink>
                  Already have an account?{" "}
                  <SignInLinkText href="/signin">Log in</SignInLinkText>
                </SignInLink>
              </form>
            </FormContainer>
          </RightPanel>
        </ContentWrapper>
      </MainCard>
    </PageContainer>
  );
}
