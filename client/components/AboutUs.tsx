


  
  import React, { useState } from 'react';

const AboutUs = () => {
  const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

  const openFacultyModal = () => setIsFacultyModalOpen(true);
  const openTeamModal = () => setIsTeamModalOpen(true);
  const closeModals = () => {
    setIsFacultyModalOpen(false);
    setIsTeamModalOpen(false);
  };

  const facultyMembers = [
    { name: "Dr. Hemdut Joshi", designation: "President", image: "/images/faculty1.jpg", scale: 1, offsetY: 30 },
    { name: "Dr. Avinash Chandra", designation: "Vice President", image: "/images/faculty2.jpg", scale: 1.2, offsetY: 30 },
    { name: "Dr. Jyotsana", designation: "Vice President", image: "/images/faculty3.jpg", scale: 1, offsetY: 35 },
    { name: "Dr. Rohit singla", designation: "Vice President", image: "/images/faculty4.jpg", scale: 1.4, offsetY: 35 },
    { name: "Dr. Tarunpreet", designation: "Vice President", image: "/images/faculty5.jpg", scale: 1.3, offsetY: 20, offsetX: 12 },
    { name: "Dr. Vishal gupta", designation: "Vice President", image: "/images/faculty6.jpg", scale: 1.0, offsetY: 25 },
  ];

  const oscMembers = [
    { name: "Pranay Mathur", designation: "OSC Member", image: "/images/osc1.jpg", scale: 1.1, offsetY: 15 },
    { name: "Kshitiz Arora", designation: "OSC Member", image: "/images/osc2.jpg", scale: 1.1, offsetY: 15 },
  ];

  const coreMembers = [
    { name: "Awanti Prakash", designation: "Core Member", image: "/images/core1.jpg", scale: 1.4, offsetY: -28 },
    { name: "Nandini", designation: "Core Member", image: "/images/core2.jpg", scale: 1.8, offsetY: -50 },
    { name: "Anuj Srivastava", designation: "Core Member", image: "/images/core3.jpg", scale: 1.3, offsetY: 0 },
    { name: "Snehil Jhawar", designation: "Core Member", image: "/images/core4.jpg", scale: 1.1, offsetY: 20 },
    { name: "Vansh Nayak", designation: "Core Member", image: "/images/core5.jpg", scale: 1.49, offsetY: -10 },
    { name: "Vanshaj Kashyap", designation: "Core Member", image: "/images/core6.jpg", scale: 1.08, offsetY: 10 },
    { name: "Tabrez Khan", designation: "Core Member", image: "/images/core7.jpg", scale: 1.4, offsetY: -35 },
    { name: "Arnav Kakkar", designation: "Core Member", image: "/images/core8.png",scale: 0.8, offsetY: 20 },
    { name: "Jasneh Kaur", designation: "Core Member", image: "/images/core9.png", scale:0.88 , offsetY: 20 },
    { name: "Manan Sharma", designation: "Core Member", image: "/images/core10.jpg", scale:.8 , offsetY: 20 },
    { name: "Vanshaj Kaushik", designation: "Core Member", image: "/images/core11.jpg", scale:0.82 , offsetY: 20 },
    { name: "Pushp Bahukhandi", designation: "Core Member", image: "/images/core12.png", scale: 1.7 , offsetY: 0 },
    { name: "Garvita Bhatnagar", designation: "Core Member", image: "/images/core13.png", scale: 2, offsetY: -35 },
    { name: "Harshita Sinha", designation: "Core Member", image: "/images/core14.jpg", scale: 0.9, offsetY: 0 },
    { name: "Mehar Dua", designation: "Core Member", image: "/images/core15.jpg", scale: .9, offsetY: 20 },
    { name: "Mannat Bharadwaj", designation: "Core Member", image: "/images/core16.jpg", scale: 1-0.1, offsetY: 20 },
    { name: "Aditiya Thakur", designation: "Core Member", image: "/images/core17.jpg", scale: 1-0.1, offsetY: 20 },
  ];

  const mentorMembers = [
    { name: "Aanya Aggarwal", designation: "Mentor Member", image: "/images/mentor1.png", scale: 1.4, offsetY: 8 },
    { name: "Aarush Sahu", designation: "Mentor Member", image: "/images/mentor2.png", scale: 1.3, offsetY: 8 },
    { name: "Aarushi Gupta", designation: "Mentor Member", image: "/images/mentor3.png", scale: 1.4, offsetY: 8 },
    { name: "Agamjot Kaur", designation: "Mentor Member", image: "/images/mentor4.png", scale: 1.4, offsetY: 8 },
    { name: "Akshat Mahajan", designation: "Mentor Member", image: "/images/mentor25.png", scale: 1.4, offsetY: 8 },
        { name: "Akshat Walia", designation: "Mentor Member", image: "/images/mentor47.png", scale: 1.2, offsetY: 8 },

    { name: "Anjali", designation: "Mentor Member", image: "/images/mentor5.png", scale: 1., offsetY: 8 },
    { name: "Arpit Kumar", designation: "Mentor Member", image: "/images/mentor6.png", scale: 1.2, offsetY: 8 },
    { name: "Arunava Saha", designation: "Mentor Member", image: "/images/mentor8.png", scale: 1.4, offsetY: 8 },
    { name: "Aaryan Khurana", designation: "Mentor Member", image: "/images/mentor9.png", scale: 1.4, offsetY: 8 },
    { name: "Daksha Gulati", designation: "Mentor Member", image: "/images/mentor10.png", scale: 1.4, offsetY: 8 },
    { name: "Dhruv Gupta", designation: "Mentor Member", image: "/images/mentor11.png", scale: 1.2, offsetY: 8 },
    { name: "Disha Goyal", designation: "Mentor Member", image: "/images/mentor12.png", scale: 1.4, offsetY: 8 },
    { name: "Gyanvi Narayan", designation: "Mentor Member", image: "/images/mentor13.png", scale: 1.4, offsetY: -8 },
    { name: "Harnoor", designation: "Mentor Member", image: "/images/mentor14.png", scale: 1.4, offsetY: 28 },
    { name: "Inaayat Kaur", designation: "Mentor Member", image: "/images/mentor15.png", scale: 1.4, offsetY: 18 },
    { name: "Jaskaran Singh", designation: "Mentor Member", image: "/images/mentor16.png", scale: 1.4, offsetY: 28 },
    { name: "Jasmin Tyagi", designation: "Mentor Member", image: "/images/mentor17.png", scale: 1., offsetY: 8 },
    { name: "Jatin Garg", designation: "Mentor Member", image: "/images/mentor18.png", scale: 1.4, offsetY: 8 },
    { name: "Karanbir Singh", designation: "Mentor Member", image: "/images/mentor19.png", scale: 1.4, offsetY: 28 },
    { name: "Kayna Chadha", designation: "Mentor Member", image: "/images/mentor20.png", scale: 1.4, offsetY: -28 },
    { name: "Keshav Gupta", designation: "Mentor Member", image: "/images/mentor21.png", scale: 1.4, offsetY: 28 },
    { name: "Khusboo Gaur", designation: "Mentor Member", image: "/images/mentor22.png", scale: 1.4, offsetY: 18 },
    { name: "Komal Kakkar", designation: "Mentor Member", image: "/images/mentor23.png", scale: 1.4, offsetY: -28 },
    { name: "Kunal Thakur", designation: "Mentor Member", image: "/images/mentor23.png", scale: 1.4, offsetY: 28 },
    { name: "Lakshya Kaushik", designation: "Mentor Member", image: "/images/mentor24.png", scale: 1.4, offsetY: 28 },
    { name: "Moitrayan Nath", designation: "Mentor Member", image: "/images/mentor26.png", scale: 1.4, offsetY: 28 },
    { name: "Nishika Gupta", designation: "Mentor Member", image: "/images/mentor27.png", scale: 1.4, offsetY: 28 },
    { name: "Palak", designation: "Mentor Member", image: "/images/mentor28.png", scale: 1.4, offsetY: 8 },
        { name: "Piyush Wadhawa", designation: "Mentor Member", image: "/images/mentor29.png", scale: 1.4, offsetY: 28 },

        { name: "Prabal Gupta", designation: "Mentor Member", image: "/images/mentor30.png", scale: 1.4, offsetY: 28 },

    { name: "Prabnoor Singh Gill", designation: "Mentor Member", image: "/images/mentor31.png", scale: 1.4, offsetY: 8 },
    { name: "Pranav Mishra", designation: "Mentor Member", image: "/images/mentor32.png", scale: 1.4, offsetY: 28 },
    { name: "Pranjal", designation: "Mentor Member", image: "/images/mentor33.png", scale: 1.4, offsetY: 28 },
    { name: "Rishit Modi", designation: "Mentor Member", image: "/images/mentor34.png", scale: 1.4, offsetY: 28 },
    { name: "Ritagya Chitkara", designation: "Mentor Member", image: "/images/mentor35.png", scale: 1.4, offsetY: 28 },
    { name: "Sabhya Mahajan", designation: "Mentor Member", image: "/images/mentor36.png", scale: 1.4, offsetY: 28 },
    { name: "Sahil Sharma", designation: "Mentor Member", image: "/images/mentor37.png", scale: 1.4, offsetY: 28 },
    { name: "Samaira Aneja", designation: "Mentor Member", image: "/images/mentor38.png", scale: 1.4, offsetY: 28 },
    { name: "Saras Tewatia", designation: "Mentor Member", image: "/images/mentor39.png", scale: 1.4, offsetY: 28 },
    { name: "Shrdha Gupta", designation: "Mentor Member", image: "/images/mentor40.png", scale: 1.4, offsetY: 28 },
    { name: "Shubhr Gupta", designation: "Mentor Member", image: "/images/mentor41.png", scale: 1.4, offsetY: 28 },
    { name: "Shubreet Kaur", designation: "Mentor Member", image: "/images/menotr42.png", scale: 1.4, offsetY: 28 },
    { name: "Simran Sajnani", designation: "Mentor Member", image: "/images/mentor42.png", scale: 1.4, offsetY:28 },
    { name: "Sneha Bansal", designation: "Mentor Member", image: "/images/mentor43.png", scale: 1.4, offsetY: 28 },
    { name: "Utkarshani Mishra", designation: "Mentor Member", image: "/images/mentor44.png", scale: 1.4, offsetY: 8 },
    { name: "Vedant Gupta", designation: "Mentor Member", image: "/images/mentor45.png", scale: 1.4, offsetY: 28 },
    { name: "Vignesh Jain", designation: "Mentor Member", image: "/images/mentor46.png", scale: 1.4, offsetY:28 },
    { name: "Yasmit Vaish", designation: "Mentor Member", image: "/images/mentor48.png", scale: 1.4, offsetY:28 },
    { name: "Yaashaswee", designation: "Mentor Member", image: "/images/mentor49.png", scale: 1.4, offsetY: 28 },
  ];

  const renderMemberCard = (member: {name:string, designation:string, image:string, scale: number, offsetY: number}, index: number, prefix: string) => (
    <div key={`${prefix}-${index}`} className="w-full max-w-[200px] h-[300px] bg-white border-[4px] border-black rounded-[25px] shadow-lg flex flex-col">
      <div className="flex-1 p-2 flex items-center justify-center">
        <img
          src={member.image}
          alt={member.name}
          style={{
            transform: `scale(${member.scale || 1}) translate(0, ${member.offsetY || 0}px)`,
          }}
          className="max-h-[100%] max-w-full object-contain hover:scale-[1.1] overflow-y-hidden"
        />
      </div>
      <div className="bg-blue-200 text-center z-10 border-t-[4px] border-black">
        <span className="block text-sm font-bold text-black">{member.name}</span>
        <span className="block text-[12px] text-black">{member.designation}</span>
      </div>
    </div>
  );

  return (
    <div className="bg-transparent text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-[5vw] font-extrabold">FROSH'25</h1>
        </div>

        {/* Mission and Vision Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="h-[20vh] bg-cover border-l-4 border-blue-600 p-6 rounded-lg shadow-md bg-[url(/team2.jpg)]" >
          </div>
          <div className="h-[20vh] bg-cover border-l-4 border-blue-600 p-6 rounded-lg shadow-md bg-[url(/team_photo.jpeg)]">
          </div>
        </div>

        {/* Buttons Section */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <button
            onClick={openFacultyModal}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-300"
          >
            Faculty
          </button>
          <button
            onClick={openTeamModal}
            className="px-8 py-3 bg-blue-100 text-blue-800 font-semibold rounded-full shadow-lg hover:bg-blue-200 transition-colors duration-300"
          >
            Team
          </button>
        </div>

        {/* Our Story Section */}
        <div className="text-center">
          <h3 className="text-3xl font-bold text-blue-700 mb-4">Our Story</h3>
          <p className="text-gray-300 leading-relaxed max-w-2xl mx-auto">
            Frosh is the official Admissions Cell of Thapar Institute dedicated to making the first-year experience unforgettable. We host events, guide freshers, and foster a welcoming campus environment.
          </p>
        </div>
      </div>

      {/* Faculty Modal */}
      {isFacultyModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-slate-900 p-8 rounded-xl max-w-6xl w-full overflow-y-auto max-h-[80vh] relative">
            <button onClick={closeModals} className="absolute top-4 right-4 text-white text-2xl">✕</button>
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Faculty</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 justify-items-center">
              {facultyMembers.map((member, index) => renderMemberCard(member, index, 'faculty'))}
            </div>
          </div>
        </div>
      )}

      {/* Team Modal */}
      {isTeamModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-slate-900 p-8 rounded-xl max-w-6xl w-full overflow-y-auto max-h-[80vh] relative">
            <button onClick={closeModals} className="absolute top-4 right-4 text-white md:text-[2vw] text-[4.5vw]">✕</button>
            <h2 className="md:text-[3vw] text-[5vw] font-bold text-white mb-6 text-center">Our Team</h2>
            <h4 className="md:text-[2vw] text-[4.5vw] font-semibold text-white mb-4 text-center">OSC</h4>
            <div className="flex flex-wrap justify-center gap-6">
              {oscMembers.map((member, index) => renderMemberCard(member, index, 'osc'))}
            </div>
            <h4 className="md:text-[2vw] text-[4.5vw] font-semibold text-white my-6 text-center">Core</h4>
            <div className="flex flex-wrap justify-center gap-6">
              {coreMembers.map((member, index) => renderMemberCard(member, index, 'core'))}
            </div>
            <h4 className="md:text-[2vw] text-[4.5vw] font-semibold text-white my-6 text-center">Mentors</h4>
            <div className="flex flex-wrap justify-center gap-6">
              {mentorMembers.map((member, index) => renderMemberCard(member, index, 'core'))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutUs;
