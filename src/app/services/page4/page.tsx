// pages/page4.tsx
import React from "react";
import PickupDropForm from "../../components/bookservice/PickupDropForm";
import OffersCard from "../../components/bookservice/OffersCard";
import CarCard from "../../components/bookservice/CarCard";
import Nav from "../../components/bookservice/Nav";

const Page4 = () => {
  return (
    <div className="w-full px-8 mt-[70px] min-h-screen bg-white">
      {/* Navbar */}
      {/* <div className="sticky top-0 z-50 bg-white">
        <Nav />
      </div> */}
      <div className="bg-white sm:w-[500px] md:w-[600px] lg:w-full text-black min-h-screen w-full p-4 sm:p-6 lg:p-8 xl:p-12.5 2xl:px-0 mx-auto">
        {/* Form Section */}
        <div className="mb-8 lg:mb-12">
          <PickupDropForm />
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6 xl:gap-8 2xl:gap-0">
          {/* Offers Column */}
          <div className="flex flex-col gap-6 w-full lg:max-w-sm lg:top-4">
            <OffersCard
              title="Weekend Special"
              date="19‑05‑2025 to 25‑05‑2025"
              image="Weekend.png"
              description="Perfect for weekend getaways! Book any car for 2 days and get the 3rd day absolutely free."
              features={[
                "Valid for all car categories",
                "Free additional driver",
                "GPS navigation included",
                "Flexible pickup locations",
              ]}
              link="/"
            />

            <OffersCard
              title="Long‑Term Rentals"
              date="Save More, Rent Longer"
              image="Longterm.png"
              description="Planning an extended stay? Our monthly rental packages offer significant savings and added convenience."
              features={[
                "Up to 40% savings",
                "Flexible terms",
                "GPS navigation included",
                "Free maintenance",
              ]}
              link="/"
            />
          </div>

          {/* Cars Column */}
          <div className="2xl:ml-[30px] flex flex-col gap-6 xl:gap-8">
            <CarCard
              title="SCORPIO‑N"
              subtitle="The Big Daddy of SUVs"
              image="suv2.png"
              passengers={7}
              fuel="Diesel"
              mileage="Limited Mileage"
              location="Mercury Car Rentals Priv Ltd floor16, Premch, Row House 214, Ahmedabad, India 380054"
              price="$219"
              features={[
                "Automatic Transmission",
                "Air Conditioning",
                "Bluetooth",
                "Child Seat Available",
              ]}
            />

            <CarCard
              title="XUV700"
              subtitle="The Smart Beast of SUVs"
              image="Xuv700.png"
              passengers={4}
              fuel="Diesel"
              mileage="Limited Mileage"
              location="Mercury Car Rentals Priv Ltd floor16, Premch, Row House 214, Ahmedabad, India 380054"
              price="$219"
              features={[
                "Automatic Transmission",
                "Premium Sound System",
                "360° Camera",
                "Panoramic Sunroof",
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page4;
