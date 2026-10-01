// Complete 50-Episode Syllabus for John Vervaeke's Awakening from the Meaning Crisis

export const ARCS = [
  {
    id: 1,
    roman: 'I',
    title: 'The Axial Revolution & Classical Antiquity',
    episodesRange: 'Episodes 1 – 13',
    color: 'var(--arc-1-color)',
    bg: 'var(--arc-1-bg)',
    border: 'var(--arc-1-border)',
    description: 'Humanity awakens to second-order self-transcendence, breaking free from the Bronze Age continuous cosmos through psychotechnologies like literacy and coinage to birth philosophy, Buddhism, and Stoicism.'
  },
  {
    id: 2,
    roman: 'II',
    title: 'The Medieval Synthesis & The Fall',
    episodesRange: 'Episodes 14 – 20',
    color: 'var(--arc-2-color)',
    bg: 'var(--arc-2-bg)',
    border: 'var(--arc-2-border)',
    description: 'The monumental synthesis of Greek philosophy and Christian agape in Augustine and Aquinas, followed by the catastrophic unraveling via 14th-century Nominalism (William of Ockham) and the death of the sacred canopy.'
  },
  {
    id: 3,
    roman: 'III',
    title: 'The Modern Dilemma & Cognitive Alienation',
    episodesRange: 'Episodes 21 – 30',
    color: 'var(--arc-3-color)',
    bg: 'var(--arc-3-bg)',
    border: 'var(--arc-3-border)',
    description: 'The Scientific Revolution, Cartesian dualism, Hobbesian mechanism, Romanticism, and the rise of nihilism, existential nausea, and Frankfurtian bullshit in the modern psyche.'
  },
  {
    id: 4,
    roman: 'IV',
    title: 'Cognitive Science & Relevance Realization',
    episodesRange: 'Episodes 31 – 40',
    color: 'var(--arc-4-color)',
    bg: 'var(--arc-4-bg)',
    border: 'var(--arc-4-border)',
    description: 'A rigorous cognitive scientific reconstruction of mind, consciousness, the 4 Ways of Knowing (4P/3R), salience landscapes, and the mechanics of parasitic processing and reciprocal opening.'
  },
  {
    id: 5,
    roman: 'V',
    title: 'Wisdom, Dialogos & The Ecology of Practices',
    episodesRange: 'Episodes 41 – 50',
    color: 'var(--arc-5-color)',
    bg: 'var(--arc-5-bg)',
    border: 'var(--arc-5-border)',
    description: 'Cultivating wisdom, overcoming foolishness, resurrecting transjectivity and sacredness, and assembling the modern Ecology of Practices to forge a Religion That Is Not a Religion.'
  }
];

