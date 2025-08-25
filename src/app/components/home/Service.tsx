// app/components/Service.tsx
"use client";
import React, { FC } from "react";

interface ServiceCardProps {
  image: string;
  title: string;
  description: string;
}

const ServiceCard: FC<ServiceCardProps> = ({ image, title, description }) => (
  <div className="border border-gray-300 rounded-3xl flex flex-col sm:flex-row p-4">
    <img
      src={image}
      alt={title}
      className="w-full sm:w-[40%] 2xl:w-[403px] rounded-3xl object-cover p-2"
    />
    <div className="sm:ml-5 mt-4 2xl:w-[382px] sm:mt-0">
      <p className="text-[24px] md:text-[28px] lg:text-[32px] font-bold">
        {title}
      </p>
      <p className="text-base text-[#616161] leading-[27.2px] font-semibold mt-2">
        {description}
      </p>
      <button className="rounded-full border-2 h-[48px] w-[140px] font-bold text-sm text-white bg-[#3DBEC8] mt-6">
        Read More
      </button>
    </div>
  </div>
);

const Service: FC = () => {
  const services: ServiceCardProps[] = [
    {
      image: "/homePage/service1.png",
      title: "Airport Transfer",
      description:
        "Reliable airport transfers with real-time flight tracking and timely pickups. Travel to or from the airport smoothly, with luggage assistance and a comfortable, hassle-free ride.",
    },
    {
      image: "/homePage/service2.png",
      title: "Car Rental With Driver",
      description:
      "Reliable airport transfers with real-time flight tracking and timely pickups. Travel to or from the airport smoothly, with luggage assistance and a comfortable, hassle-free ride."    
    },
    {
      image: "/homePage/service3.png",
      title: "Business Car Rental",
      description:
        "Make a lasting impression with our executive car rentals. Ideal for corporate travel, meetings, and events—punctual, professional, and perfectly suited to your business lifestyle.",
    },
    {
      image: "/homePage/service4.png",
      title: "Chauffeur Services",
      description:
        "Luxury travel with experienced chauffeurs for special events or VIP guests. Expect premium service, elegant vehicles, and a professional touch for any occasion.",
    },
  ];

  return (
    <div className="flex justify-center px-4 sm:px-6 lg:px-0">
      <div className="max-w-[1780px] w-full py-16">
        <p className="text-[#3DBEC8] text-base font-bold text-center">
          ∗ Our Services
        </p>
        <p className="text-[28px] sm:text-[32px] md:text-[36px] lg:text-[44px] text-[#040401] mx-auto leading-snug text-center font-bold max-w-[600px] mt-2">
          Explore our wide range of rental services
        </p>
        <p className="text-base text-[#616161] mx-auto leading-[27.2px] text-center font-semibold max-w-[600px] pt-4">
          We offer tailored rental solutions designed to fit every need—from
          personal to professional travel. Choose the service that best suits
          your journey.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Service;
