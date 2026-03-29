import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Copy, Check, Mic, Users, Lightbulb, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

// ─── HR Questions Data ─────────────────────────────────────────────────────────
const HR_CATEGORIES = [
  {
    cat: 'Self Introduction',
    icon: '👤',
    color: '#7c3aed',
    questions: [
      {
        q: 'Tell me about yourself.',
        tips: ['Keep it 60-90 seconds', 'Follow: Name → Education → Skills → Projects → Goal', 'Don\'t recite your CV — add personality'],
        answer: `"My name is [Name], a final-year B.Tech CSE student from [College]. I have a strong foundation in data structures, algorithms, and full-stack development. Over the past year, I built [Project Name], a web app that [brief impact]. I've completed internships/projects in [domain], which helped me understand real-world software development. I'm passionate about problem-solving and am now actively looking for opportunities at [Company] where I can contribute and grow. In my free time, I practice competitive programming and contribute to open source."`,
        tags: ['Very Common', 'Round 1']
      },
      {
        q: 'Walk me through your resume.',
        tips: ['Start from education, go chronologically', 'Highlight the most relevant parts to the role', 'Keep each section to 2-3 sentences'],
        answer: `"Sure! I completed my 12th in [Year] with [%]. Then I joined [College] for B.Tech CSE, graduating in [Year] with a CGPA of [X.X]. During college, I focused on DSA and completed key projects: [Project 1] and [Project 2]. I also did an internship at [Company] where I worked on [tech]. In terms of skills, I'm strong in [languages/frameworks]. My certifications include [AWS/relevant cert]. I believe my profile aligns well with this role because [reason]."`,
        tags: ['Common', 'HR']
      },
      {
        q: 'Why did you choose Computer Science?',
        tips: ['Be genuine — connect to a real interest', 'Mention specific experiences (first program, project, etc.)', 'Link to your career goals'],
        answer: `"I've always been fascinated by how software shapes our daily lives. In 10th grade, I wrote my first program — a simple calculator — and the feeling of creating something from scratch was thrilling. As I learned more, I realized CS gives me the power to solve real-world problems at scale. I chose CSE specifically because it sits at the intersection of logic, creativity, and impact, which is exactly where I want to build my career."`,
        tags: ['Common', 'Motivation']
      },
    ]
  },
  {
    cat: 'Strengths & Weaknesses',
    icon: '⚡',
    color: '#f59e0b',
    questions: [
      {
        q: 'What are your strengths?',
        tips: ['Pick 2-3 specific strengths relevant to the role', 'Always back with an example', 'Avoid generic answers like "hardworking"'],
        answer: `"My three key strengths are: First, problem-solving — I enjoy breaking complex problems into smaller parts. In my internship, I debugged a performance issue that reduced API response time by 40%. Second, quick learning — I picked up React in 3 weeks for a project deadline. Third, attention to detail — my code review contributions caught 15+ bugs in our team's sprint. These qualities make me effective in fast-paced engineering environments."`,
        tags: ['Very Common', 'HR']
      },
      {
        q: 'What is your biggest weakness?',
        tips: ['Choose a real weakness that you\'re actively improving', 'Show self-awareness + growth', 'NEVER say "I\'m a perfectionist" or "I work too hard"'],
        answer: `"I used to struggle with public speaking and presenting technical ideas clearly to non-technical audiences. I realized this when I had to present my project to stakeholders during my internship — I was well-prepared technically but couldn't communicate the impact clearly. Since then, I've been actively working on it: I joined a college debate club, started giving presentations at our coding club, and take every opportunity to explain technical concepts to peers. I've improved significantly and see it as an ongoing journey."`,
        tags: ['Very Common', 'HR']
      },
      {
        q: 'What makes you unique compared to other candidates?',
        tips: ['Combine technical + soft skills + specific experience', 'Be confident but not arrogant', 'Align your uniqueness with what the company needs'],
        answer: `"What sets me apart is the combination of strong technical fundamentals and hands-on project experience. Most freshers have done courses and certifications, but I've built [Project] from scratch — from architecture to deployment — and solved real production issues during my internship. Additionally, I communicate well in teams and have led 3 group projects, which gives me an edge in collaborative environments. I'm also genuinely passionate about [Company's domain], which means I'll be motivated beyond just completing tasks."`,
        tags: ['Differentiation', 'HR']
      },
    ]
  },
  {
    cat: 'Company & Role Specific',
    icon: '🏢',
    color: '#10b981',
    questions: [
      {
        q: 'Why do you want to join our company?',
        tips: ['Research the company before the interview', 'Mention specific: product/service, culture, growth, tech stack', 'Connect company\'s work to your own goals — make it personal'],
        answer: `"I want to join [Company] for three specific reasons. First, [Company]'s product/service — [mention something specific about what they build] — aligns exactly with problems I care about. Second, I've read about [Company]'s engineering culture, particularly [specific practice like open source contributions / engineering blog / specific initiative], which tells me I'll learn a lot here. Third, as a fresher, joining a company that invests in structured onboarding and mentorship — which [Company] is known for — will accelerate my growth in the first 2-3 years. I see this as a place where I can both contribute and grow significantly."`,
        tags: ['Very Common', 'HR', 'Must Prepare']
      },
      {
        q: 'Where do you see yourself in 5 years?',
        tips: ['Show ambition but be realistic', 'Align with the company\'s growth opportunities', 'Mention technical + leadership growth'],
        answer: `"In 5 years, I see myself as a solid senior software engineer with deep expertise in [relevant domain]. In the short term, I want to master the technical fundamentals and become a reliable team contributor. By year 3, I aim to start leading small modules or features independently. By year 5, I want to be in a position where I can mentor juniors and contribute to architectural decisions. I believe [Company] has the right scale and complexity of problems to support that kind of growth journey."`,
        tags: ['Common', 'HR']
      },
      {
        q: 'Why should we hire you?',
        tips: ['Summarize your value in 3 key points', 'Show enthusiasm — they want someone who WANTS to be there', 'Be specific, not generic'],
        answer: `"You should hire me because I bring three things to the table. One, technical ability — I have strong fundamentals in DSA and have built [Project] that demonstrates I can write production-level code. Two, the right attitude — I'm a quick learner, I don't give up on hard problems, and I'm genuinely excited about [Company]'s work. Three, I'm a team player — I've led and contributed to multiple team projects and communicate clearly. I believe I'll ramp up quickly and start adding value within the first few months. I'm also very motivated to work specifically here, not just anywhere."`,
        tags: ['Very Common', 'Closing']
      },
    ]
  },
  {
    cat: 'Situation-Based (STAR)',
    icon: '⭐',
    color: '#06b6d4',
    questions: [
      {
        q: 'Tell me about a challenge you faced and how you overcame it.',
        tips: ['Use STAR method: Situation, Task, Action, Result', 'Choose a real technical or team challenge', 'Focus more on YOUR action than the situation'],
        answer: `"During my final year project, we were 2 weeks from the deadline when our team of 4 suddenly lost one member due to health issues. (Situation) I was the lead and we had 40% of the work remaining. (Task) I immediately reorganized our task board, redistributed the work based on each person's strengths, and moved to daily 15-minute standups to track progress. I personally took on the most complex backend module to unblock others. (Action) We delivered the project on time with all core features working, and even got an A grade from our faculty. (Result) I learned that clear communication and proactive reorganization matter more than raw technical ability during a crisis."`,
        tags: ['Common', 'STAR', 'Behavioral']
      },
      {
        q: 'Describe a situation where you worked in a team.',
        tips: ['Show your contribution specifically, not just "we did it"', 'Mention conflict handling if applicable', 'Include outcome'],
        answer: `"In my second year, I worked in a 5-member team for a state-level hackathon with a 24-hour deadline. We had a disagreement early on about the tech stack — two members wanted to use Angular, others wanted React. (Situation) I facilitated a quick 10-minute discussion where we evaluated both based on team skill level and time constraints, and we chose React since 4 of us knew it better. (Action) I was responsible for the backend APIs and integration. We finished 90% of features in 20 hours, and used the last 4 hours for testing and presentation prep. (Result) We placed 2nd out of 200 teams. The key takeaway was that fast, consensus-driven decisions under pressure are a team superpower."`,
        tags: ['Team', 'STAR']
      },
      {
        q: 'Have you ever failed? What did you learn?',
        tips: ['Be honest — failure shows self-awareness', 'The learning is more important than the failure', 'Show how it changed your approach'],
        answer: `"Yes. During my internship, I was tasked with optimizing a database query that was causing slowness. I spent 2 days trying different SQL optimizations, only to realize at the end that the real issue was in the application logic — we were making N+1 API calls. I missed the obvious because I assumed the problem was in the database from the start. (Failure) The lesson was to always diagnose before assuming — form hypotheses, test them systematically, and don't get tunnel vision. Since then, I always start with 'root cause analysis' before diving into a fix. I also started documenting my debugging process, which has helped me and my team avoid similar issues."`,
        tags: ['Self-Awareness', 'STAR']
      },
    ]
  },
  {
    cat: 'Work & Ethics',
    icon: '🎯',
    color: '#ef4444',
    questions: [
      {
        q: 'Are you comfortable with relocation?',
        tips: ['Be honest — don\'t say yes if you absolutely can\'t relocate', 'If yes, show flexibility and enthusiasm', 'If partial, be specific about constraints'],
        answer: `"Yes, I'm completely comfortable with relocation. I understand that working in a major tech hub comes with opportunities to collaborate with diverse teams, attend events, and grow faster. I'm currently from [City], but I have no constraints that would prevent me from relocating to [Company's location]. I see it as part of the experience of starting my career."`,
        tags: ['Common', 'Logistics']
      },
      {
        q: 'Are you comfortable with night shifts or extended hours?',
        tips: ['Be honest about realistic expectations', 'Show commitment without sounding desperate', 'Mention your work ethic'],
        answer: `"I understand that tech work sometimes requires additional hours, especially around releases or critical issues. I'm comfortable with that when the situation calls for it. That said, I also believe in sustainable work practices — I work best when I'm rested and focused. I'm happy to put in extra effort when the team needs it, and I also value a culture where time is used effectively so that extended hours are the exception, not the norm."`,
        tags: ['HR', 'Work Culture']
      },
      {
        q: 'Do you have any questions for us?',
        tips: ['ALWAYS ask questions — shows genuine interest', 'Ask about growth, team culture, tech stack, or onboarding', 'Don\'t ask about salary/leave in HR rounds'],
        answer: `Good questions to ask:
• "What does the onboarding process look like for new engineers?"
• "What technologies does the team currently work with, and are there plans to adopt new ones?"
• "What does success look like in the first 3-6 months for someone in this role?"
• "Can you tell me about the team I'd be working with and how they collaborate?"
• "What are the biggest challenges the engineering team is currently solving?"
• "Are there opportunities for internal mobility or cross-team projects?"`,
        tags: ['Closing', 'Must Ask']
      },
    ]
  },
  {
    cat: 'Salary & Offers',
    icon: '💰',
    color: '#8b5cf6',
    questions: [
      {
        q: 'What are your salary expectations?',
        tips: ['Research market rates for freshers at that company', 'Give a range, not a single number', 'Show flexibility while anchoring high'],
        answer: `"Based on my research on fresher compensation at companies of [Company]'s scale and the current market for [role], I'm looking at a range of ₹X–₹Y LPA. That said, I'm more focused on the quality of the role, learning opportunities, and the team culture at this stage of my career. I'm open to discussing compensation once we've established mutual fit, and I'm confident we can agree on something reasonable."`,
        tags: ['Salary', 'Negotiation']
      },
      {
        q: 'Do you have any other offers?',
        tips: ['Be truthful — it\'s okay to have offers, it shows market value', 'Don\'t bluff or exaggerate', 'Show genuine preference for THIS company if you have one'],
        answer: `"Yes, I'm currently in the interview process with [Company A] and have received an offer from [Company B]. However, [Company] is my top preference because of [specific reason]. I wanted to be transparent about this — I'm genuinely interested in this opportunity and would be happy to share more details if needed. I'm also happy to give you a timeline by which I need to respond to the other offer, so we can plan accordingly."`,
        tags: ['Honest', 'HR']
      },
    ]
  },
];