export const ALL_EPISODES_CATALOG = [
  // Arc 1
  {
    number: 1,
    title: 'Introduction to the Meaning Crisis',
    arc: 1,
    duration: '59 min',
    youtubeId: '54l8_ewcOlY',
    youtubeUrl: 'https://www.youtube.com/watch?v=54l8_ewcOlY&list=PLND1JCRq8Vuh3f0P5qjrSdb5eC1ZfZwWJ&index=1',
    summary: 'Dr. Vervaeke diagnoses the modern epidemic of anxiety, depression, and existential despair as a systemic Meaning Crisis rooted in the collapse of the Threefold Order.',
    keyTerms: ['Meaning Crisis', 'Nomological Order', '4 Ways of Knowing', 'Psychotechnology'],
    hasQuiz: true
  },
  {
    number: 2,
    title: 'Flow, Metaphor, and the Axial Revolution',
    arc: 1,
    duration: '54 min',
    youtubeId: 'aF9HeXg65AE',
    youtubeUrl: 'https://www.youtube.com/watch?v=aF9HeXg65AE&list=PLND1JCRq8Vuh3f0P5qjrSdb5eC1ZfZwWJ&index=2',
    summary: 'Exploring shamanism, Upper Paleolithic art, psychotechnologies, flow states, and the monumental transition to second-order thinking in the Axial Revolution.',
    keyTerms: ['Flow State', 'Shamanism', 'Axial Revolution', 'Metaphor'],
    hasQuiz: true
  },
  {
    number: 3,
    title: 'Continuous Cosmos and the Axial Revolution',
    arc: 1,
    duration: '58 min',
    youtubeId: 'C1AaqD8t3pk',
    youtubeUrl: 'https://www.youtube.com/watch?v=C1AaqD8t3pk&list=PLND1JCRq8Vuh3f0P5qjrSdb5eC1ZfZwWJ&index=3',
    summary: 'Contrasting the Bronze Age "continuous cosmos" of ritual and myth with the breakthrough to the transcendent realm in Ancient Israel and Ancient Greece.',
    keyTerms: ['Continuous Cosmos', 'Two-Worlds Mythology', 'Prophetic Tradition', 'Akrasia'],
    hasQuiz: true
  },
  {
    number: 4,
    title: 'Socrates and the Quest for Wisdom',
    arc: 1,
    duration: '57 min',
    youtubeId: 'Lhl51bZQlM8',
    youtubeUrl: 'https://www.youtube.com/watch?v=Lhl51bZQlM8&list=PLND1JCRq8Vuh3f0P5qjrSdb5eC1ZfZwWJ&index=4',
    summary: 'Socrates exposes self-deception through the Elenchus, cultivating Aporia and transforming passion into Ta Erotika—the love of truth and goodness.',
    keyTerms: ['Elenchus', 'Aporia', 'Ta Erotika', 'Self-Deception'],
    hasQuiz: true
  },
  {
    number: 5,
    title: 'Plato and the Cave',
    arc: 1,
    duration: '58 min',
    youtubeId: 'neDutbcedUY',
    youtubeUrl: 'https://www.youtube.com/watch?v=neDutbcedUY&list=PLND1JCRq8Vuh3f0P5qjrSdb5eC1ZfZwWJ&index=5',
    summary: 'Plato’s Allegory of the Cave, the tripartite psyche (Appetite, Thumos, Reason), and the process of Anagoge—climbing toward the Good.',
    keyTerms: ['Allegory of the Cave', 'Tripartite Psyche', 'Anagoge', 'The Good'],
    hasQuiz: true
  },
  {
    number: 6,
    title: 'Aristotle, Kant, and Purpose',
    arc: 1,
    duration: '56 min',
    youtubeId: 'A_gH5VIZO0Q',
    youtubeUrl: 'https://www.youtube.com/watch?v=A_gH5VIZO0Q&list=PLND1JCRq8Vuh3f0P5qjrSdb5eC1ZfZwWJ&index=6',
    summary: 'Aristotle’s revolutionary biological and teleological worldview: Hylomorphism, Actuality vs. Potentiality, and human flourishing as Entelechy.',
    keyTerms: ['Hylomorphism', 'Entelechy', 'Actuality/Potentiality', 'Flourishing (Eudaimonia)'],
    hasQuiz: true
  },
  {
    number: 7,
    title: 'Aristotle’s Worldview and Alienation',
    arc: 1,
    duration: '59 min',
    youtubeId: 'yy47YzvGniQ',
    youtubeUrl: 'https://www.youtube.com/watch?v=yy47YzvGniQ&list=PLND1JCRq8Vuh3f0P5qjrSdb5eC1ZfZwWJ&index=7',
    summary: 'Aristotle’s contact epistemology—the conformity theory of knowing where the soul becomes what it knows—and the deep sense of cosmic belonging.',
    keyTerms: ['Contact Epistemology', 'Conformity Theory', 'Cosmic Belonging', 'Morphé'],
    hasQuiz: true
  },
  {
    number: 8,
    title: 'The Buddha and the Axial Revolution',
    arc: 1,
    duration: '58 min',
    youtubeId: 'EWumJSBqXa8',
    youtubeUrl: 'https://www.youtube.com/watch?v=EWumJSBqXa8&list=PLND1JCRq8Vuh3f0P5qjrSdb5eC1ZfZwWJ&index=8',
    summary: 'Siddhartha Gautama’s radical psychotechnology of mindfulness: Sati, Vipassana, the Four Noble Truths, and untangling existential Dukkha.',
    keyTerms: ['Mindfulness (Sati)', 'Vipassana', 'Dukkha', 'Eightfold Path'],
    hasQuiz: true
  },
  {
    number: 9,
    title: 'Insight',
    arc: 1,
    duration: '58 min',
    youtubeId: 'jkWNBdBDyoE',
    youtubeUrl: 'https://www.youtube.com/watch?v=jkWNBdBDyoE&list=PLND1JCRq8Vuh3f0P5qjrSdb5eC1ZfZwWJ&index=9',
    summary: 'Gestalt psychology, the Nine-Dot Problem, reframing, and how the brain solves combinatorial explosion through dynamic Insight.',
    keyTerms: ['Insight', 'Gestalt Shift', 'Combinatorial Explosion', 'Reframing'],
    hasQuiz: true
  },
  {
    number: 10,
    title: 'Consciousness',
    arc: 1,
    duration: '56 min',
    youtubeId: 'dRzm_wSR1RU',
    youtubeUrl: 'https://www.youtube.com/watch?v=dRzm_wSR1RU&list=PLND1JCRq8Vuh3f0P5qjrSdb5eC1ZfZwWJ&index=10',
    summary: 'Global Workspace Theory, integrated information, working memory, and why consciousness is optimized for complex relevance realization.',
    keyTerms: ['Global Workspace Theory', 'Salience Landscape', 'Working Memory', 'Relevance Realization'],
    hasQuiz: true
  },
  {
    number: 11,
    title: 'Higher States of Consciousness',
    arc: 1,
    duration: '59 min',
    youtubeId: '39NpjQDtqNw',
    youtubeUrl: 'https://www.youtube.com/watch?v=39NpjQDtqNw&list=PLND1JCRq8Vuh3f0P5qjrSdb5eC1ZfZwWJ&index=11',
    summary: 'Mystical experiences, "realer than real" phenomenological states, and how transformative flow experiences disrupt neurotic fixed framing.',
    keyTerms: ['Higher States of Consciousness', 'Realer Than Real', 'Ego Dissolution', 'Anagoge'],
    hasQuiz: true
  },
  {
    number: 12,
    title: 'Marcus Aurelius and Stoicism',
    arc: 1,
    duration: '59 min',
    youtubeId: 'rvx4_0NAfaY',
    youtubeUrl: 'https://www.youtube.com/watch?v=rvx4_0NAfaY&list=PLND1JCRq8Vuh3f0P5qjrSdb5eC1ZfZwWJ&index=12',
    summary: 'Stoicism as an operating system for mental discipline: Prosochê (attention), the Dichotomy of Control, and the View from Above.',
    keyTerms: ['Stoicism', 'Prosochê', 'Dichotomy of Control', 'View from Above'],
    hasQuiz: true
  },
  {
    number: 13,
    title: 'Epicureans, Cynics, and Skeptics',
    arc: 1,
    duration: '57 min',
    youtubeId: 'vGB8k7jk1AQ',
    youtubeUrl: 'https://www.youtube.com/watch?v=vGB8k7jk1AQ&list=PLND1JCRq8Vuh3f0P5qjrSdb5eC1ZfZwWJ&index=13',
    summary: 'Hellenistic therapeutic philosophies created to achieve Ataraxia (untroubledness) amidst historical chaos and empire collapse.',
    keyTerms: ['Ataraxia', 'Cynicism', 'Skepticism', 'Epicureanism'],
    hasQuiz: true
  },

  // Arc 2
  {
    number: 14,
    title: 'Gnosticism and the Ancient Crisis',
    arc: 2,
    duration: '58 min',
    youtubeId: 'rpndwf45nao',
    youtubeUrl: 'https://www.youtube.com/watch?v=rpndwf45nao&list=PLND1JCRq8Vuh3f0P5qjrSdb5eC1ZfZwWJ&index=14',
    summary: 'Gnostic psychology, the alienated soul trapped in a cosmic conspiracy, and Gnosis as salvation through transformative insight.',
    keyTerms: ['Gnosticism', 'Gnosis', 'Existential Alienation', 'Demiurge'],
    hasQuiz: false
  },
  {
    number: 15,
    title: 'Christianity and Agape',
    arc: 2,
    duration: '59 min',
    youtubeId: 'FvLe4BuU-NM',
    youtubeUrl: 'https://www.youtube.com/watch?v=FvLe4BuU-NM&list=PLND1JCRq8Vuh3f0P5qjrSdb5eC1ZfZwWJ&index=15',
    summary: 'Agape as kenotic, down-flowing creative love that calls forth personhood in the other, distinct from Eros and Philia.',
    keyTerms: ['Agape', 'Kenosis', 'Personhood', 'Historical Consciousness'],
    hasQuiz: false
  },
  {
    number: 18,
    title: 'Nominalism and the Fall of the Middle Ages',
    arc: 2,
    duration: '59 min',
    youtubeId: 'ITfUCL1yTQQ',
    youtubeUrl: 'https://www.youtube.com/watch?v=ITfUCL1yTQQ&list=PLND1JCRq8Vuh3f0P5qjrSdb5eC1ZfZwWJ&index=18',
    summary: 'William of Ockham champions Nominalism, sundering universals into mere names and shattering the sacred canopy of the Aristotelian cosmos.',
    keyTerms: ['Nominalism', 'William of Ockham', 'Realism', 'Sacred Canopy'],
    hasQuiz: true
  },

  // Arc 3
  {
    number: 21,
    title: 'Martin Luther and Descartes',
    arc: 3,
    duration: '58 min',
    youtubeId: 'x90XKjhcu4w',
    youtubeUrl: 'https://www.youtube.com/watch?v=x90XKjhcu4w&list=PLND1JCRq8Vuh3f0P5qjrSdb5eC1ZfZwWJ&index=21',
    summary: 'Descartes introduces the mind-body split (Cartesian dualism), reducing the living cosmos to a mechanical clockwork and inventing epistemic anxiety.',
    keyTerms: ['Cartesian Dualism', 'Epistemic Anxiety', 'Ghost in the Machine', 'Clockwork Universe'],
    hasQuiz: true
  },
  {
    number: 28,
    title: 'Nietzsche, Nihilism, and Frankfurt’s Bullshit',
    arc: 3,
    duration: '59 min',
    youtubeId: 'Yp6F80Nx0lc',
    youtubeUrl: 'https://www.youtube.com/watch?v=Yp6F80Nx0lc&list=PLND1JCRq8Vuh3f0P5qjrSdb5eC1ZfZwWJ&index=28',
    summary: 'The death of God, Friedrich Nietzsche’s prophesy of catastrophic nihilism, and Harry Frankfurt’s diagnostic analysis of modern Bullshit.',
    keyTerms: ['Nietzsche', 'Nihilism', 'Frankfurtian Bullshit', 'Salience Hijacking'],
    hasQuiz: true
  },

  // Arc 4
  {
    number: 31,
    title: 'The 4 Ways of Knowing',
    arc: 4,
    duration: '59 min',
    youtubeId: 'gfKcVbNd7Xc',
    youtubeUrl: 'https://www.youtube.com/watch?v=gfKcVbNd7Xc&list=PLND1JCRq8Vuh3f0P5qjrSdb5eC1ZfZwWJ&index=31',
    summary: 'A deep systematic dissection of Propositional, Procedural, Perspectival, and Participatory knowing (4P/3R) and why propositional bias blinds us.',
    keyTerms: ['4 Ways of Knowing', 'Participatory Knowing', 'Propositional Tyranny', 'Affordances'],
    hasQuiz: true
  },
  {
    number: 36,
    title: 'Relevance Realization and Parasitic Processing',
    arc: 4,
    duration: '58 min',
    youtubeId: '48Ch2x3DrfM',
    youtubeUrl: 'https://www.youtube.com/watch?v=48Ch2x3DrfM&list=PLND1JCRq8Vuh3f0P5qjrSdb5eC1ZfZwWJ&index=36',
    summary: 'The cognitive mechanics of how our intelligence parasitizes itself: addiction, neurotic loops, and the transition from reciprocal narrowing to reciprocal opening.',
    keyTerms: ['Parasitic Processing', 'Reciprocal Narrowing', 'Reciprocal Opening', 'Cognitive Flexibility'],
    hasQuiz: true
  },

  // Arc 5
  {
    number: 42,
    title: 'Wisdom and Sophrosyne',
    arc: 5,
    duration: '59 min',
    youtubeId: 'H1yDgjQdRHw',
    youtubeUrl: 'https://www.youtube.com/watch?v=H1yDgjQdRHw&list=PLND1JCRq8Vuh3f0P5qjrSdb5eC1ZfZwWJ&index=42',
    summary: 'What is wisdom? Distinguishing foolishness from stupidity, cultivating Sophrosyne (optimal self-regulation), and coordinating the cognitive ecology.',
    keyTerms: ['Wisdom', 'Sophrosyne', 'Foolishness', 'Optimal Grip'],
    hasQuiz: true
  },
  {
    number: 50,
    title: 'The Religion That Is Not a Religion',
    arc: 5,
    duration: '62 min',
    youtubeId: 'iu9fa4TkWE0',
    youtubeUrl: 'https://www.youtube.com/watch?v=iu9fa4TkWE0&list=PLND1JCRq8Vuh3f0P5qjrSdb5eC1ZfZwWJ&index=50',
    summary: 'The grand finale: assembling an Ecology of Practices, fostering distributed cognition through Dialogos, and awakening from the Meaning Crisis.',
    keyTerms: ['Religion That Is Not a Religion', 'Ecology of Practices', 'Dialogos', 'Awakening'],
    hasQuiz: true
  }
];
