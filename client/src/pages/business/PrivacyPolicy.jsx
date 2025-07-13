import { ArrowLeft } from '@mui/icons-material';
import CircleIcon from '@mui/icons-material/Circle';
import DevicesIcon from '@mui/icons-material/Devices';
import EmailIcon from '@mui/icons-material/Email';
import GavelIcon from '@mui/icons-material/Gavel';
import InfoIcon from '@mui/icons-material/Info';
import InsightsIcon from '@mui/icons-material/Insights';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import PhoneIcon from '@mui/icons-material/Phone';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom'; // assuming you're using React Router

const PrivacyPolicyPage = () => {
  const isMobile = useMediaQuery('(max-width:768px)');
  const Bullet = () => <CircleIcon sx={{ fontSize: 8, color: '#333', mt: '6px' }} />;
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const from = params.get('from');

  const handleBack = () => {
    if (from) {
      navigate(from);
    } else {
      navigate(-1);
    }
  };

  return (
    <Box
      sx={{
        px: { xs: 3, sm: 4, md: 8 }, // horizontal padding adjusts by screen size
        py: { xs: 12, sm: 12, md: 12 }, // vertical padding adjusts by screen size
        fontFamily: 'Montserrat, sans-serif',
        maxWidth: '1200px',
        mx: 'auto', // center horizontally
        color: '#333',
        lineHeight: 1.8,
        width: '100%',
      }}
    >
      <Typography
        variant={isMobile ? 'h4' : 'h3'}
        gutterBottom
        fontWeight="bold"
        sx={{ textAlign: 'center' }}
      >
        Privacy Policy
      </Typography>

      <Typography variant="subtitle1" gutterBottom sx={{ color: '#777', textAlign: 'center' }}>
        Effective Date: April 1st, 2025
      </Typography>

      <Divider sx={{ my: 4 }} />

      <Typography paragraph>
        Nimitech IT is dedicated to protecting your privacy. This policy outlines how we collect,
        use, and safeguard your personal data when you use our website or engage with our services.
      </Typography>

      {/* Section: Information Collection */}
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        1. Information We Collect
      </Typography>
      <List>
        <ListItem disableGutters>
          <ListItemIcon>
            <InfoIcon sx={{ color: '#333' }} />
          </ListItemIcon>
          <ListItemText primary="Personal details such as your name, email, phone number, and company name." />
        </ListItem>
        <ListItem disableGutters>
          <ListItemIcon>
            <DevicesIcon sx={{ color: '#333' }} />
          </ListItemIcon>
          <ListItemText primary="Technical data including IP address, browser type, pages visited, and cookies." />
        </ListItem>
      </List>

      {/* Section: Use of Information */}
      <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mt: 3 }}>
        2. How We Use Your Information
      </Typography>
      <List>
        <ListItem disableGutters>
          <ListItemIcon>
            <SupportAgentIcon sx={{ color: '#333' }} />
          </ListItemIcon>
          <ListItemText primary="Respond to inquiries and provide customer support" />
        </ListItem>
        <ListItem disableGutters>
          <ListItemIcon>
            <ManageAccountsIcon sx={{ color: '#333' }} />
          </ListItemIcon>
          <ListItemText primary="Deliver services and manage user accounts" />
        </ListItem>
        <ListItem disableGutters>
          <ListItemIcon>
            <MarkEmailUnreadIcon sx={{ color: '#333' }} />
          </ListItemIcon>
          <ListItemText primary="Send service-related messages or newsletters (opt-out available)" />
        </ListItem>
        <ListItem disableGutters>
          <ListItemIcon>
            <InsightsIcon sx={{ color: '#333' }} />
          </ListItemIcon>
          <ListItemText primary="Improve user experience and service delivery" />
        </ListItem>
        <ListItem disableGutters>
          <ListItemIcon>
            <GavelIcon sx={{ color: '#333' }} />
          </ListItemIcon>
          <ListItemText primary="Comply with legal obligations and prevent fraud" />
        </ListItem>
      </List>

      {/* Section: Sharing */}
      <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mt: 3 }}>
        3. Sharing Your Data
      </Typography>
      <Typography paragraph>
        We never sell your data. We may share it with trusted partners who support our services
        under strict confidentiality agreements.
      </Typography>

      {/* Section: Consent */}
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        4. Your Consent
      </Typography>
      <Typography paragraph>
        By using our website or submitting information, you consent to our data practices as
        described in this policy.
      </Typography>

      {/* Section: Cookies */}
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        5. Cookies
      </Typography>
      <Typography paragraph>
        We use cookies for analytics and service improvement. You may manage cookie preferences via
        your browser settings.
      </Typography>

      {/* Section: Security */}
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        6. Data Security
      </Typography>
      <Typography paragraph>
        We apply strong security protocols to protect your data, including encryption, firewalls,
        and access controls.
      </Typography>

      {/* Section: Your Rights */}
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        7. Your Rights
      </Typography>
      <Typography paragraph>
        You can request access to, correction of, or deletion of your personal data. Contact us
        using:
      </Typography>

      <List>
        <ListItem disableGutters>
          <ListItemIcon>
            <LocationOnIcon sx={{ color: '#333' }} />
          </ListItemIcon>
          <ListItemText primary="Nimitech IT" />
        </ListItem>
        <ListItem disableGutters>
          <ListItemIcon>
            <EmailIcon sx={{ color: '#333' }} />
          </ListItemIcon>
          <ListItemText primary="info@nimitechit.com" />
        </ListItem>
        <ListItem disableGutters>
          <ListItemIcon>
            <PhoneIcon sx={{ color: '#333' }} />
          </ListItemIcon>
          <ListItemText primary="252-903-9651" />
        </ListItem>
      </List>

      {/* Section: Third-Party Links */}
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        8. Third-Party Links
      </Typography>
      <Typography paragraph>
        We may link to other websites. We are not responsible for the privacy practices or content
        of third-party sites.
      </Typography>

      {/* Section: Changes */}
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        9. Policy Updates
      </Typography>
      <Typography paragraph>
        We may update this Privacy Policy as needed. Any changes will be posted on this page with an
        updated date.
      </Typography>

      {/* Section: Contact */}
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        10. Contact Us
      </Typography>
      <List>
        {/* {['Nimitech IT', 'info@nimitechit.com', '252-903-9651'].map((text, i) => (
          <ListItem disableGutters key={i}>
            <ListItemIcon>
              <Bullet />
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))} */}
        <List>
          <ListItem disableGutters>
            <ListItemIcon>
              <LocationOnIcon sx={{ color: '#333' }} />
            </ListItemIcon>
            <ListItemText primary="Nimitech IT" />
          </ListItem>
          <ListItem disableGutters>
            <ListItemIcon>
              <EmailIcon sx={{ color: '#333' }} />
            </ListItemIcon>
            <ListItemText primary="info@nimitechit.com" />
          </ListItem>
          <ListItem disableGutters>
            <ListItemIcon>
              <PhoneIcon sx={{ color: '#333' }} />
            </ListItemIcon>
            <ListItemText primary="252-903-9651" />
          </ListItem>
        </List>
      </List>

      <Divider sx={{ my: 5 }} />

      {/* Final Note */}
      <Typography variant="body1" sx={{ fontStyle: 'italic', color: '#555' }}>
        Your trust is important to us. If you have any concerns about your privacy or our data
        practices, please don’t hesitate to reach out.
      </Typography>

      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Additional Data Protection Privileges & Trust Commitments
      </Typography>

      <Typography paragraph>
        At Nimitech IT, your data is not just protected — it’s respected. Beyond industry-standard
        safeguards, we go above and beyond to give you full visibility and control over your
        personal information. This section outlines additional commitments and data privileges
        designed to enhance your safety, trust, and confidence in every interaction with our
        services.
      </Typography>

      <Typography paragraph>
        <strong>1. Fair Processing Principles:</strong> We uphold the principles of fairness,
        transparency, and accountability in all data-related operations. Before we collect or
        process any personal data, we ensure that the purpose is legitimate, the necessity is clear,
        and the user’s expectations are respected.
      </Typography>

      <Typography paragraph>
        <strong>2. Human-First Privacy Design:</strong> All our web applications, forms, dashboards,
        and user interfaces are built with privacy in mind from day one. Consent checkboxes, cookie
        preferences, and privacy controls are displayed clearly and accessibly — never hidden behind
        technical jargon.
      </Typography>

      <Typography paragraph>
        <strong>3. No Automated Decisions Without Human Oversight:</strong> Nimitech IT does not use
        AI or automated profiling to make decisions that may affect your rights or freedoms. If any
        automated processing is implemented in the future, it will include meaningful human review,
        and you will be notified in advance.
      </Typography>

      <Typography paragraph>
        <strong>4. 24/7 Privacy Support Line:</strong> If you ever have a concern about how your
        data is handled, our dedicated privacy response team is available via email and phone. We
        treat every inquiry with the urgency and respect it deserves, responding within 72 hours or
        sooner.
      </Typography>

      <Typography paragraph>
        <strong>5. Enhanced Rights for Sensitive Information:</strong> If you share data considered
        sensitive under global privacy laws (such as biometric data, racial/ethnic origin, or
        personal health information), it will be stored only with encrypted protection, never used
        for marketing, and immediately deleted upon request.
      </Typography>

      <Typography paragraph>
        <strong>6. Voluntary Data Anonymization:</strong> You may request to have your records
        anonymized instead of deleted — allowing you to still benefit from basic site functionality
        while removing any personal identifiers from our database. This gives you more flexibility
        while maintaining privacy.
      </Typography>

      <Typography paragraph>
        <strong>7. Zero Tolerance for Data Misuse:</strong> All Nimitech IT employees are trained
        annually on privacy compliance and monitored for ethical conduct. Any internal misuse of
        customer data results in disciplinary action, including contract termination and legal
        referral.
      </Typography>

      <Typography paragraph>
        <strong>8. Parental Control & Children’s Privacy:</strong> Our services are not designed for
        users under 13, and we do not knowingly collect data from children. Parents or guardians may
        contact us to request deletion of any data unintentionally submitted by minors.
      </Typography>

      <Typography paragraph>
        <strong>9. Privacy Beyond the Platform:</strong> Even when your data leaves our system
        (e.g., for newsletter delivery or billing integration), it remains protected under contracts
        with third-party vendors who meet global standards like ISO 27001 and GDPR compliance. We
        monitor and audit those relationships regularly.
      </Typography>

      <Typography paragraph>
        <strong>10. Informed Breach Response Policy:</strong> In the unlikely event of a data
        breach, we notify affected users within 72 hours, explain the risk, provide mitigation
        steps, and work with regulatory authorities to ensure accountability. You will never be left
        in the dark.
      </Typography>

      <Typography paragraph>
        <strong>11. Ethical Retention Policies:</strong> We do not keep your data longer than
        necessary. Emails, messages, or inquiries are automatically removed from our live systems
        after 12 months of inactivity unless regulatory retention rules require longer storage.
      </Typography>

      <Typography paragraph>
        <strong>12. Multi-Region Compliance:</strong> Nimitech IT complies not just with local
        Nigerian data protection guidelines, but also with international standards — including GDPR
        (EU), CCPA (California), and PIPEDA (Canada). This ensures your privacy rights are respected
        no matter where you are located.
      </Typography>

      <Typography paragraph>
        <strong>13. User-Controlled Marketing Preferences:</strong> Every email, newsletter, or
        campaign you receive includes a one-click unsubscribe option and a link to manage your
        preferences. We do not send marketing unless you explicitly opt in.
      </Typography>

      <Typography paragraph>
        <strong>14. Transparency in Algorithmic Tools:</strong> We may use AI tools to analyze data
        trends and improve your experience — but never without full transparency. Any algorithm we
        use is vetted for fairness, bias, and relevance to your intended service.
      </Typography>

      <Typography paragraph>
        <strong>15. Legal Respect for Your Rights:</strong> When law enforcement or government
        agencies request access to user data, we assess the legality of each request and notify the
        affected user when possible, unless prohibited by law.
      </Typography>

      <Typography paragraph>
        <strong>16. Community Respect & No Surveillance:</strong> We do not track users for
        behavioral advertising or surveillance. We respect your right to use the internet privately
        and without fear of monitoring.
      </Typography>

      <Typography paragraph>
        <strong>17. Trust by Design, Always:</strong> Nimitech IT strives to lead by example. We
        regularly review our policies, test our systems, and refine our culture to ensure that
        privacy isn’t just a checkbox — it’s a core part of your experience with us.
      </Typography>

      <Typography paragraph sx={{ fontStyle: 'italic' }}>
        We believe that privacy is more than policy — it’s a promise. Thank you for trusting
        Nimitech IT with your information. If at any point you have concerns, questions, or
        suggestions, our team is here to listen and act.
      </Typography>
      <Box sx={{ textAlign: 'center', mt: 6 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleBack}
          sx={{
            fontFamily: 'Montserrat, sans-serif',
            textTransform: 'none',
            paddingX: 4,
            paddingY: 1.5,
            borderRadius: 3,
            fontSize: '16px',
          }}
        >
          <ArrowLeft sx={{ mr: 1 }} /> Back
        </Button>
      </Box>
    </Box>
  );
};

export default PrivacyPolicyPage;
