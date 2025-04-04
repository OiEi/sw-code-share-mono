import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface CodeBlockProps {
    code: string;
    language?: string;
}

export const CodeBlock = ({ code, language = 'go' }: CodeBlockProps) => {
    return (
        <SyntaxHighlighter
            language={language}
            style={tomorrow}
            showLineNumbers={true}
            wrapLines={true}
            customStyle={{
                backgroundColor: '#f5f5f5',
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