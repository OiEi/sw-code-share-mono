interface ThemeHeader {
    headerBackground: string;
    labelColor: string;
}

export interface Theme {
    value: string;
    label: string;
    prismTheme: string;
    editorBg: string;
    editorText: string;
    themeHeader: ThemeHeader;
}