// ─── GD Topics Data ────────────────────────────────────────────────────────────
const GD_TOPICS = [
  {
    topic: 'Is Artificial Intelligence a threat or an opportunity?',
    category: 'Technology',
    color: '#3b82f6',
    forPoints: [
      'AI creates new job categories (prompt engineers, AI trainers, AI ethicists)',
      'AI handles repetitive tasks, freeing humans for creative/strategic work',
      'AI improves healthcare — early disease detection, drug discovery',
      'AI boosts productivity across industries (agriculture, logistics, education)',
      'Countries that adopt AI early will have significant economic advantages',
    ],
    againstPoints: [
      'Automation threatens 85 million jobs by 2025 (WEF estimate)',
      'AI bias and discrimination in hiring, lending, criminal justice',
      'Privacy concerns — AI surveillance, data misuse',
      'Concentration of AI power in a few corporations/countries',
      'Deepfakes and misinformation at scale',
    ],
    conclusion: 'AI is primarily an opportunity if we proactively manage its risks through regulation, reskilling programs, and ethical frameworks. Like past industrial revolutions, it will displace some jobs while creating new ones, but the pace of change demands intentional policy.',
    keyFacts: ['ChatGPT reached 100M users in 2 months (fastest in history)', 'India has the 3rd largest AI startup ecosystem globally', 'AI market expected to reach $1.8 trillion by 2030']
  },
  {
    topic: 'Work From Home vs. Work From Office — Which is better?',
    category: 'Workplace',
    color: '#10b981',
    forPoints: [
      'WFH: No commute → 2-3 hours saved daily, better work-life balance',
      'WFH: Companies save on office infrastructure costs',
      'WFH: Proven productivity gains for focused/individual work',
      'WFO: Better collaboration, spontaneous problem-solving, team bonding',
      'WFO: Clearer work-life separation, better for freshers (mentorship)',
    ],
    againstPoints: [
      'WFH: Isolation, burnout, "always online" culture',
      'WFH: Not feasible for all roles (manufacturing, labs, service)',
      'WFO: Commute waste, expensive city living for employees',
      'WFO: Less flexibility, harder for working parents',
      'WFH: Infrastructure inequality — not everyone has good home setup',
    ],
    conclusion: 'Hybrid model (3 days office, 2 days remote) is emerging as the optimal balance — preserving collaboration benefits while offering flexibility. The "best" model depends on role type, team size, and individual preference.',
    keyFacts: ['77% of remote workers report better productivity (Stanford study)', 'Microsoft found collaboration networks became more siloed in full WFH', 'India: 50%+ companies adopted hybrid by 2023']
  },
  {
    topic: 'Social Media: Boon or Bane for today\'s youth?',
    category: 'Society',
    color: '#f59e0b',
    forPoints: [
      'Platform for education, skill-building, and free information',
      'Entrepreneurship opportunities (content creators earn crores)',
      'Social movements and awareness (climate, mental health)',
      'Connecting with global communities, diverse perspectives',
      'Job search, networking, portfolio building (LinkedIn)',
    ],
    againstPoints: [
      'Mental health impact — anxiety, FOMO, depression from comparison',
      'Misinformation and fake news spreading faster than facts',
      'Privacy violation, data exploitation by corporations',
      'Reduced attention spans and deep thinking ability',
      'Cyberbullying and online harassment',
    ],
    conclusion: 'Social media is a powerful tool that is boon or bane depending on how consciously it is used. Digital literacy, time limits, and platform accountability are key to making it net positive for youth.',
    keyFacts: ['Average Indian youth spends 3.8 hours/day on social media', '45% of teens report feeling overwhelmed by social media (Pew Research)', 'Instagram reach: 2B+ monthly active users']
  },
  {
    topic: 'Should engineering education in India be more practical than theoretical?',
    category: 'Education',
    color: '#8b5cf6',
    forPoints: [
      'Industry-academia gap: most graduates aren\'t job-ready on day 1',
      'Practical skills (coding, lab, projects) are directly measurable by employers',
      'Countries like Germany integrate apprenticeships into engineering degrees',
      'India needs more innovation, which requires experimental, hands-on culture',
      'NASSCOM: 80% of Indian engineers need reskilling before being productive',
    ],
    againstPoints: [
      'Theory builds the foundation — you can\'t build on sand',
      'Impractical to provide industry-grade labs to all 3,500+ engineering colleges',
      'Theoretical knowledge is transferable across domains and time',
      'Excessive focus on practical may limit research output',
      'Industry\'s needs change faster than curriculum can adapt',
    ],
    conclusion: 'A 60:40 practical-to-theory ratio with mandatory industry internships would serve Indian engineering students best. Curriculum reform should happen in partnership with industry, not in isolation from it.',
    keyFacts: ['India graduates 1.5M engineers annually', 'Only 3% of IIT graduates become entrepreneurs (vs 30%+ in US peers)', 'Average fresher upskilling cost for companies: ₹2-3 lakhs']
  },
  {
    topic: 'Should India ban cryptocurrency?',
    category: 'Finance & Technology',
    color: '#ef4444',
    forPoints: [
      'Potential for financial inclusion in the unbanked population',
      'Blockchain technology has applications beyond currency (supply chain, identity)',
      'Outright ban pushes innovation offshore, weakening India\'s tech position',
      'Crypto can be regulated, not banned (as done in many countries)',
      'Digital assets are a new asset class that investors should have access to',
    ],
    againstPoints: [
      'Extreme volatility makes it unsuitable as a currency',
      'Used extensively for money laundering, ransomware, dark web transactions',
      'Undermines RBI\'s monetary policy and control',
      'Massive energy consumption (Bitcoin uses more energy than some countries)',
      'Most retail investors lose money — requires strong consumer protection',
    ],
    conclusion: 'Complete ban would be counterproductive. India\'s approach of high taxation (30%) while developing a CBDC (Digital Rupee) is pragmatic — regulating rather than eliminating the space, while promoting a government-backed alternative.',
    keyFacts: ['India has 100M+ crypto users (second largest globally)', 'RBI launched e-Rupee (CBDC) in 2022', 'India imposed 30% crypto tax in Budget 2022']
  },
  {
    topic: 'Is remote working the future of work in India?',
    category: 'Workplace',
    color: '#06b6d4',
    forPoints: [
      'Tier 2/3 cities get access to MNC/startup opportunities without relocating',
      'Reverse migration — talent returning to smaller cities, boosting local economies',
      'Companies can hire globally without geographic constraints',
      'Carbon footprint reduction — fewer cars on road',
      'Proved viable during COVID — 3 years of successful remote work',
    ],
    againstPoints: [
      'Infrastructure inequality — internet penetration, power stability in rural areas',
      'Collaboration and mentorship are harder remotely, especially for freshers',
      'India\'s culture of in-person relationship building affects deal-making',
      'Many sectors (manufacturing, government, healthcare) can\'t go remote',
      'Home environments in India often lack quiet, dedicated workspaces',
    ],
    conclusion: 'Remote work will be significant for knowledge workers but full remote will remain a minority. Hybrid + remote-first policies will grow, especially in IT/startup sectors, while traditional industries will remain largely in-person.',
    keyFacts: ['Bengaluru alone lost 2.2M workers to hometowns during COVID who later returned', '65% of Indian IT companies adopted permanent hybrid by 2023', 'WFH penetration in India: ~12% (much lower than US at ~35%)']
  },
];

