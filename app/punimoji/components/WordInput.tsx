"use client";

const MAX_LEN = 5;
const EMOJI_REGEX =
  /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{200D}\u{20E3}]/gu;

export default function WordInput({
  word,
  onChange,
}: {
  word: string;
  onChange: (v: string) => void;
}) {
  const remaining = MAX_LEN - word.length;

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 320 }}>
      <input
        className="input-puni"
        type="text"
        value={word}
        onChange={(e) => {
          const cleaned = e.target.value.replace(EMOJI_REGEX, "");
          if (cleaned.length <= MAX_LEN) {
            onChange(cleaned);
          }
        }}
        placeholder="ぷに"
        maxLength={MAX_LEN}
      />
      <p
        style={{
          textAlign: "center",
          fontSize: 12,
          color: remaining === 0 ? "#FF3B8E" : "#8B7A9A",
          marginTop: 8,
          fontWeight: 500,
        }}
      >
        あと {remaining} 文字
      </p>
    </div>
  );
}
