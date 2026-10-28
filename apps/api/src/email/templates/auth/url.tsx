import { Button, Heading, Link, Section, Text } from "@react-email/components";
import { EmailTemplateRegistry } from "../type.js";

export function UrlEmail(data: EmailTemplateRegistry['url']) {
    const verifyUrl = data.verifyUrl;

    return (
        <Section style={content}>
            <Heading style={h1}>
                Confirm your email
            </Heading>

            <Text style={paragraph}>
                Thanks for signing up for eComStack. Click the button below
                to verify your email address and activate your account.
            </Text>

            <Section style={buttonSection}>
                <Button href={verifyUrl} style={button}>
                    Verify Email
                </Button>
            </Section>

            <Text style={small}>
                This link expires in <strong>{data.expiresIn ?? '24 hours'}</strong>.
                If it expires, you can request a new one from the sign-in page.
            </Text>

            <Text style={fallbackLabel}>
                Button not working? Copy and paste this link into your browser:
            </Text>

            <Text style={fallbackUrl}>
                <Link href={verifyUrl} style={link}>
                    {verifyUrl}
                </Link>
            </Text>

            <Text style={small}>
                If you didn&apos;t create an account, you can safely ignore
                this email — nothing will happen without verification.
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