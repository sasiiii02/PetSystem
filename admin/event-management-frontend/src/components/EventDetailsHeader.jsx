import React from 'react';

const EventDetailsHeader = ({ event }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg">
      <div className="relative">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-96 object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
          <h2 className="text-4xl font-extrabold text-white drop-shadow-lg">{event.title}</h2>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center space-x-6 mb-4">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#D08860]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-lg font-semibold text-gray-700">{event.date}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#D08860]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-lg font-semibold text-gray-700">{event.time}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#D08860]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-lg text-gray-700 font-medium">{event.location}</p>
        </div>
        
        <p className="text-gray-800 text-base leading-relaxed bg-gray-50 p-4 rounded-lg border-l-4 border-[#D08860]">
          {event.description}
        </p>
      </div>
    </div>
  );
};

export default EventDetailsHeader;