"use client";

import { useEffect, useMemo, useState } from "react";

type Rune = { letter: string; glyph: string; name: string };
type HistoryEntry = { id: number; letters: string[]; translation: string; time: string };

const RUNES: Rune[] = [
  { letter: "A", glyph: "ᚨ", name: "Ansuz" }, { letter: "B", glyph: "ᛒ", name: "Berkano" },
  { letter: "C", glyph: "ᚲ", name: "Cen" }, { letter: "D", glyph: "ᛞ", name: "Dagaz" },
  { letter: "E", glyph: "ᛖ", name: "Ehwaz" }, { letter: "F", glyph: "ᚠ", name: "Fehu" },
  { letter: "G", glyph: "ᚷ", name: "Gebo" }, { letter: "H", glyph: "ᚺ", name: "Hagalaz" },
  { letter: "I", glyph: "ᛁ", name: "Isa" }, { letter: "J", glyph: "ᛃ", name: "Jera" },
  { letter: "K", glyph: "ᚴ", name: "Kaun" }, { letter: "L", glyph: "ᛚ", name: "Laguz" },
  { letter: "M", glyph: "ᛗ", name: "Mannaz" }, { letter: "N", glyph: "ᚾ", name: "Nauthiz" },
  { letter: "O", glyph: "ᛟ", name: "Othala" }, { letter: "P", glyph: "ᛈ", name: "Perthro" },
  { letter: "Q", glyph: "ᛩ", name: "Qairtra" }, { letter: "R", glyph: "ᚱ", name: "Raidho" },
  { letter: "S", glyph: "ᛊ", name: "Sowilo" }, { letter: "T", glyph: "ᛏ", name: "Tiwaz" },
  { letter: "U", glyph: "ᚢ", name: "Uruz" }, { letter: "V", glyph: "ᚡ", name: "Veld" },
  { letter: "W", glyph: "ᚹ", name: "Wunjo" }, { letter: "X", glyph: "ᛪ", name: "Xal" },
  { letter: "Y", glyph: "ᛦ", name: "Yr" }, { letter: "Z", glyph: "ᛉ", name: "Algiz" },
];

const NUMERALS: Rune[] = [
  { letter: "0", glyph: "0", name: "Zero" }, { letter: "1", glyph: "1", name: "One" },
  { letter: "2", glyph: "2", name: "Two" }, { letter: "3", glyph: "3", name: "Three" },
  { letter: "4", glyph: "4", name: "Four" }, { letter: "5", glyph: "5", name: "Five" },
  { letter: "6", glyph: "6", name: "Six" }, { letter: "7", glyph: "7", name: "Seven" },
  { letter: "8", glyph: "8", name: "Eight" }, { letter: "9", glyph: "9", name: "Nine" },
];

const SYMBOLS = [...RUNES, ...NUMERALS];

const SAMPLE_HISTORY: HistoryEntry[] = [
  { id: 1, letters: ["N", "O", "R", "T", "H"], translation: "NORTH", time: "JUST NOW" },
  { id: 2, letters: ["W", "I", "S", "D", "O", "M"], translation: "WISDOM", time: "12 MIN AGO" },
  { id: 3, letters: ["F", "I", "R", "E"], translation: "FIRE", time: "YESTERDAY" },
];

function RuneImage({ rune, compact = false }: { rune: Rune; compact?: boolean }) {
  const [missing, setMissing] = useState(false);
  return (
    <span className={`rune-visual${compact ? " rune-visual--compact" : ""}`} aria-hidden="true">
      <span className="rune-fallback">{rune.glyph}</span>
      {!missing && <img src={`/runes/rune_${rune.letter.toLowerCase()}.png`} alt="" onError={() => setMissing(true)} />}
    </span>
  );
}

