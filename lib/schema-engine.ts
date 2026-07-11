// lib/schema-engine.ts
// Ported from the KidTimer extension's engine.js. A generalized
// "answer questions to advance" canvas game that knows nothing about the
// subject being tested — it only understands questions shaped like:
//   { display, answer, wrongs, hint?, emoji? }
// This replaces Academic Game Builder's previous placeholder gameplay
// (a "Game Content Area" div with fake +10/+50 point buttons that did
// nothing educational) with something that actually tests the generated
// topic pack.

export interface GameQuestion {
  display: string;
  answer: string;
  wrongs: string[];
  hint?: string;
  emoji?: string;
}

export interface SchemaEngineOptions {
  questionsPerRound?: number;
  onProgress?: (correct: number, total: number) => void;
  onRoundComplete?: (correct: number, total: number) => void;
}

export class SchemaGameEngine {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  questions: GameQuestion[];
  questionsPerRound: number;
  onProgress: (correct: number, total: number) => void;
  onRoundComplete: (correct: number, total: number) => void;

  correct = 0;
  total = 0;
  frame = 0;
  state: "walking" | "question" | "resolved" | "done" = "walking";
  currentQuestion: GameQuestion | null = null;
  currentChoices: string[] = [];
  player = { x: 80, bob: 0 };
  feedback: "correct" | "wrong" | null = null;
  running = false;

  constructor(canvas: HTMLCanvasElement, questions: GameQuestion[], opts: SchemaEngineOptions = {}) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D context unavailable");
    this.ctx = ctx;
    this.questionsPerRound = opts.questionsPerRound || 8;
    this.questions = this._shufflePool(questions, this.questionsPerRound);
    this.onProgress = opts.onProgress || (() => {});
    this.onRoundComplete = opts.onRoundComplete || (() => {});
  }

  private _shufflePool(questions: GameQuestion[], count: number): GameQuestion[] {
    const pool = [...questions];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const out: GameQuestion[] = [];
    while (out.length < count) out.push(...pool);
    return out.slice(0, count);
  }

  start() {
    this.running = true;
    this._spawnNext();
    this._loop();
  }

  stop() {
    this.running = false;
  }

  private _spawnNext() {
    if (this.total >= this.questionsPerRound) {
      this.state = "done";
      this.onRoundComplete(this.correct, this.total);
      return;
    }
    this.currentQuestion = this.questions[this.total];
    const opts = [this.currentQuestion.answer, ...this.currentQuestion.wrongs];
    for (let i = opts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opts[i], opts[j]] = [opts[j], opts[i]];
    }
    this.currentChoices = opts.slice(0, 3).includes(this.currentQuestion.answer)
      ? opts.slice(0, 3)
      : [...opts.slice(0, 2), this.currentQuestion.answer];
    this.state = "question";
  }

  choose(choice: string) {
    if (this.state !== "question" || !this.currentQuestion) return;
    const isCorrect = choice === this.currentQuestion.answer;
    this.feedback = isCorrect ? "correct" : "wrong";
    this.total += 1;
    if (isCorrect) this.correct += 1;
    this.onProgress(this.correct, this.total);
    this.state = "resolved";
    setTimeout(() => {
      this.feedback = null;
      this._spawnNext();
    }, 550);
  }

  getChoiceButtons(): string[] {
    return this.currentChoices;
  }

  private _loop = () => {
    if (!this.running) return;
    this.frame++;
    this.player.bob = Math.sin(this.frame * 0.15) * 4;
    this._draw();
    requestAnimationFrame(this._loop);
  };

  private _draw() {
    const { ctx, canvas } = this;
    const W = canvas.width;
    const H = canvas.height;

    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, "#1e1b4b");
    sky.addColorStop(1, "#312e81");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    const groundY = H - 100;
    ctx.fillStyle = "#181530";
    ctx.fillRect(0, groundY, W, H - groundY);
    ctx.strokeStyle = "rgba(118,75,162,.5)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(W, groundY);
    ctx.stroke();

    const pct = this.total / this.questionsPerRound;
    ctx.fillStyle = "rgba(255,255,255,.1)";
    ctx.fillRect(20, 20, W - 40, 14);
    ctx.fillStyle = "#667eea";
    ctx.fillRect(20, 20, (W - 40) * pct, 14);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 12px sans-serif";
    ctx.fillText(`${this.total} / ${this.questionsPerRound}`, 20, 50);

    const py = groundY - 60 + this.player.bob;
    ctx.fillStyle = this.feedback === "wrong" ? "#e63946" : "#764ba2";
    ctx.beginPath();
    ctx.arc(this.player.x, py, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(this.player.x - 10, py + 10, 20, 34);

    if (this.feedback === "correct") {
      ctx.font = "bold 40px sans-serif";
      ctx.fillText("✅", this.player.x + 40, py + 20);
    } else if (this.feedback === "wrong") {
      ctx.font = "bold 40px sans-serif";
      ctx.fillText("❌", this.player.x + 40, py + 20);
    }

    if (this.state === "question" && this.currentQuestion) {
      const panelY = H / 2 - 60;
      ctx.fillStyle = "rgba(0,0,0,.5)";
      ctx.fillRect(W / 2 - 220, panelY, 440, 150);
      ctx.strokeStyle = "#667eea";
      ctx.lineWidth = 2;
      ctx.strokeRect(W / 2 - 220, panelY, 440, 150);

      ctx.fillStyle = "#fff";
      ctx.font = "bold 24px sans-serif";
      ctx.textAlign = "center";
      const displayText = this.currentQuestion.emoji
        ? `${this.currentQuestion.emoji}  ${this.currentQuestion.display}`
        : this.currentQuestion.display;
      // Wrap long lines so subject-matter questions don't overflow the panel.
      wrapText(ctx, displayText, W / 2, panelY + 45, 400, 28);

      if (this.currentQuestion.hint) {
        ctx.font = "12px sans-serif";
        ctx.fillStyle = "#c7c7e8";
        ctx.fillText(this.currentQuestion.hint, W / 2, panelY + 120);
      }
      ctx.textAlign = "left";
    }
  }
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(" ");
  let line = "";
  let lineY = y;
  for (const word of words) {
    const test = line + word + " ";
    if (ctx.measureText(test).width > maxWidth && line !== "") {
      ctx.fillText(line.trim(), x, lineY);
      line = word + " ";
      lineY += lineHeight;
    } else {
      line = test;
    }
  }
  ctx.fillText(line.trim(), x, lineY);
}
