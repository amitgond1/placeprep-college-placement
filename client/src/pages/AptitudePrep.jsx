import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Clock, Play, BarChart2, BookOpen, ChevronDown, ChevronRight, Trophy, Lightbulb, Calculator, Zap, Search, ChevronUp } from 'lucide-react';
import api from '../services/api';

const COMPANY_PATTERNS = [
  { name: 'TCS NQT', color: '#3b82f6', sections: [
    { name: 'Numerical Ability', qs: 26, time: '40 min' },
    { name: 'Verbal Ability', qs: 24, time: '30 min' },
    { name: 'Reasoning Ability', qs: 30, time: '50 min' },
    { name: 'Programming Logic', qs: 10, time: '15 min' },
    { name: 'Coding (Advanced)', qs: 2, time: '45 min' },
  ], cutoff: '55–65% sectional + overall', negativeMarking: 'No', calculator: 'Not allowed' },
  { name: 'Wipro NLTH', color: '#8b5cf6', sections: [
    { name: 'Aptitude', qs: 18, time: '' },
    { name: 'Verbal', qs: 22, time: '' },
    { name: 'Logical', qs: 20, time: '' },
    { name: 'Essay Writing', qs: 1, time: '20 min' },
  ], cutoff: 'Sectional cutoffs apply', negativeMarking: 'No', calculator: 'Not allowed' },
  { name: 'Infosys (InfyTQ)', color: '#06b6d4', sections: [
    { name: 'Aptitude + Puzzles', qs: 10, time: '25 min' },
    { name: 'Verbal', qs: 15, time: '25 min' },
    { name: 'Reasoning', qs: 15, time: '25 min' },
    { name: 'Pseudo Code', qs: 5, time: '' },
  ], cutoff: '65%+ recommended', negativeMarking: 'No', calculator: 'Not allowed' },
  { name: 'Cognizant GenC', color: '#10b981', sections: [
    { name: 'GenC: Basic Aptitude + English + Automata Fix', qs: 0, time: '' },
    { name: 'GenC Pro: Moderate aptitude + coding', qs: 0, time: '' },
    { name: 'GenC Elevate: Hard DSA + Aptitude + System Design', qs: 0, time: '' },
  ], cutoff: 'Role-dependent', negativeMarking: 'No', calculator: 'Basic allowed' },
  { name: 'Capgemini', color: '#f59e0b', sections: [
    { name: 'Aptitude', qs: 16, time: '' },
    { name: 'Behavioral (Game-based)', qs: 18, time: '' },
    { name: 'Essay Writing', qs: 1, time: '20 min' },
  ], cutoff: '60%+ overall', negativeMarking: 'No', calculator: 'Not allowed' },
  { name: 'Accenture', color: '#a855f7', sections: [
    { name: 'Abstract Reasoning', qs: 20, time: '20 min' },
    { name: 'Common Sense', qs: 14, time: '' },
    { name: 'Attention to Detail', qs: 12, time: '' },
    { name: 'Written Communication (Essay)', qs: 1, time: '250 words' },
  ], cutoff: '70%+ recommended', negativeMarking: 'No', calculator: 'Not allowed' },
  { name: 'HCL', color: '#ef4444', sections: [
    { name: 'Aptitude', qs: 25, time: '' },
    { name: 'Technical MCQ', qs: 0, time: '' },
    { name: 'Coding', qs: 2, time: '' },
  ], cutoff: '60%+ overall', negativeMarking: 'Varies', calculator: 'Not allowed' },
  { name: 'Tech Mahindra', color: '#ec4899', sections: [
    { name: 'Aptitude', qs: 25, time: '' },
    { name: 'Psychometric Assessment', qs: 0, time: '' },
    { name: 'Technical MCQ', qs: 0, time: '' },
  ], cutoff: 'Aptitude 60%+', negativeMarking: 'No', calculator: 'Not allowed' },
  { name: 'Zoho', color: '#14b8a6', sections: [
    { name: 'Very Hard Aptitude', qs: 0, time: '' },
    { name: 'Custom Coding Platform', qs: 5, time: '' },
  ], cutoff: 'Very competitive — 80%+ needed', negativeMarking: 'Yes (-1)', calculator: 'Not allowed' },
];

const TOPICS = ['Quantitative Aptitude','Logical Reasoning','Verbal Ability','Data Interpretation','Number System','Percentages','Time & Work','Time Speed Distance','Profit & Loss','Probability','Series','Syllogisms','Blood Relations','Direction Sense','Coding-Decoding','Averages','Ages','Ratio & Proportion','LCM/HCF','Geometry'];

