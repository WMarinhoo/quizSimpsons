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

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");
const progressText = document.getElementById("progress-text");
const resultEl = document.getElementById("result");
const scoreEl = document.getElementById("score");
const messageEl = document.getElementById("message");
const correctSound = document.getElementById("correct");
const wrongSound = document.getElementById("wrong");
const woohooSound = document.getElementById("woohoo");

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
    const correct = questions[current].a;

    // Evita clicar duas vezes
    if (nextBtn.disabled === false) return;
    if (selected === correct) {
        score++;
        btn.classList.add("correct");
        correctSound.play();
    } else {
        btn.classList.add("wrong");
        wrongSound.play();
        optionsEl.children[correct].classList.add("correct");
    }

    // ← AQUI ESTAVA O PROBLEMA! ←
    [...optionsEl.children].forEach(b => {
        b.disabled = true;
        b.style.cursor = "default";
    });
    nextBtn.disabled = false;
    nextBtn.textContent = "Próxima pergunta →";

    // Desabilita todos os botões de opção
    [...optionsEl.children].forEach(b => {
        b.disabled = true;
        b.style.cursor = "default";
    });


    // ===== AQUI ESTÁ A MÁGICA =====
    if (current === questions.length - 1) {
        // É a última pergunta → esconde o botão "Próxima" e vai direto pro resultado
        nextBtn.style.display = "none";           // ou nextBtn.disabled = true;
        setTimeout(showResult, 1800);             // dá tempo de ver a resposta certa/errada
    } else {
        // Ainda tem perguntas → mostra o botão normalmente
        nextBtn.disabled = false;
        nextBtn.textContent = "Próxima pergunta →";
        nextBtn.style.display = "block";
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


// ====== FUNÇÃO CORRIGIDA: mostra resultado com pontuação CERTA ======
function showResult() {
    document.getElementById("quiz").classList.add("hidden");
    resultEl.classList.remove("hidden");

    // CORREÇÃO: mostra pontuação correta (ex: 12 de 15)
    scoreEl.textContent = `${score} de ${questions.length}`;

    let frase = "";
    let classe = "";

    if (score === questions.length) {
        frase = "PERFEITO! Você é o rei de Springfield! Troféu Medalha de ouro";
        classe = "perfeito medalha-ouro";
        soltarConfetes();
        woohooSound.play();
    } else if (score >= 13) {
        frase = "INCRÍVEL! Quase perfeito! Medalha de ouro";
        classe = "excelente medalha-ouro";
        soltarConfetes();
        woohooSound.play();
    } else if (score >= 10) {
        frase = "Muito bom! Você conhece bem a família amarela Medalha de prata";
        classe = "excelente medalha-prata";
    } else if (score >= 7) {
        frase = "Bom trabalho! Tá no caminho certo Medalha de bronze";
        classe = "bom medalha-bronze";
    } else if (score >= 4) {
        frase = "D’oh! Hora de rever os episódios!";
        classe = "ruim doh";
    } else {
        frase = "D’OH!!! Maratona urgente dos Simpsons agora!";
        classe = "ruim doh";
        const dohAudio = new Audio("https://www.myinstants.com/media/sounds/doh_1.mp3");
        dohAudio.volume = 0.9;
        dohAudio.play();
    }

    messageEl.innerHTML = frase;
    messageEl.className = classe;
}

// ====== BOTÃO "JOGAR NOVAMENTE" – ZERA TUDO CORRETAMENTE ======
document.getElementById("restartBtn").onclick = () => {
    // Zera tudo de verdade
    current = 0;
    score = 0;

    // Limpa classes e texto do resultado
    messageEl.innerHTML = "";
    messageEl.className = "";
    scoreEl.textContent = "";

    // Volta pra tela do quiz
    resultEl.classList.add("hidden");
    document.getElementById("quiz").classList.remove("hidden");

    // Recarrega a primeira pergunta
    loadQuestion();
};

