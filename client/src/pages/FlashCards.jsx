import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, ChevronLeft, ChevronRight, Shuffle, CheckCircle, XCircle } from 'lucide-react';

const DECKS = [
  {
    key: 'aptitude',
    label: 'Aptitude Formulas',
    icon: '🔢',
    color: '#3b82f6',
    cards: [
      { front: 'Simple Interest formula', back: 'SI = PRT/100\nwhere P=Principal, R=Rate%, T=Time(years)\n\nAmount = P + SI' },
      { front: 'Compound Interest formula', back: 'CI = P[(1 + R/100)ⁿ - 1]\nAmount A = P(1 + R/100)ⁿ\n\nCI - SI (2 yrs) = P(R/100)²' },
      { front: 'Percentage increase/decrease', back: '% Change = [(New - Old) / Old] × 100\n\nSuccessive %: a + b + ab/100\n\nIf price ↑ by r%, consumption ↓ by r/(100+r) × 100' },
      { front: 'Time & Work — LCM method', back: 'Set Total Work = LCM of all given days\n\nIf A takes a days → efficiency = LCM/a units/day\n\nDays together = Total Work / Combined efficiency' },
      { front: 'Speed = Distance/Time conversions', back: 'km/h → m/s: multiply by 5/18\nm/s → km/h: multiply by 18/5\n\nAverage speed (equal distances) = 2xy/(x+y)' },
      { front: 'Train crossing formulas', back: 'Cross a pole/person: Time = Length of train / Speed\nCross a platform: Time = (L_train + L_platform) / Speed\nTwo trains opposite: Time = (L1+L2)/(S1+S2)\nTwo trains same dir: Time = (L1+L2)/(S1-S2)' },
      { front: 'Profit & Loss key formulas', back: 'Profit% = (Profit/CP) × 100\nSP = CP × (100+P%)/100\nCP = SP × 100/(100+P%)\n\nTwo items at same SP with P% profit & P% loss → loss of (P²/100)%' },
      { front: 'Alligation Rule', back: 'Ratio = (Dearer - Mean) : (Mean - Cheaper)\n\nExample: Milk at ₹45, Water at ₹0, Mean ₹30\nWater:Milk = (45-30):(30-0) = 15:30 = 1:2' },
      { front: 'Permutation vs Combination', back: 'nPr = n!/(n-r)! → Arrangement (order matters)\nnCr = n!/[r!(n-r)!] → Selection (order doesn\'t matter)\n\nCircular permutation = (n-1)!\nnCr = nC(n-r)' },
      { front: 'Probability basics', back: 'P(E) = Favorable / Total\nP(A or B) = P(A)+P(B)-P(A∩B)\nP(not A) = 1 - P(A)\n\nDeck: 52 cards, 4 suits, 13 each\nSum of 7 has max ways (6) in two dice' },
      { front: 'HCF & LCM relationship', back: 'HCF × LCM = Product of two numbers\n\nFor N = aᵖ × bq × cʳ:\n• HCF: lowest powers\n• LCM: highest powers\n• Number of factors = (p+1)(q+1)(r+1)' },
      { front: 'SI & CI difference formulas', back: '2 years: CI - SI = P(R/100)²\n3 years: CI - SI = P(R/100)²(3+R/100)\n\nRule of 72: Doubling time ≈ 72/R years\nHalf-yearly: R→R/2, n→2n' },
      { front: 'Ages problem shortcut', back: 'Present age = x\nPast age = x - t\nFuture age = x + t\n\nSum of ages changes by n per year for n people\nIf ratio a:b now, and t years ago ratio c:d:\nSet up equations and solve' },
      { front: 'Boats & Streams', back: 'Downstream speed = Boat + Stream\nUpstream speed = Boat - Stream\n\nBoat speed = (Downstream + Upstream)/2\nStream speed = (Downstream - Upstream)/2' },
      { front: 'Number Series types', back: '1. Arithmetic (constant difference)\n2. Geometric (constant ratio)\n3. Squares: 1,4,9,16,25...\n4. Cubes: 1,8,27,64,125...\n5. Prime: 2,3,5,7,11,13...\n6. Alternating: separate odd/even positions' },
    ]
  },
  {
    key: 'os',
    label: 'Operating Systems',
    icon: '💻',
    color: '#ef4444',
    cards: [
      { front: 'What are the 4 Coffman conditions for deadlock?', back: '1. Mutual Exclusion\n2. Hold and Wait\n3. No Preemption\n4. Circular Wait\n\nAll 4 must hold for deadlock to occur.\nEliminate any one → no deadlock.' },
      { front: 'Page replacement algorithms', back: 'FIFO: replace oldest page (Belady\'s anomaly!)\nOPT: replace used farthest in future (theoretical best)\nLRU: replace least recently used (best practical)\nClock: approximation of LRU\n\nBelady\'s Anomaly: more frames → more faults (FIFO only)' },
      { front: 'CPU Scheduling formulas', back: 'Turnaround Time (TAT) = CT - AT\nWaiting Time (WT) = TAT - BT\nResponse Time = First Run - AT\n\nSJF: optimal avg WT but starvation possible\nRound Robin: best for time-sharing, no starvation' },
      { front: 'Paging vs Segmentation', back: 'Paging: fixed-size pages; NO external fragmentation; may have internal fragmentation\nSegmentation: variable-size segments; NO internal fragmentation; may have external fragmentation\n\nTLB: cache for page table entries (reduces memory access overhead)' },
      { front: 'Semaphore operations', back: 'wait(S): S--; if S<0, block the process\nsignal(S): S++; if S<=0, wake a blocked process\n\nBinary semaphore = mutex (0 or 1)\nCounting semaphore = resource count\n\nProducer-Consumer needs 3: empty, full, mutex' },
      { front: 'Process vs Thread', back: 'Process: own memory space, PCB, heavyweight\nThread: shared memory, lightweight, faster context switch\n\nContext switch: save PCB (PC, registers, stack) of current, load next\nIPC: Pipes, Shared Memory, Message Queue, Sockets\nShared Memory = fastest IPC' },
      { front: 'Banker\'s Algorithm', back: 'Used for deadlock avoidance\n\nSafe State: sequence where all processes can finish\nNeed = Max - Allocation\n\nOnly grant resource if system remains in safe state\nSafe sequence must exist → system is safe' },
      { front: 'Disk Scheduling algorithms', back: 'FCFS: arrival order; simple but poor\nSSTF: shortest seek time first; starvation possible\nSCAN (Elevator): go end-to-end; fair\nC-SCAN: one direction only; more uniform wait\nLOOK/C-LOOK: like SCAN but stop at last request' },
    ]
  },
  {
    key: 'dbms',
    label: 'DBMS',
    icon: '🗄️',
    color: '#10b981',
    cards: [
      { front: 'Normal Forms (1NF, 2NF, 3NF, BCNF)', back: '1NF: Atomic values, no repeating groups\n2NF: No partial dependency (non-key depends on entire PK)\n3NF: No transitive dependency (non-key → non-key)\nBCNF: Every determinant must be a super key\n\nPartial: only when PK is composite' },
      { front: 'ACID Properties', back: 'A — Atomicity: all or nothing\nC — Consistency: valid state to valid state\nI — Isolation: concurrent transactions don\'t interfere\nD — Durability: committed data survives failures\n\nIsolation levels: Read Uncommitted < Read Committed < Repeatable Read < Serializable' },
      { front: 'SQL Joins', back: 'INNER JOIN: only matching rows in both\nLEFT JOIN: all from left + matching from right\nRIGHT JOIN: all from right + matching from left\nFULL OUTER JOIN: all rows from both\nCROSS JOIN: cartesian product\nSELF JOIN: table joins itself' },
      { front: 'WHERE vs HAVING', back: 'WHERE: filters rows BEFORE grouping\n  → Cannot use aggregate functions (COUNT, SUM...)\n\nHAVING: filters groups AFTER GROUP BY\n  → Can use aggregate functions\n\nExecution order: WHERE → GROUP BY → HAVING → SELECT → ORDER BY' },
      { front: 'Types of Keys', back: 'Super Key: any set that uniquely identifies rows\nCandidate Key: minimal super key\nPrimary Key: chosen candidate key (NOT NULL, UNIQUE)\nForeign Key: references PK of another table\nAlternate Key: non-chosen candidate keys\nComposite Key: multiple columns together' },
      { front: 'Concurrency problems', back: 'Dirty Read: reading uncommitted data\nLost Update: two transactions overwrite same data\nNon-repeatable Read: same row gives different values\nPhantom Read: new rows appear on re-read\n\n2PL (Two-Phase Locking): Growing phase (acquire) → Shrinking phase (release)\nGuarantees serializability but can deadlock' },
      { front: 'Indexing types', back: 'Clustered: data physically stored in index order (ONE per table)\nNon-clustered: separate structure with pointer (many allowed)\nB+ Tree: all data in leaf nodes, linked for range queries\nComposite: multiple columns\nCovering: index includes all needed columns\n\nDon\'t index: small tables, low cardinality, frequent updates' },
    ]
  },
  {
    key: 'cn',
    label: 'Computer Networks',
    icon: '🌐',
    color: '#8b5cf6',
    cards: [
      { front: 'OSI Model 7 layers (top to bottom)', back: '7. Application: HTTP, FTP, SMTP, DNS\n6. Presentation: Encryption, compression\n5. Session: Connection management\n4. Transport: TCP/UDP, ports, end-to-end\n3. Network: IP, routing, routers\n2. Data Link: MAC, frames, switches\n1. Physical: Bits, cables, hubs\n\nMnemonic: All People Seem To Need Data Processing' },
      { front: 'TCP vs UDP', back: 'TCP: Connection-oriented, reliable, ordered\n  3-way handshake: SYN→SYN-ACK→ACK\n  Use: HTTP, HTTPS, FTP, SSH, SMTP\n\nUDP: Connectionless, no guarantee\n  Use: DNS, DHCP, VoIP, Streaming, Gaming\n\nFlow control: sliding window (receiver limits sender)\nCongestion control: slow start (TCP limits itself)' },
      { front: 'Important Port Numbers', back: 'HTTP: 80\nHTTPS: 443\nFTP: 21 (control), 20 (data)\nSSH: 22\nSMTP: 25\nDNS: 53\nDHCP: 67/68\nPOP3: 110\nIMAP: 143\nRDP: 3389\n\nWell-known ports: 0-1023' },
      { front: 'IP Classes & Subnetting', back: 'Class A: 1-126, /8, 16M hosts\nClass B: 128-191, /16, 65K hosts\nClass C: 192-223, /24, 254 hosts\nClass D: 224-239 (Multicast)\n\nPrivate: 10.x.x.x, 172.16-31.x.x, 192.168.x.x\nUsable hosts = 2^(host bits) - 2\n127.0.0.1 = Loopback' },
      { front: 'ARP vs DNS vs DHCP', back: 'ARP: IP address → MAC address (Layer 2, same network)\n  Request = broadcast, Reply = unicast\n\nDNS: Domain name → IP address (Port 53)\n  Browser cache → OS → Recursive resolver → Root → TLD → Authoritative\n\nDHCP: Auto-assigns IP (DORA: Discover, Offer, Request, Ack)' },
      { front: 'Routing protocols', back: 'RIP: Distance vector, Bellman-Ford, max 15 hops\n  Slow convergence, count-to-infinity problem\n\nOSPF: Link state, Dijkstra\'s, fast convergence\n  Used within AS (intra-domain)\n\nBGP: Path vector, used between ISPs (inter-AS)\n  The internet\'s backbone routing protocol' },
      { front: 'Error detection methods', back: 'Parity bit: detects 1-bit errors only\n\nCRC (Cyclic Redundancy Check): detects burst errors\n  Used in Ethernet, Wi-Fi\n\nHamming Code: detects AND corrects 1-bit errors\n  Parity bits at positions 1,2,4,8... (powers of 2)\n\nChecksum: sum of data segments, used in TCP/UDP' },
    ]
  },
  {
    key: 'oop',
    label: 'OOP Concepts',
    icon: '🏗️',
    color: '#f59e0b',
    cards: [
      { front: '4 Pillars of OOP', back: '1. Encapsulation: data + methods in class; access modifiers hide data\n2. Abstraction: show "what", hide "how"; use abstract class/interface\n3. Inheritance: child inherits from parent; "is-a" relationship\n4. Polymorphism: compile-time (overloading) + runtime (overriding)' },
      { front: 'Overloading vs Overriding', back: 'Overloading (Compile-time polymorphism):\n  Same method name, different parameters\n  Same class, resolved at compile time\n\nOverriding (Runtime polymorphism):\n  Same name + signature, different class\n  Child class overrides parent method\n  Requires inheritance, resolved at runtime\n  Cannot override final/static/private' },
      { front: 'Abstract Class vs Interface', back: 'Abstract Class:\n  Can have concrete methods\n  Single inheritance only\n  Has constructor\n  Variables: any type\n\nInterface:\n  All abstract (pre-Java 8)\n  Multiple inheritance allowed\n  No constructor\n  Variables: public static final only\n  Java 8+: default and static methods allowed' },
      { front: 'SOLID Principles', back: 'S: Single Responsibility — one class, one reason to change\nO: Open/Closed — open for extension, closed for modification\nL: Liskov Substitution — subclass can replace parent\nI: Interface Segregation — don\'t force unused interfaces\nD: Dependency Inversion — depend on abstractions, not concretions' },
      { front: 'Design Patterns — Creational', back: 'Singleton: one instance only (private constructor + static getInstance)\nFactory: creates objects without specifying exact class\nAbstract Factory: factory of factories\nBuilder: build complex objects step by step\nPrototype: clone existing object\n\nMost asked: Singleton + Factory' },
      { front: 'Design Patterns — Behavioral', back: 'Observer: one-to-many; publish-subscribe (event listeners)\nStrategy: family of algorithms, interchangeable\nTemplate Method: algorithm skeleton, subclasses fill steps\nCommand: encapsulate request as object\nIterator: sequential access without internal knowledge\n\nMost asked: Observer + Strategy' },
      { front: '"is-a" vs "has-a" relationship', back: '"is-a" → Inheritance\n  Dog is-a Animal\n  Use: when child IS a type of parent\n  Keyword: extends (Java), : (C++)\n\n"has-a" → Composition/Aggregation\n  Car has-a Engine\n  Use: when class CONTAINS another\n  Keyword: instance variable of that type\n\nFavor composition over inheritance!' },
    ]
  },
  {
    key: 'hr',
    label: 'HR Quick Cards',
    icon: '🎤',
    color: '#ec4899',
    cards: [
      { front: 'STAR Method for behavioral questions', back: 'S — Situation: Context (10%)\nT — Task: Your responsibility (10%)\nA — Action: What YOU specifically did (60%)\nR — Result: Quantifiable outcome (20%)\n\nFocus most on ACTION — that\'s what they\'re evaluating\nAlways quantify the Result where possible' },
      { front: 'Common HR question categories', back: '1. Self Introduction (tell me about yourself)\n2. Strengths & Weaknesses\n3. Why this company/role?\n4. Where do you see yourself in 5 years?\n5. Team/conflict situations (STAR)\n6. Failure/challenge (STAR)\n7. Salary expectations\n8. Do you have questions for us?' },
      { front: 'Tell me about yourself — Structure', back: 'Name → Education → Skills → Projects/Internship → Goal\n\nKeep it 60-90 seconds\nDon\'t read your CV — add personality\nEnd with: "...and that\'s why I\'m excited about this opportunity at [Company]"\n\nPractice until it feels natural, not rehearsed' },
      { front: 'Good questions to ask the interviewer', back: '• "What does success look like in the first 3-6 months?"\n• "What technologies does the team work with?"\n• "How does onboarding work for new engineers?"\n• "What are the biggest challenges the team is currently solving?"\n• "Is there opportunity for internal mobility?"\n\nNEVER ask: salary, leave policy, work hours in first HR round' },
      { front: 'Salary negotiation phrases', back: 'Instead of: "My expectation is ₹X"\nSay: "Based on market research and my skills, I\'m looking at ₹X-Y LPA"\n\nIf asked to justify: "I looked at glassdoor, LinkedIn salary data and similar roles, and this range reflects my technical background in [skills]"\n\nAlways anchor high, leave room to negotiate' },
      { front: 'Weakness answer formula', back: '1. Name a REAL weakness (not "perfectionism")\n2. Show self-awareness: "I realized this when..."\n3. Show action: "Since then, I\'ve been..."\n4. Show progress: "I\'ve improved significantly..."\n\nExample: Public speaking → joined debate club → presenting regularly → improved significantly\n\nNEVER say: "I work too hard" or "I\'m a perfectionist"' },
    ]
  },
];