export default function Home() {
  const [sequence, setSequence] = useState<string[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>(SAMPLE_HISTORY);
  const [copied, setCopied] = useState(false);
  const translation = sequence.join("");
  const runeMap = useMemo(() => new Map(SYMBOLS.map((rune) => [rune.letter, rune])), []);

  useEffect(() => {
    const saved = window.localStorage.getItem("rune-atelier-history");
    if (!saved) return;
    try { setHistory(JSON.parse(saved)); }
    catch { window.localStorage.removeItem("rune-atelier-history"); }
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      const target = event.target as HTMLElement;
      if (["INPUT", "TEXTAREA"].includes(target.tagName)) return;
      if (/^[a-zA-Z0-9]$/.test(event.key)) setSequence((current) => [...current, event.key.toUpperCase()]);
      else if (event.key === "Backspace") { event.preventDefault(); setSequence((current) => current.slice(0, -1)); }
      else if (event.key === "Escape") setSequence([]);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const addRune = (letter: string) => { setSequence((current) => [...current, letter]); setCopied(false); };
  const saveTranslation = () => {
    if (!translation) return;
    const entry: HistoryEntry = { id: Date.now(), letters: [...sequence], translation, time: "JUST NOW" };
    const next = [entry, ...history].slice(0, 8);
    setHistory(next);
    window.localStorage.setItem("rune-atelier-history", JSON.stringify(next));
  };
  const clearHistory = () => { setHistory([]); window.localStorage.setItem("rune-atelier-history", "[]"); };
  const copyTranslation = async () => {
    if (!translation) return;
    await navigator.clipboard.writeText(translation);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Rune Atelier home">
          <span className="brand-mark"><span>ᚱ</span></span>
          <span className="brand-copy"><strong>RUNE ATELIER</strong><small>ANCIENT MARKS · MODERN VOICE</small></span>
        </a>
        <div className="topbar-note"><i /> ENGLISH TRANSLATOR <span>EST. MMXXIV</span></div>
      </header>

      <section className="hero" id="top">
        <div><p className="eyebrow"><span>01</span> THE TRANSLATOR</p><h1>Give ancient marks<br />a <em>modern voice.</em></h1></div>
        <p className="hero-intro">Select the runes below and reveal their English meaning. A quiet bridge between the old world and ours.</p>
      </section>

      <div className="workspace">
        <div className="left-column">
          <section className="translator-panel" aria-labelledby="translator-title">
            <div className="section-heading section-heading--light">
              <div><span>01</span><h2 id="translator-title">TRANSLATION DESK</h2></div><p>CLICK RUNES OR USE YOUR KEYBOARD</p>
            </div>
            <div className="translation-grid">
              <div className="sequence-area">
                <div className="field-label"><span>RUNE SEQUENCE</span><span>{sequence.length.toString().padStart(2, "0")} MARKS</span></div>
                <div className={`sequence-display${sequence.length ? " has-runes" : ""}`}>
                  {sequence.length ? sequence.map((letter, index) => {
                    const rune = runeMap.get(letter)!;
                    return <button key={`${letter}-${index}`} className="sequence-rune" onClick={() => setSequence((current) => current.filter((_, i) => i !== index))} aria-label={`Remove ${rune.name} rune`}><RuneImage rune={rune} /></button>;
                  }) : <p><strong>Your runes will appear here</strong><span>Choose a mark from the alphabet below</span></p>}
                </div>
                <div className="sequence-actions">
                  <button className="text-button" onClick={() => setSequence((current) => current.slice(0, -1))} disabled={!sequence.length}>← REMOVE LAST</button>
                  <button className="text-button" onClick={() => setSequence([])} disabled={!sequence.length}>CLEAR ALL</button>
                </div>
              </div>
              <div className="result-area">
                <div className="field-label"><span>ENGLISH TRANSLATION</span><span>LIVE</span></div>
                <div className="result-word" aria-live="polite">{translation || <span className="result-placeholder">—</span>}</div>
                <div className="result-actions">
                  <button className="copy-button" onClick={copyTranslation} disabled={!translation}>{copied ? "COPIED" : "COPY"}</button>
                  <button className="translate-button" onClick={saveTranslation} disabled={!translation}>SAVE TRANSLATION <span>↗</span></button>
                </div>
              </div>
            </div>
          </section>

          <section className="alphabet-panel" aria-labelledby="alphabet-title">
            <div className="section-heading"><div><span>02</span><h2 id="alphabet-title">RUNIC ALPHABET</h2></div><p>SELECT A MARK TO BEGIN</p></div>
            <div className="alphabet-grid">
              {RUNES.map((rune) => <button key={rune.letter} className="rune-card" onClick={() => addRune(rune.letter)} aria-label={`Add ${rune.name}, letter ${rune.letter}`}><span className="rune-letter">{rune.letter}</span><RuneImage rune={rune} /><span className="rune-name">{rune.name}</span></button>)}
            </div>
            <div className="numerals-heading">
              <div><span>02.1</span><h3>RUNIC NUMERALS</h3></div><p>ZERO THROUGH NINE</p>
            </div>
            <div className="alphabet-grid numeral-grid">
              {NUMERALS.map((rune) => <button key={rune.letter} className="rune-card" onClick={() => addRune(rune.letter)} aria-label={`Add ${rune.name}, number ${rune.letter}`}><span className="rune-letter">{rune.letter}</span><RuneImage rune={rune} /><span className="rune-name">{rune.name}</span></button>)}
            </div>
            <div className="alphabet-note"><span>+</span> Artwork loads automatically from <code>/public/runes/rune_a.png</code>–<code>rune_z.png</code> and <code>rune_0.png</code>–<code>rune_9.png</code>.</div>
          </section>
        </div>

        <aside className="history-panel" aria-labelledby="history-title">
          <div className="section-heading history-heading"><div><span>03</span><h2 id="history-title">ARCHIVE</h2></div><p>RECENT TRANSLATIONS</p></div>
          <div className="history-list">
            {history.length ? history.map((entry, index) => (
              <article className="history-item" key={entry.id}>
                <div className="history-meta"><span>{String(index + 1).padStart(2, "0")}</span><time>{entry.time}</time></div>
                <div className="history-runes" aria-hidden="true">{entry.letters.slice(0, 9).map((letter, runeIndex) => { const rune = runeMap.get(letter); return rune ? <RuneImage key={`${letter}-${runeIndex}`} rune={rune} compact /> : null; })}</div>
                <h3>{entry.translation}</h3><button onClick={() => setSequence(entry.letters)} aria-label={`Load ${entry.translation}`}>OPEN <span>↗</span></button>
              </article>
            )) : <div className="empty-history"><span>ᛟ</span><p>Your saved translations will gather here.</p></div>}
          </div>
          <div className="archive-footer"><button onClick={clearHistory} disabled={!history.length}>CLEAR ARCHIVE</button><p>STORED PRIVATELY<br />ON THIS DEVICE</p></div>
        </aside>
      </div>
      <footer><p>RUNE ATELIER <span>© 2026</span></p><p>CRAFTED FOR QUIET DISCOVERY</p></footer>
    </main>
  );
}
