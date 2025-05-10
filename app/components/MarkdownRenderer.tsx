/************************************************************
 * Name:    Elijah Campbell‑Ihim
 * Project: AI Tutor
 * Class:   CMPS-450 Senior Project
 * Date:    May 2025
 * File:    /app/components/MarkdownRender.tsx
 ************************************************************/


/**
 * MarkdownRenderer Component – Renders Markdown content with:
 * - LaTeX math support via KaTeX
 * - Syntax highlighting via highlight.js
 * - Dynamic "Copy" buttons on code blocks
 */



'use client';

import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';

// KaTeX and Highlight.js styles
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github.css';



/**
 * Renders Markdown with math and code formatting.
 * Automatically enhances code blocks with a copy-to-clipboard button.
 *
 * @param content - Markdown string to render
 */
export default function MarkdownRenderer({ content }: { content: string }) {

  //Check to see if the Markdown contains code
  useEffect(() => {
    //Separate code from rest of markdown
    const codeBlocks = document.querySelectorAll('pre code');

    //Apply changes to every code block
    codeBlocks.forEach((block) => {
      const parent = block.parentElement;
      if (!parent) return;

      // Prevent duplicate copy buttons
      if (parent.querySelector('.copy-btn')) return;

      // Create copy button
      const button = document.createElement('button');
      button.textContent = '📝Copy';
      button.className =
        'copy-btn absolute top-2 right-2 text-xs px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity';

      // Copy code content to clipboard
      button.onclick = async () => {
        await navigator.clipboard.writeText(block.textContent || '');
        button.textContent = '✅ Copied!';
        setTimeout(() => {
          button.textContent = '📝Copy';
        }, 2000);
      };

      // Add styling and copy button to code block
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
