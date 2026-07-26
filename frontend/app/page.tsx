"use client";
import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import ChatBot from "../components/ChatBot";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#2B1108] text-white">
      <Navbar />
      
      {/* HERO SECTION WITH LOCAL VIDEO */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline 
            className="absolute w-full h-full object-cover"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          <div className="absolute inset-0 bg-black/40 z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#2B1108] z-20" />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative z-30 text-center px-4"
        >
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-[#E8D7A5] uppercase tracking-[0.3em] text-sm mb-4 block font-light"
          >
            Pure Goodness for All
          </motion.span>
          <h1 className="text-6xl md:text-9xl serif-heading mb-8 text-[#E8D7A5] leading-tight">
            Crafted in <br/> <span className="italic">Wales</span>
          </h1>
          <div className="flex gap-6 justify-center items-center">
            <button className="group relative px-8 py-3 rounded-full font-semibold overflow-hidden transition-all">
              <div className="absolute inset-0 bg-[#E8D7A5] transition-transform group-hover:scale-105" />
              <span className="relative z-10 text-[#2B1108]">Explore Products</span>
            </button>
            <button className="px-8 py-3 rounded-full font-semibold border border-[#E8D7A5] text-[#E8D7A5] hover:bg-[#E8D7A5]/10 transition-all">
              Our Story
            </button>
          </div>
        </motion.div>
      </section>

      {/* ADD OTHER SECTIONS HERE (Features, Products, etc.) */}

      <ChatBot />
    </main>
  );
}