// ─── Study Guide Data ───
const GUIDE_QUANT = [
  {
    topic: 'Number System & HCF/LCM',
    icon: '🔢', color: '#3b82f6', drillTopic: 'LCM/HCF',
    description: 'Foundation of all quantitative aptitude — divisibility rules, prime factorization, remainders.',
    formulas: [
      { name: 'Sum of 1 to n', formula: 'n(n+1) / 2' },
      { name: 'Sum of squares', formula: 'n(n+1)(2n+1) / 6' },
      { name: 'Sum of cubes', formula: '[n(n+1)/2]²' },
      { name: 'HCF × LCM', formula: 'Product of two numbers' },
      { name: 'Number of factors', formula: 'If N = aᵖ·bq·cʳ → factors = (p+1)(q+1)(r+1)' },
    ],
    tips: [
      'Divisibility by 4: last 2 digits ÷ 4',
      'Divisibility by 8: last 3 digits ÷ 8',
      'Divisibility by 11: alternate digit sum difference ÷ 11',
      'For remainder problems: use cyclicity of last digits',
      'Cyclicity of 2: {2,4,8,6} repeats every 4 powers',
    ],
    example: {
      q: 'Find remainder when 2¹⁰⁰ is divided by 3',
      steps: ['2¹ = 2, remainder = 2', '2² = 4, remainder = 1', 'Pattern repeats every 2 powers: odd → 2, even → 1', '100 is even → remainder = 1'],
      answer: '1'
    }
  },
  {
    topic: 'Percentages',
    icon: '%', color: '#10b981', drillTopic: 'Percentages',
    description: 'Calculate percentage change, successive discounts, and population/income problems.',
    formulas: [
      { name: 'Percentage', formula: '(Value / Total) × 100' },
      { name: '% Increase', formula: '[(New - Old) / Old] × 100' },
      { name: 'Successive %', formula: 'a + b + ab/100 (for a% then b%)' },
      { name: '% to fraction', formula: '1/8=12.5%, 1/6≈16.67%, 1/3≈33.33%' },
    ],
    tips: [
      'x% of y = y% of x (use the simpler one)',
      'If price ↑ by r%, spend ↓ by [r/(100+r)]×100 to keep expense same',
      'Quick: 10% = move decimal, 5% = half of 10%, 15% = 10%+5%',
    ],
    example: {
      q: 'Price increased by 25%. By what % should consumption decrease to keep expense same?',
      steps: ['Use formula: r/(100+r) × 100', '= 25/125 × 100', '= 20%'],
      answer: '20%'
    }
  },
  {
    topic: 'Profit, Loss & Discount',
    icon: '💹', color: '#f59e0b', drillTopic: 'Profit & Loss',
    description: 'Selling price, cost price, marked price, successive discount, dishonest shopkeeper.',
    formulas: [
      { name: 'Profit %', formula: '(Profit / CP) × 100' },
      { name: 'SP', formula: 'CP × (100 + P%) / 100' },
      { name: 'CP from SP', formula: 'SP × 100 / (100 + P%)' },
      { name: 'Discount %', formula: '(Discount / MP) × 100' },
      { name: 'Dishonest profit', formula: '[(True wt - False wt) / False wt] × 100' },
    ],
    tips: [
      'Two articles at same SP, one at P% profit, one at P% loss → always loss of (P/10)²%',
      'Marked price trick: if discount d% and profit p%, MP = CP×(100+p)/(100-d)',
    ],
    example: {
      q: 'Two items sold at ₹990 each. One at 10% gain, other at 10% loss. Overall?',
      steps: ['Overall % = -(common %)²/100 = -1%', 'Loss = 1%'],
      answer: 'Loss of 1%'
    }
  },
  {
    topic: 'Simple & Compound Interest',
    icon: '🏦', color: '#8b5cf6', drillTopic: 'Quantitative Aptitude',
    description: 'SI vs CI, effective rate, doubling time, half-yearly/quarterly compounding.',
    formulas: [
      { name: 'Simple Interest', formula: 'SI = PRT/100' },
      { name: 'Compound Interest', formula: 'CI = P[(1 + R/100)ⁿ - 1]' },
      { name: 'CI - SI (2 yrs)', formula: 'P(R/100)²' },
      { name: 'Doubling time (72 rule)', formula: '≈ 72/R years' },
    ],
    tips: [
      'For half-yearly: R → R/2, n → 2n',
      'For quarterly: R → R/4, n → 4n',
      'CI for 2 years at r% = SI + SI×r/100',
    ],
    example: {
      q: 'Find CI on ₹1000 at 10% p.a. for 2 years.',
      steps: ['A = 1000 × (1.1)² = ₹1210', 'CI = 1210 - 1000 = ₹210'],
      answer: '₹210'
    }
  },
  {
    topic: 'Time & Work',
    icon: '⚙️', color: '#ef4444', drillTopic: 'Time & Work',
    description: 'Work done per day, combined work, pipes & cisterns, work efficiency.',
    formulas: [
      { name: '1 day work', formula: 'If A takes n days → 1/n per day' },
      { name: 'A+B together', formula: 'AB/(A+B) days' },
      { name: 'Pipe fill time', formula: 'Inlet +ve, outlet -ve' },
    ],
    tips: [
      'Use LCM method: set total work = LCM of given days',
      'If A is x times efficient than B → B takes x times longer',
      'Pipe: if fill=a hrs, empty=b hrs → fills in ab/(b-a)',
    ],
    example: {
      q: 'A takes 10 days, B takes 15 days. Working together?',
      steps: ['LCM(10,15) = 30 = total work', 'A=3/day, B=2/day, Together=5/day', 'Days = 30/5 = 6'],
      answer: '6 days'
    }
  },
  {
    topic: 'Time, Speed & Distance',
    icon: '🚂', color: '#06b6d4', drillTopic: 'Time Speed Distance',
    description: 'Trains, boats, relative speed, average speed, circular motion.',
    formulas: [
      { name: 'Speed', formula: 'Distance / Time' },
      { name: 'km/h → m/s', formula: '× 5/18' },
      { name: 'Average speed (equal dist)', formula: '2xy/(x+y)' },
      { name: 'Train passing train', formula: '(L1+L2)/(S1±S2)' },
      { name: 'Boat upstream', formula: 'Speed = Boat - Stream' },
    ],
    tips: [
      'Relative speed: same dir = difference, opposite = sum',
      'Circular track meeting: LCM of individual times (same dir)',
    ],
    example: {
      q: 'Train 200m at 60km/h crosses bridge 300m. Time?',
      steps: ['Total = 500m', 'Speed = 60×5/18 = 50/3 m/s', 'Time = 500÷(50/3) = 30s'],
      answer: '30 seconds'
    }
  },
  {
    topic: 'Averages & Ages',
    icon: '📊', color: '#ec4899', drillTopic: 'Averages',
    description: 'Weighted average, average speed, age problems with past/future ratios.',
    formulas: [
      { name: 'Average', formula: 'Sum / Count' },
      { name: 'New avg (add person)', formula: 'Old avg ± (new value - old avg)/(n+1)' },
      { name: 'Weighted avg', formula: '(w1x1 + w2x2)/(w1+w2)' },
    ],
    tips: [
      'If one person replaced: new avg = old avg + (new-old)/n',
      'Sum of ages changes by n years per year for n people',
    ],
    example: {
      q: 'Avg of 5 numbers is 20. Remove one, avg = 18. Find it.',
      steps: ['Sum of 5 = 100', 'Sum of 4 = 72', 'Removed = 100-72 = 28'],
      answer: '28'
    }
  },
  {
    topic: 'Ratio, Proportion & Mixture',
    icon: '⚖️', color: '#14b8a6', drillTopic: 'Ratio & Proportion',
    description: 'Direct/inverse proportion, mixture & alligation, partnership problems.',
    formulas: [
      { name: 'Alligation rule', formula: '(d-m):(m-c) where m=mean, c=cheap, d=dear' },
      { name: 'Partnership profit', formula: 'Proportional to Capital × Time' },
      { name: 'Mixture replaced k times', formula: 'Remaining = P(1-r/P)ᵏ' },
    ],
    tips: [
      'If A:B=2:3 and B:C=4:5, then A:B:C=8:12:15',
      'Alligation: draw cross, put mean in center',
    ],
    example: {
      q: 'Mix water with milk at ₹45/L to get ₹30/L mixture?',
      steps: ['Alligation: Milk=45, Water=0, Mean=30', 'Water:Milk = (45-30):(30-0) = 15:30 = 1:2'],
      answer: 'Water:Milk = 1:2'
    }
  },
  {
    topic: 'Permutation & Combination',
    icon: '🎲', color: '#f97316', drillTopic: 'Probability',
    description: 'Arrangements, selections, circular permutations, word problems.',
    formulas: [
      { name: 'nPr', formula: 'n! / (n-r)!' },
      { name: 'nCr', formula: 'n! / [r!(n-r)!]' },
      { name: 'Circular perm', formula: '(n-1)!' },
      { name: 'Identical items', formula: 'n! / (p! q! r!)' },
    ],
    tips: [
      'nCr = nC(n-r): choosing 3 from 10 = choosing 7 to exclude',
      'At least one = Total - None',
    ],
    example: {
      q: '4-digit numbers from 1–9 with no repetition?',
      steps: ['9P4 = 9×8×7×6 = 3024'],
      answer: '3024'
    }
  },
  {
    topic: 'Probability',
    icon: '🎯', color: '#7c3aed', drillTopic: 'Probability',
    description: 'Classical probability, conditional probability, cards, coins, dice.',
    formulas: [
      { name: 'P(E)', formula: 'Favorable / Total outcomes' },
      { name: 'P(A or B)', formula: 'P(A)+P(B)-P(A∩B)' },
      { name: 'P(A and B)', formula: 'P(A)×P(B) if independent' },
      { name: 'Conditional', formula: 'P(A|B) = P(A∩B)/P(B)' },
    ],
    tips: [
      'Deck: 52 cards, 4 suits, 13 each, 3 face cards per suit',
      'Coin: P(at least 1 head in n tosses) = 1-(1/2)ⁿ',
    ],
    example: {
      q: 'Two dice: P(sum = 8)?',
      steps: ['Favorable: (2,6),(3,5),(4,4),(5,3),(6,2) = 5', 'Total = 36', 'P = 5/36'],
      answer: '5/36'
    }
  },
];

