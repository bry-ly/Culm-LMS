import { render } from "@react-email/components";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP, admin, lastLoginMethod } from "better-auth/plugins";
import OtpVerificationEmail from "@/emails/otp-verification";
import WelcomeEmail from "@/emails/welcome";
import prisma from "./db";
import { env } from "./env";
import { resend } from "./resend";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          const dashboardLink = `${env.BETTER_AUTH_URL}/dashboard`;
          const html = await render(
            WelcomeEmail({
              userName: user.name || "there",
              dashboardLink,
            })
          );
          const text = await render(
            WelcomeEmail({
              userName: user.name || "there",
              dashboardLink,
            }),
            { plainText: true }
          );

          resend.emails.send({
            from: "Culm LMS <send@bryanpalay.me>",
            to: [user.email],
            subject: "Welcome to Culm LMS!",
            html,
            text,
          });
        },
      },
    },
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },

  plugins: [
    admin(),
    lastLoginMethod(),
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        const html = await render(OtpVerificationEmail({ otp }));
        const text = await render(OtpVerificationEmail({ otp }), {
          plainText: true,
        });

        await resend.emails.send({
          from: "Culm LMS <send@bryanpalay.me>",
          to: [email],
          subject: "Culm LMS - Verify your email",
          html,
          text,
        });
      },
    }),
  ],
});
