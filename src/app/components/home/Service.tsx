// app/components/Service.tsx
"use client";
import React, { FC } from "react";
import Button from "../ui/Button";
import { ROUTES } from "@/app/constants/RoutesConstant";

interface ServiceCardProps {
  image: string;
  title: string;
  description: string;
}

const ServiceCard: FC<ServiceCardProps> = ({ image, title, description }) => (
  <div className="max-w-[1320px] flex flex-col cursor-pointer mb-5 sm:mb-0">
  <div className="w-full sm:p-4 p-0 overflow-hidden rounded-2xl">
   <div className="w-full overflow-hidden rounded-2xl border border-primary-gray">
   <img
      src={image}
      alt={title}
      className="w-full rounded-2xl hover:scale-105 transition-all duration-300"
    />
   </div>
  </div>
  <div className="sm:m-5 mt-4 sm:mt-0 flex flex-col flex-1 min-h-0">
    <p className="text-[24px] md:text-[25px] lg:text-3xl font-bold">
      {title}
    </p>
    <p className="text-base text-secondary text-justify leading-tight mt-2 flex-1 overflow-auto">
      {description}
    </p>
    <Button label="Read More" href={ROUTES.SERVICES} size="md" className="mt-3" />
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
    <div className="flex w-full max-w-[1320px] lg:w-[960px] xl:w-full md:w-[704px] mt-[80px] mx-auto px-4 sm:px-6 md:px-0 2xl:px-1.5">
      <div className="w-full py-0">
        <p className="text-primary text-base font-bold text-center">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service}/>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Service;
