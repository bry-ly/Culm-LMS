import * as React from "react";
import {
  Body,
  Button,
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

interface WelcomeEmailProps {
  userName: string;
  dashboardLink: string;
}

export default function WelcomeEmail({
  userName,
  dashboardLink,
}: WelcomeEmailProps) {
  return (
    <Html lang="en">
      <Tailwind config={tailwindConfig}>
        <Head />
        <Preview>Welcome to {brandAssets.appName}!</Preview>
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
                Welcome, {userName}!
              </Heading>
            </Section>

            <Hr className="border-brand-border my-6" />

            <Section>
              <Text className="text-brand-primary mb-4 text-base leading-6">
                Thank you for joining {brandAssets.appName}. We&apos;re excited
                to have you on board!
              </Text>
              <Text className="text-brand-primary mb-4 text-base leading-6">
                You can access your personalized dashboard to start learning:
              </Text>

              <Section className="text-center">
                <Button
                  className="bg-brand-primary rounded-md px-6 py-3 text-white"
                  href={dashboardLink}
                >
                  Go to Dashboard
                </Button>
              </Section>

              <Text className="text-brand-muted mt-6 mb-0 text-sm leading-6">
                If you have any questions or need assistance, feel free to
                contact our support team.
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

WelcomeEmail.PreviewProps = {
  userName: "John Doe",
  dashboardLink: "http://localhost:3000/dashboard",
} satisfies WelcomeEmailProps;

export { WelcomeEmail };
