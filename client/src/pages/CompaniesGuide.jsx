import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Clock, ChevronRight } from 'lucide-react';

const COMPANIES_DATA = {
  Amazon: {
    color: '#f97316', tagline: 'Leadership Principles + Hard DSA',
    rounds: [
      { name: 'Online Assessment', type: 'Coding', time: '90 min', difficulty: 4,
        description: '2 Medium/Hard DSA problems. Focus on Arrays, Strings, Trees, DP.',
        topics: ['Arrays','Dynamic Programming','Trees','Graphs','String Manipulation'],
        questions: ['Two Sum variations','LRU Cache','Word Break','Number of Islands'],
        tips: 'Aim to solve both problems. Partial credit matters. Think aloud.' },
      { name: 'Technical Round 1', type: 'DSA Deep Dive', time: '60 min', difficulty: 4,
        description: 'In-depth DSA with follow-ups. Optimize your solution each time.',
        topics: ['Linked Lists','Trees','Graphs','Heaps','Sliding Window'],
        questions: ['Merge K Sorted Lists','Serialize Binary Tree','Trapping Rain Water'],
        tips: 'Explain your thought process. Discuss time/space complexity upfront.' },
      { name: 'Technical Round 2', type: 'System Design + DSA', time: '60 min', difficulty: 5,
        description: 'High-level system design (for senior roles) + 1 DSA problem.',
        topics: ['System Design Basics','Databases','APIs','Scalability','Caching'],
        questions: ['Design URL Shortener','Design Notification System'],
        tips: 'Amazon scale: think millions of users. Mention AWS services.' },
      { name: 'Bar Raiser Round', type: 'Behavioral + LP', time: '60 min', difficulty: 4,
        description: 'Amazon Leadership Principles evaluation. STAR format answers.',
        topics: ['Customer Obsession','Ownership','Invent & Simplify','Dive Deep','Deliver Results'],
        questions: ['Tell me about a time you took ownership beyond your role','Describe a technical disagreement','When did you take a calculated risk?'],
        tips: 'Prepare 3 stories per LP. Quantify your impact always.' },
    ]
  },
  Google: {
    color: '#4285f4', tagline: 'Googleyness + Hard DSA + System Design',
    rounds: [
      { name: 'Online Coding', type: 'DSA', time: '90 min', difficulty: 4,
        description: '2–3 coding problems. Expect graphs, DP, and tricky edge cases.',
        topics: ['Graphs','Dynamic Programming','Trie','Segment Tree','Advanced DP'],
        questions: ['Alien Dictionary','Word Ladder','Minimum Window Substring','Burst Balloons'],
        tips: 'Google tests correctness AND efficiency. Brute force won\'t pass.' },
      { name: 'Technical Phone Screen', type: 'Coding', time: '45 min', difficulty: 4,
        description: '1–2 problems in Google Doc. Communication is key.',
        topics: ['Binary Search','Two Pointers','Trees','Recursion'],
        questions: ['Median of Two Sorted Arrays','Jump Game II','Regular Expression Matching'],
        tips: 'Write clean code, not just pseudocode. Test with examples.' },
      { name: 'Onsite Round 1–3', type: 'DSA Hard', time: '45 min each', difficulty: 5,
        description: '3 separate coding rounds. Each has 1–2 hard problems.',
        topics: ['Trie','Union Find','Monotonic Stack','Backtracking','Graph Algorithms'],
        questions: ['Design Search Autocomplete','Reconstruct Itinerary','Number of Islands (variations)'],
        tips: 'Communicate while coding. Mention tradeoffs. Know your complexities.' },
      { name: 'Googleyness Round', type: 'Behavioral', time: '45 min', difficulty: 3,
        description: 'Culture fit: collaboration, communication, intellectual humility.',
        topics: ['Team Collaboration','Ambiguous Situations','Failure & Learning','Innovation'],
        questions: ['Describe a project you\'re most proud of','How do you handle disagreements?'],
        tips: 'Be genuine. Google values intellectual curiosity and humility.' },
    ]
  },
  Microsoft: {
    color: '#00a1f1', tagline: 'OOP + Trees + Culture Fit',
    rounds: [
      { name: 'Online Assessment', type: 'Coding + MCQ', time: '75 min', difficulty: 3,
        description: '2 coding problems + CS fundamentals MCQ (OS, DBMS, OOP).',
        topics: ['Arrays','Strings','OOP Concepts','OS Basics','DBMS'],
        questions: ['Reverse Linked List','Valid BST','Spiral Matrix','Process scheduling MCQs'],
        tips: 'Brush up CS fundamentals. MCQ section is often overlooked.' },
      { name: 'Technical Round 1', type: 'DSA', time: '60 min', difficulty: 4,
        description: 'Trees, Graphs, and OOP heavy. Code on whiteboard/shared editor.',
        topics: ['Trees','Binary Search','Graphs','OOP Design','Linked Lists'],
        questions: ['Lowest Common Ancestor','Implement Trie','Find Median from Stream'],
        tips: 'Microsoft values clean, readable code over micro-optimizations.' },
      { name: 'Technical Round 2', type: 'CS Fundamentals', time: '60 min', difficulty: 3,
        description: 'OS, DBMS, Networking, OOP design questions.',
        topics: ['Operating Systems','DBMS','Computer Networks','OOP Design','Concurrency'],
        questions: ['Design patterns','Deadlock prevention','SQL vs NoSQL','Thread synchronization'],
        tips: 'Strong theoretical foundation is valued at Microsoft.' },
      { name: 'HR + Managerial', type: 'Behavioral', time: '45 min', difficulty: 2,
        description: 'Culture fit, career goals, and leadership questions.',
        topics: ['Growth Mindset','Team Dynamics','Career Goals'],
        questions: ['Where do you see yourself in 5 years?','Describe a challenge you overcame.'],
        tips: '"Growth mindset" is Microsoft\'s core value. Mention learning from failures.' },
    ]
  },
  TCS: {
    color: '#0099cc', tagline: 'NQT Pattern — Aptitude + Basic DSA',
    rounds: [
      { name: 'TCS NQT Online Test', type: 'Aptitude + Coding', time: '180 min total', difficulty: 2,
        description: 'Multi-section test: Numerical, Verbal, Reasoning, Programming Logic, Coding.',
        topics: ['Quantitative Aptitude','Verbal Ability','Logical Reasoning','Basic DSA','Coding'],
        questions: ['Time & Work','Blood Relations','Array sorting','String reversal','Fibonacci'],
        tips: 'Sectional cutoffs are strict. Don\'t get stuck on one section. Speed matters.' },
      { name: 'Technical Interview', type: 'CS Basics', time: '30–45 min', difficulty: 2,
        description: 'Basic CS, simple DSA, projects, and OOPS.',
        topics: ['OOP Concepts','Data Structures Basics','DBMS','OS Basics','Projects'],
        questions: ['What is polymorphism?','Difference between stack and queue','Explain your project'],
        tips: 'TCS is mostly aptitude + basic CS. Be confident about your resume projects.' },
      { name: 'MR Round', type: 'Managerial', time: '20–30 min', difficulty: 1,
        description: 'Managerial round — communication and adaptability.',
        topics: ['Communication','Team Work','Adaptability','Career Goals'],
        questions: ['Why TCS?','Are you willing to relocate?','How do you handle pressure?'],
        tips: 'Be ready for relocation. TCS heavily values attitude over technical skills here.' },
      { name: 'HR Round', type: 'HR', time: '15–20 min', difficulty: 1,
        description: 'Offer formalities, salary discussion, and documentation.',
        topics: ['Salary Negotiation','Service Agreement','Background'],
        questions: ['Expected salary?','Do you have any offers?','Confirm joining date.'],
        tips: 'TCS has a service agreement (1–2 years). Be aware of bond details.' },
    ]
  },
  Wipro: {
    color: '#8b2be2', tagline: 'NLTH Pattern — Aptitude + Essay + Coding',
    rounds: [
      { name: 'NLTH Online Test', type: 'Aptitude + Essay', time: '95 min', difficulty: 2,
        description: 'Aptitude (18Q) + Verbal (22Q) + Logical (20Q) + Essay writing.',
        topics: ['Aptitude','Verbal Ability','Logical Reasoning','Essay Writing'],
        questions: ['Standard aptitude problems','Sentence correction','Series completion','Write 250 words on a topic'],
        tips: 'Essay is important — maintain structure (intro, body, conclusion). 250 words exactly.' },
      { name: 'Technical Interview', type: 'CS + DSA', time: '30–45 min', difficulty: 2,
        description: 'Basic programming, OOP, and project discussion.',
        topics: ['C++/Java/Python basics','OOP','Basic DSA','DBMS','Projects'],
        questions: ['Write a program to reverse a string','Explain inheritance','Describe your project'],
        tips: 'Know at least one programming language well. Focus on core concepts.' },
      { name: 'HR Round', type: 'HR', time: '15–20 min', difficulty: 1,
        description: 'Communication skills and attitude assessment.',
        topics: ['Career Goals','Communication','Team Work'],
        questions: ['Why Wipro?','What are your strengths?','Tell me about yourself.'],
        tips: 'Communicate confidently. Wipro hires for attitude and trainability.' },
    ]
  },
  Infosys: {
    color: '#007cc3', tagline: 'InfyTQ — Pseudo Code + DSA Basics',
    rounds: [
      { name: 'InfyTQ / Springboard Test', type: 'Online Assessment', time: '95 min', difficulty: 2,
        description: 'Aptitude + Verbal + Reasoning + Pseudo Code sections.',
        topics: ['Aptitude','Verbal','Logical Reasoning','Pseudo Code Analysis','OOPS'],
        questions: ['Pseudo code output tracing','Aptitude problems','Reading comprehension'],
        tips: 'Complete InfyTQ certification. Focus on pseudo code — unique to Infosys.' },
      { name: 'Technical Interview', type: 'CS Fundamentals', time: '30–45 min', difficulty: 2,
        description: 'Basic CS theory, DSA, and project questions.',
        topics: ['OOP','Data Structures','DBMS','Operating Systems','Projects'],
        questions: ['Explain SOLID principles','Write binary search','What is normalization?'],
        tips: 'Infosys values clear communication and CS fundamentals. Projects are key.' },
      { name: 'HR Round', type: 'HR', time: '15–20 min', difficulty: 1,
        description: 'Final HR interview for attitude and communication.',
        topics: ['Communication','Teamwork','Goals'],
        questions: ['Why Infosys?','Where do you see yourself in 3 years?'],
        tips: 'Learn about Infosys\'s pillars and recent initiatives before HR round.' },
    ]
  },
  Meta: {
    color: '#0668e1', tagline: 'STAR Behavioral + Hard DSA',
    rounds: [
      { name: 'Coding Interview 1', type: 'DSA', time: '45 min', difficulty: 5,
        description: 'Hard DSA — Graph algorithms, advanced DP, String manipulation.',
        topics: ['Graphs','Dynamic Programming','Strings','Hashing','Union Find'],
        questions: ['Group Anagrams','Accounts Merge','Nested List Weight Sum'],
        tips: 'Meta expects optimal solutions. Code must be clean and bug-free.' },
      { name: 'Coding Interview 2', type: 'DSA', time: '45 min', difficulty: 5,
        description: 'Second hard coding round with different problem set.',
        topics: ['Trees','Binary Search','Sliding Window','Two Pointers'],
        questions: ['Valid Anagram variations','Minimum Window Substring'],
        tips: 'Practice Meta-tagged problems on LeetCode. Speed and accuracy both matter.' },
      { name: 'System Design', type: 'Design', time: '45 min', difficulty: 4,
        description: 'Large-scale system design for experienced candidates.',
        topics: ['Distributed Systems','CDN','Load Balancing','Databases','API Design'],
        questions: ['Design Instagram Feed','Design Facebook Messenger','Design News Feed'],
        tips: 'Meta scale = billions of users. Mention sharding, replication, consistency.' },
      { name: 'Behavioral (STAR)', type: 'Behavioral', time: '45 min', difficulty: 3,
        description: 'Values: Move Fast, Be Bold, Focus on Impact, Be Open.',
        topics: ['Impact','Collaboration','Innovation','Feedback','Failure'],
        questions: ['Tell me about your most impactful project','Describe a time you moved fast'],
        tips: 'Use STAR format. Quantify everything. Meta loves impact metrics.' },
    ]
  },
  Flipkart: {
    color: '#f9a825', tagline: 'Backend-Heavy + Medium-Hard DSA',
    rounds: [
      { name: 'Online Test', type: 'DSA', time: '90 min', difficulty: 3,
        description: '2–3 DSA problems, Medium-Hard. Backend-focused questions.',
        topics: ['Arrays','Hash Maps','Prefix Sum','Trees','Greedy'],
        questions: ['Subarray Sum = K','Top K Frequent','Product Except Self'],
        tips: 'Flipkart values clean code. Write modular functions.' },
      { name: 'Technical Round 1', type: 'DSA + Design', time: '60 min', difficulty: 4,
        description: 'DSA mixed with low-level design (LLD) questions.',
        topics: ['DSA','OOP Design','Design Patterns','API Design'],
        questions: ['Design Parking Lot','Coin Change variations','LRU Cache'],
        tips: 'Flipkart values system thinking. Connect your DSA solution to real use cases.' },
      { name: 'Hiring Manager Round', type: 'Culture Fit', time: '45 min', difficulty: 2,
        description: 'Projects, team fit, and product thinking.',
        topics: ['Product Thinking','Leadership','Collaboration'],
        questions: ['What product would you build for tier-2 cities?','Describe your biggest project.'],
        tips: 'Show interest in e-commerce problems. Know Flipkart\'s products.' },
    ]
  },
  Cognizant: { color: '#0033a0', tagline: 'GenC/GenC Pro/GenC Elevate tracks',
    rounds: [
      { name: 'GenC Assessment', type: 'Aptitude + Automata Fix', time: '90 min', difficulty: 2,
        description: 'Aptitude + English + Automata Fix (debug code snippets).',
        topics: ['Aptitude','Verbal','Code Debugging','Logic'],
        questions: ['Find bug in given code','English error spotting','Aptitude MCQs'],
        tips: 'GenC Elevate is hardest track — requires strong DSA. Match your level to track.' },
      { name: 'Technical Interview', type: 'CS + Projects', time: '30–45 min', difficulty: 2,
        description: 'CS fundamentals and project walkthrough.',
        topics: ['OOP','DBMS','OS','Projects'],
        questions: ['Explain polymorphism','What is a deadlock?'],
        tips: 'Know your project thoroughly. Cognizant values communication.' },
      { name: 'HR Round', type: 'HR', time: '15 min', difficulty: 1,
        description: 'Final HR and attitude check.',
        topics: ['Communication','Goals','Teamwork'],
        questions: ['Why Cognizant?','Are you willing to work night shifts?'],
        tips: 'Cognizant often has night shift requirements. Be clear about availability.' },
    ]
  },
  Accenture: { color: '#a100ff', tagline: 'Cognitive Assessment + Communication',
    rounds: [
      { name: 'Cognitive Assessment', type: 'Aptitude', time: '70 min', difficulty: 2,
        description: 'Abstract Reasoning (20Q) + Common Sense (14Q) + Attention to Detail (12Q).',
        topics: ['Abstract Reasoning','Pattern Recognition','Attention to Detail'],
        questions: ['Find the odd figure','Complete the pattern','Spot the difference'],
        tips: 'Practice abstract reasoning puzzles. These are non-verbal and unique.' },
      { name: 'Written Communication Test', type: 'Essay', time: '20 min', difficulty: 2,
        description: 'Write a 250-word essay on a given topic.',
        topics: ['Essay Writing','Communication Skills'],
        questions: ['Impact of AI on jobs','Work from home — pros and cons'],
        tips: 'Clear structure is critical. Grammar and vocabulary are evaluated.' },
      { name: 'Technical + HR Interview', type: 'Combined', time: '45 min', difficulty: 2,
        description: 'CS basics + HR questions combined.',
        topics: ['CS Fundamentals','Communication','Team Work'],
        questions: ['Basic OOP','DBMS queries','Tell me about yourself'],
        tips: 'Accenture hires for communication more than technical depth at entry level.' },
    ]
  },
  Zoho: { color: '#e74c3c', tagline: 'Very Hard Aptitude + Custom Coding',
    rounds: [
      { name: 'Written Test', type: 'Aptitude (Very Hard)', time: '90 min', difficulty: 5,
        description: 'Zoho has the hardest aptitude test in industry. Expect puzzle-level problems.',
        topics: ['Hard Aptitude','Puzzles','Logical Reasoning','Number Theory'],
        questions: ['Complex probability','Advanced number theory','Logic puzzles'],
        tips: 'Zoho\'s aptitude is genuinely hard. Practice puzzle books (Shakuntala Devi).' },
      { name: 'Coding Round 1', type: 'Custom Coding Platform', time: '90 min', difficulty: 4,
        description: '5 coding problems on Zoho\'s own platform. Medium-Hard level.',
        topics: ['DSA','Algorithms','Data Structures'],
        questions: ['Custom DSA problems — not standard LeetCode'],
        tips: 'Zoho uses its own platform. Practice competitive programming for speed.' },
      { name: 'Technical Interview', type: 'Deep Technical', time: '60 min', difficulty: 4,
        description: 'Deep technical — CS theory, projects, code review.',
        topics: ['OOP Design','Algorithms','Projects','CS Fundamentals'],
        questions: ['Design a mini-CRM system','Explain your project architecture'],
        tips: 'Zoho selects very few. Be thorough in CS fundamentals and coding.' },
    ]
  },
  Capgemini: { color: '#0070c0', tagline: 'Game-based + Aptitude + Essay',
    rounds: [
      { name: 'Game-Based Assessment', type: 'Behavioral Games', time: '45 min', difficulty: 2,
        description: '7 cognitive games testing attention, memory, and pattern recognition.',
        topics: ['Memory Games','Pattern Recognition','Speed Accuracy','Attention'],
        questions: ['Not traditional — game interface'],
        tips: 'Just be calm and focused. Don\'t overthink game-based assessments.' },
      { name: 'Technical + Aptitude Test', type: 'Online', time: '55 min', difficulty: 2,
        description: 'Aptitude (16Q) + Behavioral (18Q).',
        topics: ['Quantitative Aptitude','Behavioral Competencies'],
        questions: ['Standard aptitude MCQs','Behavioral scenario questions'],
        tips: 'Behavioral section tests how you handle work situations. Be consistent.' },
      { name: 'Technical Interview', type: 'CS', time: '30–45 min', difficulty: 2,
        description: 'CS basics and project discussion.',
        topics: ['OOP','DBMS','Networking','Projects'],
        questions: ['Explain ACID properties','What is DNS?','Describe your project'],
        tips: 'Capgemini is relatively easy at entry level. Basics and confidence matter.' },
    ]
  },
};

