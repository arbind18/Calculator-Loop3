'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, Loader2, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { MarkdownLite } from '@/components/ui/markdown-lite';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

import { detectLanguage } from '@/lib/ai/languageUtils';

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: null | (() => void);
  onresult: null | ((event: any) => void);
  onerror: null | ((event: any) => void);
  onend: null | (() => void);
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  }
}

export function ChatWindow({ isOpen, onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: (() => {
        const lang = detectLanguage(navigator.language || 'en');
        return lang === 'hi'
          ? "Namaste! Main Calculator Loop ka AI assistant hoon. Aap kisi bhi category (Finance, Health, Math, Education, Construction, Technology, etc.) ka calculator ya formula pooch sakte hain.\n\nExamples:\n- \"EMI formula\"\n- \"GST 18% on ₹5000\"\n- \"BMI weight 70kg height 175cm\""
          : "Hello! I'm your AI assistant for Calculator Loop. Ask about any category—finance, health, math, education, construction, technology, and more.\n\nExamples:\n- \"EMI formula\"\n- \"GST 18% on ₹5000\"\n- \"BMI weight 70kg height 175cm\"";
      })()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const requestMicrophonePermission = async (uiLang: 'hi' | 'en') => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      appendAssistantMessage(
        uiLang === 'hi'
          ? 'Is device/browser me microphone permission request available nahi hai. Chrome/Edge me try kijiye.'
          : 'Microphone permission request is not available on this device/browser. Try Chrome/Edge.'
      );
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop tracks immediately; we only want to trigger the permission prompt.
      stream.getTracks().forEach((t) => t.stop());
      return true;
    } catch (err: any) {
      const name: string | undefined = err?.name;
      const hint = (() => {
        switch (name) {
          case 'NotAllowedError':
          case 'SecurityError':
            return uiLang === 'hi'
              ? 'Mic permission allow nahi hua. Chrome me lock icon → Permissions → Microphone → Allow karke reload kijiye.'
              : 'Microphone permission was not allowed. In Chrome, tap the lock icon → Permissions → Microphone → Allow, then reload.';
          case 'NotFoundError':
            return uiLang === 'hi'
              ? 'Microphone device nahi mila. Phone ka mic check kijiye.'
              : 'No microphone device was found. Check your device mic.';
          case 'NotReadableError':
            return uiLang === 'hi'
              ? 'Mic kisi aur app me busy ho sakta hai. Dusre apps close karke dobara try kijiye.'
              : 'The mic may be busy/in use. Close other apps and try again.';
          default:
            return uiLang === 'hi'
              ? 'Mic permission request fail ho gayi. “Open in Chrome” karke try kijiye.'
              : 'Microphone permission request failed. Try opening in Chrome.';
        }
      })();

      appendAssistantMessage(
        uiLang === 'hi'
          ? `Mic permission nahi mil paayi${name ? ` (${name})` : ''}. ${hint}`
          : `Could not get microphone permission${name ? ` (${name})` : ''}. ${hint}`
      );
      return false;
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // If chat closes while listening, stop recognition.
    if (!isOpen && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      setIsListening(false);
    }
  }, [isOpen]);

  const appendAssistantMessage = (content: string) => {
    setMessages((prev) => [...prev, { role: 'assistant', content }]);
  };

  const toggleMic = async () => {
    if (isLoading) return;

    const uiLang = (navigator.language || 'en').toLowerCase().startsWith('hi') ? 'hi' : 'en';
    if (!window.isSecureContext) {
      appendAssistantMessage(
        uiLang === 'hi'
          ? 'Voice input ke liye HTTPS (ya localhost) zaroori hota hai. Aapki current site non-HTTPS par open hai, isliye mic start nahi hoga.'
          : 'Voice input usually requires HTTPS (or localhost). This page is not in a secure context, so the mic cannot start.'
      );
      return;
    }
    const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      appendAssistantMessage(
        uiLang === 'hi'
          ? 'Sorry, aapke browser me voice input (speech recognition) supported nahi hai. Chrome/Edge try kijiye.'
          : 'Sorry, voice input (speech recognition) is not supported in your browser. Try Chrome/Edge.'
      );
      return;
    }

    // Trigger the browser permission prompt first. Only start recognition after permission is granted.
    const allowed = await requestMicrophonePermission(uiLang);
    if (!allowed) return;

    // Stop if already listening
    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch {
        // ignore
      }
      setIsListening(false);
      return;
    }

    // Start listening
    const recognition = new SpeechRecognitionCtor();
    recognitionRef.current = recognition;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = uiLang === 'hi' ? 'hi-IN' : 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0]?.transcript ?? '';
      }
      const next = transcript.trim();
      if (next) setInput(next);
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);

      const code: string | undefined = event?.error;
      const hint = (() => {
        switch (code) {
          case 'not-allowed':
          case 'service-not-allowed':
            return uiLang === 'hi'
              ? 'Mic permission blocked hai. Chrome me address bar ke lock icon → Permissions → Microphone → Allow karke reload kijiye.'
              : 'Microphone permission is blocked. In Chrome, tap the lock icon → Permissions → Microphone → Allow, then reload.'
          case 'audio-capture':
            return uiLang === 'hi'
              ? 'Microphone available nahi lag raha. Phone ka mic (system) check kijiye aur “Speech Services by Google” update kijiye.'
              : 'No microphone was found. Check your device mic and update “Speech Services by Google”.'
          case 'no-speech':
            return uiLang === 'hi'
              ? 'Koi voice detect nahi hua. Dobara try kijiye aur phone ke mic ke bilkul paas boliye.'
              : 'No speech was detected. Try again and speak closer to the microphone.'
          case 'network':
            return uiLang === 'hi'
              ? 'Network error. Internet connection check karke dobara try kijiye.'
              : 'Network error. Check your internet connection and try again.'
          default:
            return uiLang === 'hi'
              ? 'Agar aap WhatsApp/Instagram ke in-app browser me open kar rahe hain, to “Open in Chrome” karke try kijiye.'
              : 'If you opened the site inside an in-app browser (WhatsApp/Instagram), try “Open in Chrome”.'
        }
      })();

      appendAssistantMessage(
        uiLang === 'hi'
          ? `Voice input me error aaya${code ? ` (${code})` : ''}. ${hint} Aap type karke bhi message bhej sakte hain.`
          : `Voice input hit an error${code ? ` (${code})` : ''}. ${hint} You can also type your message.`
      );
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch {
      setIsListening(false);
      appendAssistantMessage(
        uiLang === 'hi'
          ? 'Voice start nahi ho paaya. Agar aap mobile/IP URL se open kar rahe hain to HTTPS chahiye hota hai. Chrome/Edge + https:// ya localhost try kijiye.'
          : 'Could not start voice input. If you opened the site via an IP/mobile URL, HTTPS is often required. Try Chrome/Edge with https:// or localhost.'
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) throw new Error('Failed to fetch');

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-4 w-[350px] md:w-[400px] h-[500px] bg-background border rounded-lg shadow-xl flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
      {/* Header */}
      <div className="p-4 border-b bg-primary text-primary-foreground flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          <h3 className="font-semibold">AI Assistant</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-primary-foreground hover:bg-primary/90">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={cn(
              "flex w-full",
              msg.role === 'user' ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-lg p-3 text-sm shadow-sm",
                msg.role === 'user' 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-card text-card-foreground border"
              )}
            >
              {msg.role === 'assistant' ? (
                <MarkdownLite content={msg.content} />
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg p-3">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t bg-background">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about calculators..."
            className="flex-1 bg-background border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={toggleMic}
            disabled={isLoading}
            aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
            title={isListening ? 'Stop voice input' : 'Start voice input'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
          <Button type="submit" size="icon" disabled={isLoading}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
