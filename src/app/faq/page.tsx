"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { ROUTES } from "@/app/constants/RoutesConstant";

interface FAQ {
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  icon: string;
  faqs: FAQ[];
}

export default function FAQPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const faqCategories: FAQCategory[] = [
    {
      title: "Booking & Reservations",
      icon: "mdi:calendar-check",
      faqs: [
        {
          question: "How do I book a charter?",
          answer:
            "You can book a charter by visiting our 'Plan Journey' page, entering your trip details including pickup/dropoff locations, dates, and number of passengers. You'll receive instant quotes from available vehicles. Select your preferred option and complete the booking with payment.",
        },
        {
          question: "How far in advance should I book?",
          answer:
            "We recommend booking at least 2-3 weeks in advance for best availability, especially during peak seasons (holidays, summer months). However, we also accommodate last-minute bookings based on vehicle availability.",
        },
        {
          question: "Can I modify my booking after confirmation?",
          answer:
            "Yes, you can modify your booking up to 24 hours before your scheduled departure time at no additional charge. Changes made within 24 hours may incur fees. Contact our support team to make modifications.",
        },
        {
          question: "Do you offer multi-day charters?",
          answer:
            "Absolutely! We offer single-day trips, multi-day tours, and extended rental periods. Our pricing is competitive for long-term bookings, and you'll have dedicated support throughout your journey.",
        },
        {
          question: "Can I book a round trip?",
          answer:
            "Yes, we offer round trip bookings. Simply select 'Round Trip' when planning your journey and provide both pickup and return dates. Round trips often come with discounted rates.",
        },
      ],
    },
    {
      title: "Payment & Pricing",
      icon: "mdi:cash-multiple",
      faqs: [
        {
          question: "What payment methods do you accept?",
          answer:
            "We accept all major credit cards (Visa, Mastercard, American Express), debit cards, and corporate accounts. Payment is processed securely through our encrypted payment gateway.",
        },
        {
          question: "When do I need to pay?",
          answer:
            "Full payment is required at the time of booking to confirm your reservation. For corporate accounts, we offer NET 30 payment terms upon approval.",
        },
        {
          question: "Are there any hidden fees?",
          answer:
            "No hidden fees! Our quote includes the base fare and a transparent 3% service fee. Any additional costs (tolls, parking, wait time) will be discussed upfront and itemized separately.",
        },
        {
          question: "Do you offer group discounts?",
          answer:
            "Yes! We offer discounts for large groups, multi-day bookings, and repeat customers. Corporate clients also receive special rates. Contact our sales team for custom quotes.",
        },
        {
          question: "What is your cancellation policy?",
          answer:
            "Free cancellation up to 24 hours before pickup. Cancellations within 24 hours are subject to a cancellation fee as specified in your booking confirmation. No-shows are charged in full.",
        },
      ],
    },
    {
      title: "Vehicles & Amenities",
      icon: "mdi:bus",
      faqs: [
        {
          question: "What types of vehicles do you offer?",
          answer:
            "We offer a wide range of vehicles including luxury sedans, SUVs, minivans, charter buses (15-56 passengers), and coach buses. All vehicles are well-maintained, clean, and equipped with modern amenities.",
        },
        {
          question: "Are your vehicles accessible?",
          answer:
            "Yes, we have ADA-compliant vehicles with wheelchair lifts and accessibility features. Please specify accessibility requirements when booking so we can provide the appropriate vehicle.",
        },
        {
          question: "What amenities are included?",
          answer:
            "Most vehicles include air conditioning, comfortable seating, audio systems, and USB charging ports. Larger buses may include WiFi, restrooms, entertainment systems, and luggage storage. Specific amenities vary by vehicle.",
        },
        {
          question: "How many passengers can your vehicles accommodate?",
          answer:
            "Our fleet ranges from 4-passenger luxury sedans to 56-passenger coach buses. We'll help you select the right vehicle size based on your group and luggage requirements.",
        },
        {
          question: "Are your vehicles regularly maintained?",
          answer:
            "Yes, all vehicles undergo rigorous maintenance schedules and safety inspections. We follow manufacturer guidelines and exceed DOT requirements to ensure passenger safety and comfort.",
        },
      ],
    },
    {
      title: "Drivers & Safety",
      icon: "mdi:account-tie",
      faqs: [
        {
          question: "Are your drivers licensed and insured?",
          answer:
            "Yes, all our drivers hold valid commercial driver's licenses (CDL), undergo background checks, and are fully insured. They receive ongoing training in safety and customer service.",
        },
        {
          question: "Can I request a specific driver?",
          answer:
            "While we cannot guarantee specific drivers, you can note preferences in your booking. We'll do our best to accommodate requests for repeat customers who've had positive experiences.",
        },
        {
          question: "What if my driver is late?",
          answer:
            "Our drivers aim to arrive 10-15 minutes early. If there's any delay, you'll be notified immediately. In the rare event of significant delays, we'll arrange alternative transportation at no extra charge.",
        },
        {
          question: "Do drivers help with luggage?",
          answer:
            "Yes, our drivers will assist with loading and unloading luggage. Please inform us in advance if you have oversized items or special handling requirements.",
        },
        {
          question: "What safety measures do you have in place?",
          answer:
            "We implement comprehensive safety protocols including regular vehicle inspections, driver training, GPS tracking, real-time monitoring, and 24/7 emergency support. All vehicles carry emergency equipment.",
        },
      ],
    },
    {
      title: "Routes & Destinations",
      icon: "mdi:map-marker-path",
      faqs: [
        {
          question: "Which areas do you serve?",
          answer:
            "We serve 50+ cities across Canada, including major metropolitan areas and popular tourist destinations. For trips outside our standard service area, contact us for availability and pricing.",
        },
        {
          question: "Can you accommodate multi-stop trips?",
          answer:
            "Yes! We specialize in multi-stop itineraries including wine tours, city tours, airport transfers with stops, and custom routes. Add all your stops when planning your journey.",
        },
        {
          question: "Do you provide airport transfers?",
          answer:
            "Absolutely! We offer reliable airport pickup and drop-off services. Our drivers monitor flight schedules and adjust for delays. Meet & greet service is available for an additional fee.",
        },
        {
          question: "Can I change the route during the trip?",
          answer:
            "Minor route adjustments can be made with driver approval. Significant changes may affect pricing and schedule. We recommend discussing any changes with dispatch before departure.",
        },
        {
          question: "Do you offer cross-border trips?",
          answer:
            "Yes, we provide cross-border transportation to the USA. Additional documentation and advance notice are required. Contact us at least 7 days before for international trips.",
        },
      ],
    },
    {
      title: "Policies & Guidelines",
      icon: "mdi:file-document-outline",
      faqs: [
        {
          question: "What is your luggage policy?",
          answer:
            "Each passenger is allowed one large suitcase and one carry-on. Additional luggage may require a larger vehicle. Oversized items (sports equipment, musical instruments) must be mentioned when booking.",
        },
        {
          question: "Can passengers eat and drink on board?",
          answer:
            "Non-alcoholic beverages are allowed. Food is permitted but must be cleaned up. Alcohol consumption policies vary by vehicle type and local regulations. No smoking or vaping is allowed.",
        },
        {
          question: "What happens in case of vehicle breakdown?",
          answer:
            "In the unlikely event of a breakdown, we'll dispatch a replacement vehicle immediately. You'll be kept informed throughout, and any delays will be compensated as per our service guarantee.",
        },
        {
          question: "Do you provide child seats?",
          answer:
            "Child safety seats can be provided upon request at no additional charge. Please specify the number and type of seats needed (infant, toddler, booster) when booking.",
        },
        {
          question: "Can I bring my pet?",
          answer:
            "Service animals are always welcome. Pets may be allowed with advance notice and driver approval. A pet fee may apply, and pets must be in carriers or on leashes at all times.",
        },
      ],
    },
    {
      title: "Technical & Support",
      icon: "mdi:headset",
      faqs: [
        {
          question: "How do I track my vehicle?",
          answer:
            "Once your trip begins, you'll receive a tracking link via SMS or email. This allows you to monitor your vehicle's location in real-time and estimated arrival time.",
        },
        {
          question: "What if I need to contact support during my trip?",
          answer:
            "Our 24/7 support team is available by phone, email, or in-app chat. Emergency assistance is prioritized. Contact numbers are provided in your booking confirmation.",
        },
        {
          question: "Do you have a mobile app?",
          answer:
            "Currently, our services are accessible through our mobile-optimized website. A dedicated mobile app is in development and will be launched soon with enhanced features.",
        },
        {
          question: "How do I receive my booking confirmation?",
          answer:
            "You'll receive an immediate email confirmation with trip details, driver information (assigned 24 hours before departure), and payment receipt. Keep this for your records.",
        },
        {
          question: "Can I leave a review or feedback?",
          answer:
            "Absolutely! We value your feedback. After your trip, you'll receive a survey link. You can also leave reviews on our website or contact our customer experience team directly.",
        },
      ],
    },
  ];

  // Flatten all FAQs for searching
  const allFAQs = faqCategories.flatMap((category) =>
    category.faqs.map((faq) => ({ ...faq, category: category.title }))
  );

  // Filter FAQs based on search and category
  const filteredCategories = faqCategories
    .map((category) => ({
      ...category,
      faqs: category.faqs.filter((faq) =>
        searchQuery
          ? faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
          : true
      ),
    }))
    .filter(
      (category) =>
        (activeCategory === "all" || category.title === activeCategory) &&
        category.faqs.length > 0
    );

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
              Frequently Asked Questions
            </h1>
            <p className="text-xl sm:text-2xl text-white/90 mb-8">
              Find answers to common questions about our charter services
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Icon
                  icon="mdi:magnify"
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search for answers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-4 py-4 rounded-xl text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-white/30 transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-gray-50 -mt-6">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {allFAQs.length}+
              </div>
              <div className="text-gray-600 text-sm">Questions Answered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {faqCategories.length}
              </div>
              <div className="text-gray-600 text-sm">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-gray-600 text-sm">Support Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">&lt;2h</div>
              <div className="text-gray-600 text-sm">Average Response</div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 sticky top-0 bg-white z-10 border-b border-gray-200">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all ${
                activeCategory === "all"
                  ? "bg-primary text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Icon icon="mdi:view-grid" className="inline w-5 h-5 mr-2" />
              All Categories
            </button>
            {faqCategories.map((category) => (
              <button
                key={category.title}
                onClick={() => setActiveCategory(category.title)}
                className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all ${
                  activeCategory === category.title
                    ? "bg-primary text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Icon icon={category.icon} className="inline w-5 h-5 mr-2" />
                {category.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 md:px-8">
          {filteredCategories.length > 0 ? (
            <div className="space-y-12">
              {filteredCategories.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon
                        icon={category.icon}
                        className="w-6 h-6 text-primary"
                      />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {category.title}
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {category.faqs.map((faq, faqIndex) => (
                      <details
                        key={faqIndex}
                        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 group hover:shadow-md transition-all"
                      >
                        <summary className="font-semibold text-gray-900 cursor-pointer flex items-start justify-between list-none">
                          <span className="text-lg flex-1 pr-4">
                            {faq.question}
                          </span>
                          <Icon
                            icon="mdi:chevron-down"
                            className="w-6 h-6 text-primary flex-shrink-0 transition-transform group-open:rotate-180"
                          />
                        </summary>
                        <div className="mt-4 text-gray-600 leading-relaxed pl-2 border-l-4 border-primary/20">
                          {faq.answer}
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Icon
                icon="mdi:file-search-outline"
                className="w-20 h-20 text-gray-300 mx-auto mb-4"
              />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No results found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search or browse all categories
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-all"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Still Have Questions Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Still Have Questions?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Can't find what you're looking for? Our support team is here to
              help!
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 text-center hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon icon="mdi:email" className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Email Support
              </h3>
              <p className="text-gray-600 mb-4">support@echarter.com</p>
              <p className="text-sm text-gray-500">Response within 2 hours</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 text-center hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon icon="mdi:phone" className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Call Us
              </h3>
              <p className="text-gray-600 mb-4">+1 (800) 123-4567</p>
              <p className="text-sm text-gray-500">24/7 availability</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 text-center hover:shadow-lg transition-all sm:col-span-2 lg:col-span-1">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon icon="mdi:chat" className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Live Chat
              </h3>
              <p className="text-gray-600 mb-4">Instant messaging</p>
              <p className="text-sm text-gray-500">Available 9 AM - 6 PM</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => router.push(ROUTES.CONTACT)}
              className="bg-primary text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-dark hover:shadow-xl transform hover:scale-105 transition-all inline-flex items-center gap-2"
            >
              <Icon icon="mdi:message-text" className="w-6 h-6" />
              Contact Support
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 md:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Book Your Charter?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Now that you have all the information, let's plan your perfect
            journey!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => router.push(ROUTES.PLAN_JOURNEY)}
              className="bg-white text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all inline-flex items-center gap-2"
            >
              <Icon icon="mdi:map-marker-path" className="w-6 h-6" />
              Plan Your Journey
            </button>
            <button
              onClick={() => router.push(ROUTES.HOME)}
              className="bg-white/10 backdrop-blur-sm border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/20 transition-all inline-flex items-center gap-2"
            >
              <Icon icon="mdi:information" className="w-6 h-6" />
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
