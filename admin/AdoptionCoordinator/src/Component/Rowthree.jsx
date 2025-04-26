import { MagnifyingGlassIcon, DocumentCheckIcon, HeartIcon } from "@heroicons/react/24/solid";
import Adoption1 from "../assets/Adoption1.jpeg";

const features = [
  {
    name: 'Search for Your Perfect Match',
    description:
      'Browse adoptable pets in shelters and rescues near you and find the perfect match for your family.',
    icon: MagnifyingGlassIcon,
  },
  {
    name: 'Submit Adoption Application',
    description:
      'Complete a thorough home study process to prepare and verify your readiness for adoption.',
    icon: DocumentCheckIcon,
  },
  {
    name: 'Matching Process',
    description:
      'Use our comprehensive adoption checklist to ensure you are ready to welcome your new pet home.',
    icon: HeartIcon,
  },
]

export default function RowThree() {
  return (
    <div className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <svg
          aria-hidden="true"
          className="absolute top-0 left-[max(50%,25rem)] h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
        >
          <defs>
            <pattern
              x="50%"
              y={-1}
              id="e813992c-7d03-4cc4-a2bd-151760b470a0"
              width={200}
              height={200}
              patternUnits="userSpaceOnUse"
            >
              <path d="M100 200V.5M.5 .5H200" fill="none" />
            </pattern>
          </defs>
          <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
            <path
              d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
              strokeWidth={0}
            />
          </svg>
          <rect fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)" width="100%" height="100%" strokeWidth={0} />
        </svg>
      </div>
      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
        <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          <div className="lg:pr-4">
            <div className="lg:max-w-lg">
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
                Start Your Adoption Journey
              </h1>
              <p className="mt-6 text-xl/8 text-gray-700">
                Embark on a transformative path to finding your perfect pet companion. Our compassionate team guides you through every step of this incredible journey.
              </p>
            </div>
          </div>
        </div>
        <div className="-mt-5 -ml-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
          <img
            src={Adoption1}
            alt="Adoption journey illustration"
            className="w-[48rem] max-w-none rounded-xl bg-gray-900 ring-1 shadow-xl ring-gray-400/10 sm:w-[57rem]"
          />
        </div>
        <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          <div className="lg:pr-4">
            <div className="max-w-xl text-base/7 text-gray-700 lg:max-w-lg">
              <dl className="mt-2 max-w-xl space-y-12 text-base/10 text-gray-600 lg:max-w-none">
                {features.map((feature, index) => (
                  <div key={feature.name} className="relative pl-16">
                    <dt className="inline">
                      <feature.icon 
                        className="absolute left-0 top-1 h-10 w-10 text-indigo-600" 
                        aria-hidden="true" 
                      />
                      <span className="text-2xl font-bold text-gray-900 block mb-2">
                        {feature.name}
                      </span>
                    </dt>
                    <dd className="inline text-base text-gray-600">{feature.description}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-10 flex items-center gap-x-6">
                <a
                  href="/info_adoptable_pet"
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Search Adoptable Pets
                </a>
                <a
                  href="/info"
                  className="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600"
                >
                  Learn More <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}