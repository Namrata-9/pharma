import React from "react";

const AboutUs = () => {
  const styles = {
    container: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: "50px 20px",
      maxWidth: "1000px",
      margin: "0 auto",
      color: "#333",
    },
    heading: {
      textAlign: "center",
      color: "#0b6e4f",
      fontSize: "36px",
      marginBottom: "10px",
    },
    subheading: {
      textAlign: "center",
      fontSize: "18px",
      color: "#555",
      marginBottom: "40px",
    },
    section: {
      backgroundColor: "#f9f9f9",
      borderRadius: "12px",
      padding: "30px",
      marginBottom: "30px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
    },
    sectionTitle: {
      color: "#0b6e4f",
      fontSize: "24px",
      marginBottom: "10px",
    },
    paragraph: {
      lineHeight: "1.7",
      fontSize: "16px",
      color: "#444",
    },
    team: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "20px",
      marginTop: "20px",
    },
    card: {
      backgroundColor: "#fff",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
      textAlign: "center",
    },
    avatar: {
      width: "70px",
      height: "70px",
      borderRadius: "50%",
      marginBottom: "10px",
      objectFit: "cover",
    },
    name: {
      fontWeight: "600",
      fontSize: "16px",
      color: "#0b6e4f",
    },
    role: {
      fontSize: "14px",
      color: "#777",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>About PharmaCare</h1>
      <p style={styles.subheading}>Your trusted pharmacy management partner.</p>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Who We Are</h2>
        <p style={styles.paragraph}>
          PharmaCare is a modern pharmacy management platform built to simplify
          the workflow of pharmacies, from inventory tracking and sales to
          patient management. We are a passionate team of developers and
          healthcare professionals on a mission to bring digital transformation
          to the pharmacy industry.
        </p>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Our Mission</h2>
        <p style={styles.paragraph}>
          Our mission is to empower pharmacists and healthcare providers with
          intelligent tools that ensure better inventory control, accurate sales
          tracking, and an overall efficient pharmacy experience for both staff
          and customers.
        </p>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Meet the Team</h2>
        <div style={styles.team}>
          <div style={styles.card}>
            <img
              src="https://i.pravatar.cc/70?img=12"
              alt="Founder"
              style={styles.avatar}
            />
            <div style={styles.name}>Namrata Sharma</div>
            <div style={styles.role}>Founder & Developer</div>
          </div>
          <div style={styles.card}>
            <img
              src="https://i.pravatar.cc/70?img=32"
              alt="Tech Lead"
              style={styles.avatar}
            />
            <div style={styles.name}>Rahul Verma</div>
            <div style={styles.role}>Tech Lead</div>
          </div>
          <div style={styles.card}>
            <img
              src="https://i.pravatar.cc/70?img=44"
              alt="UI/UX Designer"
              style={styles.avatar}
            />
            <div style={styles.name}>Anjali Mehta</div>
            <div style={styles.role}>UI/UX Designer</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
