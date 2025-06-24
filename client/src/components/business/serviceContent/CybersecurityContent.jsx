import { businessImages } from '../../../assets/images';
import './services.css'; // 👈 shared styles

const CybersecurityContent = () => {
  return (
    <div
      className="services_block"
      style={{ fontFamily: 'Montserrat, sans-serif' }} // ✅ Font applied here
    >
      <p>
        At Nimitech IT, we know that in today’s digital world, cybersecurity isn’t just an
        option—it’s a necessity. Whether you’re a healthcare organization, construction company,
        financial institution, or a small business, we provide customized, affordable cybersecurity
        services that safeguard your data, systems, and reputation against evolving cyber threats.
      </p>

      <div>
        <p style={{ fontSize: '20px' }}>Why Cybersecurity Matters</p>
        <p>
          Cyber attacks are becoming more frequent and sophisticated, putting businesses of all
          sizes at risk. From data breaches and ransomware to compliance violations, the
          consequences can be devastating—financial losses, legal penalties, and damage to your
          brand’s trust. Nimitech IT helps you stay one step ahead with proactive, enterprise-grade
          protection designed to keep your business safe 24/7.
        </p>
      </div>

      <div className="image-container">
        <img src={businessImages.CS_image1} alt="Cybersecurity Visual" />
      </div>

      <div>
        <p style={{ fontSize: '20px' }}>Our Cybersecurity Services</p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            Real-Time Threat Detection & Monitoring: Identify and respond to threats instantly to
            minimize risk.
          </li>
          <li>
            Network Security: Secure your infrastructure with firewalls, VPNs, and intrusion
            prevention systems.
          </li>
          <li>
            Compliance & Risk Management: Navigate complex regulations like HIPAA, PCI, and GDPR
            with ease.
          </li>
          <li>
            Endpoint Protection: Safeguard all devices connected to your network, from laptops to
            mobile phones.
          </li>
          <li>
            Vulnerability Assessments & Penetration Testing: Identify and fix security gaps before
            attackers find them.
          </li>
          <li>
            Incident Response & Recovery: Rapid support to mitigate damage and restore operations
            after a breach.
          </li>
        </ul>
      </div>

      <div className="image-container">
        <img src={businessImages.CS_image2} alt="Cybersecurity Visual" />
      </div>

      <div>
        <p style={{ fontSize: '20px' }}>Why Choose Nimitech IT?</p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            Industry Expertise: We’ve successfully served clients in healthcare, construction,
            finance, and small business sectors—tailoring solutions to fit your unique security
            challenges.
          </li>
          <li>
            Affordable & Scalable: Our global outsourcing model lets us offer top-tier cybersecurity
            at a fraction of traditional costs, making protection accessible for every budget.
          </li>
          <li>
            24/7 Support: Cyber threats never rest, and neither do we. Our dedicated team monitors
            your systems around the clock.
          </li>
          <li>
            Certified Professionals: Work with experienced, certified cybersecurity experts
            committed to your business’s safety.
          </li>
        </ul>
      </div>

      <p className="font-medium text-gray-900">
        <div style={{ fontSize: '20px' }}>
          Don’t Wait for a Breach — Secure Your Business Today.
        </div>
        <br />
        Your data and your customers’ trust are your most valuable assets. Partner with Nimitech IT
        to implement a robust cybersecurity strategy that prevents attacks before they happen. Let
        us handle your IT security so you can focus on growing your business confidently and
        securely.
      </p>
    </div>
  );
};

export default CybersecurityContent;
