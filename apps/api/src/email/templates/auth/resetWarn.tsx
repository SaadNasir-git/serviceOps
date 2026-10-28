import { Heading, Link, Section, Text } from "@react-email/components";

export function ResetWarnEmail() {
    return (
        <Section style={content}>
            <Heading style={h1}>
                Your password was changed
            </Heading>

            <Text style={paragraph}>
                The password for your eComStack account was successfully
                changed just now. If this was you, no further action is
                needed.
            </Text>

            <Section style={alertBox}>
                <Text style={alertTitle}>
                    Didn&apos;t change your password?
                </Text>
                <Text style={alertBody}>
                    Someone else may have access to your account. Reset your
                    password immediately and contact our support team so we can
                    help you secure it.
                </Text>
            </Section>

            <Text style={small}>
                If you have questions or need help, reach out to us at{' '}
                <Link href="mailto:support@ecomstack.com" style={link}>
                    support@ecomstack.com
                </Link>
                .
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

const alertBox: React.CSSProperties = {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    padding: '16px',
    margin: '0 0 24px',
};

const alertTitle: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: 600,
    color: '#991b1b',
    margin: '0 0 6px',
};

const alertBody: React.CSSProperties = {
    fontSize: '13px',
    lineHeight: 1.6,
    color: '#7f1d1d',
    margin: 0,
};

const small: React.CSSProperties = {
    fontSize: '12px',
    lineHeight: 1.6,
    color: '#6b7280',
    margin: '0 0 12px',
};

const link: React.CSSProperties = {
    color: '#2563eb',
    textDecoration: 'underline',
};