export default function FlashCards() {
  const [selectedDeck, setSelectedDeck] = useState('aptitude');
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(new Set());
  const [unknown, setUnknown] = useState(new Set());
  const [shuffled, setShuffled] = useState(false);
  const [cards, setCards] = useState(DECKS[0].cards);

  const deck = DECKS.find(d => d.key === selectedDeck);

  const selectDeck = (key) => {
    const d = DECKS.find(d => d.key === key);
    setSelectedDeck(key);
    setCards([...d.cards]);
    setCardIdx(0);
    setFlipped(false);
    setKnown(new Set());
    setUnknown(new Set());
    setShuffled(false);
  };

  const shuffle = () => {
    const shuffledCards = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setCardIdx(0);
    setFlipped(false);
    setShuffled(true);
  };

  const markKnown = () => {
    setKnown(prev => new Set([...prev, cardIdx]));
    setUnknown(prev => { const n = new Set(prev); n.delete(cardIdx); return n; });
    next();
  };

  const markUnknown = () => {
    setUnknown(prev => new Set([...prev, cardIdx]));
    setKnown(prev => { const n = new Set(prev); n.delete(cardIdx); return n; });
    next();
  };

  const next = () => {
    setFlipped(false);
    setTimeout(() => setCardIdx(i => Math.min(i + 1, cards.length - 1)), 150);
  };

  const prev = () => {
    setFlipped(false);
    setTimeout(() => setCardIdx(i => Math.max(i - 1, 0)), 150);
  };

  const reset = () => {
    setCardIdx(0);
    setFlipped(false);
    setKnown(new Set());
    setUnknown(new Set());
    setShuffled(false);
    setCards([...deck.cards]);
  };

  const card = cards[cardIdx];
  const progress = ((cardIdx) / cards.length) * 100;
  const knownCount = known.size;
  const unknownCount = unknown.size;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-20 md:pb-0">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>🃏 Flash Cards</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Quick revision for formulas, CS concepts, and HR answers — flip to reveal!</p>
      </div>

      {/* Deck selector */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {DECKS.map(d => (
          <button key={d.key} onClick={() => selectDeck(d.key)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all shrink-0"
            style={selectedDeck === d.key
              ? { background: d.color, color: 'white' }
              : { background: `${d.color}15`, color: d.color, border: `1px solid ${d.color}30` }}>
            <span>{d.icon}</span> {d.label}
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
          <span>Card {cardIdx + 1} of {cards.length}</span>
          <div className="flex items-center gap-3">
            <span className="text-green-400 flex items-center gap-1"><CheckCircle size={12} /> {knownCount} known</span>
            <span className="text-red-400 flex items-center gap-1"><XCircle size={12} /> {unknownCount} review</span>
          </div>
        </div>
        <div className="w-full rounded-full h-2" style={{ background: 'var(--border)' }}>
          <div className="h-2 rounded-full transition-all" style={{ width: `${progress}%`, background: deck.color }} />
        </div>
      </div>

      {/* Flash card */}
      <div className="relative" style={{ perspective: '1000px' }}>
        <motion.div
          className="w-full cursor-pointer"
          style={{ transformStyle: 'preserve-3d', minHeight: 280 }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => setFlipped(f => !f)}
        >
          {/* Front */}
          <div className="absolute inset-0 w-full rounded-2xl flex flex-col items-center justify-center p-8 text-center"
            style={{ backfaceVisibility: 'hidden', background: 'var(--bg-card)', border: `2px solid ${deck.color}40`, minHeight: 280 }}>
            <div className="text-3xl mb-4">{deck.icon}</div>
            <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{card?.front}</p>
            <p className="text-xs mt-4" style={{ color: 'var(--text-secondary)' }}>Click to reveal answer</p>
          </div>
          {/* Back */}
          <div className="absolute inset-0 w-full rounded-2xl flex flex-col items-center justify-center p-8"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', background: `${deck.color}15`, border: `2px solid ${deck.color}60`, minHeight: 280 }}>
            <p className="text-sm leading-relaxed whitespace-pre-line text-center font-mono" style={{ color: 'var(--text-primary)' }}>{card?.back}</p>
          </div>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button onClick={prev} disabled={cardIdx === 0}
          className="p-3 rounded-xl border transition-all disabled:opacity-30"
          style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
          <ChevronLeft size={18} />
        </button>

        {flipped ? (
          <>
            <button onClick={markUnknown}
              className="flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
              style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>
              <XCircle size={16} /> Need Review
            </button>
            <button onClick={markKnown}
              className="flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
              style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }}>
              <CheckCircle size={16} /> Got It!
            </button>
          </>
        ) : (
          <button onClick={() => setFlipped(true)}
            className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all"
            style={{ background: `linear-gradient(135deg, ${deck.color}, ${deck.color}99)` }}>
            Flip Card ↓
          </button>
        )}

        <button onClick={next} disabled={cardIdx === cards.length - 1}
          className="p-3 rounded-xl border transition-all disabled:opacity-30"
          style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button onClick={shuffle}
          className="flex-1 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
          <Shuffle size={14} /> Shuffle
        </button>
        <button onClick={reset}
          className="flex-1 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      {/* Session summary */}
      {(knownCount + unknownCount) > 0 && (
        <div className="card">
          <div className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>📊 Session Progress</div>
          <div className="flex gap-2">
            <div className="flex-1 text-center p-3 rounded-xl" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
              <div className="text-xl font-black text-green-400">{knownCount}</div>
              <div className="text-xs text-green-400">Known</div>
            </div>
            <div className="flex-1 text-center p-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <div className="text-xl font-black text-red-400">{unknownCount}</div>
              <div className="text-xs text-red-400">Review</div>
            </div>
            <div className="flex-1 text-center p-3 rounded-xl" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
              <div className="text-xl font-black" style={{ color: deck.color }}>
                {cards.length - knownCount - unknownCount}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Unseen</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
