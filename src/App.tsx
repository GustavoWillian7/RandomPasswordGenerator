import { useState } from "react";
import "./App.css";

export default function PasswordGenerator() {
  const [length, setLength] = useState(12);
  const [includeUpperCase, setIncludeUpperCase] = useState(true);
  const [includeLowerCase, setIncludeLowerCase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSpecialChars, setIncludeSpecialChars] = useState(false);
  const [password, setPassword] = useState("");

  function generateRandomPassword() {
    let charset = "";
    if (includeUpperCase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeLowerCase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (includeNumbers) charset += "0123456789";
    if (includeSpecialChars) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (charset.length === 0) {
      setPassword("Selecione ao menos uma opção!");
      return;
    }

    let pwd = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      pwd += charset[randomIndex];
    }
    setPassword(pwd);
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(password);
    alert("Senha copiada!");
  }

  return (
    <div className="container">
      <h2 className="title">🔑 Gerador de Senhas</h2>

      <div className="input-group">
        <label>Tamanho:</label>
        <input
          type="number"
          min="4"
          max="50"
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
        />
      </div>

      <div className="checkbox-group">
        <label>
          <input
            type="checkbox"
            checked={includeUpperCase}
            onChange={() => setIncludeUpperCase(!includeUpperCase)}
          />
          Letras maiúsculas (A-Z)
        </label>
        <label>
          <input
            type="checkbox"
            checked={includeLowerCase}
            onChange={() => setIncludeLowerCase(!includeLowerCase)}
          />
          Letras minúsculas (a-z)
        </label>
        <label>
          <input
            type="checkbox"
            checked={includeNumbers}
            onChange={() => setIncludeNumbers(!includeNumbers)}
          />
          Números (0-9)
        </label>
        <label>
          <input
            type="checkbox"
            checked={includeSpecialChars}
            onChange={() => setIncludeSpecialChars(!includeSpecialChars)}
          />
          Caracteres especiais (!@#$...)
        </label>
      </div>

      <button className="btn btn-generate" onClick={generateRandomPassword}>
        Gerar Senha
      </button>

      {password && (
        <div className="result">
          <p>
            <strong>Sua senha:</strong>
          </p>
          <div className="password-box">{password}</div>
          <button className="btn btn-copy" onClick={copyToClipboard}>
            Copiar
          </button>
        </div>
      )}
    </div>
  );
}
