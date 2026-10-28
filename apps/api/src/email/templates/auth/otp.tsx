import { Heading, Section, Text } from "@react-email/components";
import { EmailTemplateRegistry } from "../type.js";

export function OtpEmail(data: EmailTemplateRegistry['otp']) {
    return (
        <Section style={content}>
            <Heading style={h1}>
                Verify your identity
            </Heading>

            <Text style={paragraph}>
                Use the code below to finish signing in. It expires in{' '}
                <strong>{data.expiresIn ?? '10 minutes'}</strong> and can only be used once.
            </Text>

            <Section style={codeBox}>
                <Text style={codeText}>{data.code}</Text>
            </Section>

            <Text style={small}>
                Never share this code with anyone. eComStack will never ask
                you for it over the phone, chat, or email.
            </Text>

            <Text style={small}>
                Didn&apos;t try to sign in? You can safely ignore this
                email — your account is still secure.
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

const codeBox: React.CSSProperties = {
    backgroundColor: '#f3f4f6',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '20px 16px',
    textAlign: 'center',
    margin: '0 0 24px',
};

const codeText: React.CSSProperties = {
    margin: 0,
    fontFamily:
        "ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace",
    fontSize: '32px',
    fontWeight: 700,
    letterSpacing: '8px',
    color: '#111827',
    paddingLeft: '8px',
};

const small: React.CSSProperties = {
    fontSize: '12px',
    lineHeight: 1.6,
    color: '#6b7280',
    margin: '0 0 12px',
};