const GUIDE_REASONING = [
  {
    topic: 'Number Series',
    icon: '🔗', color: '#22c55e', drillTopic: 'Series',
    description: 'Arithmetic, geometric, difference series, and mixed patterns.',
    formulas: [
      { name: 'AP general term', formula: 'a + (n-1)d' },
      { name: 'GP general term', formula: 'a × rⁿ⁻¹' },
    ],
    tips: [
      'Check 1st difference, 2nd difference, ratio',
      'Prime series: 2,3,5,7,11,13,17,19...',
      'Square series: 1,4,9,16,25,36...',
      'Mixed: separate even/odd positions',
    ],
    example: {
      q: 'Find next: 2, 6, 12, 20, 30, ?',
      steps: ['Differences: 4,6,8,10,12', '2nd diff = 2 (constant)', 'Next = 30+12 = 42'],
      answer: '42'
    }
  },
  {
    topic: 'Coding-Decoding',
    icon: '🔐', color: '#0ea5e9', drillTopic: 'Coding-Decoding',
    description: 'Letter coding, number coding, substitution cipher, reverse alphabets.',
    formulas: [
      { name: 'Alphabet positions', formula: 'A=1, B=2 ... Z=26' },
      { name: 'Opposite letter', formula: 'A↔Z, B↔Y (sum = 27)' },
    ],
    tips: [
      'EJOTY rule: E=5, J=10, O=15, T=20, Y=25',
      'Check if each letter is shifted by same amount',
      'Check reverse alphabet if forward shift fails',
    ],
    example: {
      q: 'If PENCIL = RGPEML, find code for PAPER',
      steps: ['P→R (+2), E→G (+2), N→P (+2)...', 'Each letter shifted by +2', 'P→R, A→C, P→R, E→G, R→T'],
      answer: 'RCRGT'
    }
  },
  {
    topic: 'Blood Relations',
    icon: '👨‍👩‍👧', color: '#f43f5e', drillTopic: 'Blood Relations',
    description: 'Family tree puzzles, mother/father/uncle/aunt/sibling relationships.',
    formulas: [],
    tips: [
      'Always draw a family tree diagram',
      'Identify gender from pronouns (his/her)',
      '"Only son" = no other children',
      'Paternal = father\'s side, Maternal = mother\'s side',
      'Nephew/niece = sibling\'s son/daughter',
    ],
    example: {
      q: 'A is B\'s sister. C is B\'s mother. D is C\'s father. How is A related to D?',
      steps: ['A and B are siblings', 'C is A\'s mother', 'D is C\'s father = A\'s grandfather'],
      answer: 'A is D\'s granddaughter'
    }
  },
  {
    topic: 'Direction Sense',
    icon: '🧭', color: '#84cc16', drillTopic: 'Direction Sense',
    description: 'Navigation problems with turns, final direction, shadow problems.',
    formulas: [
      { name: 'Turn Right (clockwise)', formula: 'N→E→S→W→N' },
      { name: 'Turn Left (anti-clockwise)', formula: 'N→W→S→E→N' },
    ],
    tips: [
      'Always fix North upward and draw the path',
      'Final distance: use Pythagoras for right-angle path',
      'Shadow in morning = East side (Sun rises East)',
      'Shadow in evening = West side (Sun sets West)',
    ],
    example: {
      q: 'North, turn right 90°, walk 5km, turn left 90°, walk 12km. Distance from start?',
      steps: ['North→East→walk 5km', 'East→North→walk 12km', 'Net: 5km East, 12km North', 'Distance = √(5²+12²) = √169 = 13km'],
      answer: '13 km'
    }
  },
  {
    topic: 'Syllogisms',
    icon: '🧠', color: '#6366f1', drillTopic: 'Syllogisms',
    description: 'Venn diagram logic — All, No, Some, Some-Not statements.',
    formulas: [
      { name: 'All A are B', formula: 'A is completely inside B' },
      { name: 'No A is B', formula: 'A and B don\'t overlap' },
      { name: 'Some A are B', formula: 'A and B partially overlap' },
    ],
    tips: [
      'Draw all possible Venn diagrams',
      'A conclusion is valid only if it holds in ALL diagrams',
      'All+All→All, All+No→No, All+Some→Some',
      '"Definitely true" = valid in every possible case',
    ],
    example: {
      q: 'All dogs are animals. Some animals are cats. Conclusion: Some cats are dogs?',
      steps: ['Dogs inside Animals circle', 'Some Animals overlap with Cats', 'Cats may or may not overlap Dogs'],
      answer: 'Cannot be concluded'
    }
  },
  {
    topic: 'Analogy & Classification',
    icon: '🔄', color: '#a855f7', drillTopic: 'Logical Reasoning',
    description: 'Find the odd one out, complete the pair with the same relationship.',
    formulas: [],
    tips: [
      'Identify the relationship in the given pair first',
      'Relationships: tool-use, part-whole, cause-effect, degree',
      'For classification: find the one that doesn\'t belong to the same category',
      'Check multiple aspects: function, size, material, origin',
    ],
    example: {
      q: 'Pen:Write :: Knife:?',
      steps: ['Pen is used to Write', 'Similarly, Knife is used to...', 'Cut'],
      answer: 'Cut'
    }
  },
  {
    topic: 'Seating Arrangement',
    icon: '💺', color: '#f59e0b', drillTopic: 'Logical Reasoning',
    description: 'Linear rows, circular arrangements, facing directions, positions.',
    formulas: [],
    tips: [
      'For linear: fix one person, place others using relative clues',
      'For circular: fix one person\'s position, arrange rest relatively',
      'Note "facing center" vs "facing outside" for circular',
      'Use process of elimination — try different positions',
      '"Immediate neighbor" = directly adjacent',
    ],
    example: {
      q: '5 people A,B,C,D,E sit in a row. B is 2nd from left. D is to the right of C. A is at one end.',
      steps: ['A is at one end (pos 1 or 5)', 'B is at position 2', 'Try A at pos 1: B at 2, try C,D...', 'Fill remaining positions'],
      answer: 'Use constraint satisfaction'
    }
  },
  {
    topic: 'Statement & Assumptions / Conclusions',
    icon: '📋', color: '#06b6d4', drillTopic: 'Logical Reasoning',
    description: 'Evaluate whether assumptions/conclusions follow from given statements.',
    formulas: [],
    tips: [
      'Assumption: something taken for granted in the statement',
      'Conclusion: something that directly follows from the statement',
      'If the statement is an advice/appeal — the writer assumes it\'s actionable',
      'Do not use outside knowledge — judge only from the statement',
      '"Some" is weaker than "All"; "may" is weaker than "will"',
    ],
    example: {
      q: 'Statement: "Children, drink milk daily." Assumption: Drinking milk is beneficial.',
      steps: ['The advice is given because it\'s assumed beneficial', 'This assumption supports the statement'],
      answer: 'Assumption follows'
    }
  },
  {
    topic: 'Input-Output / Machine Coding',
    icon: '⌨️', color: '#ec4899', drillTopic: 'Logical Reasoning',
    description: 'Step-by-step word/number arrangement by a machine.',
    formulas: [],
    tips: [
      'First identify the pattern after step 1 and step 2',
      'Words often sorted alphabetically or by length',
      'Numbers often sorted in ascending/descending order',
      'Sometimes alternating — numbers on left, words on right',
      'Once pattern found, apply forward or backward',
    ],
    example: {
      q: 'Input: "sky 23 blue 14 green 5". Step 1: "5 sky 23 blue 14 green". Step 2: "5 14 sky 23 blue green"',
      steps: ['Numbers are being sorted to front in ascending order', 'Step 3: "5 14 23 sky blue green"', 'Step 4: "5 14 23 blue green sky"'],
      answer: 'Numbers sort first, then words alphabetically'
    }
  },
];

