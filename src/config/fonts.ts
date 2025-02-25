import { Inter, Montserrat_Alternates, Prata } from "next/font/google";


export const inter = Inter({ subsets: ["latin"] });

export const titleFont = Montserrat_Alternates({ 
    subsets: ["latin"],
    weight: ['500', '700'],
});

export const titlePrata = Prata({
    subsets: ["latin"],
    weight: '400',
});
