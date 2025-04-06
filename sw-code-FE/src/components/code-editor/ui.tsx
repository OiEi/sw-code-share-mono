import { useCallback, useEffect, useState } from 'react';

import { PageSettings } from '@/components/toolbar/page-settings.ts';
import { Theme } from '@/lib/theme/theme.type.ts';

import Prism from 'prismjs';

import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';

import 'prismjs/themes/prism.css';
import 'prismjs/themes/prism-tomorrow.css';

import 'prismjs/components/prism-go';
import 'prismjs/components/prism-csharp';

import '@/lib/theme/index.css';

import Editor from 'react-simple-code-editor';
import { usePageContext } from '@/lib/hooks/useContext.ts';

export const CodeEditor = () => {
  const ctx = usePageContext();

  const handleValueChange = (code) => {
    ctx.sendText(code);
    ctx.setRawText(code);
  };

  const handleHighlightCode = (code: string) => {
    switch (ctx.pageSettings.language) {
    case 'go':
      return Prism.highlight(code, Prism.languages.go, 'go');
    case 'csharp':
      return Prism.highlight(code, Prism.languages.csharp, 'csharp');
    case 'javascript':
    default:
      return Prism.highlight(code, Prism.languages.javascript, 'javascript');
    }
  };

  const renderLineNumbers = () => {
    const lines = ctx.rawText.split('\n');
    const padding = lines > 100 ? '2px' : lines > 10 ? '6px' : '10px';
    return (
      <div
        className={`${ctx.theme.editorBg} ${ctx.theme.editorText} prism-${ctx.theme.value}`}
        style={{
          position: 'absolute',
          left: '0.1rem',
          top: '10px',
          bottom: '0.1rem',
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: Number(ctx.pageSettings.font),
          lineHeight: '1.5',
          color: '#999',
          userSelect: 'none',
          textAlign: 'right',
          paddingRight: padding / 2,
          borderRight: '1px solid #ddd',
          paddingLeft: padding * 2,
          backgroundColor: ctx.theme.editorBg,
          borderBottomLeftRadius: '2rem',
          borderBottomRightRadius: '2rem'
        }}
      >
        {lines.map((_, i) => (
          <div
            key={i}>{i + 1}</div>
        ))}
      </div>
    );
  };

  const [textPadding, setTextPadding] = useState('0.75rem');

  // пиздак, костыль но поебать
  useEffect(() => {
    const lineCount = ctx.rawText.split('\n').length;

    if (ctx.pageSettings.font == '18') {
      if (lineCount > 100) {
        setTextPadding('2.1rem');
      } else if (lineCount > 10 && lineCount < 100) {
        setTextPadding('1.5rem');
      }
      else {
        setTextPadding('1rem');
      }
    }

    if (ctx.pageSettings.font == '12') {
      if (lineCount > 100) {
        setTextPadding('1.5rem');
      } else {
        setTextPadding('1rem');
      }
    }

    if (ctx.pageSettings.font == '8') {
      if (lineCount > 100) {
        setTextPadding('1rem');
      } else {
        setTextPadding('0.75rem');
      }
    }

  }, [ctx.pageSettings, ctx.rawText]);

  return (
    <div style={{ position: 'relative' }} className={`${ctx.theme.editorBg} ${ctx.theme.editorText} prism-${ctx.theme.value} rounded-b-2xl`}>
      {renderLineNumbers()}
      <div style={{ paddingLeft: textPadding }} className={'rounded-b-2xl'}>
        <Editor
          className={`min-h-[calc(100vh-8rem)] ${ctx.theme.editorBg} ${ctx.theme.editorText} prism-${ctx.theme.value}`}
          value={ctx.rawText}
          onValueChange={handleValueChange}
          highlight={handleHighlightCode}
          padding={10}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: Number(ctx.pageSettings.font),
            backgroundColor: ctx.theme.editorBg,
            color: ctx.theme.editorText,
            borderBottomLeftRadius: '2rem',
            borderBottomRightRadius: '2rem',
          }}
          textareaClassName='focus:outline-none focus:ring-0 border-0'
          preClassName='border-0 focus:outline-none'
        />
      </div>
    </div>
  );
};

