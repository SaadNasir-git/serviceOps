import { Button, Heading, Link, Section, Text } from "@react-email/components";
import { EmailTemplateRegistry } from "../type.js";

export function ForgotPasswordEmail(data: EmailTemplateRegistry['forgotPassword']) {
    const resetUrl = data.forgotPasswordUrl;

    return (
        <Section style={content}>
            <Heading style={h1}>
                Reset your password
            </Heading>

            <Text style={paragraph}>
                We received a request to reset the password for your eComStack
                account. Click the button below to choose a new one. This link
                expires in{' '}
                <strong>{data.expiresIn ?? '30 minutes'}</strong> and can only
                be used once.
            </Text>

            <Section style={buttonSection}>
                <Button href={resetUrl} style={button}>
                    Reset Password
                </Button>
            </Section>

            <Text style={fallbackLabel}>
                Button not working? Copy and paste this link into your browser:
            </Text>

            <Text style={fallbackUrl}>
                <Link href={resetUrl} style={link}>
                    {resetUrl}
                </Link>
            </Text>

            <Text style={small}>
                If you didn&apos;t request a password reset, you can safely
                ignore this email — your password will remain unchanged.
            </Text>

            <Text style={small}>
                If you keep receiving these emails without requesting them,
                someone may be trying to access your account. Contact support
                to secure it.
            </Text>
        </Section>
    );
}

/* ----------------------------- styles ----------------------------- */

const content: React.CSSProperties = {
    padding: '8px 32px 0 32px',
};

const h1: React.CSSProperties = {
    fontSize: '22px',
    fontWeight: 600,
    color: '#111827',
    margin: '16px 0 12px',
};

const paragraph: React.CSSProperties = {
    fontSize: '14px',
    lineHeight: 1.6,
    color: '#374151',
    margin: '0 0 20px',
};

const buttonSection: React.CSSProperties = {
    textAlign: 'center',
    margin: '0 0 24px',
};

const button: React.CSSProperties = {
    backgroundColor: '#111827',
    color: '#ffffff',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: 600,
    textDecoration: 'none',
    display: 'inline-block',
};

const small: React.CSSProperties = {
    fontSize: '12px',
    lineHeight: 1.6,
    color: '#6b7280',
    margin: '0 0 12px',
};

const fallbackLabel: React.CSSProperties = {
    fontSize: '12px',
    lineHeight: 1.6,
    color: '#6b7280',
    margin: '16px 0 4px',
};

const fallbackUrl: React.CSSProperties = {
    fontSize: '12px',
    lineHeight: 1.6,
    color: '#374151',
    margin: '0 0 20px',
    wordBreak: 'break-all',
};

const link: React.CSSProperties = {
    color: '#2563eb',
    textDecoration: 'underline',
};