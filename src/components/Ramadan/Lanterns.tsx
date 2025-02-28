"use client"
import Image from "next/image";
import { useMemo } from "react";
import "./ramadan_styles.css";

const LanternString = () => {
    const lanternCount = 12;
    const lanterns = Array.from({ length: lanternCount });
    return (
        <div className={"lanternString"}> 
            {lanterns.map((_, index) => ( // .map() is to loop through our lanterns array
                <Image
                    key={index}
                    src="/images/lantern.png"
                    alt="Lantern"
                    width={40}
                    height={80}
                    className={"lantern"}
                    style={{ animationDelay: `${index * 0.2}s` }} // Staggered animation
                />
            ))}
        </div>
    );
};

export default LanternString;