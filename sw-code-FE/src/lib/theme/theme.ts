import {Theme} from "@/lib/theme/theme.type.ts";

export const themes: Theme[] = [
    {
        value: "light",
        label: "Light",
        prismTheme: "prism.css",
        editorBg: "bg-white",
        editorText: "text-gray-800",
        themeHeader: {
            headerBackground: 'bg-gray-800',
            labelColor: 'text-gray-50',
        }
    },
    {
        value: "dark",
        label: "Dark",
        prismTheme: "prism-tomorrow.css",
        editorBg: "bg-gray-900",
        editorText: "text-gray-100",
        themeHeader: {
            headerBackground: 'bg-gray-50',
            labelColor: 'text-black',
        }
    },
    {
        value: "cutemiya",
        label: "cutemiya",
        prismTheme: "prism.css",
        editorBg: "bg-[#002b36]",
        editorText: "text-[#93a1a1]",
        themeHeader: {
            headerBackground: 'bg-pink-50',
            labelColor: 'text-gray-800',
        }
    }
];
