import { Body, Container, Head, Hr, Html, Preview, Section, Text } from '@react-email/components';
import { EmailTemplateRegistry } from './type.js';
import { ResetPasswordEmail } from './auth/resetPassword.js';
import { OtpEmail } from './auth/otp.js';
import { UrlEmail } from './auth/url.js';
import { ResetWarnEmail } from './auth/resetWarn.js';

function EmailBody<K extends keyof EmailTemplateRegistry>(key: K, data: EmailTemplateRegistry[K]) {
    if (key === 'url') {
        return UrlEmail(data as EmailTemplateRegistry['url'])
    } else if (key === 'otp') {
        return OtpEmail(data as EmailTemplateRegistry['otp'])
    } else if (key === 'reset') {
        return ResetPasswordEmail(data as EmailTemplateRegistry['reset']);
    } else if (key === 'resetWarn'){
        return ResetWarnEmail();
    }
}

export function Email<K extends keyof EmailTemplateRegistry>({ key, title, preheader, data }: { key: K, title: string, preheader: string, data: EmailTemplateRegistry[K] }) {
    return (
        <Html lang="en">
            <Head>
                <title>{title}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            </Head>

            <Preview>{preheader}</Preview>

            <Body style={body}>
                <Container style={container}>
                    {/* Brand / project name */}
                    <Section style={headerSection}>
                        <Text style={brand}>{process.env.PROJECT_NAME}</Text>
                    </Section>

                    {/*Email Body*/}
                    {EmailBody(key, data)}

                    <Section style={hrSection}>
                        <Hr style={hr} />
                    </Section>

                    {/* Footer */}
                    <Section style={footerSection}>
                        <Text style={footerText}>
                            Sent by YourApp, Inc.
                            <br />
                            123 Example Street, Suite 100, City, Country
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}


/* ----------------------------- styles ----------------------------- */

const body: React.CSSProperties = {
    margin: 0,
    padding: 0,
    backgroundColor: '#f4f5f7',
    fontFamily:
        "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif",
};

const container: React.CSSProperties = {
    maxWidth: '520px',
    margin: '40px auto',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
};

const headerSection: React.CSSProperties = {
    padding: '32px 32px 8px 32px',
    textAlign: 'center',
};

const brand: React.CSSProperties = {
    margin: 0,
    fontSize: '20px',
    fontWeight: 700,
    color: '#111827',
    letterSpacing: '-0.2px',
};

const hrSection: React.CSSProperties = {
    padding: '24px 32px 0 32px',
};

const hr: React.CSSProperties = {
    borderColor: '#e5e7eb',
    margin: 0,
};

const footerSection: React.CSSProperties = {
    padding: '20px 32px 32px 32px',
    textAlign: 'center',
};

const footerText: React.CSSProperties = {
    margin: 0,
    fontSize: '12px',
    lineHeight: 1.6,
    color: '#9ca3af',
};