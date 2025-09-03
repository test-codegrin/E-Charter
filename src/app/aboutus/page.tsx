"use client";

import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="bg-black text-white font-sans max-w-[1760px] mt-[70px] mx-auto">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex flex-col justify-center items-center md:text-left text-center px-4 sm:px-6 md:px-10">
        {/* Background image */}
        <Image
          src="/images/Map-BG.jpg"
          alt="Background Map"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/70"></div>

        {/* Content */}
        <div className="relative z-10 mt-[90px] 2xl:mt-[0px] max-w-5xl mx-auto">
          <h1 className="text-3xl text-center sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            About Us
          </h1>

          {/* Fleet Image */}
          <div className="flex justify-center mb-6">
            <Image
              src="/images/fleets.png"
              alt="Fleet Vehicles"
              width={1000}
              height={600}
              className="object-contain w-full max-w-[900px] max-h-64 sm:max-h-72 md:max-h-80"
              priority
            />
          </div>

          {/* About Text */}
          <div className="space-y-4 text-base sm:text-lg md:text-xl leading-relaxed">
            <p>
              eCharter is a modern ground passenger transportation provider in
              Canada, committed to delivering innovative, customizable, and
              sustainable charter bus and private shuttle services.
            </p>
            <p>
              With a growing fleet spanning Alberta, British Columbia, Ontario,
              and Quebec, we make group travel easy, accessible, and eco-friendly.
            </p>
            <p className="font-semibold text-lg sm:text-xl">
              Anytime. Anywhere. Any occasion. Any group size.
            </p>
          </div>
        </div>
      </section>

      {/* Mission / Vision / Services */}
      <section className="px-4 sm:px-6 md:px-10 lg:px-16 py-12 space-y-16">
        <div className="mx-auto max-w-5xl text-center md:text-left">
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-[#D9C4AC] font-bold">
            Our Mission
          </h2>
          <p className="mt-4 text-base sm:text-lg md:text-xl">
            Deliver the best possible private transportation experience to every
            booking.
          </p>
        </div>

        <div className="mx-auto max-w-5xl text-center md:text-left">
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-[#D9C4AC] font-bold">
            Our Vision
          </h2>
          <p className="mt-4 text-base sm:text-lg md:text-xl">
            Create a charter service ecosystem that allows businesses and any
            group to access customizable, affordable and reliable ground
            transportation services according to their needs.
          </p>
        </div>

        <div className="mx-auto max-w-5xl text-center md:text-left">
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-[#D9C4AC] font-bold">
            Our Services
          </h2>
          <div className="mt-4 space-y-4 text-base sm:text-lg md:text-xl">
            <p>
              eCharter Services is experienced in serving different industries,
              including Travel & Tourism, Weddings & Events, Corporate,
              Education, Leisure & Entertainment, Community, Sports, Government,
              etc.
            </p>
            <p>
              Our services vary from pick up & drop off, hourly charter, and day
              package to multi-day out-of-town trips.
            </p>
            <p>
              We also offer customized contract services to meet business and
              private clients' unique needs.
            </p>
            <p>
              Our fleet includes various class vehicles for different capacities,
              allowing us to serve any sized group.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4 sm:px-6 md:px-10 lg:px-16 bg-black">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-10">
            Why Choose eCharter?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 text-left">
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
              <h3 className="text-lg sm:text-xl font-semibold mb-3">
                Eco-Friendly Travel
              </h3>
              <p className="text-sm sm:text-base md:text-lg">
                We are committed to sustainability, using modern vehicles that
                reduce emissions while ensuring passenger comfort.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
              <h3 className="text-lg sm:text-xl font-semibold mb-3">
                Affordable & Transparent
              </h3>
              <p className="text-sm sm:text-base md:text-lg">
                Our pricing is fair and clear—no hidden fees, just reliable
                transportation for every budget.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
              <h3 className="text-lg sm:text-xl font-semibold mb-3">
                Reliable Service
              </h3>
              <p className="text-sm sm:text-base md:text-lg">
                From corporate events to private getaways, our experienced
                drivers and diverse fleet ensure a safe and seamless journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="px-4 sm:px-6 md:px-10 lg:px-16 py-12">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-[#D9C4AC] font-bold">
            Why Us
          </h2>
          <ul className="list-disc marker:text-[#D9C4AC] ml-6 sm:ml-10 mt-6 space-y-4">
            <li className="text-base sm:text-lg md:text-xl">
              eCharter Services is your go-to vendor for complete transportation
              services.
            </li>
            <li className="text-base sm:text-lg md:text-xl">
              Our experienced customer service team provides complimentary
              transportation planning to ensure you get the best solution when
              booking with us.
            </li>
            <li className="text-base sm:text-lg md:text-xl">
              Our fleet team is composed of well-maintained vehicles and
              experienced drivers to cope with any situation on the road.
            </li>
            <li className="text-base sm:text-lg md:text-xl">
              Safety is our priority. Punctuality is our mandate.
            </li>
            <li className="text-base sm:text-lg md:text-xl">
              Our 24/7, multi-language team is available for you anytime.
            </li>
          </ul>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 sm:px-6 md:px-10 lg:px-16 text-center bg-black">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
          Plan Your Journey with eCharter
        </h2>
        <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl mb-8">
          Book your next trip with confidence. eCharter makes group
          transportation simple, sustainable, and stress-free.
        </p>
        <a
          href="/contactus"
          className="bg-yellow-500 text-black px-6 py-3 rounded-full font-semibold hover:bg-yellow-400 transition"
        >
          Get in Touch
        </a>
      </section>
    </main>
  );
}