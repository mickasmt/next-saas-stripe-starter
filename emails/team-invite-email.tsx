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

type TeamInviteEmailProps = {
  inviterName: string;
  teamName: string;
  inviteUrl: string;
  role: string;
  siteName: string;
};

export const TeamInviteEmail = ({
  inviterName = "",
  teamName = "",
  inviteUrl,
  role = "MEMBER",
  siteName,
}: TeamInviteEmailProps) => (
  <Html>
    <Head />
    <Preview>
      {inviterName} invited you to join {teamName} on {siteName}
    </Preview>
    <Tailwind>
      <Body className="bg-white font-sans">
        <Container className="mx-auto py-5 pb-12">
          <Icons.logo className="m-auto block size-10" />
          <Text className="text-base">Hi,</Text>
          <Text className="text-base">
            <strong>{inviterName}</strong> has invited you to join the team{" "}
            <strong>{teamName}</strong> on {siteName} as a{" "}
            <strong>{role.toLowerCase()}</strong>.
          </Text>
          <Section className="my-5 text-center">
            <Button
              className="inline-block rounded-md bg-zinc-900 px-4 py-2 text-base text-white no-underline"
              href={inviteUrl}
            >
              Accept Invitation
            </Button>
          </Section>
          <Text className="text-base">
            This invitation expires in 7 days.
          </Text>
          <Text className="text-base">
            If you were not expecting this invitation, you can safely ignore this
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