const GUIDE_VERBAL = [
  {
    topic: 'Synonyms & Antonyms',
    icon: '📖', color: '#3b82f6', drillTopic: 'Verbal Ability',
    description: 'Vocabulary — words with similar/opposite meanings frequently asked in campus tests.',
    formulas: [],
    tips: [
      'Root words: "bene" = good (beneficial, benevolent), "mal" = bad (malicious)',
      'Root "voc/vok" = voice/call (vocal, invoke, revoke)',
      '"philo" = love (philosophy), "mis/miso" = hate (misanthrope)',
      'Negative prefixes: un-, dis-, in-, ir-, im-, il-',
      'Suffix "-ous" = full of (joyous), "-ive" = tending to (active)',
    ],
    tips2: [
      { word: 'LACONIC', syn: 'Brief, Concise, Terse', ant: 'Verbose, Lengthy' },
      { word: 'BENEVOLENT', syn: 'Kind, Generous', ant: 'Malevolent, Cruel' },
      { word: 'EPHEMERAL', syn: 'Transient, Fleeting', ant: 'Permanent, Eternal' },
      { word: 'SAGACIOUS', syn: 'Wise, Prudent', ant: 'Foolish, Ignorant' },
      { word: 'OBSTINATE', syn: 'Stubborn, Adamant', ant: 'Flexible, Compliant' },
    ],
    example: {
      q: 'Synonym of GARRULOUS?',
      steps: ['Root: from Latin "garrire" = to chatter', 'Means: excessively talkative', 'Synonym = Loquacious or Verbose'],
      answer: 'Talkative / Verbose'
    }
  },
  {
    topic: 'Fill in the Blanks',
    icon: '✏️', color: '#10b981', drillTopic: 'Verbal Ability',
    description: 'Select the most appropriate word(s) based on context and grammar.',
    formulas: [],
    tips: [
      'Read entire sentence before choosing — context matters most',
      'Check grammar: article (a/an), preposition, verb tense',
      'Eliminate obviously wrong options first',
      'For double blanks: both words must fit logically together',
      'Contrast clues: "although, despite, however, but" signal opposite meaning',
      'Cause-effect: "because, therefore, thus, so" signal similar/resulting idea',
    ],
    example: {
      q: 'The scientist was _____ about the results, as they were _____ from expected.',
      steps: ['First blank: emotion about results (excited? worried?)', 'Second blank: "far from expected" = divergent', '"Puzzled" and "divergent" fit', 'Or: excited + different'],
      answer: 'puzzled / divergent'
    }
  },
  {
    topic: 'Sentence Correction & Spotting Errors',
    icon: '🔍', color: '#f59e0b', drillTopic: 'Verbal Ability',
    description: 'Identify grammatical errors in subject-verb agreement, tense, articles, prepositions.',
    formulas: [],
    tips: [
      'Subject-verb agreement: singular subject → singular verb',
      '"Each/Every/Neither/Either/One of" takes singular verb',
      '"Both/Few/Many/Several" take plural verb',
      'Collective nouns (team, jury): singular verb unless acting individually',
      'Tense: "since" uses perfect tense ("have been"), "ago" uses simple past',
      'Articles: "a" before consonant sound, "an" before vowel sound',
      'Prepositions: "different from" (not "to"), "interested in", "afraid of"',
    ],
    example: {
      q: 'Find error: "Neither of the boys (A) have done (B) their homework (C) today (D)"',
      steps: ['Neither = singular subject', '"have done" should be "has done"', 'Error is in Part B'],
      answer: 'Part B: "have done" → "has done"'
    }
  },
  {
    topic: 'Para Jumbles',
    icon: '🔀', color: '#8b5cf6', drillTopic: 'Verbal Ability',
    description: 'Rearrange jumbled sentences into a coherent paragraph.',
    formulas: [],
    tips: [
      'Find the opening sentence: introduces topic, no pronoun without reference',
      'Find the closing sentence: conclusion, summary, or consequence',
      'Pronouns (he/she/it/they) must refer to a noun in a previous sentence',
      'Connectors: "however, therefore, moreover, furthermore" link ideas',
      'Look for time sequence: "first, then, later, finally"',
      'Mandatory pairs: a question followed by its answer',
    ],
    example: {
      q: 'Arrange: P:He became famous. Q:He started painting at age 5. R:He was born in Italy. S:His paintings sold worldwide.',
      steps: ['R introduces the person (birth)', 'Q: early life event', 'P: result of talent', 'S: ultimate consequence'],
      answer: 'R → Q → P → S'
    }
  },
  {
    topic: 'Active & Passive Voice',
    icon: '🔁', color: '#ef4444', drillTopic: 'Verbal Ability',
    description: 'Convert between active and passive voice across all tenses.',
    formulas: [
      { name: 'Passive formula', formula: 'Object + be(tense) + V3 + by + Subject' },
      { name: 'Simple Present', formula: 'is/am/are + V3' },
      { name: 'Simple Past', formula: 'was/were + V3' },
      { name: 'Future', formula: 'will be + V3' },
      { name: 'Present Perfect', formula: 'has/have been + V3' },
    ],
    tips: [
      'Active: Subject + Verb + Object → "She wrote a letter"',
      'Passive: Object + be + V3 + by Subject → "A letter was written by her"',
      'Pronouns change: I→me, he→him, she→her, they→them, we→us',
      'Modal passives: can→can be, must→must be, should→should be',
    ],
    example: {
      q: 'Change to passive: "They will complete the project tomorrow."',
      steps: ['Object = "the project" → moves to front', 'will + be + V3 = "will be completed"', 'Subject "They" → "by them"'],
      answer: '"The project will be completed by them tomorrow."'
    }
  },
  {
    topic: 'Direct & Indirect Speech',
    icon: '💬', color: '#06b6d4', drillTopic: 'Verbal Ability',
    description: 'Convert reported speech — changing pronouns, tense, and time expressions.',
    formulas: [],
    tips: [
      'Present Simple → Past Simple (say → said)',
      'Present Continuous → Past Continuous',
      'Past Simple → Past Perfect',
      'will → would, can → could, may → might, must → had to',
      'Time changes: now→then, today→that day, tomorrow→next day, yesterday→previous day',
      'Pronouns: I→he/she, we→they, you→he/she/they (based on context)',
    ],
    example: {
      q: 'He said, "I will come here tomorrow."',
      steps: ['"I" → "he"', '"will" → "would"', '"here" → "there"', '"tomorrow" → "the next day"'],
      answer: 'He said that he would come there the next day.'
    }
  },
  {
    topic: 'Reading Comprehension',
    icon: '📰', color: '#14b8a6', drillTopic: 'Verbal Ability',
    description: 'Extract information, find main idea, inference, tone and author\'s purpose.',
    formulas: [],
    tips: [
      'Read questions BEFORE reading the passage',
      'Main idea: usually in first or last paragraph',
      'Tone: objective/neutral vs subjective/biased',
      'Inference: something implied, not directly stated',
      'For "suggests/implies" — select what can be logically deduced',
      '"According to passage" — answer must be in text, not assumed',
      'Eliminate options that are too broad, too narrow, or opposite',
    ],
    example: {
      q: 'How to approach RC questions?',
      steps: ['1. Read questions first to know what to look for', '2. Read passage actively, underlining key ideas', '3. Answer factual questions with text evidence', '4. For inference, reason logically from given facts'],
      answer: 'Read questions first, then passage'
    }
  },
  {
    topic: 'Prepositions & Articles',
    icon: '📝', color: '#ec4899', drillTopic: 'Verbal Ability',
    description: 'Common preposition usage and article (a/an/the) rules.',
    formulas: [],
    tips: [
      '"a" before consonant sound: a university (yoo), a European',
      '"an" before vowel sound: an hour (silent h), an MBA',
      '"the" for specific/known things: "the sun", "the book you gave"',
      'No article: general plurals ("Dogs are loyal"), languages, most proper nouns',
      'Prepositions: "at" for point in time/place, "in" for period/enclosed space, "on" for day/surface',
      'Common pairs: arrive at/in, depend on, listen to, look at, wait for',
    ],
    example: {
      q: '"She has been waiting ___ two hours ___ the bus stop."',
      steps: ['Duration → "for" (for two hours)', 'Location (point) → "at" (at the bus stop)'],
      answer: 'for ... at'
    }
  },
];

