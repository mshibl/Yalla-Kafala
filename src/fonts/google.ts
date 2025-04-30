import { 
    Merriweather,
    Lora, 
    Nunito_Sans,
    Quicksand,
    Bebas_Neue,
    Josefin_Sans 
  } from 'next/font/google'
  
  export const merriweather = Merriweather({
    subsets: ['latin'],
    weight: ['300', '400', '700', '900'],
    display: 'swap',
  })
  
  export const lora = Lora({
    subsets: ['latin'],
    display: 'swap',
  })
  
  export const nunitoSans = Nunito_Sans({
    subsets: ['latin'],
    display: 'swap',
  })
  
  export const quicksand = Quicksand({
    subsets: ['latin'],
    display: 'swap',
  })
  
  export const bebasNeue = Bebas_Neue({
    weight: '400',
    subsets: ['latin'],
    display: 'swap',
  })
  
  export const josefinSans = Josefin_Sans({
    subsets: ['latin'],
    display: 'swap',
  })