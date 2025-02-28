// import { createContext, useContext, useState, ReactNode } from "react"; //create and use cont. creates global context and allows 
// // components to access context, usestate stores ramadan mode state true or false. react node for children components
// import React from "react";

// interface RamadanContextProps { // interface is for type safety
//     isRamadan: boolean; //Stores if Ramadan mode is active
//     setIsRamadan: (value: boolean) => void;//Function to toggle mode
// }

// const RamadanContext = createContext<RamadanContextProps | undefined>(undefined); // create context with undefined as default value

// export const RamadanProvider = ({ children }: { children: ReactNode }) => { //Create the provider component that wraps the app
//     const [isRamadan, setIsRamadan] = useState<boolean>(true);
//     return (
//         <RamadanContext.Provider value={{ isRamadan, setIsRamadan }}>
//             {children}
//         </RamadanContext.Provider>
//     );
// };

// // Create a custom hook to access Ramadan mode anywhere in the app
// export const useRamadan = (): RamadanContextProps => {
//     const context = useContext(RamadanContext);
//     if (!context) throw new Error("useRamadan must be used within a RamadanProvider");
//     return context;
// };

// // Export context (optional, in case direct access is needed)
// export { RamadanContext };