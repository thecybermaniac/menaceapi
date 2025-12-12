import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Section,
  Hr,
} from 'https://esm.sh/@react-email/components@0.0.22'
import * as React from 'https://esm.sh/react@18.3.1'

interface EmailConfirmationProps {
  supabase_url: string
  token_hash: string
  redirect_to: string
  email_action_type: string
}

export const EmailConfirmationEmail = ({
  supabase_url,
  token_hash,
  redirect_to,
  email_action_type,
}: EmailConfirmationProps) => (
  <Html>
    <Head />
    <Preview>Confirm your Menace API email</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoSection}>
          <Text style={logoText}>⚡ Menace API</Text>
        </Section>
        
        <Heading style={h1}>Confirm Your Email</Heading>
        
        <Text style={text}>
          Welcome to Menace API! Please confirm your email address by clicking 
          the button below to get started.
        </Text>
        
        <Section style={buttonSection}>
          <Link
            href={`${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`}
            target="_blank"
            style={button}
          >
            Confirm Email
          </Link>
        </Section>
        
        <Text style={textMuted}>
          If you didn't create an account with Menace API, you can safely ignore this email.
        </Text>
        
        <Hr style={hr} />
        
        <Text style={footer}>
          © {new Date().getFullYear()} Menace API. All rights reserved.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default EmailConfirmationEmail

const main = {
  backgroundColor: '#0a0a0a',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
}

const container = {
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '560px',
}

const logoSection = {
  textAlign: 'center' as const,
  marginBottom: '32px',
}

const logoText = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#f97316',
  margin: '0',
}

const h1 = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '0 0 24px',
}

const text = {
  color: '#d1d5db',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'center' as const,
  margin: '0 0 24px',
}

const textMuted = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  textAlign: 'center' as const,
  margin: '24px 0 0',
}

const buttonSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#f97316',
  borderRadius: '8px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: 'bold',
  padding: '14px 32px',
  textDecoration: 'none',
}

const hr = {
  borderColor: '#27272a',
  margin: '32px 0',
}

const footer = {
  color: '#4b5563',
  fontSize: '12px',
  textAlign: 'center' as const,
  margin: '0',
}
