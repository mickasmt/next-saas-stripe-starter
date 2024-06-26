import { Resend } from "resend";

import { env } from "@/env.mjs";

export const resend = new Resend(env.RESEND_API_KEY);

// TODO: Update sendVerificationRequest for use react-email with resend magic-link

// Email({
//   sendVerificationRequest: async ({ identifier, url, provider }) => {
//     const user = await getUserByEmail(identifier);
//     if (!user || !user.name) return null;

//     const userVerified = user?.emailVerified ? true : false;
//     const authSubject = userVerified ? `Sign-in link for ${siteConfig.name}` : "Activate your account";

//     try {
//       const { data, error } = await resend.emails.send({
//         from: 'SaaS Starter App <onboarding@resend.dev>',
//         to: process.env.NODE_ENV === "development" ? 'delivered@resend.dev' : identifier,
//         subject: authSubject,
//         react: MagicLinkEmail({
//           firstName: user?.name as string,
//           actionUrl: url,
//           mailType: userVerified ? "login" : "register",
//           siteName: siteConfig.name
//         }),
//         // Set this to prevent Gmail from threading emails.
//         // More info: https://resend.com/changelog/custom-email-headers
//         headers: {
//           'X-Entity-Ref-ID': new Date().getTime() + "",
//         },
//       });

//       if (error || !data) {
//         throw new Error(error?.message)
//       }

//       // console.log(data)
//     } catch (error) {
//       throw new Error("Failed to send verification email.")
//     }
//   },
// }),
