import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Download, Zap, User, GraduationCap, Code2, FolderOpen,
  Briefcase, Award, Trophy, ChevronDown, ChevronUp, Plus, Trash2,
  CheckCircle, XCircle, Building2, Loader2, Eye, Edit3,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

/* ─── helpers ──────────────────────────────────────────────────────────────── */
const emptyPersonal = { name: '', email: '', phone: '', location: '', linkedin: '', github: '', portfolio: '', summary: '' };
const emptyEducation = () => ({ id: Date.now(), institution: '', degree: '', branch: '', cgpa: '', year: '', relevant: '' });
const emptySkill = () => ({ id: Date.now(), category: '', items: '' });
const emptyProject = () => ({ id: Date.now(), title: '', tech: '', description: '', link: '' });
const emptyExperience = () => ({ id: Date.now(), company: '', role: '', duration: '', points: '' });
const emptyCertification = () => ({ id: Date.now(), name: '', issuer: '', date: '', link: '' });
const emptyAchievement = () => ({ id: Date.now(), title: '', description: '' });

const FORM_TABS = [
  { id: 'personal', label: 'Personal', icon: User },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'skills', label: 'Skills', icon: Code2 },
  { id: 'projects', label: 'Projects', icon: FolderOpen },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'certifications', label: 'Certifications', icon: Award },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
  { id: 'ats', label: 'ATS Checker', icon: Zap },
];

/* ─── sub-components ────────────────────────────────────────────────────────── */
function Input({ label, value, onChange, placeholder, type = 'text', className = '' }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label className="text-xs font-medium text-[var(--text-secondary)]">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-purple-500 transition-colors"
      />
    </div>
  );
}

function Textarea({ label, value, onChange, placeholder, rows = 3, className = '' }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label className="text-xs font-medium text-[var(--text-secondary)]">{label}</label>}
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-purple-500 transition-colors resize-none"
      />
    </div>
  );
}

/* ─── ATS Score Arc ─────────────────────────────────────────────────────────── */
function ScoreGauge({ score }) {
  const r = 54;
  const circ = Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 75 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444';
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="140" height="80" viewBox="0 0 140 80">
        <path d="M 16 76 A 54 54 0 0 1 124 76" fill="none" stroke="var(--border)" strokeWidth="10" strokeLinecap="round" />
        <path d="M 16 76 A 54 54 0 0 1 124 76" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset 1s ease' }} />
        <text x="70" y="68" textAnchor="middle" fontSize="24" fontWeight="700" fill={color}>{score}</text>
      </svg>
      <span className="text-xs text-[var(--text-secondary)]">ATS Score</span>
    </div>
  );
}

