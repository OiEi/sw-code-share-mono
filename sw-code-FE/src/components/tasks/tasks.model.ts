type CodeSlice = {
    color: string;
    grade: string;
    text: string;
    solution: string;
}

type LanguageCategory = {
    [theme: string]: CodeSlice[];
}

type Tasks = {
    [language: string]: LanguageCategory;
}

export type { Tasks }