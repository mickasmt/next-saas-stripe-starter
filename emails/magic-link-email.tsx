import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html, Preview,
  Section,
  Tailwind,
  Text
} from '@react-email/components';
import { Icons } from '../components/shared/icons';

type MagicLinkEmailProps = {
  actionUrl: string
  firstName: string
  mailType: "login" | "register"
  siteName: string
}

export const MagicLinkEmail = ({
  firstName = '',
  actionUrl,
  mailType,
  siteName
}: MagicLinkEmailProps) => (
  <Html>
    <Head />
    <Preview>
      The sales intelligence platform that helps you uncover qualified leads.
    </Preview>
    <Tailwind>
      <Body className="bg-white font-sans">
        <Container className="mx-auto py-5 pb-12">
          <Icons.logo className="m-auto block size-10" />
          <Text className="text-base">
            Hi {firstName},
          </Text>
          <Text className="text-base">
            Welcome to {siteName} ! Click the link below to {mailType === "login" ? "sign in to" : "activate"} your account.
          </Text>
          <Section className="my-5 text-center">
            <Button
              className="inline-block rounded-md bg-zinc-900 px-4 py-2 text-base text-white no-underline"
              href={actionUrl}
            >
              {mailType === "login" ? "Sign in" : "Activate Account"}
            </Button>
          </Section>
          <Text className="text-base">
            This link expires in 24 hours and can only be used once.
          </Text>
          {mailType === "login" ? (
            <Text className="text-base">
              If you did not try to log into your account, you can safely ignore it.
            </Text>
          ) : null}
          <Hr className="my-4 border-t-2 border-gray-300" />
          <Text className="text-sm text-gray-600">
            123 Code Street, Suite 404, Devtown, CA 98765
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default MagicLinkEmail;