// ─── Interview Tips ────────────────────────────────────────────────────────────
const INTERVIEW_TIPS = {
  before: [
    { tip: 'Research the company thoroughly', detail: 'Know their products, recent news, funding, tech stack, culture. Check their website, LinkedIn, Glassdoor, and any recent press releases.' },
    { tip: 'Practice out loud', detail: 'Thinking an answer and saying it are very different. Practice with a mirror or record yourself. Common mistake: knowing the answer but fumbling the delivery.' },
    { tip: 'Prepare 5 STAR stories', detail: 'Have 5 strong situations ready: challenge overcome, leadership shown, conflict resolved, failure learned from, teamwork success. Most HR questions map to these.' },
    { tip: 'Test your setup (for virtual interviews)', detail: 'Check camera, mic, internet 30 minutes before. Have a plain background, good lighting from the front, not backlit.' },
    { tip: 'Sleep well and eat before', detail: 'Cognitive function drops significantly with poor sleep. You cannot perform at your best on 4 hours of sleep no matter how well prepared you are.' },
  ],
  during: [
    { tip: 'Pause before answering', detail: 'It\'s okay to say "Give me a moment to think about that." 5 seconds of silence feels long to you but is completely normal to the interviewer.' },
    { tip: 'Use the STAR format for behavioral questions', detail: 'Situation (10%) → Task (10%) → Action (60%) → Result (20%). Most people talk too much about the situation and too little about their actions.' },
    { tip: 'Quantify everything possible', detail: '"I improved performance" is weak. "I reduced API latency by 40%, from 800ms to 480ms, by switching to Redis caching" is memorable.' },
    { tip: 'Show enthusiasm genuinely', detail: 'Interviewers hire people they want to work with. Engagement, smiling, leaning forward slightly, making eye contact — these matter as much as answers.' },
    { tip: 'Ask for clarification if unsure', detail: '"Could you give me a bit more context on what specifically you\'re looking for?" is a sign of maturity, not weakness.' },
  ],
  after: [
    { tip: 'Send a thank-you email within 24 hours', detail: 'Brief, genuine, specific. "Thank you for taking the time... I especially enjoyed discussing [specific topic]... I remain very excited about this opportunity."' },
    { tip: 'Write down what you remember', detail: 'Capture questions asked, what went well, what you\'d answer differently. This makes every interview a learning experience even if you don\'t get the role.' },
    { tip: 'Follow up professionally if no response in 1 week', detail: 'A single, polite follow-up email is appropriate. Don\'t call repeatedly or send multiple messages — it signals poor boundary awareness.' },
  ],
  bodyLanguage: [
    { tip: 'Maintain eye contact (70% of the time)', detail: 'Too much = aggressive, too little = unconfident. Natural eye contact while speaking builds trust.' },
    { tip: 'Firm handshake, warm smile at the start', detail: 'The first 30 seconds set the tone. A confident greeting primes the interviewer to see you positively.' },
    { tip: 'Sit straight, slightly leaning forward', detail: 'Shows engagement. Slouching signals disinterest. Don\'t cross arms — open posture signals confidence and openness.' },
    { tip: 'Control nervous habits', detail: 'Pen clicking, hair touching, excessive "um" and "uh". Practice awareness of your specific nervous ticks and consciously reduce them.' },
    { tip: 'Mirror the interviewer\'s energy', detail: 'If they\'re formal, be formal. If they\'re casual and friendly, you can relax slightly. Social mirroring builds rapport.' },
  ]
};

