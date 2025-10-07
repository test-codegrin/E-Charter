"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { ROUTES } from "@/app/constants/RoutesConstant";

export default function AboutUs() {
  const router = useRouter();

  const values = [
    {
      icon: "mdi:shield-check",
      title: "Safety First",
      description:
        "Your safety is our top priority. All our vehicles undergo rigorous maintenance and safety checks.",
    },
    {
      icon: "mdi:clock-fast",
      title: "Reliability",
      description:
        "We pride ourselves on punctuality and dependability. Your journey matters to us.",
    },
    {
      icon: "mdi:heart-outline",
      title: "Customer-Centric",
      description:
        "We listen to our customers and continuously improve our services based on your feedback.",
    },
    {
      icon: "mdi:leaf",
      title: "Sustainability",
      description:
        "We're committed to reducing our carbon footprint with eco-friendly vehicle options.",
    },
  ];

  const stats = [
    { number: "10K+", label: "Happy Customers" },
    { number: "500+", label: "Vehicles" },
    { number: "50+", label: "Cities Covered" },
    { number: "24/7", label: "Customer Support" },
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      image: "/images/team/ceo.jpg",
      bio: "15+ years in transportation industry",
    },
    {
      name: "Michael Chen",
      role: "Head of Operations",
      image: "/images/team/operations.jpg",
      bio: "Expert in logistics and fleet management",
    },
    {
      name: "Emily Rodriguez",
      role: "Customer Experience Director",
      image: "/images/team/cx.jpg",
      bio: "Passionate about customer satisfaction",
    },
    {
      name: "David Thompson",
      role: "Technology Lead",
      image: "/images/team/tech.jpg",
      bio: "Building innovative travel solutions",
    },
  ];

  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-primary-dark text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/images/pattern.svg')] bg-repeat"></div>
        </div>
        
        <div className="relative max-w-[1320px] mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
            >
              <Icon icon="mdi:arrow-left" className="w-5 h-5 mr-2" />
              Back
            </button>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              About eCharter
            </h1>
            <p className="text-xl sm:text-2xl text-white/90 mb-8">
              Your trusted partner in seamless travel experiences
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => router.push(ROUTES.PLAN_JOURNEY)}
                className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Plan Your Journey
              </button>
              <button
                onClick={() => router.push(ROUTES.CONTACT)}
                className="bg-white/10 backdrop-blur-sm border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/20 transition-all"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-4xl sm:text-5xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
                <p>
                  Founded in 2015, eCharter began with a simple mission: to
                  make group travel easy, affordable, and stress-free. What
                  started as a small fleet of charter buses has grown into
                  Canada's largest marketplace for charter transportation.
                </p>
                <p>
                  We recognized that planning group trips was often complicated
                  and time-consuming. There was a gap in the market for a
                  platform that could connect travelers with quality
                  transportation providers while offering transparent pricing
                  and exceptional service.
                </p>
                <p>
                  Today, we serve thousands of customers across Canada,
                  providing everything from airport transfers to multi-day tour
                  charters. Our commitment to innovation, safety, and customer
                  satisfaction has made us the go-to choice for group travel.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/images/about-story.jpg"
                  alt="eCharter Story"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800";
                  }}
                />
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-full -z-10"></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary/5 rounded-full -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Mission & Vision
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Driving the future of group transportation
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border-2 border-primary/10 hover:border-primary/30 transition-all">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Icon
                  icon="mdi:target"
                  className="w-8 h-8 text-primary"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Our Mission
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                To revolutionize group travel by providing seamless,
                affordable, and reliable transportation solutions that connect
                people to their destinations safely and comfortably.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border-2 border-primary/10 hover:border-primary/30 transition-all">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Icon
                  icon="mdi:telescope"
                  className="w-8 h-8 text-primary"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Our Vision
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                To become the world's most trusted and innovative group
                transportation platform, setting new standards for service
                excellence and customer satisfaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="text-center p-6 bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-lg transition-all group"
              >
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:scale-110 transition-all">
                  <Icon
                    icon={value.icon}
                    className="w-10 h-10 text-primary group-hover:text-white transition-colors"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Leadership Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Passionate professionals dedicated to your journey
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                    <Icon
                      icon="mdi:account"
                      className="w-16 h-16 text-white"
                    />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose eCharter?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We go above and beyond to make your journey exceptional
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border border-blue-100">
              <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center mb-6">
                <Icon icon="mdi:shield-check" className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Safety & Compliance
              </h3>
              <p className="text-gray-600 leading-relaxed">
                All vehicles are regularly inspected and maintained to the
                highest standards. Our drivers undergo thorough background
                checks and training.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl border border-green-100">
              <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center mb-6">
                <Icon icon="mdi:cash-multiple" className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Transparent Pricing
              </h3>
              <p className="text-gray-600 leading-relaxed">
                No hidden fees or surprise charges. Get instant quotes and
                compare prices from multiple providers to find the best deal.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl border border-purple-100">
              <div className="w-16 h-16 bg-purple-500 rounded-xl flex items-center justify-center mb-6">
                <Icon icon="mdi:headset" className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                24/7 Support
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Our dedicated customer support team is available around the
                clock to assist you before, during, and after your trip.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 md:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust eCharter for their
            group travel needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => router.push(ROUTES.PLAN_JOURNEY)}
              className="bg-white text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              Get Started Now
            </button>
            <button
              onClick={() => router.push(ROUTES.CONTACT)}
              className="bg-white/10 backdrop-blur-sm border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/20 transition-all"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
