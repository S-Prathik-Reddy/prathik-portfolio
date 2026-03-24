import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span> <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>

          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Data Engineering Intern</h4>
                <h5>Signode India</h5>
              </div>
              <h3>2022</h3>
            </div>
            <p>
              Architected a Big Data analytics solution using the Hadoop ecosystem and Apache Spark,
              improving data handling efficiency by 40%. Engineered Python ETL scripts using AWS cloud
              services (S3, EC2, EMR), resulting in a 35% boost in data processing efficiency.
            </p>
          </div>

          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Frontend Developer Intern</h4>
                <h5>Appshark Software</h5>
              </div>
              <h3>2023</h3>
            </div>
            <p>
              Innovated a data pipeline architecture with Apex, SQL, and LWC for survey translation
              across 5+ international markets. Automated end-to-end CI/CD pipelines using Perforce,
              Jenkins, and GitHub Actions, achieving 95%-unit test coverage.
            </p>
          </div>

          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>React Native Developer Intern</h4>
                <h5>CodeFacts Solutions</h5>
              </div>
              <h3>2023</h3>
            </div>
            <p>
              Developed a client-specific dashboard app using React Native CLI for cross-platform
              iOS and Android. Built three functional modules with Angular.js, integrating real-time
              data updates and seamless navigation to enhance user experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
