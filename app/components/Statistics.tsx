import React from "react";
import tw from "twin.macro";
import styled from "styled-components";
import {
  SectionHeading,
  Subheading as SubheadingBase,
} from "@/components/misc/Heading";
import { PrimaryButton as PrimaryButtonBase } from "@/components/misc/Buttons";
import DotBlob from "@/images/dot-pattern.svg";
import Stats from "@/images/Stats.svg";
import Image from "next/image";
interface TextColumnProps {
  textonleft: string; // Adjust the type as needed
}
const Container = tw.div`relative`;
const TwoColumn = tw.div`flex md:flex-row xs:flex-col items-center justify-between max-w-screen-xl mx-auto py-10 md:py-20`;
const Column = tw.div`w-full max-w-md mx-auto md:max-w-none md:mx-0`;
const imageContainerCss = tw`p-2!`;
const HighlightedText = tw.span`bg-customTheme text-gray-100 px-8 transform -skew-x-12 inline-block leading-snug text-2xl font-black`;
const SubHeading = tw.p`font-black text-2xl text-green-600 md:text-3xl mb-2  mx-auto leading-snug max-w-3xl`;

const ImageColumn = tw.div`relative mt-12 lg:mt-0 flex flex-col justify-center`;
const TextColumn = styled(Column)<TextColumnProps>(() => [
  tw`md:w-7/12 mt-8 md:mt-0`,
]);

const TextContent = tw.div`lg:py-8 text-center md:text-left`;

const Subheading = tw(SubheadingBase)`text-center md:text-left`;
const Heading = tw(
  SectionHeading
)`mt-4 font-black text-left text-3xl sm:text-4xl lg:text-5xl text-center md:text-left leading-tight`;
const Description = tw.div`mt-4 mx-auto md:text-left text-base md:text-base lg:text-lg font-medium leading-relaxed text-secondary-100`;

// const StatisticsColumn = tw.div`flex flex-row items-center justify-around sm:block mx-auto md:text-left mt-4`;
// const Statistic = tw.div`text-left sm:inline-block sm:mr-12 last:mr-0 mt-4`;
// const Value = tw.div`font-bold text-lg sm:text-xl lg:text-2xl text-secondary-500 tracking-wide`;
// const Key = tw.div`font-medium text-primary-700`;

const PrimaryButton = tw(
  PrimaryButtonBase
)`mt-8 md:mt-10 text-sm inline-block mx-auto md:mx-0`;

const DotBlobContainer = tw.div`pointer-events-none rounded-md absolute w-32 h-32 right-0 bottom-0 transform translate-x-10 translate-y-10 -z-10`;

export default function Statistics() {
  // const data = [
  //   {
  //     key: "Orders",
  //     value: "500+",
  //   },
  //   {
  //     key: "Dishes",
  //     value: "50+",
  //   },
  // ];

  return (
    <Container>
      <TwoColumn>
        <TextColumn textonleft={true.toString()}>
          <TextContent>
            <Subheading>A Reputated Brand</Subheading>
            <Heading>
              Why <HighlightedText>Choose Us ?</HighlightedText>
            </Heading>
            <Description>
              <SubHeading>Fitarrito: Where Health Meets Taste</SubHeading>
              <div className="text-lg text-gray-700 mb-4">
                <strong>Healthy food is rarely an easy, go-to option</strong>.
                Finding a place that serves nutritious yet delicious meals often
                feels like a compromise. At <strong>Fitarrito</strong>, we’re
                here to change that.
              </div>
              <div className="text-lg text-gray-700 mb-4">
                Our journey began with a simple yet powerful vision: to craft a
                <strong> multi-cuisine experience</strong> that blends
                <strong> nutrition, flavor, and indulgence</strong>—all in one
                bite. We believe that eating healthy shouldn’t mean giving up
                taste, and we’re on a mission to make
                <strong> wholesome, flavorful food more accessible</strong> for
                everyone.
              </div>
              <div className="text-lg text-gray-700 mb-4">
                Whether you’re craving a light, protein-packed meal or a rich,
                flavorful delight, Fitarrito has something for every palate.
              </div>
              <div className="text-lg text-green-900 font-semibold text-center">
                Because at <strong>Fitarrito</strong>, healthy eating isn’t a
                compromise—it’s a celebration of flavor.
              </div>
            </Description>
            {/* <StatisticsColumn>
              {data.map((statistic, index) => (
                <Statistic key={index}>
                  <Value>{statistic.value}</Value>
                  <Key>{statistic.key}</Key>
                </Statistic>
              ))}
            </StatisticsColumn> */}
            <PrimaryButton
              as="a"
              href={
                "https://www.swiggy.com/city/trichy/fitaritto-majestic-appartments-cantonment-rest956093"
              }
            >
              Order Now
            </PrimaryButton>
          </TextContent>
        </TextColumn>
        <ImageColumn css={imageContainerCss}>
          <Image
            src={Stats}
            alt="UTP-Logo"
            width={600}
            style={{ borderRadius: "5%" }}
          />
          <DotBlobContainer>
            <Image src={DotBlob} alt="Blob-Logo" />
          </DotBlobContainer>
        </ImageColumn>
      </TwoColumn>
    </Container>
  );
}
