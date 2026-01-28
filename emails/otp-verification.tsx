import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import tailwindConfig, { brandAssets } from "./tailwind.config";

interface OtpVerificationEmailProps {
  otp: string;
}

export default function OtpVerificationEmail({
  otp,
}: OtpVerificationEmailProps) {
  return (
    <Html lang="en">
      <Tailwind config={tailwindConfig}>
        <Head />
        <Preview>Your verification code is {otp}</Preview>
        <Body className="bg-brand-secondary font-sans">
          <Container className="mx-auto max-w-xl bg-white px-6 py-10">
            <Section className="text-center">
              <Img
                src={brandAssets.logo.src}
                alt={brandAssets.logo.alt}
                width={brandAssets.logo.width}
                height={brandAssets.logo.height}
                className="mx-auto"
              />
              <Heading className="text-brand-primary mt-6 mb-0 text-2xl font-semibold">
                Verify your email
              </Heading>
            </Section>

            <Hr className="border-brand-border my-6" />

            <Section>
              <Text className="text-brand-primary mb-4 text-base leading-6">
                Enter this verification code to sign in to your{" "}
                {brandAssets.appName} account:
              </Text>

              <Section className="border-brand-border bg-brand-secondary my-6 rounded border border-solid px-6 py-4 text-center">
                <Text className="text-brand-primary m-0 font-mono text-4xl font-bold tracking-widest">
                  {otp}
                </Text>
              </Section>

              <Text className="text-brand-muted mb-0 text-sm leading-6">
                This code expires in 10 minutes. If you did not request this
                code, please ignore this email.
              </Text>
            </Section>

            <Hr className="border-brand-border my-6" />

            <Section>
              <Text className="text-brand-muted m-0 text-center text-xs">
                {brandAssets.appName} - The Modern Learning Management System
              </Text>
              <Text className="text-brand-muted m-0 mt-1 text-center text-xs">
                Questions? Contact us at {brandAssets.supportEmail}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

OtpVerificationEmail.PreviewProps = {
  otp: "123456",
} satisfies OtpVerificationEmailProps;

export { OtpVerificationEmail };
