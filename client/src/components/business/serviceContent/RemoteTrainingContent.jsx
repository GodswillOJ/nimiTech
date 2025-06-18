import React from 'react';
import { businessImages } from '../../../assets/images';
import './services.css'; // Reused styles for consistent layout

const RemoteTrainingContent = () => {
  return (
    <div className="services_block">
      <p>
        <strong>Remote IT Training — Powered by NimiTutor.com</strong>
        <br />
        <em>Learn Today. Lead Tomorrow.</em>
        <br />
        At Nimitech, we’re shaping the next generation of tech professionals through cutting-edge
        remote IT training, delivered in partnership with NimiTutor.com. Our platform offers
        flexible, expert-led tutoring that empowers individuals and businesses to master essential
        digital skills—anytime, anywhere.
      </p>

      <div className="image-container">
        <img src={businessImages.RM_image} alt="Remote Training Visual" />
      </div>

      <p>
        Whether you’re starting a new tech career or expanding your current capabilities, our
        training programs are built to help you grow, earn certifications, and gain real-world
        experience through hands-on learning.
      </p>

      <div>
        <p className="font-semibold">What We Offer</p>
        <p>
          Our personalized tutoring services cover a wide range of in-demand IT and business skills,
          including:
        </p>
        <ul>
          <li>
            <strong>Cybersecurity</strong>: Learn how to protect systems, detect threats, and secure
            data.
          </li>
          <li>
            <strong>Artificial Intelligence & Machine Learning (AI/ML)</strong>: Build intelligent
            solutions using real-world tools.
          </li>
          <li>
            <strong>Coding</strong>: Master programming languages like Python, JavaScript, and more.
          </li>
          <li>
            <strong>Business Analysis</strong>: Understand processes, drive efficiency, and deliver
            results.
          </li>
          <li>
            <strong>Data Analysis</strong>: Turn raw data into actionable insights using industry
            tools.
          </li>
          <li>
            <strong>And Much More</strong>: Including cloud computing, IT support, project
            management, and certification prep.
          </li>
        </ul>
      </div>

      <div>
        <p className="font-semibold">Why Train with Nimitech & NimiTutor?</p>
        <ul>
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
