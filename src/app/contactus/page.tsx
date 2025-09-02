"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// ✅ Import slick-carousel styles
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface Testimonial {
  title: string;
  text: string;
  name: string;
  role: string;
}

const testimonials: Testimonial[] = [
  {
    title: "Private Group Shuttle",
    text: "Leo Charter Services provided an amazing shuttle experience for our family reunion!",
    name: "Emily K.",
    role: "Organizer",
  },
  {
    title: "Tour Group Transportation",
    text: "Our tour group was thoroughly impressed with the service from Leo Charter Services. They catered to our every need, making the entire experience enjoyable!",
    name: "David R.",
    role: "Tour Operator",
  },
  {
    title: "Corporate Event Travel",
    text: "Professional, punctual, and reliable. They made sure our team arrived on time and stress-free.",
    name: "Sophia M.",
    role: "Event Manager",
  },
  {
    title: "Wedding Transportation",
    text: "We couldn’t have asked for better service on our wedding day. Thank you for making it special!",
    name: "Michael & Anna",
    role: "Bride & Groom",
  },
];

// ✅ Custom slider arrows
function SampleNextArrow(props: any) {
  const { onClick } = props;
  return (
    <div
      onClick={onClick}
      className="absolute -right-8 top-1/2 -translate-y-1/2 cursor-pointer text-white hover:text-[#c49b63] transition z-10"
    >
      <FaChevronRight size={28} />
    </div>
  );
}

function SamplePrevArrow(props: any) {
  const { onClick } = props;
  return (
    <div
      onClick={onClick}
      className="absolute -left-8 top-1/2 -translate-y-1/2 cursor-pointer text-white hover:text-[#c49b63] transition z-10"
    >
      <FaChevronLeft size={28} />
    </div>
  );
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    source: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // TODO: integrate API call
  };

  // ✅ Slider settings (auto slide enabled)
  const settings = {
    dots: true,
    infinite: true,
    speed: 400,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true, // enable auto-slide
    autoplaySpeed: 2000, // slide every 4s
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <section className="w-full">
      {/* Hero Banner */}
      <div className="relative max-w-[1760px] mx-auto mt-[71px]">
        <img 
          src="/images/contactUs.avif"
        />
      </div>

      {/* Contact Form Section */}
      <main className="bg-[#111] max-w-[1760px] mx-auto text-white font-sans flex justify-center items-center px-6 py-12">
        <div className="max-w-[1200px] w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Company Info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center mb-6">
              <Image
                src="/images/logo.png"
                alt="Leo Charter Services"
                width={100}
                height={100}
                className="mr-3"
              />
              <h1 className="text-xl font-bold leading-tight">
                <span className="block">eCHARTER</span>
                <span className="block">SERVICES</span>
              </h1>
            </div>
            <p className="text-gray-300 mb-3">info@eCharterservices.com</p>
            <p className="text-gray-300 mb-3">1-888-666-8090</p>
            <p className="text-[#c49b63] font-medium">
              Facebook/Instagram @eCharterservices
            </p>
          </div>

          {/* Right Side - Form */}
          <form
            onSubmit={handleSubmit}
            className="text-white flex flex-col space-y-4"
          >
            <h2 className="text-2xl font-bold text-[#c49b63] mb-2">
              Contact us
            </h2>

            {/* Name fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full p-2 focus:outline-none rounded bg-[#f9f8ff] text-black"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full p-2 focus:outline-none rounded bg-[#f9f8ff] text-black"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm mb-1">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-2 focus:outline-none rounded bg-[#f9f8ff] text-black"
              />
            </div>

            {/* Phone + Source */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Phone number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full p-2 focus:outline-none rounded bg-[#f9f8ff] text-black"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">
                  How did you hear about us? *
                </label>
                <select
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  required
                  className="w-full p-2 focus:outline-none rounded bg-[#f9f8ff] text-black"
                >
                  <option value="">Select...</option>
                  <option value="google">Google</option>
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="referral">Referral</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm mb-1">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full p-2 rounded bg-[#f9f8ff] focus:outline-none text-black"
              ></textarea>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="mt-4 w-[200px] px-6 py-2 border border-[#c49b63] text-[#c49b63] rounded hover:bg-[#c49b63] hover:text-black transition"
            >
              Send
            </button>
          </form>
        </div>
      </main>

      {/* Testimonials Section with Image Slider */}
      <section className="bg-[#111] max-w-[1760px] mx-auto text-white font-sans px-6 py-16">
        <div className="max-w-6xl w-full text-center mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#c49b63] mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg text-gray-300">
            Hear from satisfied customers about their experiences.
          </p>
        </div>

        <div className="relative max-w-[1060px] mx-auto w-full">
          <Slider {...settings}>
            {testimonials.map((t, i) => (
              <div key={i} className="px-4">
                <div className="relative h-[350px] rounded-lg overflow-hidden shadow-lg">
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-center px-6">
                    <h3 className="text-xl font-semibold mb-2">{t.title}</h3>
                    <p className="text-gray-200 italic mb-4">"{t.text}"</p>
                    <hr className="w-12 border-gray-500 mx-auto mb-3" />
                    <p className="font-bold">{t.name}</p>
                    <p className="text-sm text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>
    </section>
  );
}