/* ─── Resume Preview ────────────────────────────────────────────────────────── */
function ResumePreview({ data }) {
  const { personal, education, skills, projects, experience, certifications, achievements } = data;
  return (
    <div id="resume-preview" className="bg-white text-gray-900 p-8 text-sm leading-relaxed font-sans min-h-full"
      style={{ fontFamily: 'Georgia, serif' }}>
      {/* Header */}
      <div className="text-center border-b-2 border-gray-800 pb-3 mb-4">
        <h1 className="text-2xl font-bold tracking-wide uppercase">{personal.name || 'Your Name'}</h1>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-1 text-xs text-gray-600">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.linkedin && <span>{personal.linkedin}</span>}
          {personal.github && <span>{personal.github}</span>}
          {personal.portfolio && <span>{personal.portfolio}</span>}
        </div>
      </div>

      {/* Summary */}
      {personal.summary && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-400 mb-1">Objective</h2>
          <p className="text-xs text-gray-700">{personal.summary}</p>
        </div>
      )}

      {/* Education */}
      {education.some(e => e.institution) && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-400 mb-2">Education</h2>
          {education.filter(e => e.institution).map(e => (
            <div key={e.id} className="flex justify-between mb-1">
              <div>
                <span className="font-semibold text-xs">{e.institution}</span>
                {e.degree && <span className="text-xs text-gray-600"> — {e.degree}{e.branch ? `, ${e.branch}` : ''}</span>}
                {e.relevant && <div className="text-xs text-gray-500 italic">Relevant: {e.relevant}</div>}
              </div>
              <div className="text-right text-xs text-gray-600">
                {e.year && <div>{e.year}</div>}
                {e.cgpa && <div>CGPA: {e.cgpa}</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.some(s => s.category) && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-400 mb-2">Technical Skills</h2>
          {skills.filter(s => s.category).map(s => (
            <div key={s.id} className="flex gap-2 text-xs mb-0.5">
              <span className="font-semibold min-w-[100px]">{s.category}:</span>
              <span className="text-gray-700">{s.items}</span>
            </div>
          ))}
        </div>
      )}

      {/* Experience */}
      {experience.some(e => e.company) && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-400 mb-2">Experience</h2>
          {experience.filter(e => e.company).map(e => (
            <div key={e.id} className="mb-2">
              <div className="flex justify-between">
                <span className="font-semibold text-xs">{e.role}</span>
                <span className="text-xs text-gray-600">{e.duration}</span>
              </div>
              <div className="text-xs text-gray-600 italic mb-1">{e.company}</div>
              {e.points && e.points.split('\n').filter(Boolean).map((p, i) => (
                <div key={i} className="text-xs text-gray-700 flex gap-1"><span>•</span><span>{p.replace(/^[-•]\s*/, '')}</span></div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects.some(p => p.title) && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-400 mb-2">Projects</h2>
          {projects.filter(p => p.title).map(p => (
            <div key={p.id} className="mb-2">
              <div className="flex justify-between">
                <span className="font-semibold text-xs">{p.title}</span>
                {p.link && <span className="text-xs text-blue-600">{p.link}</span>}
              </div>
              {p.tech && <div className="text-xs text-gray-500 italic mb-0.5">Tech: {p.tech}</div>}
              {p.description && p.description.split('\n').filter(Boolean).map((d, i) => (
                <div key={i} className="text-xs text-gray-700 flex gap-1"><span>•</span><span>{d.replace(/^[-•]\s*/, '')}</span></div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {certifications.some(c => c.name) && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-400 mb-2">Certifications</h2>
          {certifications.filter(c => c.name).map(c => (
            <div key={c.id} className="flex justify-between text-xs mb-0.5">
              <span><span className="font-semibold">{c.name}</span>{c.issuer ? ` — ${c.issuer}` : ''}</span>
              <span className="text-gray-600">{c.date}</span>
            </div>
          ))}
        </div>
      )}

      {/* Achievements */}
      {achievements.some(a => a.title) && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-400 mb-2">Achievements</h2>
          {achievements.filter(a => a.title).map(a => (
            <div key={a.id} className="flex gap-1 text-xs mb-0.5">
              <span>•</span>
              <span><span className="font-semibold">{a.title}</span>{a.description ? `: ${a.description}` : ''}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Main Component ────────────────────────────────────────────────────────── */
export default function ResumeBuilder() {
  const [activeTab, setActiveTab] = useState('personal');
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const [personal, setPersonal] = useState(emptyPersonal);
  const [education, setEducation] = useState([emptyEducation()]);
  const [skills, setSkills] = useState([emptySkill()]);
  const [projects, setProjects] = useState([emptyProject()]);
  const [experience, setExperience] = useState([emptyExperience()]);
  const [certifications, setCertifications] = useState([emptyCertification()]);
  const [achievements, setAchievements] = useState([emptyAchievement()]);

  // ATS state
  const [jobDesc, setJobDesc] = useState('');
  const [atsLoading, setAtsLoading] = useState(false);
  const [atsResult, setAtsResult] = useState(null);
  const [openAccordion, setOpenAccordion] = useState(null);
  const [optimizeCompany, setOptimizeCompany] = useState('');

  const resumeData = { personal, education, skills, projects, experience, certifications, achievements };

  // Load saved resume on mount
  useEffect(() => {
    api.get('/resume').then(r => {
      const d = r.data;
      if (d.personal) setPersonal(d.personal);
      if (d.education?.length) setEducation(d.education);
      if (d.skills?.length) setSkills(d.skills);
      if (d.projects?.length) setProjects(d.projects);
      if (d.experience?.length) setExperience(d.experience);
      if (d.certifications?.length) setCertifications(d.certifications);
      if (d.achievements?.length) setAchievements(d.achievements);
    }).catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post('/resume', resumeData);
      toast.success('Resume saved successfully!');
    } catch {
      toast.error('Failed to save resume.');
    } finally {
      setSaving(false);
    }
  };

  const handleExportPDF = () => {
    const prev = document.title;
    document.title = `${personal.name || 'Resume'}_Resume`;
    window.print();
    document.title = prev;
  };

  const handleAtsCheck = async () => {
    if (!jobDesc.trim()) { toast.error('Please enter a job description.'); return; }
    setAtsLoading(true);
    try {
      const { data } = await api.post('/resume/ats-check', { resume: resumeData, jobDescription: jobDesc });
      setAtsResult(data);
    } catch {
      toast.error('ATS check failed. Please try again.');
    } finally {
      setAtsLoading(false);
    }
  };

  // Generic list helpers
  const updateItem = (setter, id, field, value) =>
    setter(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  const addItem = (setter, factory) => setter(prev => [...prev, factory()]);
  const removeItem = (setter, id) => setter(prev => prev.filter(item => item.id !== id));

  return (
    <>
      <style>{`@media print { body * { visibility: hidden; } #resume-preview, #resume-preview * { visibility: visible; } #resume-preview { position: fixed; left: 0; top: 0; width: 100%; background: white; } }`}</style>
      <div className="flex flex-col h-full" style={{ background: 'var(--bg-primary)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]" style={{ background: 'var(--bg-card)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-[var(--text-primary)]">Resume Builder</h1>
              <p className="text-xs text-[var(--text-secondary)]">ATS-optimised, live preview</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setPreviewMode(p => !p)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border)] text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors md:hidden">
              {previewMode ? <Edit3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {previewMode ? 'Edit' : 'Preview'}
            </button>
            <button onClick={handleSave} disabled={saving}
              className="btn-primary text-sm py-2 px-4">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-600 hover:bg-green-500 text-white text-sm font-semibold transition-colors">
              <Download className="w-4 h-4" /> Export PDF
            </button>
          </div>
        </div>

        {/* Body: split view */}
        <div className="flex flex-1 overflow-hidden">
          {/* LEFT: Form Panel */}
          <div className={`flex flex-col border-r border-[var(--border)] overflow-hidden ${previewMode ? 'hidden md:flex' : 'flex'} w-full md:w-[45%] lg:w-[42%]`}>
            {/* Tabs */}
            <div className="flex gap-1 px-3 py-2 overflow-x-auto border-b border-[var(--border)]" style={{ background: 'var(--bg-card)' }}>
              {FORM_TABS.map(tab => {
                const Icon = tab.icon;
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                      activeTab === tab.id
                        ? 'bg-purple-600 text-white'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5'
                    }`}>
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>

                  {/* ── Personal ── */}
                  {activeTab === 'personal' && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <Input label="Full Name *" value={personal.name} onChange={v => setPersonal(p => ({ ...p, name: v }))} placeholder="Rahul Sharma" className="col-span-2" />
                        <Input label="Email" value={personal.email} onChange={v => setPersonal(p => ({ ...p, email: v }))} placeholder="rahul@email.com" type="email" />
                        <Input label="Phone" value={personal.phone} onChange={v => setPersonal(p => ({ ...p, phone: v }))} placeholder="+91 9876543210" />
                        <Input label="Location" value={personal.location} onChange={v => setPersonal(p => ({ ...p, location: v }))} placeholder="Mumbai, Maharashtra" />
                        <Input label="Portfolio URL" value={personal.portfolio} onChange={v => setPersonal(p => ({ ...p, portfolio: v }))} placeholder="portfolio.dev" />
                        <Input label="LinkedIn" value={personal.linkedin} onChange={v => setPersonal(p => ({ ...p, linkedin: v }))} placeholder="linkedin.com/in/rahul" className="col-span-2" />
                        <Input label="GitHub" value={personal.github} onChange={v => setPersonal(p => ({ ...p, github: v }))} placeholder="github.com/rahul" className="col-span-2" />
                      </div>
                      <Textarea label="Professional Summary" value={personal.summary} onChange={v => setPersonal(p => ({ ...p, summary: v }))}
                        placeholder="Motivated CSE student seeking SDE role…" rows={4} />
                    </div>
                  )}

                  {/* ── Education ── */}
                  {activeTab === 'education' && (
                    <div className="space-y-4">
                      {education.map((e, idx) => (
                        <div key={e.id} className="card relative">
                          <button onClick={() => removeItem(setEducation, e.id)} className="absolute top-3 right-3 text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
                          <p className="text-xs font-semibold text-purple-400 mb-3">Education #{idx + 1}</p>
                          <div className="grid grid-cols-2 gap-3">
                            <Input label="Institution" value={e.institution} onChange={v => updateItem(setEducation, e.id, 'institution', v)} placeholder="IIT Bombay" className="col-span-2" />
                            <Input label="Degree" value={e.degree} onChange={v => updateItem(setEducation, e.id, 'degree', v)} placeholder="B.Tech" />
                            <Input label="Branch" value={e.branch} onChange={v => updateItem(setEducation, e.id, 'branch', v)} placeholder="CSE" />
                            <Input label="CGPA / %" value={e.cgpa} onChange={v => updateItem(setEducation, e.id, 'cgpa', v)} placeholder="8.5" />
                            <Input label="Year" value={e.year} onChange={v => updateItem(setEducation, e.id, 'year', v)} placeholder="2021 – 2025" />
                            <Input label="Relevant Coursework" value={e.relevant} onChange={v => updateItem(setEducation, e.id, 'relevant', v)} placeholder="OS, DBMS, CN…" className="col-span-2" />
                          </div>
                        </div>
                      ))}
                      <button onClick={() => addItem(setEducation, emptyEducation)} className="flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm font-medium">
                        <Plus className="w-4 h-4" /> Add Education
                      </button>
                    </div>
                  )}

                  {/* ── Skills ── */}
                  {activeTab === 'skills' && (
                    <div className="space-y-3">
                      {skills.map((s, idx) => (
                        <div key={s.id} className="card relative">
                          <button onClick={() => removeItem(setSkills, s.id)} className="absolute top-3 right-3 text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
                          <p className="text-xs font-semibold text-purple-400 mb-3">Skill Group #{idx + 1}</p>
                          <div className="grid grid-cols-2 gap-3">
                            <Input label="Category" value={s.category} onChange={v => updateItem(setSkills, s.id, 'category', v)} placeholder="Languages" />
                            <Input label="Skills (comma-separated)" value={s.items} onChange={v => updateItem(setSkills, s.id, 'items', v)} placeholder="C++, Java, Python" />
                          </div>
                        </div>
                      ))}
                      <button onClick={() => addItem(setSkills, emptySkill)} className="flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm font-medium">
                        <Plus className="w-4 h-4" /> Add Skill Group
                      </button>
                    </div>
                  )}

                  {/* ── Projects ── */}
                  {activeTab === 'projects' && (
                    <div className="space-y-4">
                      {projects.map((p, idx) => (
                        <div key={p.id} className="card relative">
                          <button onClick={() => removeItem(setProjects, p.id)} className="absolute top-3 right-3 text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
                          <p className="text-xs font-semibold text-purple-400 mb-3">Project #{idx + 1}</p>
                          <div className="grid grid-cols-2 gap-3">
                            <Input label="Project Title" value={p.title} onChange={v => updateItem(setProjects, p.id, 'title', v)} placeholder="PlacePrep App" className="col-span-2" />
                            <Input label="Tech Stack" value={p.tech} onChange={v => updateItem(setProjects, p.id, 'tech', v)} placeholder="React, Node.js, MongoDB" className="col-span-2" />
                            <Input label="GitHub / Live Link" value={p.link} onChange={v => updateItem(setProjects, p.id, 'link', v)} placeholder="github.com/user/project" className="col-span-2" />
                          </div>
                          <Textarea label="Description (one bullet per line)" value={p.description} onChange={v => updateItem(setProjects, p.id, 'description', v)}
                            placeholder="- Developed REST API using Node.js&#10;- Improved performance by 30%" rows={4} className="mt-3" />
                        </div>
                      ))}
                      <button onClick={() => addItem(setProjects, emptyProject)} className="flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm font-medium">
                        <Plus className="w-4 h-4" /> Add Project
                      </button>
                    </div>
                  )}

                  {/* ── Experience ── */}
                  {activeTab === 'experience' && (
                    <div className="space-y-4">
                      {experience.map((e, idx) => (
                        <div key={e.id} className="card relative">
                          <button onClick={() => removeItem(setExperience, e.id)} className="absolute top-3 right-3 text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
                          <p className="text-xs font-semibold text-purple-400 mb-3">Experience #{idx + 1}</p>
                          <div className="grid grid-cols-2 gap-3">
                            <Input label="Company" value={e.company} onChange={v => updateItem(setExperience, e.id, 'company', v)} placeholder="Google" />
                            <Input label="Role" value={e.role} onChange={v => updateItem(setExperience, e.id, 'role', v)} placeholder="SWE Intern" />
                            <Input label="Duration" value={e.duration} onChange={v => updateItem(setExperience, e.id, 'duration', v)} placeholder="May 2024 – Jul 2024" className="col-span-2" />
                          </div>
                          <Textarea label="Key Points (one per line)" value={e.points} onChange={v => updateItem(setExperience, e.id, 'points', v)}
                            placeholder="- Built microservice handling 10K req/s&#10;- Reduced latency by 40%" rows={4} className="mt-3" />
                        </div>
                      ))}
                      <button onClick={() => addItem(setExperience, emptyExperience)} className="flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm font-medium">
                        <Plus className="w-4 h-4" /> Add Experience
                      </button>
                    </div>
                  )}

                  {/* ── Certifications ── */}
                  {activeTab === 'certifications' && (
                    <div className="space-y-4">
                      {certifications.map((c, idx) => (
                        <div key={c.id} className="card relative">
                          <button onClick={() => removeItem(setCertifications, c.id)} className="absolute top-3 right-3 text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
                          <p className="text-xs font-semibold text-purple-400 mb-3">Certificate #{idx + 1}</p>
                          <div className="grid grid-cols-2 gap-3">
                            <Input label="Certificate Name" value={c.name} onChange={v => updateItem(setCertifications, c.id, 'name', v)} placeholder="AWS Solutions Architect" className="col-span-2" />
                            <Input label="Issuer" value={c.issuer} onChange={v => updateItem(setCertifications, c.id, 'issuer', v)} placeholder="Amazon Web Services" />
                            <Input label="Date" value={c.date} onChange={v => updateItem(setCertifications, c.id, 'date', v)} placeholder="Dec 2024" />
                            <Input label="Credential Link" value={c.link} onChange={v => updateItem(setCertifications, c.id, 'link', v)} placeholder="credly.com/…" className="col-span-2" />
                          </div>
                        </div>
                      ))}
                      <button onClick={() => addItem(setCertifications, emptyCertification)} className="flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm font-medium">
                        <Plus className="w-4 h-4" /> Add Certification
                      </button>
                    </div>
                  )}

                  {/* ── Achievements ── */}
                  {activeTab === 'achievements' && (
                    <div className="space-y-4">
                      {achievements.map((a, idx) => (
                        <div key={a.id} className="card relative">
                          <button onClick={() => removeItem(setAchievements, a.id)} className="absolute top-3 right-3 text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
                          <p className="text-xs font-semibold text-purple-400 mb-3">Achievement #{idx + 1}</p>
                          <div className="space-y-3">
                            <Input label="Title" value={a.title} onChange={v => updateItem(setAchievements, a.id, 'title', v)} placeholder="Finalist – Smart India Hackathon 2024" />
                            <Input label="Details" value={a.description} onChange={v => updateItem(setAchievements, a.id, 'description', v)} placeholder="Among top 10 teams out of 5000+ entries" />
                          </div>
                        </div>
                      ))}
                      <button onClick={() => addItem(setAchievements, emptyAchievement)} className="flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm font-medium">
                        <Plus className="w-4 h-4" /> Add Achievement
                      </button>
                    </div>
                  )}

                  {/* ── ATS Checker ── */}
                  {activeTab === 'ats' && (
                    <div className="space-y-5">
                      <div className="card">
                        <div className="flex items-center gap-2 mb-3">
                          <Zap className="w-5 h-5 text-yellow-400" />
                          <h3 className="font-semibold text-[var(--text-primary)]">ATS Score Checker</h3>
                        </div>
                        <Textarea label="Paste Job Description" value={jobDesc} onChange={setJobDesc}
                          placeholder="We are looking for a Software Development Engineer with strong DSA skills, experience in Java/Python…" rows={7} />
                        <div className="flex gap-2 mt-3">
                          <button onClick={handleAtsCheck} disabled={atsLoading} className="btn-primary flex-1 justify-center">
                            {atsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                            {atsLoading ? 'Analysing…' : 'Check ATS Score'}
                          </button>
                        </div>
                      </div>

                      {atsResult && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                          {/* Score gauge */}
                          <div className="card flex flex-col items-center gap-3">
                            <ScoreGauge score={atsResult.score ?? 0} />
                            <p className="text-sm text-[var(--text-secondary)] text-center max-w-xs">
                              {(atsResult.score ?? 0) >= 75 ? 'Great match! Your resume is well aligned.' : (atsResult.score ?? 0) >= 50 ? 'Moderate match. Add more relevant keywords.' : 'Low match. Significant optimisation needed.'}
                            </p>
                          </div>

                          {/* Keywords */}
                          <div className="card">
                            <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Keyword Analysis</h4>
                            {atsResult.matchedKeywords?.length > 0 && (
                              <div className="mb-3">
                                <p className="text-xs text-green-400 font-medium mb-2 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Matched ({atsResult.matchedKeywords.length})</p>
                                <div className="flex flex-wrap gap-2">
                                  {atsResult.matchedKeywords.map(kw => (
                                    <span key={kw} className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/15 text-green-400 border border-green-500/30">{kw}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {atsResult.missingKeywords?.length > 0 && (
                              <div>
                                <p className="text-xs text-red-400 font-medium mb-2 flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Missing ({atsResult.missingKeywords.length})</p>
                                <div className="flex flex-wrap gap-2">
                                  {atsResult.missingKeywords.map(kw => (
                                    <span key={kw} className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/15 text-red-400 border border-red-500/30">{kw}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Section feedback accordion */}
                          {atsResult.sectionFeedback && (
                            <div className="card space-y-2">
                              <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Section Feedback</h4>
                              {Object.entries(atsResult.sectionFeedback).map(([section, feedback]) => (
                                <div key={section} className="border border-[var(--border)] rounded-lg overflow-hidden">
                                  <button onClick={() => setOpenAccordion(openAccordion === section ? null : section)}
                                    className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-[var(--text-primary)] hover:bg-white/5 transition-colors">
                                    <span className="capitalize">{section}</span>
                                    {openAccordion === section ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                  </button>
                                  <AnimatePresence>
                                    {openAccordion === section && (
                                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                                        <p className="px-3 pb-3 text-xs text-[var(--text-secondary)]">{feedback}</p>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Optimize for company */}
                          <div className="card">
                            <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-purple-400" /> Optimize for Company
                            </h4>
                            <div className="flex gap-2">
                              <input value={optimizeCompany} onChange={e => setOptimizeCompany(e.target.value)} placeholder="e.g. Google, Amazon…"
                                className="flex-1 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-purple-500" />
                              <button onClick={() => toast.success(`Optimization tips for ${optimizeCompany} will appear here.`)}
                                className="btn-primary text-sm py-2 px-4 whitespace-nowrap">Optimize</button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT: Preview Panel */}
          <div className={`flex-1 overflow-y-auto ${previewMode ? 'flex' : 'hidden md:block'} bg-gray-200`} style={{ minHeight: 0 }}>
            <div className="p-4" style={{ minWidth: 0 }}>
              <div className="shadow-2xl rounded-sm overflow-hidden mx-auto" style={{ maxWidth: 800 }}>
                <ResumePreview data={resumeData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
