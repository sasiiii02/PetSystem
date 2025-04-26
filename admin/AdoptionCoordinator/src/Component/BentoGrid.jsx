import image1 from '../assets/Adoption2.jpeg'
import image2 from '../assets/Adoption3.jpeg'
import image3 from '../assets/Adoption4.jpeg'
import image4 from '../assets/Adoption5.jpeg'
import { PawPrint, Shield, Heart } from 'lucide-react'
export default function Grid() {
  return (
    <div className="bg-gradient-to-br from-[#FFF5E6] to-[#F5EFEA] py-24 sm:py-32">
      <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-center text-xl font-semibold text-[#B3704D]">Adopt Your Perfect Companion</h2>
        <h1 className="mx-auto mt-2 max-w-lg text-center text-5xl font-extrabold text-gray-900 leading-tight">
          Your Journey to 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D08860] to-[#B3704D]"> Pet Adoption</span>
        </h1>
        <div className="mt-16 grid gap-6 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
          {[
            {
              icon: PawPrint,
              title: "Research & Preparation",
              description: "Learn about different pet types, your lifestyle compatibility, and prepare your home for a new furry friend.",
              image: image1
            },
            {
              icon: Shield,
              title: "Find Your Match",
              description: "Visit shelters, meet potential pets, and interact with animals to find the perfect companion for your family.",
              image: image2
            },
            {
              icon: Heart,
              title: "Application & Interview",
              description: "Complete adoption paperwork, undergo a shelter interview, and demonstrate your ability to provide a loving home.",
              image: image3
            },
            {
              icon: PawPrint,
              title: "Bringing Your Pet Home",
              description: "Finalize adoption, prepare your home, and start the exciting journey of bonding with your new family member.",
              image: image4
            }
          ].map((step, index) => (
            <div 
              key={index} 
              className={`relative ${
                index === 0 ? 'lg:row-span-2' : 
                index === 3 ? 'lg:row-span-2' : 
                'max-lg:row-start-1'
              } ${
                index === 2 ? 'max-lg:row-start-3 lg:col-start-2 lg:row-start-2' : ''
              }`}
            >
              <div className="absolute inset-px rounded-2xl bg-white/80 shadow-sm"></div>
              <div className="relative flex h-full flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-xl">
                <div className="px-8 pt-8 pb-4 sm:px-10 sm:pt-10">
                  <p className="text-xl font-bold text-[#B3704D] max-lg:text-center">
                    {step.title}
                  </p>
                  <p className="mt-3 max-w-lg text-base text-gray-700 leading-relaxed max-lg:text-center">
                    {step.description}
                  </p>
                </div>
                <div className="relative w-full grow">
                  <div className="h-full overflow-hidden">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}