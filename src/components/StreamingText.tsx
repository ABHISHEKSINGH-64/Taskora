import { useEffect, useState } from "react";

export function StreamingText({ text, speed = 14 }: { text: string; speed?: number }) {
  const [out, setOut] = useState("");
  useEffect(() => {
    setOut("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return (
    <p className="text-[15px] leading-[1.75] text-[var(--foreground)]">
      {out}
      <span className="caret ml-[1px] inline-block h-[1em] w-[2px] translate-y-[2px] bg-[var(--accent)]" />
    </p>
  );
}
