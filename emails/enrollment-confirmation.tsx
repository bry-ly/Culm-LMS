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

interface EnrollmentConfirmationEmailProps {
  userName: string;
  courseTitle: string;
  courseLink: string;
}

export default function EnrollmentConfirmationEmail({
  userName,
  courseTitle,
  courseLink,
}: EnrollmentConfirmationEmailProps) {
  return (
    <Html lang="en">
      <Tailwind config={tailwindConfig}>
        <Head />
        <Preview>
          You&apos;re enrolled in {courseTitle} - Start learning now!
        </Preview>
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
                You&apos;re In!
              </Heading>
            </Section>

            <Hr className="border-brand-border my-6" />

            <Section>
              <Text className="text-brand-primary mb-4 text-base leading-6">
                Hi {userName},
              </Text>
              <Text className="text-brand-primary mb-4 text-base leading-6">
                Great news! You&apos;ve been successfully enrolled in:
              </Text>

              <Section className="border-brand-border bg-brand-secondary my-6 rounded border border-solid px-6 py-4 text-center">
                <Text className="text-brand-primary m-0 text-xl font-semibold">
                  {courseTitle}
                </Text>
              </Section>

              <Text className="text-brand-primary mb-4 text-base leading-6">
                You now have full access to all course materials. Start your
                learning journey today!
              </Text>

              <Section className="text-center">
                <Button
                  className="bg-brand-primary rounded-md px-6 py-3 text-white"
                  href={courseLink}
                >
                  Start Learning
                </Button>
              </Section>

              <Text className="text-brand-muted mt-6 mb-0 text-sm leading-6">
                You can access this course anytime from your dashboard. Happy
                learning!
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

EnrollmentConfirmationEmail.PreviewProps = {
  userName: "John Doe",
  courseTitle: "Advanced React Patterns",
  courseLink: "http://localhost:3000/dashboard/advanced-react-patterns",
} satisfies EnrollmentConfirmationEmailProps;

export { EnrollmentConfirmationEmail };
