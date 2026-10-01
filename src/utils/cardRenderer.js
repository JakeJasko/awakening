// High-Resolution Canvas Share Card Generator for Awakening from the Meaning Crisis
// Generates a 1080x1350 (4:5 portrait) classical scholarly dossier card

export function getMasteryTitle(percentage) {
  if (percentage === 100) return { title: 'Axial Sage', greek: 'ΣΟΦΟΣ (Sophos)', color: '#B84A39' };
  if (percentage >= 80) return { title: 'Dialectic Practitioner', greek: 'ΦΙΛΟΣΟΦΟΣ (Philosophos)', color: '#2B4E7A' };
  if (percentage >= 60) return { title: 'Meaning Seeker', greek: 'ΖΗΤΗΤΙΚΟΣ (Zetetic)', color: '#2D6A4F' };
  return { title: 'Aporetic Inquirer', greek: 'ΑΠΟΡΙΑ (Inquirer)', color: '#A86214' };
}

export async function generateEpisodeCard({ episode, score, total, percentage }) {
  if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch (e) {
      // Proceed if font loading promise fails
    }
  }

  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext('2d');

  // Background: Warm Parchment
  ctx.fillStyle = '#FAF7F2';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Outer classical double border
  ctx.strokeStyle = '#D5CCC0';
  ctx.lineWidth = 4;
  ctx.strokeRect(40, 40, 1000, 1270);

  ctx.strokeStyle = '#E8E2D7';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(50, 50, 980, 1250);

  // Top Inscription
  ctx.textAlign = 'center';
  ctx.fillStyle = '#867E75';
  ctx.font = '700 20px "Cinzel", Georgia, serif';
  ctx.fillText('DR. JOHN VERVAEKE • COGNITIVE SCIENCE & PHILOSOPHY', 540, 105);

  ctx.fillStyle = '#231F1C';
  ctx.font = '800 42px "Newsreader", Georgia, serif';
  ctx.fillText('AWAKENING FROM THE MEANING CRISIS', 540, 160);

  ctx.fillStyle = '#B84A39';
  ctx.font = 'italic 24px "Newsreader", Georgia, serif';
  ctx.fillText('Epistemic Mastery Dossier', 540, 200);

  // Decorative Terracotta Line
  ctx.strokeStyle = '#B84A39';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(380, 225);
  ctx.lineTo(700, 225);
  ctx.stroke();

  // Episode Spotlight Box
  ctx.fillStyle = '#FFFDF9';
  ctx.beginPath();
  ctx.roundRect(90, 260, 900, 440, 18);
  ctx.fill();
  ctx.strokeStyle = '#E8E2D7';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Episode Number Tag
  ctx.fillStyle = '#B84A39';
  ctx.font = '700 22px "Cinzel", Georgia, serif';
  ctx.fillText(`EPISODE ${episode.roman || episode.id}`, 540, 315);

  // Episode Title
  ctx.fillStyle = '#231F1C';
  ctx.font = '800 40px "Newsreader", Georgia, serif';
  const titleText = episode.title.length > 36 ? episode.title.substring(0, 34) + '...' : episode.title;
  ctx.fillText(titleText, 540, 375);

  // Mastery Rank Badge
  const mastery = getMasteryTitle(percentage);
  ctx.fillStyle = mastery.color;
  ctx.font = '700 24px "Cinzel", Georgia, serif';
  ctx.fillText(mastery.greek, 540, 430);

  ctx.fillStyle = '#231F1C';
  ctx.font = '700 32px "Newsreader", Georgia, serif';
  // Score Highlight Pill (Dynamically sized to fully encompass score and percentage)
  const scoreText = `${score} / ${total} CORRECT  (${percentage}%)`;
  ctx.font = '800 26px "Cinzel", Georgia, serif';
  const textWidth = ctx.measureText(scoreText).width;
  const pillPaddingX = 56;
  const pillWidth = Math.max(420, Math.ceil(textWidth + pillPaddingX * 2));
  const pillHeight = 62;
  const pillX = 540 - pillWidth / 2;
  const pillY = 520;

  ctx.fillStyle = '#F3EFE8';
  ctx.beginPath();
  ctx.roundRect(pillX, pillY, pillWidth, pillHeight, pillHeight / 2);
  ctx.fill();
  ctx.strokeStyle = mastery.color;
  ctx.lineWidth = 1.8;
  ctx.stroke();

  ctx.fillStyle = mastery.color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(scoreText, 540, pillY + pillHeight / 2 + 1);
  ctx.textBaseline = 'alphabetic'; // restore default baseline

  // Quote Box
  ctx.fillStyle = '#FAF7F2';
  ctx.beginPath();
  ctx.roundRect(130, 605, 820, 75, 10);
  ctx.fill();

  ctx.fillStyle = '#5C554E';
  ctx.font = 'italic 20px "Newsreader", Georgia, serif';
  let snippet = episode.quote || 'The unexamined life is not worth living.';
  if (snippet.length > 85) snippet = snippet.substring(0, 82) + '...';
  ctx.fillText(`"${snippet}"`, 540, 650);

  // Key Concepts Box
  ctx.fillStyle = '#FFFDF9';
  ctx.beginPath();
  ctx.roundRect(90, 730, 900, 410, 18);
  ctx.fill();
  ctx.strokeStyle = '#E8E2D7';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#231F1C';
  ctx.font = '700 28px "Newsreader", Georgia, serif';
  ctx.fillText('Core Psychotechnologies & Concepts Mastered', 540, 785);

  // Render concept chips
  const concepts = episode.keyConcepts || ['Relevance Realization', '4 Ways of Knowing', 'Psychotechnologies', 'Dialogos'];
  let cy = 840;
  concepts.slice(0, 4).forEach((c, idx) => {
    ctx.fillStyle = '#FDF1EE';
    ctx.beginPath();
    ctx.roundRect(140, cy, 800, 54, 8);
    ctx.fill();
    ctx.strokeStyle = '#F3C4BC';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#B84A39';
    ctx.textAlign = 'left';
    ctx.font = '700 20px "Cinzel", Georgia, serif';
    ctx.fillText(`0${idx + 1}`, 165, cy + 34);

    ctx.fillStyle = '#231F1C';
    ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(c, 230, cy + 34);

    cy += 70;
  });

  // Footer Tagline & Greek Motto
  ctx.textAlign = 'center';
  ctx.fillStyle = '#867E75';
  ctx.font = 'italic 22px "Newsreader", Georgia, serif';
  ctx.fillText('«Ο δε ανεξέταστος βίος ου βιωτός ανθρώπῳ»', 540, 1200);

  ctx.fillStyle = '#5C554E';
  ctx.font = '500 18px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('The unexamined life is not worth living — Socrates (Apology 38a)', 540, 1235);

  ctx.fillStyle = '#B84A39';
  ctx.font = '700 20px "Cinzel", Georgia, serif';
  ctx.fillText('AWAKENING FROM THE MEANING CRISIS COMPANION', 540, 1275);

  return canvas.toDataURL('image/png');
}
