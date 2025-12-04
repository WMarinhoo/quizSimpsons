const questions = [
    { q: "Qual é o nome do meio de Homer?", o: ["Jay", "Lee", "Michael", "Joseph"], a: 0 },
    { q: "Qual é a frase mais famosa do Homer?", o: ["D'oh!", "Woo-hoo!", "Excelenteee!", "Por que você, rapazinho?"], a: 0 },
    { q: "Qual é o emprego de Homer?", o: ["Vendedor de carros", "Inspetor de segurança nuclear", "Barman", "Policial"], a: 1 },
    { q: "Qual instrumento Lisa toca?", o: ["Violino", "Saxofone", "Piano", "Flauta"], a: 1 },
    { q: "Qual é o nome do bar do Moe?", o: ["Bar do Joe", "Taberna do Moe", "Moe's Tavern", "O Bar"], a: 2 },
    { q: "Quem é o melhor amigo de Bart?", o: ["Nelson", "Milhouse", "Ralph", "Martin"], a: 1 },
    { q: "Qual é a comida favorita do Homer?", o: ["Pizza", "Donuts", "Hambúrguer", "Bacon"], a: 1 },
    { q: "Quantos dedos cada Simpson tem?", o: ["5", "4", "3", "6"], a: 1 },
    { q: "Qual é o nome da irmã gêmea da Selma?", o: ["Marge", "Patty", "Lisa", "Maggie"], a: 1 },
    { q: "Quem é o milionário de Springfield?", o: ["Sr. Burns", "Krusty", "Apu", "Ned Flanders"], a: 0 },
    { q: "Qual é a cor do carro da família?", o: ["Verde", "Rosa", "Laranja", "Azul"], a: 1 },
    { q: "Qual é o bordão do Bart?", o: ["¡Ay, caramba!", "Eat my shorts!", "Cowabunga!", "Não fui eu!"], a: 1 },
    { q: "Quem fundou Springfield?", o: ["Jebediah Springfield", "Abraham Simpson", "Zachariah Springfield", "Hans Moleman"], a: 0 },
    { q: "Qual é o nome do cachorro da família?", o: ["Pequeno Ajudante do Papai Noel", "Bongo", "Laddie", "Sr. Pinchy"], a: 0 },
    { q: "Em que cidade fica Springfield?", o: ["Nenhuma resposta oficial", "Kentucky", "Illinois", "Oregon"], a: 0 }
];

let current = 0;
let score = 0;

// Elementos
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");
const progressText = document.getElementById("progress-text");
const resultEl = document.getElementById("result");
const scoreEl = document.getElementById("score");
const messageEl = document.getElementById("message");


// SONS LOCAIS
const somAcerto = document.getElementById("somAcerto"); // woo‑hoo
const somErro = document.getElementById("somErro"); // d’oh
let audioDesbloqueado = false;

// Desbloqueia áudio no primeiro clique (OBRIGATÓRIO em 2025)
document.body.addEventListener("click", () => {
    if (!audioDesbloqueado) {
        audioDesbloqueado = true;
        somAcerto.load();
        somErro.load();
    }
}, { once: true });

function loadQuestion() {
    const q = questions[current];
    questionEl.textContent = q.q;
    progressText.textContent = `Pergunta ${current + 1} de ${questions.length}`;
    optionsEl.innerHTML = "";

    q.o.forEach((option, i) => {
        const btn = document.createElement("button");
        btn.textContent = option;
        btn.onclick = () => selectAnswer(i, btn);
        optionsEl.appendChild(btn);
    });

    nextBtn.disabled = true;
    nextBtn.textContent = "Próxima pergunta";
}

function selectAnswer(selected, btn) {
    // Evita clique duplo
    if (!nextBtn.disabled) return;

    const correctIdx = questions[current].a;

    // Remove classes antigas (limpeza)
    [...optionsEl.children].forEach(b => b.classList.remove("correct", "wrong"));

    if (selected === correctIdx) {
        // ACERTOU → Woo‑hoo!
        score++;
        btn.classList.add("correct");

        if (audioDesbloqueado) {
            somAcerto.currentTime = 0;        // reinicia do começo
            somAcerto.play().catch(e => console.log("Erro ao tocar woo‑hoo:", e));
        }

    } else {
        // ERROU → D’oh!
        btn.classList.add("wrong");
        optionsEl.children[correctIdx].classList.add("correct");

        if (audioDesbloqueado) {
            somErro.currentTime = 0;
            somErro.play().catch(e => console.log("Erro ao tocar d’oh:", e));
        }
    }

    // Desabilita todas as opções
    [...optionsEl.children].forEach(b => {
        b.disabled = true;
        b.style.cursor = "default";
    });

    // Última pergunta → vai direto pro resultado
    if (current === questions.length - 1) {
        nextBtn.style.display = "none";
        setTimeout(showResult, 2200);
    } else {
        nextBtn.disabled = false;
        nextBtn.textContent = "Próxima pergunta →";
    }
}

nextBtn.onclick = () => {
    current++;
    if (current < questions.length) {
        loadQuestion();
    } else {
        showResult();
    }
};

function showResult() {
    document.getElementById("quiz").classList.add("hidden");
    resultEl.classList.remove("hidden");
    scoreEl.textContent = `${score} de ${questions.length}`;

    let frase = "";
    if (score === 15) frase = "PERFEITO! Você é o rei de Springfield!";
    else if (score >= 12) frase = "INCRÍVEL! Quase perfeito!";
    else if (score >= 9) frase = "Muito bom! Medalha de prata";
    else if (score >= 6) frase = "Bom trabalho! Medalha de bronze";
    else frase = "D’OH! Hora de rever os episódios!";

    messageEl.textContent = frase;
}

document.getElementById("restartBtn").onclick = () => {
    current = 0;
    score = 0;
    resultEl.classList.add("hidden");
    document.getElementById("quiz").classList.remove("hidden");
    nextBtn.style.display = "block";
    loadQuestion();
};

// Inicia o jogo
loadQuestion();