const companyList = Object.keys(COMPANIES_DATA);

export default function CompaniesGuide() {
  const [selected, setSelected] = useState('Amazon');
  const company = COMPANIES_DATA[selected];

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-20 md:pb-0">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Company Interview Guide</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Round-by-round breakdown for every company</p>
      </div>

      {/* Company Grid */}
      <div className="flex flex-wrap gap-2">
        {companyList.map(c => {
          const data = COMPANIES_DATA[c];
          return (
            <button key={c} onClick={() => setSelected(c)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all"
              style={selected === c
                ? { background: data.color, color: 'white', borderColor: 'transparent', boxShadow: `0 4px 15px ${data.color}40` }
                : { borderColor: 'var(--border)', color: 'var(--text-secondary)', background: 'var(--bg-card)' }}>
              <div className="w-5 h-5 rounded-full text-xs font-bold text-white flex items-center justify-center"
                style={{ background: data.color }}>{c[0]}</div>
              {c}
            </button>
          );
        })}
      </div>

      {/* Company Detail */}
      <AnimatePresence mode="wait">
        <motion.div key={selected} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }} className="space-y-4">
          {/* Header */}
          <div className="card" style={{ borderColor: `${company.color}40`, borderWidth: 2 }}>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black text-white"
                style={{ background: company.color }}>{selected[0]}</div>
              <div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{selected}</h2>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{company.tagline}</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{ background: `${company.color}15`, color: company.color }}>
                    {company.rounds.length} Rounds
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Rounds Timeline */}
          <div className="space-y-4">
            {company.rounds.map((round, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }} className="flex gap-4">
                {/* Timeline */}
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                    style={{ background: company.color }}>R{i + 1}</div>
                  {i < company.rounds.length - 1 && <div className="w-0.5 flex-1 mt-1" style={{ background: 'var(--border)' }} />}
                </div>

                {/* Card */}
                <div className="card flex-1 mb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>{round.name}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ background: `${company.color}15`, color: company.color }}>{round.type}</span>
                        <span className="text-xs flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                          <Clock size={11} /> {round.time}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} size={12} fill={j < round.difficulty ? company.color : 'none'}
                          style={{ color: j < round.difficulty ? company.color : 'var(--border)' }} />
                      ))}
                    </div>
                  </div>

                  <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>{round.description}</p>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>Must-Prepare Topics</div>
                      <div className="flex flex-wrap gap-1.5">
                        {round.topics.map(t => (
                          <span key={t} className="text-xs px-2 py-1 rounded-lg font-medium"
                            style={{ background: 'var(--bg-primary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>{t}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>Sample Questions</div>
                      <ul className="space-y-1">
                        {round.questions.slice(0, 3).map(q => (
                          <li key={q} className="text-xs flex items-start gap-1" style={{ color: 'var(--text-secondary)' }}>
                            <ChevronRight size={10} className="mt-0.5 shrink-0" /> {q}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-3 p-3 rounded-xl text-sm" style={{ background: `${company.color}0d`, border: `1px solid ${company.color}30` }}>
                    <span className="font-semibold" style={{ color: company.color }}>💡 Tip: </span>
                    <span style={{ color: 'var(--text-secondary)' }}>{round.tips}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