// ─── Company HR Q&A ────────────────────────────────────────────────────────────
const COMPANY_HR = [
  {
    company: 'TCS',
    color: '#1e40af',
    focus: 'Values alignment, long-term commitment, learning agility',
    questions: [
      { q: 'TCS has a bond/service agreement. Are you comfortable with that?', a: 'Yes, I understand TCS\'s initial service commitment. I see it as a mutual investment — TCS invests in my training and development, and I commit my time and skills in return. I\'m looking for a long-term career, not just a job, so a 1-2 year commitment aligns with my own goals of building deep expertise before moving roles.' },
      { q: 'How do you handle working on repetitive/maintenance tasks?', a: 'I believe every task has value. Even "repetitive" maintenance code requires precision — a bug in production has real consequences. I find ways to make routine work more efficient: automating where possible, improving documentation. I\'ve also found that deep work on existing systems often teaches more than building new things, because you understand why decisions were made.' },
      { q: 'TCS works with multiple clients. How do you handle frequent context switches?', a: 'I actually enjoy working across domains — it keeps learning continuous. I handle context switches by maintaining clear notes and documentation so I can ramp back up quickly. In college projects, I\'ve balanced 3-4 parallel responsibilities and found that good organization and habit-building (daily standup with myself, task lists) makes it manageable.' },
    ]
  },
  {
    company: 'Infosys',
    color: '#0f766e',
    focus: 'Communication, problem-solving approach, client readiness',
    questions: [
      { q: 'How comfortable are you working directly with clients?', a: 'I\'m very comfortable. I\'ve presented technical work to faculty, external judges at hackathons, and project stakeholders. I understand that client-facing work requires clear communication, professional demeanor, and the ability to translate technical complexity into business terms. I actively worked on my communication skills in college and am ready for that responsibility.' },
      { q: 'What do you know about Infosys\'s core values?', a: 'Infosys is built on C-LIFE values: Client Value, Leadership by Example, Integrity and Transparency, Fairness, and Excellence. What resonates most with me is integrity and excellence — I believe in doing the right thing even when no one is watching, and I don\'t settle for "good enough" when I can make something genuinely excellent.' },
      { q: 'Describe how you approach learning new technologies quickly.', a: 'I follow a structured approach: I start with official documentation and one good course, then immediately build something small with the technology. Theory without practice doesn\'t stick for me. I also look for "mental models" — how does this new thing relate to what I already know? For example, when I learned Docker, I mapped it to my understanding of VMs. This approach helped me become productive in React within 3 weeks.' },
    ]
  },
  {
    company: 'Wipro',
    color: '#7c3aed',
    focus: 'Adaptability, client service mindset, team orientation',
    questions: [
      { q: 'Wipro is known for training. How will you make the most of it?', a: 'I plan to treat training as a full-time job — attending all sessions actively, completing extra exercises, and networking with peers and trainers. I\'ll maintain a learning journal and try to apply concepts immediately in practice environments. I\'m particularly interested in [Wipro\'s specific technology area] training and plan to get certified within the first year.' },
      { q: 'How do you deal with ambiguous requirements?', a: 'First, I clarify — I ask specific questions to narrow down what\'s needed. I create a brief requirement document or bullet list of my understanding and confirm with stakeholders before starting. If some ambiguity remains, I build for the most common use case first and make the solution modular enough to accommodate changes. I\'ve found that 30 minutes of clarification saves days of rework.' },
      { q: 'Are you open to working in any technology domain?', a: 'Yes, absolutely. While I have strengths in [your stack], I believe that strong fundamentals in CS — algorithms, system design, data modeling — transfer across all domains. I\'m genuinely curious and have picked up multiple technologies independently. I\'d naturally develop a preference over time, but I\'m entering with an open mind and enthusiasm for whichever domain I\'m placed in.' },
    ]
  },
  {
    company: 'Accenture',
    color: '#a855f7',
    focus: 'Innovation, creativity, business impact mindset',
    questions: [
      { q: 'Accenture works at the intersection of tech and business. How do you think about business impact?', a: 'I think every technical decision has a business consequence. When I built [project], I didn\'t just think about code quality — I measured: How does this reduce user effort? By how many clicks? How does it affect engagement? This habit of connecting technical work to measurable outcomes is something I want to develop further. I\'m also genuinely interested in understanding the client\'s business model, not just their tech requirements.' },
      { q: 'Tell me about a creative solution you\'ve devised.', a: 'During a college hackathon, our team needed real-time location sharing but had no budget for a map API. Instead of giving up, I used the HTML5 Geolocation API and overlaid coordinates on an OpenStreetMap embed — completely free, implemented in 4 hours, and worked perfectly. The solution wasn\'t in any tutorial; it came from combining two things no one had thought to combine. I enjoy that kind of constraint-driven creativity.' },
      { q: 'How do you handle feedback and criticism?', a: 'I genuinely welcome it. In my last project, my team lead told me my variable names were unclear and making the code hard to review. My initial reaction was mild defensiveness, but I took a step back, re-read my code with fresh eyes, and realized he was right. I rewrote the naming conventions and the codebase became much more readable. I now actively ask for feedback rather than waiting for it.' },
    ]
  },
];

