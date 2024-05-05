const crypto = require('crypto');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function generateRandomPassword(length, options) {
  let charset = '';
  if (options.includeUpperCase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (options.includeLowerCase) charset += 'abcdefghijklmnopqrstuvwxyz';
  if (options.includeNumbers) charset += '0123456789';
  if (options.includeSpecialChars) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, charset.length);
    password += charset[randomIndex];
  }
  return password;
}

function getPasswordPreferences() {
  return new Promise((resolve, reject) => {
    function askQuestion(question, callback) {
      rl.question(question, (answer) => {
        callback(answer);
      });
    }

    function validateInput(input) {
      return input.toLowerCase().trim() === 's' || input.toLowerCase().trim() === 'n';
    }

    function askLengthQuestion() {
      askQuestion('Informe o tamanho da senha: ', (length) => {
        length = parseInt(length);
        if (isNaN(length) || length <= 0) {
          console.error('Tamanho inválido. Informe um valor inteiro, por favor.');
          askLengthQuestion();
          return;
        }

        askQuestion('Incluir letras maiúsculas? (s/n): ', (includeUpperCase) => {
          if (!validateInput(includeUpperCase)) {
            console.error('Entrada inválida. Digite "s" ou "n", por favor.');
            askLengthQuestion();
            return;
          }
          includeUpperCase = includeUpperCase.toLowerCase().trim() === 's';
          askLowerCaseQuestion(includeUpperCase, length);
        });
      });
    }

    function askLowerCaseQuestion(includeUpperCase, length) {
      askQuestion('Incluir letras minúsculas? (s/n): ', (includeLowerCase) => {
        if (!validateInput(includeLowerCase)) {
          console.error('Entrada inválida. Digite "s" ou "n", por favor.');
          askLowerCaseQuestion(includeUpperCase, length);
          return;
        }
        includeLowerCase = includeLowerCase.toLowerCase().trim() === 's';
        askNumbersQuestion(includeUpperCase, includeLowerCase, length);
      });
    }

    function askNumbersQuestion(includeUpperCase, includeLowerCase, length) {
      askQuestion('Incluir números? (s/n): ', (includeNumbers) => {
        if (!validateInput(includeNumbers)) {
          console.error('Entrada inválida. Digite "s" ou "n", por favor.');
          askNumbersQuestion(includeUpperCase, includeLowerCase, length);
          return;
        }
        includeNumbers = includeNumbers.toLowerCase().trim() === 's';
        askSpecialCharsQuestion(includeUpperCase, includeLowerCase, includeNumbers, length);
      });
    }

    function askSpecialCharsQuestion(includeUpperCase, includeLowerCase, includeNumbers, length) {
      askQuestion('Incluir caracteres especiais? (s/n): ', (includeSpecialChars) => {
        if (!validateInput(includeSpecialChars)) {
          console.error('Entrada inválida. Digite "s" ou "n", por favor.');
          askSpecialCharsQuestion(includeUpperCase, includeLowerCase, includeNumbers, length);
          return;
        }
        includeSpecialChars = includeSpecialChars.toLowerCase().trim() === 's';

        resolve({
          length,
          includeUpperCase,
          includeLowerCase,
          includeNumbers,
          includeSpecialChars
        });

        rl.close();
      });
    }

    askLengthQuestion();
  });
}

async function main() {
  try {
    console.log('Bem vindo ao gerador de senhas aleatórias!');
    const preferences = await getPasswordPreferences();
    const password = generateRandomPassword(preferences.length, preferences);
    console.log('Sua senha é:', password);
  } catch (err) {
    console.error('Error:', err.message);
    rl.close();
  }
}

main();
