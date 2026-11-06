import { useState } from "react";

type PasswordInputProps = {
  value: string;
  onChange: (wert: string) => void;
  placeholder?: string;
  autoComplete?: string;
};

// AAA: Passwortfeld mit Auge. Klick zeigt oder versteckt den Text.
export default function PasswordInput({
  value,
  onChange,
  placeholder,
  autoComplete,
}: PasswordInputProps) {
  const [sichtbar, setSichtbar] = useState(false);

  return (
    <div className="password-field">
      <input
        type={sichtbar ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
      <button
        type="button"
        className="password-toggle"
        onClick={() => setSichtbar(!sichtbar)}
        aria-label={sichtbar ? "passwort verbergen" : "passwort anzeigen"}
        title={sichtbar ? "verbergen" : "anzeigen"}
      >
        {sichtbar ? "◉" : "◎"}
      </button>
    </div>
  );
}
