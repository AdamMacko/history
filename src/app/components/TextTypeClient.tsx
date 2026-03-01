'use client';

import { TextType } from "./TextType";

export default function TextTypeClient() {
  return (
    <TextType
      className="
        text-1xl          
        sm:text-1xl 
        md:text-3xl 
        lg:text-3xl       
        font-bold        
        uppercase         
        tracking-tight 
        text-black
        font-['Betania_Patmos']
        drop-shadow-lg    
      "
      cursorClassName="text-amber-400/80"
      text={[
        "HISTORY ART & MUSIC CLUB 🎸",
        "Nekonečno zážitkov na jednom mieste!🌠",
      ]}
      deletingSpeed={40}     
      typingSpeed={60}       
      pauseDuration={2500}   
      cursorBlinkDuration={0.6}
      variableSpeed={{ min: 50, max: 110 }}
    />
  );
}