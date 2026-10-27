
"use client";

import { useEffect, useRef, useState } from "react";

type Rule = {
  intent: string;
  keywords: string[];
  reply: string;
};

type Message = {
  id: number;
  sender: "user" | "bot";
  text: string;
};

const chatbotRules: Rule[] = [];

function normalizeMessage(message: string): string {
  return message.toLowerCase().trim().replace(/\s+/g, " ");
}

function getBotReply(userMessage: string): string {
  const normalizedMessage = normalizeMessage(userMessage);

  const matchedRule = chatbotRules.find((rule) =>
    rule.keywords.some((keyword) =>
      normalizedMessage.includes(normalizeMessage(keyword))
    )
  );

  if (matchedRule) {
    return matchedRule.reply;
  }

  return "Sorry, I could not understand your question. Please ask about fees, admissions, university timings, the library, or hostels.";
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "bot",
      text: "Assalam-o-Alaikum! Welcome to UOS Helpdesk Bot. 👋 How can I help you today? You can ask me about fees, admissions, timings, the library, or hostels."
    }
  ]);

  const [input, setInput] = useState("");
  const [nextId, setNextId] = useState(2);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function handleSend() {
    const text = input.trim();

    if (!text || isTyping) return;

    const userMessage: Message = {
      id: nextId,
      sender: "user",
      text
    };

    const botMessage: Message = {
      id: nextId + 1,
      sender: "bot",
      text: getBotReply(text)
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
      botMessage
    ]);

    setInput("");
    setNextId((previous) => previous + 2);
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto flex h-[85vh] min-h-[520px] max-h-[850px] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">

        {/* Header */}
        <header className="flex items-center gap-4 bg-emerald-800 px-5 py-5 text-white sm:px-7">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15 text-2xl">
            🎓
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold sm:text-2xl">
              UOS Helpdesk Bot
            </h1>
            <p className="mt-1 text-sm text-emerald-100">
              University of Sargodha Student Support
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-emerald-100">
            <span className="h-2.5 w-2.5 rounded-full bg-green-300" />
            Online
          </div>
        </header>

        {/* Chat messages */}
        <section
          className="flex-1 space-y-5 overflow-y-auto bg-slate-50 p-4 sm:p-6"
          aria-label="Chat messages"
          aria-live="polite"
        >
          <div className="text-center">
            <span className="rounded-full bg-slate-200 px-3 py-1 text-xs text-slate-600">
              Student Helpdesk
            </span>
          </div>

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-end gap-2 ${
                message.sender === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              {message.sender === "bot" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm">
                  🎓
                </div>
              )}

              <div
                className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-6 sm:max-w-[75%] ${
                  message.sender === "user"
                    ? "rounded-br-sm bg-emerald-700 text-white"
                    : "rounded-bl-sm border border-slate-200 bg-white text-slate-700 shadow-sm"
                }`}
              >
                {message.text}
              </div>

              {message.sender === "user" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm">
                  👤
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="text-sm text-slate-500">
              Bot is typing...
            </div>
          )}

          <div ref={bottomRef} />
        </section>

        {/* Quick questions */}
        <div className="flex flex-wrap gap-2 border-t border-slate-100 bg-white px-4 pt-4 sm:px-6">
          {[
            "Fee structure",
            "Admission details",
            "University timings",
            "Library",
            "Hostel"
          ].map((question) => (
            <button
              key={question}
              type="button"
              onClick={() => {
                if (isTyping) return;

                const userMessage: Message = {
                  id: nextId,
                  sender: "user",
                  text: question
                };

                const botMessage: Message = {
                  id: nextId + 1,
                  sender: "bot",
                  text: getBotReply(question)
                };

                setMessages((previous) => [
                  ...previous,
                  userMessage,
                  botMessage
                ]);

                setNextId((previous) => previous + 2);
              }}
              className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800 transition hover:bg-emerald-100"
            >
              {question}
            </button>
          ))}
        </div>

        {/* Input area */}
        <form
          className="flex items-center gap-3 border-t border-slate-200 bg-white p-4 sm:p-6"
          onSubmit={(event) => {
            event.preventDefault();
            handleSend();
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your question here..."
            aria-label="Type your question"
            className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          />

          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send
          </button>
        </form>

        <footer className="bg-white pb-3 text-center text-xs text-slate-400">
          UOS Helpdesk Bot · Rule-based student support
        </footer>
      </div>
    </main>
  );
}
