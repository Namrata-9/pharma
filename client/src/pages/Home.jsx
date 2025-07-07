import React from "react";

const Home = () => {
  return (
    <div style={styles.homeContainer}>
      <div style={styles.welcomeBox} className="animate-fade-in">
        <h1 style={styles.glowTitle}>💊 Welcome to Pharmacare</h1>

        <p style={styles.lead}>Your trusted Pharmacy Management Solution</p>

        {/* Decorative label instead of clickable button */}

        <div style={styles.label} className="animate-slide-up">
          🚀 Trusted by 100+ Pharmacies
        </div>

        {/* Embedded animations */}

        <style>
          {`

            @keyframes backgroundFade {

              0% {

                background: linear-gradient(to right, #e0f7fa, #ffffff);

              }

              100% {

                background: linear-gradient(to right, #ffffff, #e0f7fa);

              }

            }



            @keyframes fadeIn {

              from {

                opacity: 0;

                transform: scale(0.95);

              }

              to {

                opacity: 1;

                transform: scale(1);

              }

            }



            @keyframes slideUp {

              from {

                opacity: 0;

                transform: translateY(40px);

              }

              to {

                opacity: 1;

                transform: translateY(0px);

              }

            }



            .animate-fade-in {

              animation: fadeIn 1.5s ease;

            }



            .animate-slide-up {

              animation: slideUp 2s ease;

            }

          `}
        </style>
      </div>
    </div>
  );
};

const styles = {
  homeContainer: {
    height: "75vh",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    background: "linear-gradient(to right, #e0f7fa, #fff)",

    animation: "backgroundFade 4s ease-in-out infinite alternate",
  },

  welcomeBox: {
    textAlign: "center",

    padding: "40px",

    borderRadius: "20px",

    backgroundColor: "rgba(255, 255, 255, 0.95)",

    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)",
  },

  glowTitle: {
    fontSize: "2.8rem",

    color: "#00796b",

    fontWeight: "bold",

    textShadow: "1px 1px 8px #b2dfdb",

    marginBottom: "15px",
  },

  lead: {
    fontSize: "1.3rem",

    color: "#555",

    marginBottom: "25px",
  },

  label: {
    display: "inline-block",

    padding: "10px 20px",

    backgroundColor: "#004d40",

    color: "#fff",

    fontSize: "0.95rem",

    borderRadius: "30px",

    boxShadow: "0 0 10px rgba(0,0,0,0.2)",

    animation: "pulse 2s infinite",
  },
};

export default Home;
