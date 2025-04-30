'use client';

import React, { useEffect } from 'react';
import { ClipboardCopy } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github.css';

export default function MarkdownRenderer({ content }: { content: string }) {
  useEffect(() => {
    const codeBlocks = document.querySelectorAll('pre code');

    codeBlocks.forEach((block) => {
      const parent = block.parentElement;
      if (!parent) return;

      // Avoid adding multiple buttons
      if (parent.querySelector('.copy-btn')) return;

      const button = document.createElement('button');
      button.textContent = '📝Copy';
      button.className =
        'copy-btn absolute top-2 right-2 text-xs px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity';

      button.onclick = async () => {
        await navigator.clipboard.writeText(block.textContent || '');
        button.textContent = '✅ Copied!';
        setTimeout(() => {
          button.textContent = '📝Copy';
        }, 2000);
      };

      parent.classList.add('relative', 'group', 'p-4', 'bg-white', 'rounded-lg');
      parent.appendChild(button);
    });
  }, [content]);

  return (
    <div className="prose max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeHighlight]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
