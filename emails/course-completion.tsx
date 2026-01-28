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

interface CourseCompletionEmailProps {
  userName: string;
  courseTitle: string;
  completedAt: string;
}

export default function CourseCompletionEmail({
  userName,
  courseTitle,
  completedAt,
}: CourseCompletionEmailProps) {
  return (
    <Html lang="en">
      <Tailwind config={tailwindConfig}>
        <Head />
        <Preview>Congratulations! You&apos;ve completed {courseTitle}</Preview>
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
                Congratulations, {userName}!
              </Heading>
            </Section>

            <Hr className="border-brand-border my-6" />

            <Section>
              <Text className="text-brand-primary mb-4 text-base leading-6">
                You&apos;ve successfully completed all lessons in:
              </Text>

              <Section className="border-brand-border bg-brand-secondary my-6 rounded border border-solid px-6 py-4 text-center">
                <Text className="text-brand-primary m-0 text-xl font-semibold">
                  {courseTitle}
                </Text>
                <Text className="text-brand-muted m-0 mt-2 text-sm">
                  Completed on {completedAt}
                </Text>
              </Section>

              <Text className="text-brand-primary mb-4 text-base leading-6">
                This is a significant achievement! The knowledge and skills
                you&apos;ve gained will serve you well in your journey.
              </Text>

              <Text className="text-brand-primary mb-4 text-base leading-6">
                Keep up the great work and continue exploring more courses on{" "}
                {brandAssets.appName}.
              </Text>

              <Text className="text-brand-muted mt-6 mb-0 text-sm leading-6">
                Thank you for learning with us. We&apos;re proud of your
                accomplishment!
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

CourseCompletionEmail.PreviewProps = {
  userName: "John Doe",
  courseTitle: "Advanced React Patterns",
  completedAt: "January 28, 2026",
} satisfies CourseCompletionEmailProps;

export { CourseCompletionEmail };
