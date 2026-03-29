import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, BookOpen, CheckCircle, XCircle, RotateCcw, Lightbulb } from 'lucide-react';

// ─── Data ──────────────────────────────────────────────────────────────────────

const SUBJECTS = [
  {
    key: 'os',
    label: 'Operating Systems',
    icon: '💻',
    color: '#3b82f6',
    shortDesc: 'Process management, memory, scheduling, deadlock, synchronization',
    topics: [
      {
        title: 'Process & Thread Management',
        content: `A **Process** is a program in execution. It has its own memory space, PCB (Process Control Block), and resources.
A **Thread** is the smallest unit of execution within a process. Threads share the same memory space.

**Process States:** New → Ready → Running → Waiting → Terminated

**PCB contains:** PID, program counter, CPU registers, memory limits, open files, priority

**Process vs Thread:**
• Process: heavy, own memory, slow context switch
• Thread: lightweight, shared memory, fast context switch

**Types of threads:** User-level threads (managed by user library) vs Kernel-level threads (managed by OS)

**Context Switch:** Saving the state of a process/thread and loading the next one. Overhead is caused by saving/restoring registers, cache invalidation.

**IPC (Inter-Process Communication):** Pipes, Message Queues, Shared Memory, Semaphores, Sockets`,
        keyPoints: [
          'Process = program + resources; Thread = lightweight process',
          'PCB stores PID, PC, registers, memory info',
          'Shared memory is fastest IPC; pipes are simplest',
          'User threads are faster but block entire process on I/O',
        ],
      },
      {
        title: 'CPU Scheduling Algorithms',
        content: `**Goal:** Maximize CPU utilization, throughput; minimize waiting time, turnaround time, response time.

**FCFS (First Come First Serve):** Non-preemptive. Simple but convoy effect (short processes wait behind long ones).

**SJF (Shortest Job First):** Non-preemptive. Optimal average waiting time, but starvation possible.

**SRTF (Shortest Remaining Time First):** Preemptive SJF. Best average waiting time.

**Round Robin (RR):** Preemptive. Each process gets a time quantum. No starvation. Best for time-sharing.

**Priority Scheduling:** Each process has priority. Can be preemptive/non-preemptive. Starvation → solved by Aging.

**Multilevel Queue:** Processes divided into groups (foreground/background) each with own algorithm.

**Key Formulas:**
• Turnaround Time = Completion Time - Arrival Time
• Waiting Time = Turnaround Time - Burst Time
• Response Time = First Run Time - Arrival Time
• CPU Utilization = CPU busy time / Total time`,
        keyPoints: [
          'FCFS: simple, convoy effect; SJF: optimal but starvation',
          'Round Robin: best for time-sharing, no starvation',
          'WT = TAT - BT; TAT = CT - AT',
          'Aging prevents starvation in priority scheduling',
        ],
      },
      {
        title: 'Memory Management',
        content: `**Contiguous Allocation:** Each process gets a single continuous block. Fragmentation issues.

**Paging:** Memory divided into fixed-size pages (logical) and frames (physical). No external fragmentation.
• Page table maps page number to frame number
• Address = Page Number × Page Size + Offset
• TLB (Translation Lookaside Buffer): cache for page table lookups

**Segmentation:** Divides memory into variable-size segments (code, stack, heap). No internal fragmentation.

**Virtual Memory:** Allows execution of processes not fully in memory. Uses demand paging.

**Page Replacement Algorithms:**
• FIFO: replace oldest page
• Optimal (OPT): replace page used farthest in future (best, not implementable)
• LRU: replace least recently used (best implementable)
• Clock Algorithm: approximation of LRU

**Thrashing:** CPU spends more time swapping pages than executing. Solved by working set model.

**Belady's Anomaly:** Adding more frames can INCREASE page faults (FIFO only, not LRU/OPT)`,
        keyPoints: [
          'Paging: no external fragmentation; Segmentation: no internal fragmentation',
          'TLB reduces page table access overhead',
          'LRU is best practical replacement; OPT is theoretical best',
          'Thrashing = too many page faults; fix by reducing multiprogramming',
        ],
      },
      {
        title: 'Deadlock',
        content: `**Deadlock:** All processes are waiting for resources held by each other — circular wait.

**4 Necessary Conditions (Coffman Conditions):**
1. Mutual Exclusion: resource held by only one process
2. Hold and Wait: process holds resource and waits for another
3. No Preemption: resource can't be forcibly taken
4. Circular Wait: P1→R1→P2→R2→P1 cycle

**Deadlock Handling:**
• **Prevention:** Eliminate one of the 4 conditions
• **Avoidance:** Banker's Algorithm — only grant if safe state maintained
• **Detection:** Allow deadlock, detect using wait-for graph, then recover
• **Ignorance:** Ostrich algorithm (Windows/Unix for rare deadlocks)

**Banker's Algorithm:**
• Safe state = there exists a safe sequence where all processes can finish
• Need matrix = Max - Allocation
• Grant request only if system remains in safe state

**Recovery from Deadlock:** Process termination (kill one/all deadlocked) or Resource Preemption (take resources away)`,
        keyPoints: [
          '4 conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait',
          'Banker\'s Algorithm: checks safe state before granting resources',
          'Wait-for graph: used for detection (cycle = deadlock)',
          'Prevention eliminates one condition; avoidance uses Banker\'s',
        ],
      },
      {
        title: 'Synchronization',
        content: `**Race Condition:** Two+ processes access shared data concurrently, final result depends on execution order.

**Critical Section:** Code segment accessing shared resources. Requirements:
1. Mutual Exclusion: only one process in CS at a time
2. Progress: if no one is in CS, an interested process must enter
3. Bounded Waiting: limited number of times others enter CS before a waiting process

**Solutions:**
• **Mutex (Mutual Exclusion Lock):** Binary lock — acquire/release
• **Semaphore:** Integer variable. wait(S): S--; signal(S): S++
  - Binary semaphore = mutex
  - Counting semaphore = resource counting
• **Monitor:** High-level synchronization. Only one thread active at a time
• **Peterson's Solution:** Software solution for 2 processes

**Classic Problems:**
• **Producer-Consumer:** shared buffer, use semaphore (empty, full, mutex)
• **Readers-Writers:** multiple readers OK, one writer at a time
• **Dining Philosophers:** 5 philosophers, 5 forks, circular deadlock

**Spinlock vs Sleep lock:** Spinlock = busy wait (good for short wait); Sleep lock = OS puts thread to sleep`,
        keyPoints: [
          'Race condition → critical section problem',
          'Semaphore: wait() decrements, signal() increments',
          'Mutex = binary semaphore; Monitor = high-level sync',
          'Producer-Consumer uses 3 semaphores: empty, full, mutex',
        ],
      },
      {
        title: 'File Systems & I/O',
        content: `**File System:** Organizes files on disk. Provides naming, access, protection.

**Disk Scheduling Algorithms:**
• FCFS: service in arrival order. Simple, poor performance
• SSTF (Shortest Seek Time First): go to nearest request. Starvation possible
• SCAN (Elevator): go to one end, reverse. Better than SSTF
• C-SCAN: like SCAN but only services in one direction
• LOOK/C-LOOK: like SCAN/C-SCAN but don't go to ends

**File Allocation Methods:**
• Contiguous: fast sequential, fragmentation
• Linked: no fragmentation, random access slow
• Indexed: inode stores block addresses, efficient random access

**UNIX File System:** inode contains file metadata + block pointers (direct + indirect + double indirect)

**I/O Management:**
• Polling: CPU keeps checking device status (busy-wait)
• Interrupt-Driven: device sends interrupt when done
• DMA (Direct Memory Access): device transfers directly to memory, CPU freed`,
        keyPoints: [
          'SSTF: best seek time but starvation; SCAN: no starvation',
          'Indexed allocation: inode with direct/indirect block pointers',
          'DMA: device → memory directly, CPU not needed',
          'C-SCAN is fairer than SCAN (uniform wait time)',
        ],
      },
    ],
    mcqs: [
      { q: 'Which page replacement algorithm suffers from Belady\'s Anomaly?', opts: ['LRU','FIFO','OPT','Clock'], ans: 1, exp: 'Belady\'s Anomaly: adding more frames increases page faults — occurs only in FIFO, not LRU or OPT.' },
      { q: 'What is the minimum number of processes needed for deadlock to occur?', opts: ['1','2','3','4'], ans: 1, exp: '2 processes minimum for deadlock: P1 holds R1, wants R2; P2 holds R2, wants R1.' },
      { q: 'Which scheduling algorithm is best for time-sharing systems?', opts: ['FCFS','SJF','Round Robin','Priority'], ans: 2, exp: 'Round Robin gives equal time slices to all processes, preventing starvation — ideal for time-sharing.' },
      { q: 'TLB (Translation Lookaside Buffer) is used for?', opts: ['Disk caching','Page table caching','Process scheduling','Semaphore storage'], ans: 1, exp: 'TLB caches recent page table entries to speed up virtual-to-physical address translation.' },
      { q: 'Semaphore wait(S) operation does what?', opts: ['S++','S--','Reset S to 0','Check if S>0'], ans: 1, exp: 'wait(S) decrements S. If S < 0, the process blocks. signal(S) increments S and wakes a waiting process.' },
      { q: 'Which condition is NOT required for deadlock?', opts: ['Mutual Exclusion','Starvation','Hold and Wait','Circular Wait'], ans: 1, exp: 'Starvation is NOT a Coffman condition. The 4 conditions are: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait.' },
      { q: 'Thrashing occurs when?', opts: ['CPU is idle','Too many page faults reduce CPU utilization','Memory is full','Process terminates'], ans: 1, exp: 'Thrashing: CPU spends more time swapping pages than executing. Fix by reducing degree of multiprogramming.' },
      { q: 'What does a context switch save?', opts: ['Page table only','PCB of current process','File system state','All RAM contents'], ans: 1, exp: 'Context switch saves the PCB (registers, PC, stack pointer, etc.) of the running process and loads the next.' },
    ],
  },
  {
    key: 'dbms',
    label: 'DBMS',
    icon: '🗄️',
    color: '#10b981',
    shortDesc: 'SQL, normalization, transactions, indexing, ER diagrams, ACID',
    topics: [
      {
        title: 'ER Model & Relational Model',
        content: `**Entity-Relationship Model:** Conceptual design tool.
• **Entity:** Real-world object (Student, Course)
• **Attribute:** Property of entity (StudentID, Name)
  - Simple, Composite, Derived, Multi-valued
• **Relationship:** Association between entities (Enrolls)
• **Cardinality:** 1:1, 1:N, M:N

**Keys in Relational Model:**
• **Super Key:** Any set of attributes that uniquely identifies a tuple
• **Candidate Key:** Minimal super key (no subset is a super key)
• **Primary Key:** Chosen candidate key (no NULL, unique)
• **Foreign Key:** References primary key of another table
• **Alternate Key:** Candidate keys not chosen as primary key

**Integrity Constraints:**
• Domain constraint: value must be in defined domain
• Entity integrity: primary key cannot be NULL
• Referential integrity: foreign key must reference existing PK or be NULL`,
        keyPoints: [
          'Candidate key = minimal super key; PK = chosen candidate key',
          'Foreign key enforces referential integrity between tables',
          'M:N relationships need a junction/bridge table',
          'Derived attribute = calculated from other attributes (Age from DOB)',
        ],
      },
      {
        title: 'SQL — Complete Reference',
        content: `**DDL:** CREATE, ALTER, DROP, TRUNCATE (auto-commit)
**DML:** INSERT, UPDATE, DELETE, SELECT (can rollback)
**DCL:** GRANT, REVOKE
**TCL:** COMMIT, ROLLBACK, SAVEPOINT

**SELECT syntax:**
\`SELECT col1, col2 FROM table WHERE condition GROUP BY col HAVING condition ORDER BY col LIMIT n\`

**Joins:**
• INNER JOIN: matching rows in both tables
• LEFT JOIN: all from left + matching from right (NULL for unmatched)
• RIGHT JOIN: all from right + matching from left
• FULL OUTER JOIN: all rows from both tables
• CROSS JOIN: cartesian product
• SELF JOIN: join table with itself

**Aggregate Functions:** COUNT, SUM, AVG, MIN, MAX
• Used with GROUP BY
• HAVING filters groups (WHERE filters rows)

**Subqueries:** Query inside another query
• Correlated subquery: references outer query (executes per row)
• Non-correlated: independent of outer query

**Window Functions:** ROW_NUMBER(), RANK(), DENSE_RANK(), LEAD(), LAG()
• Used with OVER (PARTITION BY col ORDER BY col)

**Indexes:** Speed up SELECT but slow down INSERT/UPDATE/DELETE`,
        keyPoints: [
          'WHERE before GROUP BY; HAVING filters after grouping',
          'LEFT JOIN returns all rows from left table even if no match',
          'TRUNCATE = DDL (auto-commit); DELETE = DML (can rollback)',
          'Correlated subquery runs once per outer row (slower)',
        ],
      },
      {
        title: 'Normalization',
        content: `**Purpose:** Eliminate redundancy and update anomalies.

**1NF (First Normal Form):**
• Each column has atomic (indivisible) values
• No repeating groups
• Each row is unique

**2NF (Second Normal Form):**
• Must be in 1NF
• No partial dependency (non-key attribute depends on entire PK, not part of it)
• Only applies when PK is composite

**3NF (Third Normal Form):**
• Must be in 2NF
• No transitive dependency (non-key attribute depends on another non-key attribute)
• Rule: X → Y → Z where X is PK and Y is non-key (then Y → Z is transitive)

**BCNF (Boyce-Codd Normal Form):**
• Stronger than 3NF
• For every functional dependency X → Y: X must be a super key
• Eliminates all anomalies from overlapping candidate keys

**Denormalization:** Intentionally add redundancy for performance (read-heavy systems)

**Functional Dependency:** X → Y means X determines Y (same X → same Y always)
**Armstrong's Axioms:** Reflexivity, Augmentation, Transitivity`,
        keyPoints: [
          '1NF: atomic values; 2NF: no partial dependency; 3NF: no transitive dependency',
          'BCNF: every determinant must be a super key',
          'Partial dependency: non-key depends on part of composite PK',
          'Transitive: A → B → C where B is non-key (violation in 3NF)',
        ],
      },
      {
        title: 'Transactions & ACID Properties',
        content: `**Transaction:** A unit of work that is executed completely or not at all.

**ACID Properties:**
• **Atomicity:** All operations succeed or none do (rollback if failure)
• **Consistency:** DB moves from one valid state to another (constraints maintained)
• **Isolation:** Concurrent transactions don't interfere (appear sequential)
• **Durability:** Committed transactions survive system failures (written to disk)

**Transaction States:** Active → Partially Committed → Committed / Failed → Aborted

**Isolation Levels (from weak to strong):**
1. Read Uncommitted: can read dirty data (lowest isolation)
2. Read Committed: only read committed data
3. Repeatable Read: same query returns same result within transaction
4. Serializable: highest isolation, fully sequential (slowest)

**Concurrency Problems:**
• **Dirty Read:** Read uncommitted data from another transaction
• **Lost Update:** Two transactions read same value, both update, one overwrites the other
• **Non-repeatable Read:** Same row read twice gives different results
• **Phantom Read:** New rows appear on re-read (due to insert by another transaction)

**Locking:** Shared lock (read), Exclusive lock (write)
**Two-Phase Locking (2PL):** Growing phase (acquire locks) → Shrinking phase (release)`,
        keyPoints: [
          'ACID: Atomicity, Consistency, Isolation, Durability',
          'Serializable is strictest isolation but slowest',
          'Dirty read = reading uncommitted data from another transaction',
          '2PL guarantees serializability but can cause deadlock',
        ],
      },
      {
        title: 'Indexing & Query Optimization',
        content: `**Index:** Data structure that improves search speed. B+ Tree is most common.

**Types of Indexes:**
• **Primary Index:** On ordered primary key field
• **Secondary Index:** On non-ordering field
• **Clustered Index:** Data rows physically stored in index order (one per table)
• **Non-Clustered Index:** Separate structure with pointer to data row (multiple allowed)
• **Composite Index:** Index on multiple columns
• **Covering Index:** Index includes all columns needed for a query

**B+ Tree Index:**
• All data in leaf nodes
• Leaf nodes linked for range queries
• Height = log₂(n) — very efficient

**When NOT to index:**
• Small tables
• Columns with low cardinality (gender, boolean)
• Frequently updated columns

**Query Optimization:**
• Query planner chooses execution plan
• Use EXPLAIN to see query plan
• Avoid SELECT * — specify columns
• Use joins instead of subqueries when possible
• Index WHERE, JOIN, ORDER BY columns`,
        keyPoints: [
          'Clustered index: data stored in order; one per table',
          'B+ tree: leaf nodes linked for efficient range queries',
          'Index speeds SELECT but slows INSERT/UPDATE/DELETE',
          'Low cardinality columns (gender) → poor index candidates',
        ],
      },
    ],
    mcqs: [
      { q: 'Which normal form eliminates transitive dependencies?', opts: ['1NF','2NF','3NF','BCNF'], ans: 2, exp: '3NF eliminates transitive dependencies (A→B→C where B is non-key). BCNF is stricter, requiring all determinants to be super keys.' },
      { q: 'What does ACID stand for?', opts: ['Atomicity, Consistency, Integrity, Durability','Atomicity, Consistency, Isolation, Durability','Availability, Consistency, Isolation, Durability','Atomicity, Concurrency, Isolation, Durability'], ans: 1, exp: 'ACID = Atomicity (all-or-nothing), Consistency (valid state), Isolation (concurrent independence), Durability (committed = permanent).' },
      { q: 'Which JOIN returns all rows from both tables?', opts: ['INNER JOIN','LEFT JOIN','RIGHT JOIN','FULL OUTER JOIN'], ans: 3, exp: 'FULL OUTER JOIN returns all rows from both tables, with NULL for non-matching columns on either side.' },
      { q: 'Primary key constraints include?', opts: ['Must be NULL','Must be unique and NOT NULL','Can be duplicate','Must be foreign key'], ans: 1, exp: 'Primary key: UNIQUE + NOT NULL. It uniquely identifies each row and cannot be null.' },
      { q: 'Which isolation level prevents dirty reads?', opts: ['Read Uncommitted','Read Committed','Repeatable Read','Serializable'], ans: 1, exp: 'Read Committed prevents dirty reads by only reading committed data. Read Uncommitted allows reading uncommitted (dirty) data.' },
      { q: 'A foreign key references which key of another table?', opts: ['Any key','Foreign key','Primary key','Super key'], ans: 2, exp: 'Foreign key references the primary key (or unique key) of another table to enforce referential integrity.' },
      { q: 'HAVING clause filters?', opts: ['Individual rows before grouping','Groups after GROUP BY','Columns in SELECT','Table joins'], ans: 1, exp: 'HAVING filters groups after GROUP BY. WHERE filters individual rows before grouping. You cannot use aggregate functions in WHERE.' },
      { q: 'Which index type stores data in sorted order physically?', opts: ['Secondary Index','Non-Clustered Index','Clustered Index','Bitmap Index'], ans: 2, exp: 'Clustered index stores data rows physically sorted by the index key. Only one clustered index per table is allowed.' },
    ],
  },
  {
    key: 'cn',
    label: 'Computer Networks',
    icon: '🌐',
    color: '#8b5cf6',
    shortDesc: 'OSI model, TCP/IP, protocols, IP addressing, routing, subnetting',
    topics: [
      {
        title: 'OSI Model & TCP/IP Model',
        content: `**OSI Model (7 Layers):** All People Seem To Need Data Processing
1. **Physical** — Bits, cables, hubs, repeaters
2. **Data Link** — Frames, MAC address, switches, error detection (CRC)
3. **Network** — Packets, IP address, routing, routers
4. **Transport** — Segments, port numbers, end-to-end reliability (TCP/UDP)
5. **Session** — Connection establishment, synchronization
6. **Presentation** — Encryption, compression, data format
7. **Application** — HTTP, FTP, SMTP, DNS, end-user services

**TCP/IP Model (4 Layers):**
1. Network Access (= Physical + Data Link)
2. Internet (= Network)
3. Transport (= Transport)
4. Application (= Session + Presentation + Application)

**Data Units per layer:** Bits → Frames → Packets → Segments → Data

**Devices per layer:**
• Physical: Hub, Repeater
• Data Link: Switch, Bridge
• Network: Router
• Transport: Gateway (Layer 4+)`,
        keyPoints: [
          'OSI: 7 layers; TCP/IP: 4 layers (Application, Transport, Internet, Network Access)',
          'Router = Layer 3 (Network); Switch = Layer 2 (Data Link)',
          'MAC address = Data Link layer; IP address = Network layer',
          'Mnemonic: All People Seem To Need Data Processing',
        ],
      },
      {
        title: 'TCP vs UDP & Transport Layer',
        content: `**TCP (Transmission Control Protocol):**
• Connection-oriented (3-way handshake: SYN → SYN-ACK → ACK)
• Reliable, ordered, error-checked delivery
• Flow control: Sliding window
• Congestion control: Slow start, AIMD
• Applications: HTTP, HTTPS, FTP, SMTP, SSH

**UDP (User Datagram Protocol):**
• Connectionless, no guarantee of delivery
• Faster, lower overhead
• Applications: DNS, DHCP, VoIP, Video Streaming, Gaming

**TCP 3-Way Handshake:**
Client: SYN → Server: SYN-ACK → Client: ACK (Connection established)

**TCP 4-Way Termination:**
FIN → FIN-ACK → FIN → FIN-ACK

**Ports:**
• Well-known ports: 0-1023 (HTTP=80, HTTPS=443, FTP=21, SSH=22, SMTP=25, DNS=53)
• Registered ports: 1024-49151
• Dynamic/Ephemeral: 49152-65535

**Flow Control vs Congestion Control:**
• Flow control: prevent sender from overwhelming receiver (window size)
• Congestion control: prevent network from being overwhelmed (TCP slow start)`,
        keyPoints: [
          'TCP: reliable, ordered, connection-oriented; UDP: fast, connectionless',
          '3-way handshake: SYN → SYN-ACK → ACK',
          'HTTP=80, HTTPS=443, FTP=21, SSH=22, DNS=53, SMTP=25',
          'Slow start: TCP starts with small window, doubles until threshold',
        ],
      },
      {
        title: 'IP Addressing & Subnetting',
        content: `**IPv4:** 32-bit address, dotted decimal (192.168.1.1)
**IPv6:** 128-bit address, hexadecimal (2001:db8::1)

**IP Classes (Classful):**
| Class | Range | Default Subnet Mask | Hosts |
|-------|-------|---------------------|-------|
| A | 1-126 | 255.0.0.0 (/8) | 16M |
| B | 128-191 | 255.255.0.0 (/16) | 65K |
| C | 192-223 | 255.255.255.0 (/24) | 254 |
| D | 224-239 | Multicast | - |
| E | 240-255 | Experimental | - |

**Private IP Ranges:**
• 10.0.0.0/8 (Class A)
• 172.16.0.0/12 (Class B)
• 192.168.0.0/16 (Class C)

**Subnetting (CIDR):**
• /24 = 256 addresses, 254 usable hosts
• /25 = 128 addresses, 126 usable hosts
• Hosts per subnet = 2^(host bits) - 2
• Subnets = 2^(borrowed bits)

**Special Addresses:**
• 127.0.0.1 = Loopback
• 0.0.0.0 = Default route
• 255.255.255.255 = Broadcast
• Network address: all host bits = 0
• Broadcast: all host bits = 1`,
        keyPoints: [
          'Class A: /8 (16M hosts); Class B: /16 (65K hosts); Class C: /24 (254 hosts)',
          'Usable hosts = 2^(host bits) - 2 (subtract network + broadcast)',
          'Private ranges: 10.x.x.x, 172.16-31.x.x, 192.168.x.x',
          'CIDR notation: /24 = 255.255.255.0 subnet mask',
        ],
      },
      {
        title: 'Important Protocols',
        content: `**Application Layer Protocols:**
• **HTTP/HTTPS:** Web browsing. HTTP = port 80, HTTPS = 443 (SSL/TLS encrypted)
• **DNS:** Resolves domain names to IP addresses. Port 53 (UDP/TCP)
• **DHCP:** Automatically assigns IP addresses. Port 67/68 (UDP)
• **FTP:** File transfer. Port 21 (control), 20 (data)
• **SMTP/POP3/IMAP:** Email. SMTP=25 (send), POP3=110 (retrieve), IMAP=143
• **SSH:** Secure remote access. Port 22
• **SNMP:** Network management. Port 161

**DNS Resolution Process:**
Browser Cache → OS Cache → Recursive Resolver → Root DNS → TLD DNS → Authoritative DNS → IP Address

**ARP (Address Resolution Protocol):**
• Resolves IP address to MAC address (within same network)
• ARP request = broadcast; ARP reply = unicast

**ICMP:** Internet Control Message Protocol
• Used by ping and traceroute
• Reports errors (host unreachable, TTL expired)

**NAT (Network Address Translation):**
• Maps private IPs to public IP
• Types: Static NAT, Dynamic NAT, PAT (Port Address Translation)`,
        keyPoints: [
          'DNS: domain → IP (port 53); ARP: IP → MAC address',
          'DHCP assigns IP automatically (DORA: Discover, Offer, Request, Acknowledge)',
          'HTTPS = HTTP + TLS/SSL encryption on port 443',
          'NAT allows multiple private IPs to share one public IP',
        ],
      },
      {
        title: 'Routing & Network Devices',
        content: `**Routing Algorithms:**
• **Distance Vector (DVR):** Each router shares its routing table with neighbors. Bellman-Ford algorithm. Slow convergence, count-to-infinity problem. (RIP)
• **Link State (LSR):** Each router knows full network topology. Dijkstra's algorithm. Fast convergence. (OSPF)
• **Path Vector:** Used in BGP (Border Gateway Protocol) for inter-AS routing

**Routing Protocols:**
• **RIP:** Distance vector, hop count metric (max 15), slow
• **OSPF:** Link state, Dijkstra, fast convergence, used within AS
• **BGP:** Path vector, used between ISPs/AS (the internet's routing protocol)

**Network Devices:**
• **Hub:** Layer 1, broadcasts to all ports
• **Switch:** Layer 2, learns MAC addresses, forwards to specific port
• **Router:** Layer 3, connects different networks, uses IP
• **Bridge:** Layer 2, connects two LAN segments
• **Gateway:** Connects networks with different protocols (Layer 3+)

**Error Detection/Correction:**
• **Parity bit:** Detects 1-bit errors
• **CRC (Cyclic Redundancy Check):** Detects burst errors (used in Ethernet)
• **Hamming Code:** Detects and corrects single-bit errors`,
        keyPoints: [
          'RIP: distance vector, max 15 hops; OSPF: link state, Dijkstra, faster',
          'BGP: inter-AS routing (between ISPs); OSPF: intra-AS routing',
          'Switch learns MAC addresses; Router uses IP addresses',
          'CRC detects burst errors; Hamming code corrects single-bit errors',
        ],
      },
    ],
    mcqs: [
      { q: 'Which layer of OSI model is responsible for routing?', opts: ['Data Link','Network','Transport','Session'], ans: 1, exp: 'Network layer (Layer 3) handles routing, IP addressing, and packet forwarding. Routers operate at this layer.' },
      { q: 'TCP uses which handshake for connection establishment?', opts: ['2-way','3-way','4-way','1-way'], ans: 1, exp: '3-way handshake: Client sends SYN, Server replies SYN-ACK, Client sends ACK. This establishes a TCP connection.' },
      { q: 'DNS uses which port number?', opts: ['80','53','443','22'], ans: 1, exp: 'DNS uses port 53 (both UDP for queries and TCP for zone transfers). DNS resolves domain names to IP addresses.' },
      { q: 'What does ARP resolve?', opts: ['Domain name to IP','IP to MAC address','Port to service','MAC to hostname'], ans: 1, exp: 'ARP (Address Resolution Protocol) resolves an IP address to a MAC address within the same local network.' },
      { q: 'Which routing protocol uses Dijkstra\'s algorithm?', opts: ['RIP','BGP','OSPF','EIGRP'], ans: 2, exp: 'OSPF (Open Shortest Path First) uses Dijkstra\'s shortest path algorithm. It\'s a link-state routing protocol.' },
      { q: 'Maximum number of usable hosts in a /24 subnet?', opts: ['256','254','255','252'], ans: 1, exp: '/24 = 256 addresses. Subtract 2 (network + broadcast) = 254 usable hosts.' },
      { q: 'UDP is preferred over TCP for?', opts: ['File downloads','Email','Live video streaming','Web browsing'], ans: 2, exp: 'UDP is preferred for real-time applications (streaming, gaming, VoIP) where speed matters more than reliability.' },
      { q: 'Which device operates at Layer 2 of OSI?', opts: ['Router','Hub','Switch','Repeater'], ans: 2, exp: 'Switch operates at Layer 2 (Data Link) and uses MAC addresses to forward frames to specific ports.' },
    ],
  },
  {
    key: 'oop',
    label: 'OOP Concepts',
    icon: '🏗️',
    color: '#f59e0b',
    shortDesc: 'Inheritance, polymorphism, encapsulation, abstraction, design patterns',
    topics: [
      {
        title: 'Four Pillars of OOP',
        content: `**1. Encapsulation:**
Bundling data (attributes) and methods that operate on data into a single unit (class), and restricting direct access.
• Access modifiers: private, protected, public
• Getters and setters provide controlled access
• Benefits: data hiding, modularity, easier maintenance

**2. Abstraction:**
Hiding implementation details and showing only essential features.
• Abstract classes (can have implemented methods)
• Interfaces (only method signatures, all abstract by default)
• "What" not "how"

**3. Inheritance:**
A class (child) inherits properties and methods from another class (parent).
• Types: Single, Multiple (not in Java), Multi-level, Hierarchical, Hybrid
• "is-a" relationship (Dog is-a Animal)
• Promotes code reuse
• Method overriding: child provides specific implementation of parent method

**4. Polymorphism:**
Same interface, different behavior.
• **Compile-time (Static):** Method Overloading — same name, different parameters
• **Runtime (Dynamic):** Method Overriding — same name and signature, different class
• Achieved through inheritance and interfaces

**Key relationships:**
• "is-a": Inheritance (Dog is-a Animal)
• "has-a": Composition (Car has-a Engine)`,
        keyPoints: [
          'Encapsulation: data hiding via access modifiers + getters/setters',
          'Abstraction: show "what" not "how"; use abstract class/interface',
          'Polymorphism: overloading = compile-time; overriding = runtime',
          '"is-a" = inheritance; "has-a" = composition',
        ],
      },
      {
        title: 'Classes, Objects & Constructors',
        content: `**Class:** Blueprint/template for creating objects.
**Object:** Instance of a class with actual values.

**Constructor:** Special method called when object is created.
• Same name as class
• No return type
• Default constructor: provided by compiler if none defined
• Constructor overloading: multiple constructors with different parameters
• Constructor chaining: this() or super() calls

**this keyword:** Refers to current object instance
**super keyword:** Refers to parent class

**Static vs Instance:**
• Static members: belong to class, shared across all instances
• Instance members: belong to specific object

**final keyword:**
• final variable: constant (cannot be changed)
• final method: cannot be overridden
• final class: cannot be inherited (e.g., String in Java)

**Abstract class vs Interface:**
| Feature | Abstract Class | Interface |
|---------|---------------|-----------|
| Instantiate | No | No |
| Constructor | Yes | No |
| Methods | Abstract + concrete | Default only (Java 8+) |
| Variables | Any type | public static final |
| Inheritance | Single | Multiple |`,
        keyPoints: [
          'Constructor: same name as class, no return type, called on object creation',
          'Static members: class-level (shared); Instance members: object-level',
          'final class = can\'t inherit; final method = can\'t override; final var = constant',
          'Abstract class can have implemented methods; Interface (pre-Java 8) cannot',
        ],
      },
      {
        title: 'Design Patterns',
        content: `Design patterns are reusable solutions to common software design problems.

**Creational Patterns (object creation):**
• **Singleton:** Only one instance of class exists (DB connection, Logger)
  - Private constructor + static getInstance()
• **Factory Method:** Subclass decides which object to create
• **Abstract Factory:** Factory of factories
• **Builder:** Build complex objects step by step
• **Prototype:** Clone an existing object

**Structural Patterns (class/object composition):**
• **Adapter:** Makes incompatible interfaces work together
• **Decorator:** Add behavior dynamically without subclassing
• **Facade:** Simplified interface to complex subsystem
• **Proxy:** Placeholder for another object (lazy loading, access control)

**Behavioral Patterns (communication between objects):**
• **Observer:** One-to-many dependency, subscribers notified of changes (pub/sub)
• **Strategy:** Define family of algorithms, make them interchangeable
• **Command:** Encapsulate a request as an object
• **Iterator:** Sequential access to elements without knowing internal structure
• **Template Method:** Define skeleton of algorithm, subclasses fill in steps`,
        keyPoints: [
          'Singleton: private constructor + static getInstance() — one instance',
          'Observer: publish-subscribe pattern (event listeners, UI updates)',
          'Factory: creates objects without specifying exact class',
          'Decorator: add functionality without changing original class',
        ],
      },
      {
        title: 'SOLID Principles',
        content: `**S — Single Responsibility Principle (SRP):**
A class should have only ONE reason to change. Each class handles one responsibility.
Example: Don't mix business logic and database operations in same class.

**O — Open/Closed Principle (OCP):**
Classes should be OPEN for extension but CLOSED for modification.
Use inheritance/interfaces to extend behavior without modifying existing code.

**L — Liskov Substitution Principle (LSP):**
Subclasses should be substitutable for their parent class without breaking functionality.
If S is a subclass of T, objects of T can be replaced with objects of S.

**I — Interface Segregation Principle (ISP):**
Clients should not be forced to implement interfaces they don't use.
Split large interfaces into smaller, more specific ones.

**D — Dependency Inversion Principle (DIP):**
High-level modules should not depend on low-level modules.
Both should depend on ABSTRACTIONS (interfaces).
Example: use IDatabase interface instead of specific MySQLDatabase class.

**DRY:** Don't Repeat Yourself
**KISS:** Keep It Simple, Stupid
**YAGNI:** You Ain't Gonna Need It`,
        keyPoints: [
          'SRP: one class = one responsibility',
          'OCP: extend via inheritance, don\'t modify existing code',
          'LSP: subclass can replace parent without breaking code',
          'DIP: depend on abstractions (interfaces), not concrete implementations',
        ],
      },
    ],
    mcqs: [
      { q: 'Which pillar of OOP hides implementation details?', opts: ['Encapsulation','Abstraction','Inheritance','Polymorphism'], ans: 1, exp: 'Abstraction hides implementation details and shows only essential features. Abstract classes and interfaces achieve abstraction.' },
      { q: 'Method overloading is an example of?', opts: ['Runtime polymorphism','Compile-time polymorphism','Inheritance','Encapsulation'], ans: 1, exp: 'Method overloading (same name, different parameters) is resolved at compile time = compile-time/static polymorphism.' },
      { q: 'Which design pattern ensures only one instance of a class?', opts: ['Factory','Observer','Singleton','Decorator'], ans: 2, exp: 'Singleton pattern: private constructor + static getInstance() ensures only one instance is created.' },
      { q: 'Which SOLID principle says a class should have one reason to change?', opts: ['Open/Closed','Single Responsibility','Liskov Substitution','Dependency Inversion'], ans: 1, exp: 'Single Responsibility Principle (SRP): each class should have exactly one reason to change / one responsibility.' },
      { q: '"is-a" relationship represents?', opts: ['Composition','Aggregation','Inheritance','Association'], ans: 2, exp: '"is-a" represents inheritance (Dog is-a Animal). "has-a" represents composition (Car has-a Engine).' },
      { q: 'Which keyword prevents method overriding in Java?', opts: ['static','abstract','final','private'], ans: 2, exp: 'final keyword on a method prevents it from being overridden by subclasses. final class prevents inheritance.' },
      { q: 'Interface in Java (pre-Java 8) can have?', opts: ['Implemented methods','Abstract methods only','Constructors','Instance variables'], ans: 1, exp: 'Pre-Java 8, interfaces can only have abstract methods and public static final variables. Java 8 added default methods.' },
      { q: 'Observer design pattern implements?', opts: ['One-to-one dependency','One-to-many dependency','Many-to-many dependency','No dependency'], ans: 1, exp: 'Observer pattern: one subject (publisher) has many observers (subscribers) who are notified when state changes.' },
    ],
  },
  {
    key: 'se',
    label: 'Software Engineering',
    icon: '⚙️',
    color: '#ef4444',
    shortDesc: 'SDLC models, Agile, testing, design, software metrics',
    topics: [
      {
        title: 'SDLC Models',
        content: `**SDLC Phases:** Planning → Requirements → Design → Implementation → Testing → Deployment → Maintenance

**Waterfall Model:**
• Sequential, linear phases
• Each phase must complete before next starts
• Good for: well-defined requirements, small projects
• Bad for: changing requirements

**V-Model (Validation & Verification):**
• Each development phase has corresponding testing phase
• Testing planned alongside development
• Good for: safety-critical systems

**Agile Model:**
• Iterative, incremental development
• Short sprints (2-4 weeks)
• Continuous feedback and adaptation
• Values: individuals, working software, customer collaboration, responding to change
• Frameworks: Scrum, Kanban, XP (Extreme Programming)

**Scrum Framework:**
• Roles: Product Owner, Scrum Master, Development Team
• Events: Sprint Planning, Daily Standup, Sprint Review, Sprint Retrospective
• Artifacts: Product Backlog, Sprint Backlog, Increment

**Spiral Model:**
• Risk-driven, combines Waterfall + Prototyping
• 4 phases: Planning → Risk Analysis → Engineering → Evaluation
• Good for: large, high-risk projects

**RAD (Rapid Application Development):** Component-based, minimal planning, fast delivery`,
        keyPoints: [
          'Waterfall: sequential, rigid; Agile: iterative, flexible',
          'Scrum: Product Owner, Scrum Master, Dev Team; Sprint = 2-4 weeks',
          'V-Model: each dev phase has corresponding test phase',
          'Spiral: risk-driven, risk analysis in every iteration',
        ],
      },
      {
        title: 'Software Testing',
        content: `**Testing Levels:**
1. **Unit Testing:** Test individual functions/components
2. **Integration Testing:** Test combined components
3. **System Testing:** Test complete system
4. **Acceptance Testing (UAT):** Test by end users

**Testing Types:**
• **Black Box:** No knowledge of internal code. Tests input/output
• **White Box:** Full knowledge of code. Tests code paths, branches
• **Grey Box:** Partial knowledge

**Functional vs Non-Functional Testing:**
• Functional: Does it work correctly? (unit, integration, regression)
• Non-functional: How well does it work? (performance, security, usability)

**Important Testing Techniques:**
• **Regression Testing:** Re-test after changes to ensure nothing broke
• **Smoke Testing:** Quick test to check if build is stable
• **Sanity Testing:** Quick test of specific functionality after bug fix
• **Performance Testing:** Load, stress, endurance testing
• **TDD (Test-Driven Development):** Write tests BEFORE code (Red → Green → Refactor)

**Bug Lifecycle:** New → Assigned → Open → Fixed → Retested → Closed / Reopened

**Test Coverage Criteria:**
• Statement coverage: every statement executed once
• Branch coverage: every branch (if/else) taken
• Path coverage: every possible path executed`,
        keyPoints: [
          'Unit → Integration → System → Acceptance (UAT)',
          'Black box: no code knowledge; White box: full code knowledge',
          'TDD: write test first, then code (Red-Green-Refactor)',
          'Regression: test after changes; Smoke: basic build stability check',
        ],
      },
      {
        title: 'Software Design & Architecture',
        content: `**Software Design Levels:**
1. **Architectural Design:** High-level structure (microservices, monolith, MVC)
2. **High-Level Design (HLD):** System modules and their interactions
3. **Low-Level Design (LLD):** Detailed class diagrams, algorithms

**Common Architectures:**
• **MVC (Model-View-Controller):** Separates data, UI, and logic
• **Microservices:** Application as small independent services
• **Monolithic:** Single deployable unit
• **Client-Server:** Clients request, servers respond
• **Event-Driven:** Components communicate via events

**Coupling & Cohesion:**
• **Coupling:** Dependency between modules (LOW coupling = good)
• **Cohesion:** How related functions in module are (HIGH cohesion = good)
• Goal: low coupling + high cohesion

**Software Metrics:**
• **Cyclomatic Complexity:** Number of linearly independent paths = E - N + 2P
• **LOC (Lines of Code):** Simple but rough measure
• **Function Points:** Measures functionality from user's perspective
• **KLOC:** Kilo lines of code

**UML Diagrams:**
• Structural: Class, Object, Component, Deployment diagrams
• Behavioral: Use Case, Sequence, Activity, State diagrams`,
        keyPoints: [
          'MVC: Model (data), View (UI), Controller (logic)',
          'Low coupling + High cohesion = good design',
          'Cyclomatic complexity = E - N + 2P (edges - nodes + 2)',
          'Microservices: independent, loosely coupled services; Monolith: single unit',
        ],
      },
    ],
    mcqs: [
      { q: 'Which SDLC model is best for rapidly changing requirements?', opts: ['Waterfall','V-Model','Agile','Spiral'], ans: 2, exp: 'Agile handles changing requirements best through iterative development, continuous feedback, and adaptive planning.' },
      { q: 'Scrum sprint typically lasts?', opts: ['1 day','1 week','2-4 weeks','3 months'], ans: 2, exp: 'A Scrum sprint typically lasts 2-4 weeks (commonly 2 weeks). At end of each sprint, a potentially shippable product increment is delivered.' },
      { q: 'Which testing requires knowledge of source code?', opts: ['Black Box','White Box','System Testing','UAT'], ans: 1, exp: 'White box testing (glass box) requires full knowledge of internal code structure to design test cases based on code paths.' },
      { q: 'TDD stands for?', opts: ['Test Driven Development','Technical Design Document','Testing and Debugging','Top Down Design'], ans: 0, exp: 'TDD (Test Driven Development): Write failing test first (Red), write minimum code to pass (Green), then refactor (Refactor).' },
      { q: 'Good software design aims for?', opts: ['High coupling, low cohesion','Low coupling, high cohesion','High coupling, high cohesion','Low coupling, low cohesion'], ans: 1, exp: 'Low coupling = modules are independent (easy to change). High cohesion = module has clear single purpose. Both reduce complexity.' },
      { q: 'Regression testing is performed?', opts: ['Before development','Only once at project end','After every code change','During requirement analysis'], ans: 2, exp: 'Regression testing is performed after code changes/bug fixes to ensure existing functionality still works correctly.' },
      { q: 'In Scrum, who owns the product backlog?', opts: ['Scrum Master','Development Team','Product Owner','Stakeholders'], ans: 2, exp: 'Product Owner owns and prioritizes the product backlog. They represent stakeholder interests and define requirements.' },
      { q: 'MVC stands for?', opts: ['Model View Component','Module View Controller','Model View Controller','Main View Class'], ans: 2, exp: 'MVC (Model-View-Controller): Model = data/business logic, View = UI/presentation, Controller = handles user input.' },
    ],
  },
];

