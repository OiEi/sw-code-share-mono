import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface CodeBlockProps {
    code: string;
    language?: string;
}

export const CodeBlock = ({ code, language = 'go' }: CodeBlockProps) => {
    return (
        <SyntaxHighlighter
            language={language}
            style={dracula}
            showLineNumbers={true}
            wrapLines={true}
            customStyle={{
                borderRadius: '8px',
                padding: '16px',
                fontSize: '14px',
                lineHeight: '1.5',
            }}
        >
            {code}
        </SyntaxHighlighter>
    );
};