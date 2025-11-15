import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
  Hr,
  Row,
  Column,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface BookingConfirmationEmailProps {
  userName: string;
  userEmail: string;
  tripName: string;
  tripDuration: string;
  tripCost: string;
  tripDescription: string;
  buddyName?: string;
  buddyAge?: number;
  buddyLocation?: string;
  buddyInterests?: string[];
}

export const BookingConfirmationEmail = ({
  userName,
  userEmail,
  tripName,
  tripDuration,
  tripCost,
  tripDescription,
  buddyName,
  buddyAge,
  buddyLocation,
  buddyInterests,
}: BookingConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Your Travel Buddy booking confirmation for {tripName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>🎉 Booking Confirmed!</Heading>
        
        <Text style={text}>
          Hi <strong>{userName}</strong>,
        </Text>
        
        <Text style={text}>
          Great news! Your booking has been confirmed. Get ready for an amazing adventure!
        </Text>

        <Section style={section}>
          <Heading style={h2}>Trip Details</Heading>
          <Hr style={hr} />
          
          <Row style={row}>
            <Column style={labelColumn}>
              <Text style={label}>Destination:</Text>
            </Column>
            <Column>
              <Text style={value}>{tripName}</Text>
            </Column>
          </Row>

          <Row style={row}>
            <Column style={labelColumn}>
              <Text style={label}>Duration:</Text>
            </Column>
            <Column>
              <Text style={value}>{tripDuration}</Text>
            </Column>
          </Row>

          <Row style={row}>
            <Column style={labelColumn}>
              <Text style={label}>Cost:</Text>
            </Column>
            <Column>
              <Text style={value}>{tripCost}</Text>
            </Column>
          </Row>

          <Text style={description}>{tripDescription}</Text>
        </Section>

        {buddyName && (
          <Section style={section}>
            <Heading style={h2}>Your Travel Buddy</Heading>
            <Hr style={hr} />
            
            <Text style={text}>
              <strong>{buddyName}</strong> {buddyAge && `(${buddyAge} years)`}
            </Text>
            
            {buddyLocation && (
              <Text style={text}>
                📍 {buddyLocation}
              </Text>
            )}
            
            {buddyInterests && buddyInterests.length > 0 && (
              <Text style={text}>
                <strong>Interests:</strong> {buddyInterests.join(', ')}
              </Text>
            )}
          </Section>
        )}

        <Section style={section}>
          <Heading style={h2}>Customer Information</Heading>
          <Hr style={hr} />
          
          <Text style={text}>
            <strong>Name:</strong> {userName}
          </Text>
          <Text style={text}>
            <strong>Email:</strong> {userEmail}
          </Text>
        </Section>

        <Section style={infoBox}>
          <Text style={infoText}>
            📧 A detailed itinerary will be sent to you 7 days before departure.
          </Text>
          <Text style={infoText}>
            📞 For any queries, contact our support team 24/7.
          </Text>
        </Section>

        <Text style={footer}>
          Safe travels! 🌍<br />
          The Travel Buddy Team
        </Text>

        <Hr style={hr} />
        
        <Text style={footerSmall}>
          This is an automated confirmation email. Please do not reply to this message.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default BookingConfirmationEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const h1 = {
  color: '#333',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0 40px',
  textAlign: 'center' as const,
};

const h2 = {
  color: '#667EEA',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '24px 0 16px',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
};

const section = {
  padding: '24px 40px',
  backgroundColor: '#fafafa',
  margin: '24px 40px',
  borderRadius: '8px',
};

const row = {
  marginBottom: '12px',
};

const labelColumn = {
  width: '120px',
};

const label = {
  color: '#666',
  fontSize: '14px',
  fontWeight: '600' as const,
  margin: '0',
};

const value = {
  color: '#333',
  fontSize: '14px',
  margin: '0',
};

const description = {
  color: '#666',
  fontSize: '14px',
  lineHeight: '22px',
  marginTop: '16px',
  fontStyle: 'italic' as const,
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const infoBox = {
  backgroundColor: '#EEF2FF',
  padding: '24px 40px',
  margin: '24px 40px',
  borderRadius: '8px',
  borderLeft: '4px solid #667EEA',
};

const infoText = {
  color: '#4338CA',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '8px 0',
};

const footer = {
  color: '#666',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'center' as const,
  marginTop: '32px',
  padding: '0 40px',
};

const footerSmall = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center' as const,
  marginTop: '16px',
  padding: '0 40px',
};
