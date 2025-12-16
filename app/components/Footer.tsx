"use client";
import React from "react";
import tw from "twin.macro";
import styled from "styled-components";
import logo from "../images/logo.svg";
import Image from "next/image";
import { FaSquareInstagram } from "react-icons/fa6";
import { FaWhatsappSquare } from "react-icons/fa";
import { IoCall } from "react-icons/io5";

const Container = tw.div`bg-gray-500 text-gray-100 w-screen`;
const Content = tw.div`mx-auto py-10 lg:py-16 `;

const Row = tw.div`flex items-center justify-center flex-col`;

const LogoContainer = tw.div`flex items-center justify-center md:justify-start`;
const LogoText = tw.h5`ml-2 text-2xl font-black tracking-wider`;

const LinksContainer = tw.div`mt-8 font-medium flex flex-wrap justify-center items-center flex-col sm:flex-row`;
const Link = tw.a`border-b-2 border-transparent hocus:text-gray-300 hocus:border-gray-300 pb-1 transition duration-300 mt-2 mx-4`;

const SocialLinksContainer = tw.div`mt-10`;
const SocialLink = styled.a`
  ${tw`cursor-pointer inline-block text-gray-100 hover:text-gray-500 transition duration-300 mx-4`}
  svg {
    ${tw`w-7 h-7`}
  }
`;

const Footer: React.FC = () => {
  return (
    <Container>
      <Content>
        <Row>
          <LogoContainer>
            <Image src={logo} alt="UTP-Logo" width={55} height={55} />
            <LogoText>Fitarrito</LogoText>
          </LogoContainer>
          <LinksContainer>
            <Link href="#">Home</Link>
            <Link href="#">About</Link>
            <Link href="#">Contact Us</Link>
            <Link href="#">Reviews</Link>
          </LinksContainer>
          <SocialLinksContainer>
            <SocialLink href="https://facebook.com">
              <FaSquareInstagram />
            </SocialLink>
            <SocialLink href="https://twitter.com">
              <FaWhatsappSquare />
            </SocialLink>
            <SocialLink href="https://twitter.com">
              <IoCall />
            </SocialLink>
          </SocialLinksContainer>
          {/* <CopyrightText>
            &copy; Copyright 2020, Treact Inc. All Rights Reserved.
          </CopyrightText> */}
        </Row>
      </Content>
    </Container>
  );
};
export default Footer;