// ─── MCQ Quiz Component ────────────────────────────────────────────────────────
function MCQQuiz({ mcqs, color }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState([]);

  const q = mcqs[current];

  const handleSelect = (optIdx) => {
    if (selected !== null) return;
    setSelected(optIdx);
    const isCorrect = optIdx === q.ans;
    if (isCorrect) setScore(s => s + 1);
    setAnswers(prev => [...prev, { selected: optIdx, correct: q.ans, isCorrect }]);
  };

  const next = () => {
    if (current + 1 >= mcqs.length) { setFinished(true); return; }
    setCurrent(c => c + 1);
    setSelected(null);
  };

  const reset = () => {
    setCurrent(0); setSelected(null); setScore(0); setFinished(false); setAnswers([]);
  };

  if (finished) {
    const pct = Math.round((score / mcqs.length) * 100);
    return (
      <div className="text-center space-y-4">
        <div className="text-5xl font-black" style={{ color: pct >= 75 ? '#22c55e' : pct >= 50 ? '#f59e0b' : '#ef4444' }}>
          {pct}%
        </div>
        <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>
          {score}/{mcqs.length} correct — {pct >= 75 ? 'Excellent!' : pct >= 50 ? 'Good effort!' : 'Keep practicing!'}
        </div>
        <div className="grid grid-cols-8 gap-1">
          {answers.map((a, i) => (
            <div key={i} className="h-2 rounded-full" style={{ background: a.isCorrect ? '#22c55e' : '#ef4444' }} />
          ))}
        </div>
        <button onClick={reset} className="flex items-center gap-2 mx-auto px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: color }}>
          <RotateCcw size={14} /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
        <span>Question {current + 1}/{mcqs.length}</span>
        <span>Score: {score}/{current + (selected !== null ? 1 : 0)}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5" style={{ background: 'var(--border)' }}>
        <div className="h-1.5 rounded-full transition-all" style={{ width: `${(current / mcqs.length) * 100}%`, background: color }} />
      </div>
      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{q.q}</p>
      <div className="space-y-2">
        {q.opts.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = i === q.ans;
          let bg = 'var(--bg-primary)', border = 'var(--border)', textColor = 'var(--text-primary)';
          if (selected !== null) {
            if (isCorrect) { bg = 'rgba(34,197,94,0.1)'; border = '#22c55e'; textColor = '#22c55e'; }
            else if (isSelected) { bg = 'rgba(239,68,68,0.1)'; border = '#ef4444'; textColor = '#ef4444'; }
          }
          return (
            <button key={i} disabled={selected !== null}
              onClick={() => handleSelect(i)}
              className="w-full flex items-start gap-3 p-3 rounded-xl border text-left text-sm transition-all"
              style={{ background: bg, borderColor: border, color: textColor }}>
              <span className="font-bold shrink-0 w-5">{String.fromCharCode(65 + i)}.</span>
              {opt}
              {selected !== null && isCorrect && <CheckCircle size={14} className="ml-auto shrink-0" style={{ color: '#22c55e' }} />}
              {selected !== null && isSelected && !isCorrect && <XCircle size={14} className="ml-auto shrink-0" style={{ color: '#ef4444' }} />}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <>
          <div className="p-3 rounded-xl text-sm" style={{ background: 'rgba(6,182,212,0.07)', border: '1px solid rgba(6,182,212,0.2)' }}>
            <span className="font-semibold" style={{ color: '#06b6d4' }}>
              <Lightbulb size={13} className="inline mr-1" />Explanation:{' '}
            </span>
            <span style={{ color: 'var(--text-secondary)' }}>{q.exp}</span>
          </div>
          <button onClick={next} className="w-full py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: color }}>
            {current + 1 >= mcqs.length ? 'See Results' : 'Next Question'} →
          </button>
        </>
      )}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function CoreSubjects() {
  const [activeSubject, setActiveSubject] = useState('os');
  const [openTopic, setOpenTopic] = useState(null);
  const [quizMode, setQuizMode] = useState(false);

  const subject = SUBJECTS.find(s => s.key === activeSubject);

  const renderContent = (content) => {
    return content.split('\n').map((line, i) => {
      if (!line.trim()) return <div key={i} className="h-2" />;
      // Bold **text**
      const parts = line.split(/\*\*(.*?)\*\*/g);
      const formatted = parts.map((part, j) =>
        j % 2 === 1
          ? <strong key={j} style={{ color: 'var(--text-primary)' }}>{part}</strong>
          : <span key={j}>{part}</span>
      );
      if (line.startsWith('•')) {
        return (
          <div key={i} className="flex items-start gap-2 text-sm">
            <span style={{ color: subject.color }} className="mt-0.5 shrink-0">•</span>
            <span style={{ color: 'var(--text-secondary)' }}>{formatted}</span>
          </div>
        );
      }
      if (line.startsWith('|')) {
        // Table row
        const cells = line.split('|').filter(c => c.trim() && !c.match(/^[-\s]+$/));
        if (!cells.length) return null;
        return (
          <div key={i} className="flex gap-2 text-xs border-b" style={{ borderColor: 'var(--border)' }}>
            {cells.map((cell, ci) => (
              <div key={ci} className="flex-1 py-1.5 px-2" style={{ color: 'var(--text-secondary)' }}>{cell.trim()}</div>
            ))}
          </div>
        );
      }
      return (
        <p key={i} className="text-sm" style={{ color: line.startsWith('#') ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
          {formatted}
        </p>
      );
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-20 md:pb-0">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>📚 Core Computer Science</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>OS • DBMS • Computer Networks • OOP • Software Engineering — theory + MCQ practice</p>
      </div>

      {/* Subject selector */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {SUBJECTS.map(sub => (
          <button key={sub.key}
            onClick={() => { setActiveSubject(sub.key); setOpenTopic(null); setQuizMode(false); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all"
            style={activeSubject === sub.key
              ? { background: sub.color, color: 'white' }
              : { background: `${sub.color}15`, color: sub.color, border: `1px solid ${sub.color}30` }}>
            <span>{sub.icon}</span> {sub.label}
          </button>
        ))}
      </div>

      {/* Subject header */}
      <div className="rounded-2xl p-5" style={{
        background: `linear-gradient(135deg, ${subject.color}15, ${subject.color}05)`,
        border: `1px solid ${subject.color}30`
      }}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{subject.icon}</div>
            <div>
              <div className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{subject.label}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{subject.shortDesc}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setQuizMode(false)}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={!quizMode
                ? { background: subject.color, color: 'white' }
                : { background: `${subject.color}15`, color: subject.color }}>
              <BookOpen size={14} className="inline mr-1" /> Theory
            </button>
            <button onClick={() => setQuizMode(true)}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={quizMode
                ? { background: subject.color, color: 'white' }
                : { background: `${subject.color}15`, color: subject.color }}>
              ✏️ MCQ Practice
            </button>
          </div>
        </div>
      </div>

      {/* Theory view */}
      {!quizMode && (
        <div className="space-y-3">
          {subject.topics.map((topic, idx) => (
            <div key={idx} className="rounded-2xl overflow-hidden"
              style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
              <button className="w-full flex items-center justify-between p-5 text-left"
                onClick={() => setOpenTopic(openTopic === idx ? null : idx)}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold"
                    style={{ background: `${subject.color}20`, color: subject.color }}>
                    {idx + 1}
                  </div>
                  <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{topic.title}</div>
                </div>
                <ChevronDown size={16}
                  className={`transition-transform shrink-0 ${openTopic === idx ? 'rotate-180' : ''}`}
                  style={{ color: 'var(--text-secondary)' }} />
              </button>
              <AnimatePresence>
                {openTopic === idx && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                    className="overflow-hidden border-t" style={{ borderColor: 'var(--border)' }}>
                    <div className="p-5 space-y-4">
                      {/* Content */}
                      <div className="space-y-1.5">
                        {renderContent(topic.content)}
                      </div>

                      {/* Key Points */}
                      <div className="rounded-xl p-4 mt-4" style={{ background: `${subject.color}08`, border: `1px solid ${subject.color}20` }}>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-base">⚡</span>
                          <span className="font-bold text-sm" style={{ color: subject.color }}>Quick Revision Points</span>
                        </div>
                        <div className="space-y-2">
                          {topic.keyPoints.map((kp, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs">
                              <ChevronRight size={12} className="shrink-0 mt-0.5" style={{ color: subject.color }} />
                              <span style={{ color: 'var(--text-secondary)' }}>{kp}</span>
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
      )}

      {/* MCQ view */}
      {quizMode && (
        <div className="card max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-5">
            <div className="text-xl">{subject.icon}</div>
            <div>
              <div className="font-bold" style={{ color: 'var(--text-primary)' }}>{subject.label} — MCQ Practice</div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{subject.mcqs.length} questions with explanations</div>
            </div>
          </div>
          <MCQQuiz mcqs={subject.mcqs} color={subject.color} />
        </div>
      )}
    </div>
  );
}