// ─── Main Component ────────────────────────────────────────────────────────────
const TABS = ['HR Questions', 'Company Q&A', 'GD Topics', 'Interview Tips'];

export default function InterviewPrep() {
  const [tab, setTab] = useState(0);
  const [openQ, setOpenQ] = useState(null);
  const [openGD, setOpenGD] = useState(null);
  const [openTip, setOpenTip] = useState('before');
  const [gdFilter, setGdFilter] = useState('All');
  const [copied, setCopied] = useState(null);
  const [hrCatOpen, setHrCatOpen] = useState(0);
  const [selectedCompany, setSelectedCompany] = useState('TCS');

  const copyAnswer = (text, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(id);
      toast.success('Answer copied!');
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const gdCategories = ['All', ...new Set(GD_TOPICS.map(g => g.category))];
  const filteredGD = gdFilter === 'All' ? GD_TOPICS : GD_TOPICS.filter(g => g.category === gdFilter);
  const activeCompany = COMPANY_HR.find(c => c.company === selectedCompany);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-20 md:pb-0">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>🎤 Interview Preparation</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>HR Questions • Company Q&A • GD Topics • Interview Tips — everything for your placement interview</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl overflow-x-auto" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)}
            className="flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap"
            style={tab === i
              ? { background: 'linear-gradient(135deg,#7c3aed,#06b6d4)', color: 'white' }
              : { color: 'var(--text-secondary)' }}>
            {t}
          </button>
        ))}
      </div>

      {/* ── HR Questions Tab ── */}
      {tab === 0 && (
        <div className="space-y-3">
          <div className="rounded-2xl p-4" style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.1),rgba(6,182,212,0.08))', border: '1px solid rgba(124,58,237,0.2)' }}>
            <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>💡 How to use this section</div>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Read the model answer, then close it and answer out loud from memory. Practice until you can answer confidently without reading. Copy the answer to practice with ChatGPT as your interviewer!</p>
          </div>

          {HR_CATEGORIES.map((cat, ci) => (
            <div key={ci} className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
              <button className="w-full flex items-center justify-between p-5"
                onClick={() => setHrCatOpen(hrCatOpen === ci ? null : ci)}>
                <div className="flex items-center gap-3">
                  <span className="text-xl">{cat.icon}</span>
                  <div>
                    <div className="font-bold" style={{ color: 'var(--text-primary)' }}>{cat.cat}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{cat.questions.length} questions</div>
                  </div>
                </div>
                <ChevronDown size={16} className={`transition-transform ${hrCatOpen === ci ? 'rotate-180' : ''}`}
                  style={{ color: 'var(--text-secondary)' }} />
              </button>
              <AnimatePresence>
                {hrCatOpen === ci && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                    className="overflow-hidden border-t" style={{ borderColor: 'var(--border)' }}>
                    <div className="p-4 space-y-3">
                      {cat.questions.map((item, qi) => {
                        const key = `${ci}-${qi}`;
                        return (
                          <div key={qi} className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                            <button className="w-full flex items-start justify-between p-4 text-left"
                              onClick={() => setOpenQ(openQ === key ? null : key)}>
                              <div className="flex-1 pr-4">
                                <div className="font-medium text-sm mb-2" style={{ color: 'var(--text-primary)' }}>Q: {item.q}</div>
                                <div className="flex flex-wrap gap-1.5">
                                  {item.tags.map(tag => (
                                    <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                                      style={{ background: `${cat.color}15`, color: cat.color }}>{tag}</span>
                                  ))}
                                </div>
                              </div>
                              {openQ === key ? <ChevronUp size={14} style={{ color: 'var(--text-secondary)', shrink: 0 }} /> : <ChevronDown size={14} style={{ color: 'var(--text-secondary)' }} />}
                            </button>
                            <AnimatePresence>
                              {openQ === key && (
                                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                                  className="overflow-hidden border-t" style={{ borderColor: 'var(--border)' }}>
                                  <div className="p-4 space-y-3" style={{ background: 'var(--bg-primary)' }}>
                                    {/* Tips */}
                                    <div className="space-y-1.5">
                                      {item.tips.map((tip, ti) => (
                                        <div key={ti} className="flex items-start gap-2 text-xs">
                                          <span style={{ color: '#f59e0b' }}>⚡</span>
                                          <span style={{ color: 'var(--text-secondary)' }}>{tip}</span>
                                        </div>
                                      ))}
                                    </div>
                                    {/* Model answer */}
                                    <div className="rounded-xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold" style={{ color: cat.color }}>📝 Model Answer</span>
                                        <button onClick={() => copyAnswer(item.answer, key)}
                                          className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg"
                                          style={{ background: `${cat.color}15`, color: cat.color }}>
                                          {copied === key ? <Check size={11} /> : <Copy size={11} />}
                                          {copied === key ? 'Copied!' : 'Copy'}
                                        </button>
                                      </div>
                                      <p className="text-xs leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-secondary)' }}>{item.answer}</p>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}

      {/* ── Company Q&A Tab ── */}
      {tab === 1 && (
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {COMPANY_HR.map(c => (
              <button key={c.company} onClick={() => setSelectedCompany(c.company)}
                className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
                style={selectedCompany === c.company
                  ? { background: c.color, color: 'white' }
                  : { background: `${c.color}15`, color: c.color, border: `1px solid ${c.color}30` }}>
                {c.company}
              </button>
            ))}
          </div>

          {activeCompany && (
            <div className="space-y-3">
              <div className="rounded-xl p-4" style={{ background: `${activeCompany.color}10`, border: `1px solid ${activeCompany.color}30` }}>
                <div className="text-xs font-bold mb-1" style={{ color: activeCompany.color }}>{activeCompany.company} HR Focus</div>
                <div className="text-sm" style={{ color: 'var(--text-primary)' }}>{activeCompany.focus}</div>
              </div>
              {activeCompany.questions.map((item, qi) => (
                <div key={qi} className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                  <button className="w-full flex items-start justify-between p-4 text-left"
                    onClick={() => setOpenQ(`company-${qi}`)}>
                    <div className="font-medium text-sm pr-4" style={{ color: 'var(--text-primary)' }}>{item.q}</div>
                    {openQ === `company-${qi}` ? <ChevronUp size={14} style={{ color: 'var(--text-secondary)' }} /> : <ChevronDown size={14} style={{ color: 'var(--text-secondary)' }} />}
                  </button>
                  <AnimatePresence>
                    {openQ === `company-${qi}` && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                        className="overflow-hidden border-t" style={{ borderColor: 'var(--border)' }}>
                        <div className="p-4" style={{ background: 'var(--bg-primary)' }}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold" style={{ color: activeCompany.color }}>Model Answer</span>
                            <button onClick={() => copyAnswer(item.a, `company-${qi}`)}
                              className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg"
                              style={{ background: `${activeCompany.color}15`, color: activeCompany.color }}>
                              {copied === `company-${qi}` ? <Check size={11} /> : <Copy size={11} />}
                              Copy
                            </button>
                          </div>
                          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item.a}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── GD Topics Tab ── */}
      {tab === 2 && (
        <div className="space-y-4">
          <div className="rounded-xl p-4" style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)' }}>
            <div className="text-sm font-bold mb-1" style={{ color: '#06b6d4' }}>💬 GD Strategy</div>
            <div className="text-xs space-y-1" style={{ color: 'var(--text-secondary)' }}>
              <div>• Initiate if confident — first and last speakers are remembered most</div>
              <div>• Use facts and examples, not just opinions</div>
              <div>• Acknowledge others: "Building on what [name] said..." shows listening</div>
              <div>• Bring the group back on track if discussion drifts</div>
              <div>• Conclude with a balanced, nuanced summary</div>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {gdCategories.map(cat => (
              <button key={cat} onClick={() => setGdFilter(cat)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={gdFilter === cat
                  ? { background: 'linear-gradient(135deg,#7c3aed,#06b6d4)', color: 'white' }
                  : { background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredGD.map((gd, gi) => (
              <div key={gi} className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                <button className="w-full flex items-start justify-between p-5 text-left"
                  onClick={() => setOpenGD(openGD === gi ? null : gi)}>
                  <div className="flex-1 pr-4">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mb-2"
                      style={{ background: `${gd.color}15`, color: gd.color }}>{gd.category}</span>
                    <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{gd.topic}</div>
                  </div>
                  <ChevronDown size={16} className={`transition-transform shrink-0 ${openGD === gi ? 'rotate-180' : ''}`}
                    style={{ color: 'var(--text-secondary)' }} />
                </button>
                <AnimatePresence>
                  {openGD === gi && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                      className="overflow-hidden border-t" style={{ borderColor: 'var(--border)' }}>
                      <div className="p-5 space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="rounded-xl p-4" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)' }}>
                            <div className="text-xs font-bold text-green-400 mb-2">✅ FOR (Points)</div>
                            <div className="space-y-1.5">
                              {gd.forPoints.map((p, i) => (
                                <div key={i} className="flex items-start gap-2 text-xs">
                                  <span className="text-green-400 shrink-0">•</span>
                                  <span style={{ color: 'var(--text-secondary)' }}>{p}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="rounded-xl p-4" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
                            <div className="text-xs font-bold text-red-400 mb-2">❌ AGAINST (Points)</div>
                            <div className="space-y-1.5">
                              {gd.againstPoints.map((p, i) => (
                                <div key={i} className="flex items-start gap-2 text-xs">
                                  <span className="text-red-400 shrink-0">•</span>
                                  <span style={{ color: 'var(--text-secondary)' }}>{p}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="rounded-xl p-4" style={{ background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.2)' }}>
                          <div className="text-xs font-bold text-cyan-400 mb-2">🎯 Balanced Conclusion</div>
                          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{gd.conclusion}</p>
                        </div>
                        <div className="rounded-xl p-3" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
                          <div className="text-xs font-bold mb-2" style={{ color: 'var(--text-primary)' }}>📊 Key Facts to Quote</div>
                          <div className="space-y-1">
                            {gd.keyFacts.map((f, i) => (
                              <div key={i} className="text-xs flex items-start gap-2">
                                <span style={{ color: '#f59e0b' }}>★</span>
                                <span style={{ color: 'var(--text-secondary)' }}>{f}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Interview Tips Tab ── */}
      {tab === 3 && (
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {[
              { key: 'before', label: 'Before Interview', icon: '📋' },
              { key: 'during', label: 'During Interview', icon: '🎤' },
              { key: 'after', label: 'After Interview', icon: '✅' },
              { key: 'bodyLanguage', label: 'Body Language', icon: '🤝' },
            ].map(s => (
              <button key={s.key} onClick={() => setOpenTip(s.key)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={openTip === s.key
                  ? { background: 'linear-gradient(135deg,#7c3aed,#06b6d4)', color: 'white' }
                  : { background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                {s.icon} {s.label}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {INTERVIEW_TIPS[openTip]?.map((item, i) => (
              <div key={i} className="card">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                    style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)' }}>{i + 1}</div>
                  <div>
                    <div className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{item.tip}</div>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
