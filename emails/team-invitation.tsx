import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

import { Icons } from "../components/shared/icons";

type TeamInvitationEmailProps = {
  teamName: string;
  inviterName: string;
  role: string;
  acceptUrl: string;
  siteName: string;
};

export const TeamInvitationEmail = ({
  teamName = "",
  inviterName = "",
  role = "MEMBER",
  acceptUrl,
  siteName,
}: TeamInvitationEmailProps) => (
  <Html>
    <Head />
    <Preview>
      You&apos;ve been invited to join {teamName} on {siteName}
    </Preview>
    <Tailwind>
      <Body className="bg-white font-sans">
        <Container className="mx-auto py-5 pb-12">
          <Icons.logo className="m-auto block size-10" />
          <Text className="text-base">Hi there,</Text>
          <Text className="text-base">
            <strong>{inviterName}</strong> has invited you to join the team{" "}
            <strong>{teamName}</strong> as a{" "}
            <strong>{role.toLowerCase()}</strong> on {siteName}.
          </Text>
          <Section className="my-5 text-center">
            <Button
              className="inline-block rounded-md bg-zinc-900 px-4 py-2 text-base text-white no-underline"
              href={acceptUrl}
            >
              Accept Invitation
            </Button>
          </Section>
          <Text className="text-base">
            This invitation expires in 7 days.
          </Text>
          <Text className="text-base">
            If you don&apos;t want to join this team, you can safely ignore this
            email.
          </Text>
          <Hr className="my-4 border-t-2 border-gray-300" />
          <Text className="text-sm text-gray-600">
            123 Code Street, Suite 404, Devtown, CA 98765
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);
