import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateShareId(): string {
  return Math.random().toString(36).substring(2, 10)
}

export function detectLanguage(code: string): string {
  if (code.includes('import React') || code.includes('from "react"') || code.includes("from 'react'")) {
    return 'jsx'
  }
  if (code.includes('interface ') || code.includes(': string') || code.includes(': number')) {
    return 'typescript'
  }
  if (code.includes('def ') || code.includes('import ') && code.includes(':')) {
    return 'python'
  }
  if (code.includes('func ') || code.includes('package ')) {
    return 'go'
  }
  if (code.includes('fn ') || code.includes('let mut ')) {
    return 'rust'
  }
  if (code.includes('<?php') || code.includes('function ') && code.includes('$')) {
    return 'php'
  }
  if (code.includes('public class ') || code.includes('private ') || code.includes('void ')) {
    return 'java'
  }
  if (code.includes('function') || code.includes('const ') || code.includes('let ') || code.includes('var ')) {
    return 'javascript'
  }
  return 'plaintext'
}

export function truncateCode(code: string, maxLines: number = 100): string {
  const lines = code.split('\n')
  if (lines.length <= maxLines) return code
  return lines.slice(0, maxLines).join('\n') + `\n\n// ... truncated (${lines.length - maxLines} more lines)`
}
