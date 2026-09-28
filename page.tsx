'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Stethoscope,
  Activity,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Calendar,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { Badge } from '@/components/Badge';
import { DoctorSpecialty, SymptomCheckerResult } from '@/types';

export default function SymptomCheckerPage() {
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [bodyArea, setBodyArea] = useState<string>('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [duration, setDuration] = useState<string>('2-3 Days');
  const [severity, setSeverity] = useState<number>(4);
  const [preExisting, setPreExisting] = useState<string[]>([]);

  // Triage Result State
  const [triageReport, setTriageReport] = useState<SymptomCheckerResult | null>(null);

  const bodyAreaOptions = [
    { id: 'Head & Neck', title: 'Head & Neck', desc: 'Headaches, dizziness, throat pain, sinus pressure', icon: '🧠' },
    { id: 'Chest & Breathing', title: 'Chest & Breathing', desc: 'Chest tightness, cough, shortness of breath', icon: '🫁' },
    { id: 'Abdomen & Digestion', title: 'Abdomen & Digestion', desc: 'Stomach pain, acidity, nausea, bloating', icon: '🩺' },
    { id: 'Skin & Allergies', title: 'Skin & Allergies', desc: 'Rashes, itching, redness, hives, swelling', icon: '✨' },
    { id: 'General & Joint', title: 'General & Joint Pain', desc: 'Fever, fatigue, joint stiffness, muscle soreness', icon: '⚡' },
  ];

  const symptomOptionsMap: Record<string, string[]> = {
    'Head & Neck': ['Throbbing headache', 'Dizziness', 'Sore throat', 'Sinus pressure', 'Stiff neck'],
    'Chest & Breathing': ['Shortness of breath', 'Dry cough', 'Productive cough', 'Chest tightness', 'Wheezing'],
    'Abdomen & Digestion': ['Acid reflux / Heartburn', 'Nausea', 'Abdominal cramps', 'Bloating', 'Loss of appetite'],
    'Skin & Allergies': ['Itchy rash', 'Redness / Inflammation', 'Dry flaky skin', 'Hives', 'Swelling'],
    'General & Joint': ['High fever', 'Extreme fatigue', 'Joint stiffness', 'Body pain', 'Cold chills'],
  };

  const handleSymptomToggle = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handlePreExistingToggle = (cond: string) => {
    if (preExisting.includes(cond)) {
      setPreExisting(preExisting.filter((c) => c !== cond));
    } else {
      setPreExisting([...preExisting, cond]);
    }
  };

  const calculateTriageReport = () => {
    let level: 'Low Risk' | 'Moderate Attention' | 'High Urgency / Seek Care' = 'Low Risk';
    let specialist: DoctorSpecialty = 'General Physician';
    let causes: string[] = [];
    let remedies: string[] = [];
    let warnings: string[] = [];

    // Analyze inputs
    if (bodyArea === 'Chest & Breathing' && (severity >= 7 || selectedSymptoms.includes('Chest tightness'))) {
      level = 'High Urgency / Seek Care';
      specialist = 'Cardiology';
      causes = ['Cardiovascular distress', 'Severe bronchial hyperreactivity', 'Costochondritis'];
      remedies = ['Sit upright immediately', 'Loosen tight clothing', 'Seek emergency care if pain persists'];
      warnings = ['Do not delay if pain spreads to left arm or jaw.', 'Call emergency hotline 112 immediately.'];
    } else if (bodyArea === 'Head & Neck') {
      specialist = 'Neurology';
      if (severity >= 8) {
        level = 'High Urgency / Seek Care';
        causes = ['Acute migraine attack', 'Hypertensive headache', 'Neural inflammation'];
      } else {
        level = 'Moderate Attention';
        causes = ['Tension headache', 'Digital eye strain', 'Dehydration'];
      }
      remedies = ['Rest in a dark quiet room', 'Hydrate with electrolyte solution', 'Apply cold forehead compress'];
      warnings = ['If accompanied by sudden speech difficulty or confusion, go to ER.'];
    } else if (bodyArea === 'Skin & Allergies') {
      specialist = 'Dermatology';
      level = severity >= 7 ? 'Moderate Attention' : 'Low Risk';
      causes = ['Contact dermatitis', 'Seasonal histamine response', 'Dry skin barrier breakdown'];
      remedies = ['Apply fragrance-free moisturizer or aloe vera gel', 'Avoid hot water showers', 'Use cool compress'];
      warnings = ['Seek urgent help if facial swelling or throat tightness occurs.'];
    } else {
      specialist = 'General Physician';
      level = severity >= 7 ? 'Moderate Attention' : 'Low Risk';
      causes = ['Viral flu syndrome', 'Physical overexertion', 'Mild gastrointestinal discomfort'];
      remedies = ['Maintain 2.5L daily fluid intake', 'Ensure 8 hours of bed rest', 'Eat light digestible meals'];
      warnings = ['Monitor body temperature every 4 hours.'];
    }

    const report: SymptomCheckerResult = {
      triageLevel: level,
      summary: `Based on your selection of ${selectedSymptoms.join(', ') || bodyArea} lasting ${duration} with a severity score of ${severity}/10, ArogyaAI generated the following triage guidance.`,
      potentialCauses: causes,
      homeRemedies: remedies,
      recommendedSpecialist: specialist,
      warningSigns: warnings,
    };

    setTriageReport(report);
    setCurrentStep(4);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setBodyArea('');
    setSelectedSymptoms([]);
    setDuration('2-3 Days');
    setSeverity(4);
    setPreExisting([]);
    setTriageReport(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title */}
      <div className="text-center space-y-3">
        <Badge variant="cyan" size="md">
          <Stethoscope className="w-4 h-4 text-cyan-400" /> Interactive AI Triage
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          AI Symptom Checker Wizard
        </h1>
        <p className="text-slate-300 text-sm max-w-xl mx-auto">
          Complete a quick 3-step evaluation to analyze symptom severity and receive instant care recommendations.
        </p>
      </div>

      {/* Step Progress Bar */}
      <div className="flex items-center justify-between max-w-md mx-auto relative px-4">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -z-10" />
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all ${
              currentStep === step
                ? 'bg-cyan-500 text-slate-950 ring-4 ring-cyan-500/20 shadow-[0_0_15px_rgba(0,242,254,0.4)]'
                : currentStep > step
                ? 'bg-purple-600 text-white'
                : 'bg-slate-900 border border-slate-700 text-slate-400'
            }`}
          >
            {currentStep > step ? '✓' : `0${step}`}
          </div>
        ))}
      </div>

      {/* Wizard Form Container */}
      <GlassCard className="p-6 sm:p-10 border-cyan-500/20 relative min-h-[420px]">
        {/* STEP 1: Body Area Selection */}
        {currentStep === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white">Step 1: Select Primary Body Area</h2>
              <p className="text-xs text-slate-400">Where are you experiencing discomfort?</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {bodyAreaOptions.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => {
                    setBodyArea(opt.id);
                    setSelectedSymptoms([]);
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-4 ${
                    bodyArea === opt.id
                      ? 'bg-cyan-500/10 border-cyan-400 text-white shadow-[0_0_15px_rgba(0,242,254,0.15)]'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="text-2xl">{opt.icon}</span>
                  <div>
                    <h3 className="font-bold text-sm text-white">{opt.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{opt.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 flex justify-end">
              <button
                disabled={!bodyArea}
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 rounded-xl btn-gradient-glow text-white font-semibold text-xs sm:text-sm flex items-center gap-2 disabled:opacity-50"
              >
                <span>Next: Select Symptoms</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: Symptoms & Duration */}
        {currentStep === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white">Step 2: Specific Symptoms & Duration</h2>
              <p className="text-xs text-slate-400">Select all symptoms applying to your condition</p>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-cyan-300 block">Active Symptoms for {bodyArea}:</label>
              <div className="flex flex-wrap gap-2">
                {(symptomOptionsMap[bodyArea] || []).map((symptom) => {
                  const isSelected = selectedSymptoms.includes(symptom);
                  return (
                    <button
                      key={symptom}
                      type="button"
                      onClick={() => handleSymptomToggle(symptom)}
                      className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all ${
                        isSelected
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-[0_0_10px_rgba(0,242,254,0.3)]'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {isSelected && '✓ '} {symptom}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-800">
              <label className="text-xs font-semibold text-cyan-300 block">Symptom Duration:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['Today', '2-3 Days', '1 Week', '> 1 Month'].map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => setDuration(dur)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-medium border transition-all ${
                      duration === dur
                        ? 'bg-purple-600 text-white border-purple-400 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {dur}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-5 py-3 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                disabled={selectedSymptoms.length === 0}
                onClick={() => setCurrentStep(3)}
                className="px-6 py-3 rounded-xl btn-gradient-glow text-white font-semibold text-xs sm:text-sm flex items-center gap-2 disabled:opacity-50"
              >
                <span>Next: Severity & Factors</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: Severity Score & Factors */}
        {currentStep === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white">Step 3: Severity Rating & Medical History</h2>
              <p className="text-xs text-slate-400">Rate your pain/discomfort level from 1 (Mild) to 10 (Severe)</p>
            </div>

            {/* Severity Slider */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Pain Scale (1-10):</span>
                <span className="text-2xl font-extrabold text-cyan-400">{severity} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={severity}
                onChange={(e) => setSeverity(parseInt(e.target.value))}
                className="w-full h-2 rounded-lg bg-slate-800 accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>1 - Barely noticeable</span>
                <span>5 - Moderate discomfort</span>
                <span>10 - Severe intense pain</span>
              </div>
            </div>

            {/* Pre-existing Conditions */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-cyan-300 block">Pre-existing Health Conditions:</label>
              <div className="flex flex-wrap gap-2">
                {['Hypertension', 'Diabetes', 'Asthma', 'Heart Condition', 'None'].map((cond) => {
                  const isChecked = preExisting.includes(cond);
                  return (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => handlePreExistingToggle(cond)}
                      className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all ${
                        isChecked
                          ? 'bg-purple-500/20 text-purple-300 border-purple-400 font-semibold'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      {isChecked && '✓ '} {cond}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-5 py-3 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={calculateTriageReport}
                className="px-8 py-3.5 rounded-xl btn-gradient-glow text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg"
              >
                <Sparkles className="w-4 h-4" />
                Generate AI Triage Report
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 4: AI Triage Report */}
        {currentStep === 4 && triageReport && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  AI Triage Diagnostic Report
                  <Badge
                    variant={
                      triageReport.triageLevel === 'High Urgency / Seek Care'
                        ? 'red'
                        : triageReport.triageLevel === 'Moderate Attention'
                        ? 'amber'
                        : 'green'
                    }
                    size="md"
                  >
                    {triageReport.triageLevel}
                  </Badge>
                </h2>
                <p className="text-xs text-slate-400 mt-1">{triageReport.summary}</p>
              </div>
              <button
                onClick={handleReset}
                className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1"
              >
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
            </div>

            {/* Potential Causes & Home Remedies */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                  Potential Conditions to Discuss:
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {triageReport.potentialCauses.map((c, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  Recommended Home Care:
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {triageReport.homeRemedies.map((r, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Warning Flags if applicable */}
            {triageReport.warningSigns.length > 0 && (
              <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-300 text-xs space-y-1">
                <p className="font-bold flex items-center gap-2 text-rose-400">
                  <AlertTriangle className="w-4 h-4" /> Emergency Warning Triggers:
                </p>
                {triageReport.warningSigns.map((w, i) => (
                  <p key={i} className="pl-6 text-[11px] text-slate-300">{w}</p>
                ))}
              </div>
            )}

            {/* Specialist Recommendation & Direct Action */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 to-purple-950/40 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs text-slate-400">Recommended Specialist Consultation:</p>
                <p className="text-lg font-bold text-cyan-300">{triageReport.recommendedSpecialist}</p>
              </div>

              <Link
                href="/appointments"
                className="px-6 py-3 rounded-xl btn-gradient-glow text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shrink-0"
              >
                <Calendar className="w-4 h-4" />
                Book {triageReport.recommendedSpecialist} Specialist
              </Link>
            </div>
          </motion.div>
        )}
      </GlassCard>
    </div>
  );
}
