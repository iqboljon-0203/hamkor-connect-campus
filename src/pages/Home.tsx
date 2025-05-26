import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const GeoEducationLogo = () => (
  <svg
    width="80"
    height="80"
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="40"
      cy="40"
      r="38"
      fill="#2563eb"
      stroke="#1e40af"
      strokeWidth="4"
    />
    <path
      d="M40 20C50 20 60 30 60 40C60 50 50 60 40 60C30 60 20 50 20 40C20 30 30 20 40 20Z"
      fill="#fff"
      stroke="#1e40af"
      strokeWidth="2"
    />
    <circle
      cx="40"
      cy="40"
      r="8"
      fill="#2563eb"
      stroke="#1e40af"
      strokeWidth="2"
    />
  </svg>
);

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="max-w-md w-full flex flex-col items-center gap-8 animate-fade-in">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <GeoEducationLogo />
          <h1 className="text-4xl font-bold text-brand-600 mt-2 text-center">
            GeoEducationbot
          </h1>
          <p className="text-lg text-muted-foreground text-center mt-2 font-medium">
            Talabalar va ustozlar uchun zamonaviy amaliyot va topshiriq
            platformasi
          </p>
        </div>
        {/* Actions */}
        <div className="flex flex-col gap-4 w-full mt-8">
          <Button asChild size="lg" className="w-full text-base font-semibold">
            <Link to="/auth/login">Kirish</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="w-full text-base font-semibold"
          >
            <Link to="/auth/register">Ro'yxatdan o'tish</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
