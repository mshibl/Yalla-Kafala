// File: components/thesmallhouse/index.tsx

import Image from "next/image"
// import Link from "next/link"

export default function TheSmallHouse() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#8e2a6e] text-white py-16">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold">The Small House</h1>
            <p className="text-xl">
              A nurturing home environment where orphaned girls receive the care, love, and support they need to thrive
              and build a better future.
            </p>
            <button className="bg-white text-[#8e2a6e] hover:bg-gray-100 rounded-full px-6 py-2 font-medium">
              Donate to Support The Small House
            </button>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0">
            <Image
              src="/placeholder.svg?height=400&width=600"
              alt="The Small House"
              width={600}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="py-12">
        <div className="container mx-auto px-4 md:px-6">
          {/* About The Small House */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-[#8e2a6e] mb-6">About The Small House</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-lg mb-4">
                  The Small House is a specialized care facility designed to provide orphaned girls with a family-like
                  environment that fosters their physical, emotional, and intellectual development.
                </p>
                <p className="text-lg mb-4">
                  Unlike traditional orphanages, The Small House operates on a model that prioritizes individualized
                  care, emotional bonding, and preparation for future family life through the Kafala system.
                </p>
                <p className="text-lg">
                  Our dedicated team of caregivers, educators, and healthcare professionals work together to ensure each
                  child receives the attention and support they need to overcome past traumas and develop into
                  confident, capable young women.
                </p>
              </div>
              <div>
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Children at The Small House"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-md"
                />
              </div>
            </div>
          </section>

          {/* What We Provide */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-[#8e2a6e] mb-8">What We Provide</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 shadow-md hover:shadow-lg transition-shadow bg-white rounded-lg border border-gray-200">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-[#f3e5ef] rounded-full flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-[#8e2a6e]"
                    >
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                      <path d="M6 12v5c3 3 9 3 12 0v-5" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Quality Education</h3>
                  <p>
                    Access to quality schools, tutoring, and educational resources to help each girl reach her full
                    academic potential.
                  </p>
                </div>
              </div>

              <div className="p-6 shadow-md hover:shadow-lg transition-shadow bg-white rounded-lg border border-gray-200">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-[#f3e5ef] rounded-full flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-[#8e2a6e]"
                    >
                      <path d="M12 2a8 8 0 0 0-8 8c0 5.4 7.4 11.5 7.6 11.7.2.1.5.1.8 0 .2-.2 7.6-6.3 7.6-11.7a8 8 0 0 0-8-8z" />
                      <path d="M12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Nutritious Food</h3>
                  <p>Balanced, healthy meals prepared with care to support physical growth and overall wellbeing.</p>
                </div>
              </div>

              <div className="p-6 shadow-md hover:shadow-lg transition-shadow bg-white rounded-lg border border-gray-200">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-[#f3e5ef] rounded-full flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-[#8e2a6e]"
                    >
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Proper Healthcare</h3>
                  <p>Regular medical check-ups, preventive care, and immediate attention to health concerns.</p>
                </div>
              </div>

              <div className="p-6 shadow-md hover:shadow-lg transition-shadow bg-white rounded-lg border border-gray-200">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-[#f3e5ef] rounded-full flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-[#8e2a6e]"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Privacy & Safety</h3>
                  <p>A secure environment where each girl has personal space and feels protected.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Daily Life */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-[#8e2a6e] mb-6">Daily Life at The Small House</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Daily activities at The Small House"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-md"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">A Structured, Nurturing Routine</h3>
                <p className="mb-4">
                  At The Small House, we maintain a consistent daily schedule that provides stability while allowing for
                  individual growth and development:
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start">
                    <span className="text-[#8e2a6e] mr-2">•</span>
                    <span>Morning routines that teach self-care and responsibility</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#8e2a6e] mr-2">•</span>
                    <span>Educational activities and school attendance</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#8e2a6e] mr-2">•</span>
                    <span>Recreational time for play and creative expression</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#8e2a6e] mr-2">•</span>
                    <span>Shared meals that foster community and social skills</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#8e2a6e] mr-2">•</span>
                    <span>Evening activities that promote emotional bonding</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#8e2a6e] mr-2">•</span>
                    <span>Bedtime routines that ensure proper rest</span>
                  </li>
                </ul>
                <p>
                  Our approach balances structure with flexibility, allowing each child to develop at her own pace while
                  learning valuable life skills.
                </p>
              </div>
            </div>
          </section>

          {/* Our Team */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-[#8e2a6e] mb-6">Our Dedicated Team</h2>
            <p className="text-lg mb-8 max-w-3xl">
              The Small House is staffed by compassionate professionals who are committed to providing the highest
              quality care for each child:
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 shadow-md bg-white rounded-lg border border-gray-200">
                <h3 className="text-xl font-bold mb-2">Caregivers</h3>
                <p>
                  Our trained caregivers provide round-the-clock support, emotional nurturing, and guidance for daily
                  activities.
                </p>
              </div>
              <div className="p-6 shadow-md bg-white rounded-lg border border-gray-200">
                <h3 className="text-xl font-bold mb-2">Educators</h3>
                <p>
                  Specialized teachers work with each girl to support her educational journey and develop her unique
                  talents and interests.
                </p>
              </div>
              <div className="p-6 shadow-md bg-white rounded-lg border border-gray-200">
                <h3 className="text-xl font-bold mb-2">Healthcare Professionals</h3>
                <p>
                  Regular visits from doctors, nurses, and therapists ensure both physical and mental health needs are
                  addressed.
                </p>
              </div>
            </div>
          </section>

          {/* Success Stories */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-[#8e2a6e] mb-6">Success Stories</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-6 shadow-md bg-white rounded-lg border border-gray-200">
                <h3 className="text-xl font-bold mb-2">Amira's Journey</h3>
                <p className="mb-4">
                  When Amira arrived at The Small House at age 4, she was withdrawn and struggled to connect with
                  others. Through consistent care and support, she blossomed into a confident young girl who excels in
                  school and was welcomed into a loving Kafala family.
                </p>
                <p className="italic">
                  "The Small House gave me the foundation I needed to believe in myself and trust others again."
                </p>
              </div>
              <div className="p-6 shadow-md bg-white rounded-lg border border-gray-200">
                <h3 className="text-xl font-bold mb-2">Layla's Transformation</h3>
                <p className="mb-4">
                  Layla spent three years at The Small House, where she discovered her passion for art. The supportive
                  environment allowed her talents to flourish, and she now lives with her Kafala family who continues to
                  nurture her creative abilities.
                </p>
                <p className="italic">
                  "I found my voice through art at The Small House, and now I have a family who celebrates my
                  creativity."
                </p>
              </div>
            </div>
          </section>

          {/* How You Can Help */}
          <section>
            <h2 className="text-3xl font-bold text-[#8e2a6e] mb-6">How You Can Help</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 shadow-md text-center bg-white rounded-lg border border-gray-200">
                <div className="w-16 h-16 bg-[#f3e5ef] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-[#8e2a6e]"
                  >
                    <path d="M12 2v20" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Donate</h3>
                <p className="mb-4">
                  Your financial contribution helps us provide quality care, education, and resources for the girls.
                </p>
                <button className="bg-[#8e2a6e] hover:bg-[#7a1f5d] text-white rounded-full px-6 py-2 font-medium">
                  Make a Donation
                </button>
              </div>

              <div className="p-6 shadow-md text-center bg-white rounded-lg border border-gray-200">
                <div className="w-16 h-16 bg-[#f3e5ef] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-[#8e2a6e]"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Volunteer</h3>
                <p className="mb-4">
                  Share your time and skills to support our programs and make a difference in the lives of our girls.
                </p>
                <button className="bg-[#8e2a6e] hover:bg-[#7a1f5d] text-white rounded-full px-6 py-2 font-medium">
                  Become a Volunteer
                </button>
              </div>

              <div className="p-6 shadow-md text-center bg-white rounded-lg border border-gray-200">
                <div className="w-16 h-16 bg-[#f3e5ef] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-[#8e2a6e]"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Consider Kafala</h3>
                <p className="mb-4">
                  Open your heart and home to a child through the Kafala system and provide them with a permanent
                  family.
                </p>
                <button className="bg-[#8e2a6e] hover:bg-[#7a1f5d] text-white rounded-full px-6 py-2 font-medium">
                  Learn About Kafala
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}