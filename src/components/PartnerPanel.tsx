import React, { useState } from 'react';
import { useAppState } from '../context/AppContext';
import { HeartHandshake, ShieldCheck, Mail, Phone, MapPin, UserCheck, CalendarDays, Award, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface PartnerPanelProps {
  onNavigate: (route: string) => void;
}

export default function PartnerPanel({ onNavigate }: PartnerPanelProps) {
  const { partnerHiringActive, applyForPartner } = useAppState();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    age: '',
    qualification: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name || !formData.phone || !formData.email || !formData.city || !formData.age || !formData.qualification) {
      setErrorMsg('Please populate all fields accurately.');
      return;
    }

    const ageNum = parseInt(formData.age, 10);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 70) {
      setErrorMsg('Age eligibility criterion: Must be between 18 and 70 years of age.');
      return;
    }

    const res = applyForPartner(
      formData.name,
      formData.phone,
      formData.email,
      formData.city,
      ageNum,
      formData.qualification
    );

    if (res.success) {
      setSubmitted(true);
      setFormData({ name: '', phone: '', email: '', city: '', age: '', qualification: '' });
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div id="partner-apply-view" className="py-12 px-4 max-w-7xl mx-auto min-h-[85vh] flex flex-col justify-center">
      
      {/* Back to Home action */}
      <button 
        id="partner-back-home"
        onClick={() => onNavigate('/Home')}
        className="self-start inline-flex items-center gap-2 text-xs font-extrabold text-slate-500 hover:text-brand-primary dark:text-slate-400 dark:hover:text-white transition-colors mb-8 uppercase tracking-wider"
      >
        <ArrowLeft className="w-4 h-4 text-amber-500" />
        Back to Home Page
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Info Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 rounded-lg text-xs font-bold uppercase tracking-wider">
            <HeartHandshake className="w-3.5 h-3.5" />
            Recruitment Board
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Become a <span className="text-brand-accent">Regional Partner</span>
          </h1>
          
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
            Join the Public Ads India extension program. Our regional partners manage local client networks, verify agency submissions, and command massive recurring performance overrides securely with zero direct portfolio expenditure.
          </p>

          <div className="space-y-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/80">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5.5 h-5.5 text-[#10b981] mt-0.5 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Enterprise Authority</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Become a licensed regional lead generator with full compliance check authorities.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Award className="w-5.5 h-5.5 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Zero Capital Entry</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Absolutely no direct investment or collateral deposits required under any trade conditions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Column */}
        <div className="lg:col-span-7">
          <div className="bg-white dark:bg-[#0d1628] rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800/80 shadow-2xl relative overflow-hidden">
            
            {partnerHiringActive ? (
              // Case A: Hiring active
              <div>
                {submitted ? (
                  <div id="partner-success-screen" className="text-center py-10 animate-fade-up">
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/40 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-6">
                      <UserCheck className="w-10 h-10" />
                    </div>
                    
                    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Application Received!</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-300 font-medium max-w-sm mx-auto leading-relaxed mt-3">
                      We have logged your candidate details. The Public Ads India regional recruitment board evaluates profiles and coordinates contact processes in 3-5 office working days.
                    </p>
                    
                    <button
                      id="partner-success-done"
                      onClick={() => setSubmitted(false)}
                      className="mt-8 px-6 py-3 bg-brand-primary hover:bg-blue-700 text-white font-bold text-xs rounded-xl tracking-wider uppercase transition-colors"
                    >
                      Fill another application
                    </button>
                  </div>
                ) : (
                  <form id="partner-registration-form" onSubmit={handleSubmit} className="space-y-4">
                    <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Partner Application Form</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Please fill your correct demographics. All data is verified against state KYC registries.</p>
                    </div>

                    {errorMsg && (
                      <div className="p-3.5 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-950 font-bold text-xs rounded-xl">
                        {errorMsg}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Candidate Name</label>
                        <div className="relative">
                          <input
                            type="text"
                            name="name"
                            required
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full text-xs p-3 pl-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-brand-accent text-slate-900 dark:text-white font-medium"
                          />
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Phone No.</label>
                        <div className="relative">
                          <input
                            type="tel"
                            name="phone"
                            required
                            placeholder="10 digit mobile number"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-brand-accent text-slate-900 dark:text-white font-medium"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Email */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                        <div className="relative">
                          <input
                            type="email"
                            name="email"
                            required
                            placeholder="yourname@domain.com"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-brand-accent text-slate-900 dark:text-white font-medium"
                          />
                        </div>
                      </div>

                      {/* City */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Resident City</label>
                        <div className="relative">
                          <input
                            type="text"
                            name="city"
                            required
                            placeholder="City, State"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-brand-accent text-slate-900 dark:text-white font-medium"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Age */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Age (Years)</label>
                        <div className="relative">
                          <input
                            type="number"
                            name="age"
                            required
                            placeholder="Must be 18+"
                            value={formData.age}
                            onChange={handleInputChange}
                            className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-brand-accent text-slate-900 dark:text-white font-medium"
                          />
                        </div>
                      </div>

                      {/* Qualification */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Highest Qualification</label>
                        <div className="relative">
                          <input
                            type="text"
                            name="qualification"
                            required
                            placeholder="e.g. Graduate, MCA, MBA"
                            value={formData.qualification}
                            onChange={handleInputChange}
                            className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-brand-accent text-slate-900 dark:text-white font-medium"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      id="submit-partner-app-btn"
                      className="mt-6 w-full py-4 bg-brand-primary hover:bg-blue-700 text-white font-extrabold text-sm rounded-xl tracking-wide transition-all shadow-md active:scale-98 cursor-pointer"
                    >
                      Submit Recruitment Application
                    </button>
                  </form>
                )}
              </div>
            ) : (
              // Case B: Hiring Paused
              <div id="partner-hiring-paused-screen" className="text-center py-12 animate-fade-up">
                <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/20 rounded-full flex items-center justify-center text-rose-500 mx-auto mb-6">
                  <ShieldCheck className="w-10 h-10" />
                </div>
                
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Hiring Not Available</h2>
                <p className="text-sm text-slate-600 dark:text-slate-350 font-medium max-w-sm mx-auto leading-relaxed mt-3">
                  Thank you for your interest in our partnership program. We are currently at maximum capacity for regional supervisors and have paused partner applications. Please check back next season or contact the main office desk.
                </p>
                
                <button
                  id="hiring-paused-back-button"
                  onClick={() => onNavigate('/Home')}
                  className="mt-8 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl hover:bg-slate-200 dark:hover:bg-slate-750 transition-colors"
                >
                  Return to Home page
                </button>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
