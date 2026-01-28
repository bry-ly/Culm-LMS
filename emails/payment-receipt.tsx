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

interface PaymentReceiptEmailProps {
  userName: string;
  courseTitle: string;
  amount: string;
  transactionDate: string;
  transactionId: string;
}

export default function PaymentReceiptEmail({
  userName,
  courseTitle,
  amount,
  transactionDate,
  transactionId,
}: PaymentReceiptEmailProps) {
  return (
    <Html lang="en">
      <Tailwind config={tailwindConfig}>
        <Head />
        <Preview>Payment Receipt for {courseTitle}</Preview>
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
                Payment Receipt
              </Heading>
            </Section>

            <Hr className="border-brand-border my-6" />

            <Section>
              <Text className="text-brand-primary mb-4 text-base leading-6">
                Hi {userName},
              </Text>
              <Text className="text-brand-primary mb-4 text-base leading-6">
                Thank you for your purchase! Here are the details of your
                transaction:
              </Text>

              <Section className="border-brand-border my-6 rounded border border-solid">
                <Section className="border-brand-border border-b border-solid px-6 py-3">
                  <Text className="text-brand-muted m-0 text-sm">Course</Text>
                  <Text className="text-brand-primary m-0 mt-1 font-medium">
                    {courseTitle}
                  </Text>
                </Section>
                <Section className="border-brand-border border-b border-solid px-6 py-3">
                  <Text className="text-brand-muted m-0 text-sm">Amount</Text>
                  <Text className="text-brand-primary m-0 mt-1 font-medium">
                    {amount}
                  </Text>
                </Section>
                <Section className="border-brand-border border-b border-solid px-6 py-3">
                  <Text className="text-brand-muted m-0 text-sm">Date</Text>
                  <Text className="text-brand-primary m-0 mt-1 font-medium">
                    {transactionDate}
                  </Text>
                </Section>
                <Section className="px-6 py-3">
                  <Text className="text-brand-muted m-0 text-sm">
                    Transaction ID
                  </Text>
                  <Text className="text-brand-primary m-0 mt-1 font-mono text-sm">
                    {transactionId}
                  </Text>
                </Section>
              </Section>

              <Text className="text-brand-muted mt-6 mb-0 text-sm leading-6">
                Please keep this receipt for your records. If you have any
                questions about this transaction, please contact our support
                team.
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

PaymentReceiptEmail.PreviewProps = {
  userName: "John Doe",
  courseTitle: "Advanced React Patterns",
  amount: "$99.00",
  transactionDate: "January 28, 2026",
  transactionId: "pi_3abc123def456ghi",
} satisfies PaymentReceiptEmailProps;

export { PaymentReceiptEmail };
