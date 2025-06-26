import { businessImages } from '../../../assets/images';
import './services.css'; // Reused styles for consistent layout

const RemoteTrainingContent = () => {
  return (
    <div
      className="services_block"
      style={{ fontFamily: 'Montserrat, sans-serif' }} // ✅ Apply Montserrat here
    >
      <p>
        <em>Learn Today. Lead Tomorrow.</em>
        <br />
        At Nimitech, we’re shaping the next generation of tech professionals through cutting-edge
        remote IT training, delivered in partnership with NimiTutor.com. Our platform offers
        flexible, expert-led tutoring that empowers individuals and businesses to master essential
        digital skills—anytime, anywhere.
      </p>

      <div className="image-container">
        <img src={businessImages.online_1} alt="Remote Training Visual" />
      </div>

      <p>
        Whether you’re starting a new tech career or expanding your current capabilities, our
        training programs are built to help you grow, earn certifications, and gain real-world
        experience through hands-on learning.
      </p>

      <div>
        <p style={{ fontSize: '20px' }}>What We Offer</p>
        <p>
          Our personalized tutoring services cover a wide range of in-demand IT and business skills,
          including:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Cybersecurity: Learn how to protect systems, detect threats, and secure data.</li>
          <li>
            Artificial Intelligence & Machine Learning (AI/ML): Build intelligent solutions using
            real-world tools.
          </li>
          <li>Coding: Master programming languages like Python, JavaScript, and more.</li>
          <li>Business Analysis: Understand processes, drive efficiency, and deliver results.</li>
          <li>Data Analysis: Turn raw data into actionable insights using industry tools.</li>
          <li>
            And Much More: Including cloud computing, IT support, project management, and
            certification prep.
          </li>
        </ul>
      </div>

      <div className="image-container">
        <img src={businessImages.online2} alt="Remote Training Visual" />
      </div>

      <div>
        <p style={{ fontSize: '20px' }}>Why Train with Nimitech & NimiTutor?</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Live & On-Demand Sessions — Learn at your pace, on your schedule.</li>
          <li>Industry-Certified Instructors — Get coached by experienced professionals.</li>
          <li>Hands-On Learning — Practical labs and real-world scenarios.</li>
          <li>Career-Focused Curriculum — Designed to help you get hired or promoted.</li>
          <li>Affordable & Accessible — High-quality training without high costs.</li>
        </ul>
      </div>
    </div>
  );
};

export default RemoteTrainingContent;
