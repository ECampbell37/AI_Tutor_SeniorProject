/************************************************************
 * Name:    Elijah Campbell‑Ihim
 * Project: AI Tutor
 * Class:   CMPS-450 Senior Project
 * Date:    May 2025
 * File:    /app/components/MarkdownRender.tsx
 ************************************************************/

'use client';

import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github.css';

export default function MarkdownRenderer({ content }: { content: string }) {

  //Check to see if the Markdown contains code
  useEffect(() => {
    //Separate code from rest of markdown
    const codeBlocks = document.querySelectorAll('pre code');

    //Apply changes to every code block
    codeBlocks.forEach((block) => {
      const parent = block.parentElement;
      if (!parent) return;

      // Avoid adding multiple buttons
      if (parent.querySelector('.copy-btn')) return;

      //Copy Button
      const button = document.createElement('button');
      button.textContent = '📝Copy';
      button.className =
        'copy-btn absolute top-2 right-2 text-xs px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity';

      //Copy Button onClick
      button.onclick = async () => {
        await navigator.clipboard.writeText(block.textContent || '');
        button.textContent = '✅ Copied!';
        setTimeout(() => {
          button.textContent = '📝Copy';
        }, 2000);
      };

      //Add padding and copy button to markdown segment
      parent.classList.add('relative', 'group', 'p-4', 'bg-white', 'rounded-lg');
      parent.appendChild(button);
    });
  }, [content]);


  //Markdown Rendering
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
