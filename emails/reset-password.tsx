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

interface ResetPasswordEmailProps {
  url: string;
}

export default function ResetPasswordEmail({ url }: ResetPasswordEmailProps) {
  return (
    <Html lang="en">
      <Tailwind config={tailwindConfig}>
        <Head />
        <Preview>Reset your password for {brandAssets.appName}</Preview>
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
                Reset your password
              </Heading>
            </Section>

            <Hr className="border-brand-border my-6" />

            <Section>
              <Text className="text-brand-primary mb-4 text-base leading-6">
                We received a request to reset your password for your{" "}
                {brandAssets.appName} account. Click the button below to set a
                new password:
              </Text>

              <Section className="my-6 text-center">
                <Button
                  href={url}
                  className="bg-brand-primary text-brand-secondary inline-block rounded-md px-6 py-3 font-medium no-underline"
                >
                  Reset Password
                </Button>
              </Section>

              <Text className="text-brand-muted mb-4 text-sm leading-6">
                If you cannot click the button, copy and paste this link into
                your browser:
              </Text>

              <Text className="text-brand-primary text-sm break-all">
                {url}
              </Text>

              <Hr className="border-brand-border my-6" />

              <Text className="text-brand-muted mb-0 text-sm leading-6">
                This link expires in 1 hour. If you did not request a password
                reset, please ignore this email.
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

ResetPasswordEmail.PreviewProps = {
  url: "https://example.com/reset-password?token=abc123",
} satisfies ResetPasswordEmailProps;

export { ResetPasswordEmail };