const GUIDE_DI = [
  {
    topic: 'Bar Charts',
    icon: '📊', color: '#3b82f6', drillTopic: 'Data Interpretation',
    description: 'Compare categories, find percentage change, calculate ratios from bar graphs.',
    formulas: [
      { name: '% Change', formula: '[(New - Old) / Old] × 100' },
      { name: 'Ratio', formula: 'Value A / Value B' },
    ],
    tips: [
      'Read the scale carefully — check if y-axis starts from 0',
      'For "total", add relevant bars visually',
      'For % share: (individual bar / sum of all bars) × 100',
      'Compare bars visually before calculating for approximate answers',
    ],
    example: {
      q: 'Sales: 2020=400, 2021=500. What is % increase?',
      steps: ['Increase = 500-400 = 100', '% change = (100/400)×100 = 25%'],
      answer: '25% increase'
    }
  },
  {
    topic: 'Pie Charts',
    icon: '🥧', color: '#f59e0b', drillTopic: 'Data Interpretation',
    description: 'Calculate values from percentages, compare sectors, find central angles.',
    formulas: [
      { name: 'Value from %', formula: '(% / 100) × Total' },
      { name: 'Central angle', formula: '(% / 100) × 360°' },
      { name: 'Ratio of two sectors', formula: '%A / %B' },
    ],
    tips: [
      'Central angle = (Percentage/100) × 360',
      'If total is given, find individual values using given %',
      'Ratio of two items = ratio of their percentages',
      'Check whether pie shows %, degrees, or actual values',
    ],
    example: {
      q: 'Sector A = 30% in a pie chart with total = 500. Value of A?',
      steps: ['Value = (30/100) × 500', '= 150'],
      answer: '150'
    }
  },
  {
    topic: 'Line Graphs',
    icon: '📈', color: '#10b981', drillTopic: 'Data Interpretation',
    description: 'Track trends over time, find rate of change, identify peak/trough points.',
    formulas: [
      { name: 'Growth Rate', formula: '[(V2-V1)/V1] × 100' },
      { name: 'Average over n years', formula: 'Sum of all values / n' },
    ],
    tips: [
      'Look for steepest rise/fall (maximum growth rate)',
      'For "average", add all values and divide by count',
      'Multiple line graphs: identify which line is which',
      '"During which year was the growth maximum?" → Compare consecutive differences',
    ],
    example: {
      q: 'Revenue: 2019=200, 2020=250, 2021=220. Which year had max growth?',
      steps: ['2019→2020: +50 (25% growth)', '2020→2021: -30 (-12% growth)', '2019-2020 had maximum growth'],
      answer: '2019–2020'
    }
  },
  {
    topic: 'Data Tables',
    icon: '📋', color: '#8b5cf6', drillTopic: 'Data Interpretation',
    description: 'Extract specific values, calculate row/column totals, find averages and percentages.',
    formulas: [],
    tips: [
      'Read the table header and row labels carefully',
      'For row total: add all values in that row',
      'For column total: add all values in that column',
      'Cross-calculation: always verify your reading of row+column intersection',
      'For missing values: often use total minus given values',
      'Approximate where exact calculation isn\'t needed',
    ],
    example: {
      q: 'Table shows: A sold 100 units in Q1, 150 in Q2. B sold 200 in Q1, 180 in Q2. Who sold more in Q1+Q2?',
      steps: ['A total = 100+150 = 250', 'B total = 200+180 = 380', 'B sold more'],
      answer: 'B sold more (380 vs 250)'
    }
  },
  {
    topic: 'Mixed DI (Caselets)',
    icon: '📊', color: '#ef4444', drillTopic: 'Data Interpretation',
    description: 'Data given in paragraph form — extract figures, build mental table, solve.',
    formulas: [],
    tips: [
      'First: identify ALL numerical data from the paragraph',
      'Build a table/chart from the data before answering',
      'Watch for "of the remaining" type language',
      'Check if percentages are of whole or of a subset',
      'Approximate answers: eliminate far-off options first',
    ],
    example: {
      q: 'A school has 600 students. 60% are boys. Of the girls, 40% play sports. How many girls play sports?',
      steps: ['Girls = 40% of 600 = 240', 'Girls playing sports = 40% of 240 = 96'],
      answer: '96 girls'
    }
  },
];

const MOCK_TYPE_LABELS = {
  mock_tcs_1: { label: 'TCS NQT Mock 1', company: 'TCS', duration: 40, color: '#3b82f6' },
  mock_tcs_2: { label: 'TCS NQT Mock 2', company: 'TCS', duration: 40, color: '#3b82f6' },
  mock_tcs_3: { label: 'TCS NQT Mock 3', company: 'TCS', duration: 40, color: '#3b82f6' },
  mock_tcs_4: { label: 'TCS NQT Mock 4', company: 'TCS', duration: 40, color: '#3b82f6' },
  mock_tcs_5: { label: 'TCS NQT Mock 5', company: 'TCS', duration: 40, color: '#3b82f6' },
  mock_wipro_1: { label: 'Wipro NLTH Mock 1', company: 'Wipro', duration: 35, color: '#8b5cf6' },
  mock_wipro_2: { label: 'Wipro NLTH Mock 2', company: 'Wipro', duration: 35, color: '#8b5cf6' },
  mock_infosys_1: { label: 'Infosys InfyTQ Mock 1', company: 'Infosys', duration: 35, color: '#06b6d4' },
  mock_infosys_2: { label: 'Infosys InfyTQ Mock 2', company: 'Infosys', duration: 35, color: '#06b6d4' },
  mock_cognizant_1: { label: 'Cognizant GenC Mock 1', company: 'Cognizant', duration: 30, color: '#10b981' },
  mock_cognizant_2: { label: 'Cognizant GenC Mock 2', company: 'Cognizant', duration: 30, color: '#10b981' },
  mock_cognizant_3: { label: 'Cognizant GenC Mock 3', company: 'Cognizant', duration: 30, color: '#10b981' },
  mock_accenture_1: { label: 'Accenture Cognitive Mock 1', company: 'Accenture', duration: 30, color: '#a855f7' },
  mock_accenture_2: { label: 'Accenture Cognitive Mock 2', company: 'Accenture', duration: 30, color: '#a855f7' },
  mock_accenture_3: { label: 'Accenture Cognitive Mock 3', company: 'Accenture', duration: 30, color: '#a855f7' },
  mock_capgemini_1: { label: 'Capgemini Mock 1', company: 'Capgemini', duration: 30, color: '#f59e0b' },
  mock_capgemini_2: { label: 'Capgemini Mock 2', company: 'Capgemini', duration: 30, color: '#f59e0b' },
  mock_hcl_1: { label: 'HCL TechBee Mock 1', company: 'HCL', duration: 35, color: '#ef4444' },
  mock_hcl_2: { label: 'HCL TechBee Mock 2', company: 'HCL', duration: 35, color: '#ef4444' },
  mock_zoho_1: { label: 'Zoho Aptitude Mock 1', company: 'Zoho', duration: 45, color: '#14b8a6' },
  mock_zoho_2: { label: 'Zoho Aptitude Mock 2', company: 'Zoho', duration: 45, color: '#14b8a6' },
  mock_general_1: { label: 'General Aptitude Mock 1', company: 'General', duration: 30, color: '#64748b' },
  mock_general_2: { label: 'General Aptitude Mock 2', company: 'General', duration: 30, color: '#64748b' },
  mock_general_3: { label: 'General Aptitude Mock 3', company: 'General', duration: 30, color: '#64748b' },
};

const GUIDE_CATEGORIES = [
  { key: 'quant', label: 'Quantitative', icon: '🔢', color: '#3b82f6', data: GUIDE_QUANT, count: GUIDE_QUANT.length },
  { key: 'reasoning', label: 'Reasoning', icon: '🧠', color: '#8b5cf6', data: GUIDE_REASONING, count: GUIDE_REASONING.length },
  { key: 'verbal', label: 'Verbal', icon: '📖', color: '#10b981', data: GUIDE_VERBAL, count: GUIDE_VERBAL.length },
  { key: 'di', label: 'Data Interpretation', icon: '📊', color: '#f59e0b', data: GUIDE_DI, count: GUIDE_DI.length },
];

const PYQ_COMPANIES = ['All', 'TCS', 'Infosys', 'Wipro', 'Cognizant', 'Accenture', 'HCL', 'Zoho', 'Capgemini', 'Tech Mahindra'];
const PYQ_SECTIONS = [
  { key: 'all', label: 'All Sections' },
  { key: 'quant', label: 'Quantitative' },
  { key: 'reasoning', label: 'Reasoning' },
  { key: 'verbal', label: 'Verbal' },
];

const COMPANY_COLORS = {
  TCS: '#3b82f6', Infosys: '#06b6d4', Wipro: '#8b5cf6',
  Cognizant: '#10b981', Accenture: '#a855f7', HCL: '#ef4444',
  Zoho: '#14b8a6', Capgemini: '#f59e0b', 'Tech Mahindra': '#ec4899', All: '#64748b'
};

const TABS = ['Mock Tests', 'Topic Drill', 'Study Guide', 'Prev Year Qs', 'Company Patterns', 'My Results'];
const TAB_QUERY_KEYS = ['mocks', 'drill', 'guide', 'pyq', 'patterns', 'results'];

