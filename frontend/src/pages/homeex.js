// HomePage.jsx
import React from "react";
import { useAuth } from "../context/authContext";
import { Container, Spinner } from "react-bootstrap";
import HeroSection from "../components/home/HeroSection";
import FeatureCards from "../components/home/FeatureCards";
import QuickAccess from "../components/home/QuickAccess";
import Statistics from "../components/home/Statistics";
import UserWelcome from "../components/home/UserWelcome";
import LoginPrompt from "../components/home/LoginPrompt";
import RecentUpdates from "../components/home/RecentUpdates";
import Footer from "../components/home/Footer";
import "../styles/HomePage.css";

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading HMS...</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      {user ? (
        <>
          <UserWelcome user={user} />
          <Container fluid className="px-4 mb-5">
            <QuickAccess user={user} />
            <Statistics user={user} />
            <RecentUpdates user={user} />
          </Container>
        </>
      ) : (
        <>
          <HeroSection />
          <FeatureCards />
          <LoginPrompt />
        </>
      )}
      <Footer />
    </div>
  );
}