const getTabIndexFromQuery = (searchParams) => {
  const key = searchParams.get('tab');
  const idx = TAB_QUERY_KEYS.indexOf(key);
  return idx >= 0 ? idx : 0;
};

export default function AptitudePrep() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState(() => getTabIndexFromQuery(searchParams));
  const [mocks, setMocks] = useState([]);
  const [results, setResults] = useState([]);
  const [loadingMocks, setLoadingMocks] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [guideExpanded, setGuideExpanded] = useState(null);
  const [guideCat, setGuideCat] = useState('quant');
  const [drill, setDrill] = useState({ topic: '', difficulty: '', count: 10 });
  const [drillQs, setDrillQs] = useState([]);
  const [drillIdx, setDrillIdx] = useState(0);
  const [drillAns, setDrillAns] = useState(null);
  const [drillScore, setDrillScore] = useState(0);
  const [drillActive, setDrillActive] = useState(false);
  const [drillLoading, setDrillLoading] = useState(false);
  // PYQ state
  const [pyqCompany, setPyqCompany] = useState('All');
  const [pyqSection, setPyqSection] = useState('all');
  const [pyqQuestions, setPyqQuestions] = useState([]);
  const [pyqLoading, setPyqLoading] = useState(false);
  const [pyqTotal, setPyqTotal] = useState(0);
  const [pyqExpanded, setPyqExpanded] = useState(null);
  const [pyqLimit, setPyqLimit] = useState(20);
  const navigate = useNavigate();

  useEffect(() => { fetchData(); }, []);
  useEffect(() => { setTab(getTabIndexFromQuery(searchParams)); }, [searchParams]);
  useEffect(() => { if (tab === 3) fetchPYQ(); }, [tab, pyqCompany, pyqSection, pyqLimit]);

  const onTabChange = (index) => {
    setTab(index);
    const next = new URLSearchParams(searchParams);
    next.set('tab', TAB_QUERY_KEYS[index]);
    setSearchParams(next);
  };

  const fetchData = async () => {
    try {
      const [mocksRes, resultsRes] = await Promise.all([
        api.get('/aptitude/mocks'),
        api.get('/aptitude/results')
      ]);
      setMocks(mocksRes.data.mocks || []);
      setResults(resultsRes.data.results || []);
    } catch { }
    finally { setLoadingMocks(false); }
  };

  const fetchPYQ = async () => {
    setPyqLoading(true);
    try {
      const params = { limit: pyqLimit };
      if (pyqCompany !== 'All') params.company = pyqCompany;
      if (pyqSection !== 'all') params.section = pyqSection;
      const { data } = await api.get('/aptitude/pyq', { params });
      setPyqQuestions(data.questions || []);
      setPyqTotal(data.total || 0);
    } catch { toast.error('Failed to load PYQ questions'); }
    finally { setPyqLoading(false); }
  };

  const startDrill = async () => {
    if (!drill.topic) { toast.error('Select a topic'); return; }
    setDrillLoading(true);
    try {
      const { data } = await api.get('/aptitude/drill', { params: drill });
      setDrillQs(data.questions);
      setDrillIdx(0); setDrillAns(null); setDrillScore(0); setDrillActive(true);
    } catch { toast.error('Failed to load questions'); }
    finally { setDrillLoading(false); }
  };

  const checkDrillAnswer = async (qId, ans) => {
    setDrillAns(ans);
    try {
      const { data } = await api.post('/aptitude/drill/check', { questionId: qId, userAnswer: ans });
      if (data.isCorrect) setDrillScore(s => s + 1);
      setDrillQs(prev => prev.map((q, i) =>
        i === drillIdx ? { ...q, correctAnswer: data.correctAnswer, explanation: data.explanation } : q
      ));
    } catch {}
  };

  const prevResultScore = (mockId) => {
    const r = results.find(r => r.mockId === mockId);
    return r ? r.score : null;
  };

  const getMockMeta = (mockId) => {
    const preset = MOCK_TYPE_LABELS[mockId] || {};
    const live = mocks.find(m => m.mockId === mockId) || {};
    return {
      label: preset.label || live.title || mockId.replace(/_/g, ' ').toUpperCase(),
      company: preset.company || live.company || 'General',
      duration: preset.duration || live.duration || 30,
      color: preset.color || '#64748b'
    };
  };

  const activeCatData = GUIDE_CATEGORIES.find(c => c.key === guideCat);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-20 md:pb-0">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>📐 Aptitude Prep</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Master quantitative, logical, and verbal aptitude for campus placements</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl overflow-x-auto" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => onTabChange(i)}
            className="flex-1 py-2 px-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap"
            style={tab === i
              ? { background: 'linear-gradient(135deg,#7c3aed,#06b6d4)', color: 'white' }
              : { color: 'var(--text-secondary)' }}>
            {t}
          </button>
        ))}
      </div>

      {/* ── Mock Tests Tab ── */}
      {tab === 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loadingMocks
            ? Array(9).fill(0).map((_, i) => <div key={i} className="skeleton h-36 rounded-xl" />)
            : mocks.length === 0 ? (
              <div className="card text-center py-10 col-span-full">
                <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>No aptitude mocks found</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Seed aptitude data and refresh this page.</p>
              </div>
            ) : mocks.map(({ mockId }) => {
                const meta = getMockMeta(mockId);
                const prev = prevResultScore(mockId);
                return (
                  <motion.div key={mockId} whileHover={{ y: -2 }}
                    className="card cursor-pointer" onClick={() => navigate(`/aptitude/mock/${mockId}`)}>
                    <div className="flex items-start justify-between mb-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold text-white"
                        style={{ background: meta.color }}>{meta.company}</span>
                      {prev !== null && (
                        <span className="text-xs font-semibold" style={{ color: prev >= 16 ? '#22c55e' : '#f59e0b' }}>
                          {prev}/25
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>{meta.label}</h3>
                    <div className="flex items-center gap-3 text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
                      <span className="flex items-center gap-1"><BookOpen size={12} /> 25 Qs</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {meta.duration} min</span>
                    </div>
                    <button className="w-full py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
                      style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)' }}>
                      {prev !== null ? 'Retake Test' : 'Start Test'} →
                    </button>
                  </motion.div>
                );
              })
          }
        </div>
      )}

      {/* ── Topic Drill Tab ── */}
      {tab === 1 && (
        <div className="space-y-4">
          {!drillActive ? (
            <div className="card space-y-5">
              <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Configure Topic Drill</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Topic *</label>
                  <select value={drill.topic} onChange={e => setDrill(p => ({ ...p, topic: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                    style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                    <option value="">Select topic...</option>
                    {TOPICS.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Difficulty</label>
                  <select value={drill.difficulty} onChange={e => setDrill(p => ({ ...p, difficulty: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                    style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                    <option value="">Any</option>
                    <option>Easy</option><option>Medium</option><option>Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Questions</label>
                  <select value={drill.count} onChange={e => setDrill(p => ({ ...p, count: Number(e.target.value) }))}
                    className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                    style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                    <option value={10}>10 Questions</option>
                    <option value={20}>20 Questions</option>
                    <option value={30}>30 Questions</option>
                  </select>
                </div>
              </div>
              <button onClick={startDrill} disabled={drillLoading} className="btn-primary">
                {drillLoading ? 'Loading...' : <><Play size={15} /> Start Drill</>}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Q{drillIdx + 1}/{drillQs.length} · Score: {drillScore}/{drillIdx + (drillAns ? 1 : 0)}
                </div>
                <button onClick={() => setDrillActive(false)} className="text-xs px-3 py-1.5 rounded-lg border"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>End Drill</button>
              </div>
              {drillIdx < drillQs.length && (
                <div className="card space-y-4">
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{drillQs[drillIdx].questionText}</p>
                  <div className="space-y-2">
                    {['A','B','C','D'].map((opt, i) => {
                      const isSelected = drillAns === opt;
                      const isCorrect = drillQs[drillIdx].correctAnswer === opt;
                      const bg = !drillAns ? 'var(--bg-primary)'
                        : isCorrect ? 'rgba(34,197,94,0.15)'
                        : isSelected ? 'rgba(239,68,68,0.15)'
                        : 'var(--bg-primary)';
                      const border = !drillAns ? 'var(--border)'
                        : isCorrect ? '#22c55e'
                        : isSelected ? '#ef4444'
                        : 'var(--border)';
                      return (
                        <button key={opt} disabled={!!drillAns}
                          onClick={() => checkDrillAnswer(drillQs[drillIdx]._id, opt)}
                          className="w-full flex items-start gap-3 p-3 rounded-xl border text-left text-sm transition-all"
                          style={{ background: bg, borderColor: border, color: 'var(--text-primary)' }}>
                          <span className="font-bold shrink-0 w-5">{opt}.</span>
                          {drillQs[drillIdx].options?.[i]}
                        </button>
                      );
                    })}
                  </div>
                  {drillAns && drillQs[drillIdx].explanation && (
                    <div className="p-3 rounded-xl text-sm" style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', color: 'var(--text-secondary)' }}>
                      <span className="font-semibold" style={{ color: '#06b6d4' }}>Explanation: </span>
                      {drillQs[drillIdx].explanation}
                    </div>
                  )}
                  {drillAns && (
                    <button onClick={() => {
                      if (drillIdx + 1 >= drillQs.length) { setDrillActive(false); toast.success(`Drill complete! ${drillScore}/${drillQs.length}`); }
                      else { setDrillIdx(i => i + 1); setDrillAns(null); }
                    }} className="btn-primary">
                      {drillIdx + 1 >= drillQs.length ? 'Finish Drill' : 'Next Question'} <ChevronRight size={15} />
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Study Guide Tab ── */}
      {tab === 2 && (
        <div className="space-y-4">
          {/* Intro banner */}
          <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.12),rgba(6,182,212,0.12))', border: '1px solid rgba(124,58,237,0.25)' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="text-2xl">📚</div>
              <div>
                <div className="font-bold" style={{ color: 'var(--text-primary)' }}>Complete Aptitude Study Guide</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>Formulas • Shortcuts • Tips • Solved Examples — all in one place</div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {GUIDE_CATEGORIES.map(cat => (
                <div key={cat.key} className="text-center p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <div className="text-lg">{cat.icon}</div>
                  <div className="font-bold text-sm" style={{ color: cat.color }}>{cat.count}</div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{cat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Category selector */}
          <div className="flex gap-2 overflow-x-auto">
            {GUIDE_CATEGORIES.map(cat => (
              <button key={cat.key} onClick={() => { setGuideCat(cat.key); setGuideExpanded(null); }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all"
                style={guideCat === cat.key
                  ? { background: cat.color, color: 'white' }
                  : { background: `${cat.color}15`, color: cat.color, border: `1px solid ${cat.color}30` }}>
                <span>{cat.icon}</span> {cat.label}
              </button>
            ))}
          </div>

          {/* Guide topics */}
          {activeCatData?.data.map((guide, idx) => (
            <div key={idx} className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
              <button className="w-full flex items-center justify-between p-5 text-left"
                onClick={() => setGuideExpanded(guideExpanded === idx ? null : idx)}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold"
                    style={{ background: `${guide.color}20`, color: guide.color, border: `1px solid ${guide.color}40` }}>
                    {guide.icon}
                  </div>
                  <div>
                    <div className="font-bold" style={{ color: 'var(--text-primary)' }}>{guide.topic}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{guide.description}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4 shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); setDrill(p => ({ ...p, topic: guide.drillTopic })); onTabChange(1); }}
                    className="hidden sm:flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-medium"
                    style={{ background: `${guide.color}15`, color: guide.color }}>
                    <Play size={11} /> Practice
                  </button>
                  <ChevronDown size={16} className={`transition-transform ${guideExpanded === idx ? 'rotate-180' : ''}`}
                    style={{ color: 'var(--text-secondary)' }} />
                </div>
              </button>

              <AnimatePresence>
                {guideExpanded === idx && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                    className="overflow-hidden border-t" style={{ borderColor: 'var(--border)' }}>
                    <div className="p-5 space-y-5">
                      {/* Formulas */}
                      {guide.formulas?.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Calculator size={15} style={{ color: guide.color }} />
                            <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Key Formulas</span>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-2">
                            {guide.formulas.map((f, i) => (
                              <div key={i} className="rounded-xl p-3" style={{ background: `${guide.color}08`, border: `1px solid ${guide.color}25` }}>
                                <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{f.name}</div>
                                <div className="font-mono font-bold text-sm" style={{ color: guide.color }}>{f.formula}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Vocab table for synonyms/antonyms */}
                      {guide.tips2?.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <BookOpen size={15} style={{ color: guide.color }} />
                            <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Important Words</span>
                          </div>
                          <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid var(--border)' }}>
                            <table className="w-full text-sm">
                              <thead>
                                <tr style={{ background: `${guide.color}10` }}>
                                  <th className="px-4 py-2 text-left font-semibold" style={{ color: guide.color }}>Word</th>
                                  <th className="px-4 py-2 text-left font-semibold" style={{ color: '#22c55e' }}>Synonyms</th>
                                  <th className="px-4 py-2 text-left font-semibold" style={{ color: '#ef4444' }}>Antonyms</th>
                                </tr>
                              </thead>
                              <tbody>
                                {guide.tips2.map((row, i) => (
                                  <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                                    <td className="px-4 py-2 font-bold" style={{ color: 'var(--text-primary)' }}>{row.word}</td>
                                    <td className="px-4 py-2" style={{ color: 'var(--text-secondary)' }}>{row.syn}</td>
                                    <td className="px-4 py-2" style={{ color: 'var(--text-secondary)' }}>{row.ant}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* Tips */}
                      {guide.tips?.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Lightbulb size={15} style={{ color: '#f59e0b' }} />
                            <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Shortcuts & Tips</span>
                          </div>
                          <div className="space-y-2">
                            {guide.tips.map((tip, i) => (
                              <div key={i} className="flex items-start gap-2.5 text-sm">
                                <span className="text-yellow-400 mt-0.5 shrink-0">⚡</span>
                                <span style={{ color: 'var(--text-secondary)' }}>{tip}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Solved Example */}
                      {guide.example && (
                        <div className="rounded-xl p-4" style={{ background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.2)' }}>
                          <div className="flex items-center gap-2 mb-3">
                            <Zap size={14} style={{ color: '#06b6d4' }} />
                            <span className="font-bold text-sm" style={{ color: '#06b6d4' }}>Solved Example</span>
                          </div>
                          <p className="text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>{guide.example.q}</p>
                          <div className="space-y-1.5 mb-3">
                            {guide.example.steps.map((step, i) => (
                              <div key={i} className="flex items-start gap-2 text-xs">
                                <span className="w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0 font-bold"
                                  style={{ background: guide.color, fontSize: '10px' }}>{i + 1}</span>
                                <span style={{ color: 'var(--text-secondary)' }}>{step}</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center gap-2 mt-2 pt-2 border-t" style={{ borderColor: 'rgba(6,182,212,0.2)' }}>
                            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Answer:</span>
                            <span className="text-sm font-bold" style={{ color: '#22c55e' }}>{guide.example.answer}</span>
                          </div>
                        </div>
                      )}

                      <button
                        onClick={() => { setDrill(p => ({ ...p, topic: guide.drillTopic })); onTabChange(1); }}
                        className="sm:hidden btn-primary text-sm w-full justify-center">
                        <Play size={13} /> Practice {guide.topic}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}

      {/* ── Previous Year Questions Tab ── */}
      {tab === 3 && (
        <div className="space-y-4">
          {/* Header */}
          <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg,rgba(245,158,11,0.12),rgba(239,68,68,0.08))', border: '1px solid rgba(245,158,11,0.25)' }}>
            <div className="flex items-center gap-3 mb-1">
              <div className="text-2xl">📁</div>
              <div>
                <div className="font-bold" style={{ color: 'var(--text-primary)' }}>Previous Year Questions (PYQ)</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>Real questions asked by top companies — practice with solutions</div>
              </div>
            </div>
            {pyqTotal > 0 && (
              <div className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
                Showing <strong style={{ color: 'var(--text-primary)' }}>{pyqQuestions.length}</strong> of <strong style={{ color: 'var(--text-primary)' }}>{pyqTotal}</strong> questions
              </div>
            )}
          </div>

          {/* Company filter */}
          <div>
            <div className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>Company</div>
            <div className="flex flex-wrap gap-2">
              {PYQ_COMPANIES.map(co => {
                const color = COMPANY_COLORS[co] || '#64748b';
                const active = pyqCompany === co;
                return (
                  <button key={co} onClick={() => { setPyqCompany(co); setPyqExpanded(null); setPyqLimit(20); }}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                    style={active
                      ? { background: color, color: 'white' }
                      : { background: `${color}15`, color: color, border: `1px solid ${color}30` }}>
                    {co}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section filter */}
          <div>
            <div className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>Section</div>
            <div className="flex gap-2">
              {PYQ_SECTIONS.map(sec => (
                <button key={sec.key} onClick={() => { setPyqSection(sec.key); setPyqExpanded(null); setPyqLimit(20); }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                  style={pyqSection === sec.key
                    ? { background: 'linear-gradient(135deg,#7c3aed,#06b6d4)', color: 'white' }
                    : { background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                  {sec.label}
                </button>
              ))}
            </div>
          </div>

          {/* Questions list */}
          {pyqLoading ? (
            <div className="space-y-3">
              {Array(5).fill(0).map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}
            </div>
          ) : pyqQuestions.length === 0 ? (
            <div className="card text-center py-12">
              <div className="text-4xl mb-3">📭</div>
              <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>No questions found</p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Try a different company or section filter</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pyqQuestions.map((q, idx) => {
                const companyColor = COMPANY_COLORS[Array.isArray(q.companyTag) ? q.companyTag[0] : q.companyTag] || '#64748b';
                const isOpen = pyqExpanded === idx;
                return (
                  <div key={q._id} className="rounded-2xl overflow-hidden"
                    style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                    <button className="w-full flex items-start gap-4 p-4 text-left"
                      onClick={() => setPyqExpanded(isOpen ? null : idx)}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white"
                            style={{ background: companyColor }}>
                            {Array.isArray(q.companyTag) ? q.companyTag[0] : q.companyTag}
                          </span>
                          {q.year && (
                            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                              style={{ background: 'var(--bg-primary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                              {q.year}
                            </span>
                          )}
                          <span className="text-xs px-2 py-0.5 rounded-full capitalize font-medium"
                            style={{ background: 'rgba(124,58,237,0.1)', color: '#7c3aed' }}>
                            {q.section}
                          </span>
                          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{q.topic}</span>
                        </div>
                        <p className="text-sm font-medium leading-relaxed pr-4" style={{ color: 'var(--text-primary)' }}>
                          {idx + 1}. {q.questionText}
                        </p>
                      </div>
                      <div className="shrink-0 mt-1">
                        {isOpen ? <ChevronUp size={16} style={{ color: 'var(--text-secondary)' }} /> : <ChevronDown size={16} style={{ color: 'var(--text-secondary)' }} />}
                      </div>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                          className="overflow-hidden border-t" style={{ borderColor: 'var(--border)' }}>
                          <div className="p-4 space-y-3">
                            {/* Options */}
                            <div className="grid sm:grid-cols-2 gap-2">
                              {['A','B','C','D'].map((opt, i) => {
                                const isCorrect = q.correctAnswer === opt;
                                return (
                                  <div key={opt} className="flex items-start gap-3 p-3 rounded-xl"
                                    style={{
                                      background: isCorrect ? 'rgba(34,197,94,0.1)' : 'var(--bg-primary)',
                                      border: `1px solid ${isCorrect ? '#22c55e' : 'var(--border)'}`,
                                    }}>
                                    <span className="font-bold shrink-0 text-xs w-5"
                                      style={{ color: isCorrect ? '#22c55e' : 'var(--text-secondary)' }}>{opt}.</span>
                                    <span className="text-sm" style={{ color: isCorrect ? '#22c55e' : 'var(--text-primary)', fontWeight: isCorrect ? 600 : 400 }}>
                                      {q.options?.[i]}
                                    </span>
                                    {isCorrect && <span className="ml-auto text-green-400 shrink-0">✓</span>}
                                  </div>
                                );
                              })}
                            </div>
                            {/* Explanation */}
                            {q.explanation && (
                              <div className="p-3 rounded-xl text-sm" style={{ background: 'rgba(6,182,212,0.07)', border: '1px solid rgba(6,182,212,0.2)' }}>
                                <span className="font-semibold" style={{ color: '#06b6d4' }}>Solution: </span>
                                <span style={{ color: 'var(--text-secondary)' }}>{q.explanation}</span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              {/* Load more */}
              {pyqQuestions.length < pyqTotal && (
                <button onClick={() => setPyqLimit(l => l + 20)}
                  className="w-full py-3 rounded-xl text-sm font-semibold transition-all"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                  Load more ({pyqTotal - pyqQuestions.length} remaining)
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Company Patterns Tab ── */}
      {tab === 4 && (
        <div className="space-y-3">
          {COMPANY_PATTERNS.map((cp, i) => (
            <div key={i} className="card p-0 overflow-hidden">
              <button className="w-full flex items-center justify-between p-5 text-left"
                onClick={() => setExpanded(expanded === i ? null : i)}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white"
                    style={{ background: cp.color }}>{cp.name.substring(0,2)}</div>
                  <div>
                    <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>{cp.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>Cutoff: {cp.cutoff}</div>
                  </div>
                </div>
                <ChevronDown size={16} className={`transition-transform ${expanded === i ? 'rotate-180' : ''}`}
                  style={{ color: 'var(--text-secondary)' }} />
              </button>
              <AnimatePresence>
                {expanded === i && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                    className="overflow-hidden border-t" style={{ borderColor: 'var(--border)' }}>
                    <div className="p-5 space-y-4">
                      <div className="grid sm:grid-cols-3 gap-3">
                        {cp.sections.map((s, j) => (
                          <div key={j} className="p-3 rounded-xl" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
                            <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{s.name}</div>
                            {s.qs > 0 && <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{s.qs} Questions {s.time && `· ${s.time}`}</div>}
                            {s.time && s.qs === 0 && <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{s.time}</div>}
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <span style={{ color: 'var(--text-secondary)' }}>Negative Marking: <strong style={{ color: 'var(--text-primary)' }}>{cp.negativeMarking}</strong></span>
                        <span style={{ color: 'var(--text-secondary)' }}>Calculator: <strong style={{ color: 'var(--text-primary)' }}>{cp.calculator}</strong></span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}

      {/* ── My Results Tab ── */}
      {tab === 5 && (
        <div className="space-y-4">
          {results.length === 0 ? (
            <div className="card text-center py-12">
              <Trophy size={40} className="mx-auto mb-3" style={{ color: 'var(--text-secondary)' }} />
              <p style={{ color: 'var(--text-secondary)' }}>No mock tests attempted yet. Start a mock test to track your progress!</p>
              <button onClick={() => onTabChange(0)} className="btn-primary mt-4">Browse Mock Tests</button>
            </div>
          ) : (
            <div className="card p-0 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Mock Test','Score','Accuracy','Percentile','Date','Action'].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-medium" style={{ color: 'var(--text-secondary)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => {
                    const meta = getMockMeta(r.mockId);
                    return (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td className="px-4 py-3 font-medium" style={{ color: 'var(--text-primary)' }}>{meta.label}</td>
                        <td className="px-4 py-3 font-bold" style={{ color: r.score >= 16 ? '#22c55e' : r.score >= 12 ? '#f59e0b' : '#ef4444' }}>
                          {r.score}/{r.totalQuestions}
                        </td>
                        <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>
                          {Math.round((r.score / r.totalQuestions) * 100)}%
                        </td>
                        <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>~{r.percentile}%ile</td>
                        <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{new Date(r.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <button onClick={() => navigate(`/aptitude/results/${r._id}`)}
                            className="text-xs px-3 py-1.5 rounded-lg font-medium"
                            style={{ background: 'rgba(124,58,237,0.1)', color: '#7c3aed' }}>
                            Review
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
