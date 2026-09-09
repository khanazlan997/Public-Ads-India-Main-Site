import React, { useState, useEffect } from 'react';
import { useAppState, db } from '../context/AppContext';
import { doc, getDoc } from 'firebase/firestore';
import { Lock, Eye, EyeOff, ShieldCheck, UserCheck, Search, Users, Banknote, ListTodo, LogOut, CheckCircle2, Download } from 'lucide-react';
import { SubmissionStatus } from '../types';

interface EmployeePanelProps {
  onNavigate: (route: string) => void;
}

export default function EmployeePanel({ onNavigate }: EmployeePanelProps) {
  const { 
    currentUser, 
    loginEmployee, 
    logout, 
    submissions, 
    updateSubmissionStatus,
    bankDetailsMap
  } = useAppState();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Search filtering state
  const [filterQuery, setFilterQuery] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [viewingBankDetails, setViewingBankDetails] = useState<{ id: string; name: string; bank: any } | null>(null);

  // Pagination state (50 items per page)
  const [empSubPage, setEmpSubPage] = useState(1);

  useEffect(() => {
    setEmpSubPage(1);
  }, [filterQuery]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!username || !password) {
      setLoginError('Please enter both username and password.');
      return;
    }

    const res = loginEmployee(username, password);
    if (!res.success) {
      setLoginError(res.message);
    }
  };

  const handleStatusChange = (subId: string, status: SubmissionStatus) => {
    updateSubmissionStatus(subId, status);
  };

  // Filter data submissions
  const sortedAndFilteredSubmissions = submissions
    .filter(sub => {
      const q = filterQuery.toLowerCase();
      return (
        sub.clientName.toLowerCase().includes(q) ||
        sub.campaignName.toLowerCase().includes(q) ||
        sub.publisherName.toLowerCase().includes(q) ||
        sub.publisherId.toLowerCase().includes(q) ||
        sub.id.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const keyA = (a.submitDate || '') + '_' + (a.id || '');
      const keyB = (b.submitDate || '') + '_' + (b.id || '');
      return keyB.localeCompare(keyA);
    });

  const totalEmpSubPages = Math.ceil(sortedAndFilteredSubmissions.length / 50) || 1;
  const paginatedEmpSubmissions = sortedAndFilteredSubmissions.slice((empSubPage - 1) * 50, empSubPage * 50);

  // If not logged in as employee, display direct login form
  if (!currentUser || currentUser.type !== 'employee') {
    return (
      <div id="employee-login-screen" className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white dark:bg-[#0d1628] p-8 rounded-3xl border border-slate-200/80 dark:border-slate-850/60 shadow-2xl relative">
          
          <div className="text-center">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Staff Employee Portal
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              Please enter your allocated Employee username and license password.
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-450 border border-rose-200 dark:border-rose-900 font-bold text-xs rounded-xl">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Username ID</label>
              <input
                type="text"
                required
                placeholder="Enter your employee username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-emerald-500 text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Employee Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs p-3 pr-10 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-emerald-500 text-slate-900 dark:text-white font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-2.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              id="employee-login-sub-btn"
              className="w-full py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-950 dark:text-white hover:bg-emerald-600 hover:text-white font-extrabold text-xs tracking-wider uppercase rounded-xl transition-all shadow-md mt-6 cursor-pointer"
            >
              Verify Employee Session
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={() => onNavigate('/Home')}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline"
            >
              Back to general website
            </button>
          </div>

        </div>
      </div>
    );
  }

  // Employee Logged-in view
  const isPaymentRole = currentUser.role === 'Payment';

  return (
    <div id="employee-dashboard-layer" className="max-w-7xl mx-auto px-4 py-8 min-h-[85vh]">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#0d1628] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 mb-8 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-xl flex items-center justify-center">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Welcome, {currentUser.name}!
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-mono bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-400 px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold">
                Staff Console
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold ${
                isPaymentRole 
                  ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-400' 
                  : 'bg-blue-100 dark:bg-blue-950/50 text-blue-800 dark:text-blue-400'
              }`}>
                {isPaymentRole ? '💰 Payments Dispatcher' : '🔍 MIS Leads Auditor'}
              </span>
            </div>
          </div>
        </div>

        <button
          id="employee-logout-btn"
          onClick={() => { logout(); onNavigate('/Home'); }}
          className="px-4 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl border border-rose-200/50 dark:border-rose-950 flex items-center gap-1.5 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Terminate Session
        </button>
      </div>

      {/* Role-based Instructions & MIS Lead Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-12 space-y-6">
          <div className="bg-white dark:bg-[#0d1628] rounded-3xl p-6 md:p-8 border border-slate-200/80 dark:border-slate-800/80">
            
            {/* Action title */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  {isPaymentRole ? <Banknote className="w-5 h-5 text-amber-500" /> : <ListTodo className="w-5 h-5 text-blue-500" />}
                  {isPaymentRole ? 'Process Commission Payouts' : 'Audit Campaigns Lead MIS'}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {isPaymentRole 
                    ? 'Confirm bank credentials and finalize "Payment Done" disbursements for qualified leads.' 
                    : 'Analyze user submitted proofs, screenshots, and change statuses. Banking operations are hidden.'
                  }
                </p>
              </div>

              {/* Instant Search */}
              <div className="relative max-w-xs w-full">
                <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search lead/publisher..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="w-full text-xs p-2 pl-9 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
                />
              </div>
            </div>

            {/* List Table */}
            {sortedAndFilteredSubmissions.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                No matching campaign leads located in system registries.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0d1628]">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-450 uppercase font-extrabold tracking-wider bg-slate-50 dark:bg-slate-900/20">
                      <th className="p-4 rounded-l-xl">Ref/UID</th>
                      <th className="p-4">Campaign Name</th>
                      <th className="p-3">Client details</th>
                      <th className="p-3">Payout</th>
                      {isPaymentRole && <th className="p-3">Proof Card</th>}
                      <th className="p-3">Status</th>
                      <th className="p-4 rounded-r-xl text-right">Approve Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {paginatedEmpSubmissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20">
                        <td className="p-4">
                          <span className="font-extrabold text-slate-900 dark:text-white block">{sub.id.substring(0, 8)}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">By {sub.publisherName} ({sub.publisherId})</span>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{sub.campaignName}</span>
                        </td>
                        <td className="p-3">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 block">{sub.clientName}</span>
                          <span className="text-slate-400 block mt-0.5">{sub.clientPhone}</span>
                          {sub.clientCode && <span className="text-[9px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-slate-500 rounded uppercase block w-fit mt-1">{sub.clientCode}</span>}
                        </td>
                        <td className="p-3">
                          <span className="font-extrabold text-slate-850 dark:text-amber-500 text-red-500 font-mono">₹{sub.payout}</span>
                        </td>
                        {isPaymentRole && (
                          <td className="p-3">
                            <button
                              type="button"
                              onClick={async () => {
                                let bank = bankDetailsMap[sub.publisherId] || null;
                                if (!bank) {
                                  try {
                                    const docRef = doc(db, 'bank_details', sub.publisherId);
                                    const docSnap = await getDoc(docRef);
                                    if (docSnap.exists()) {
                                      bank = docSnap.data() as any;
                                    }
                                  } catch (error) {
                                    console.error("Error fetching bank on-demand:", error);
                                  }
                                }
                                setViewingBankDetails({
                                  id: sub.publisherId,
                                  name: sub.publisherName,
                                  bank: bank
                                });
                              }}
                              className="inline-flex items-center gap-1 text-[10px] bg-emerald-55 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded font-bold border border-emerald-100 dark:border-emerald-900 cursor-pointer"
                              title="Show Client Bank Details and UPI QR Code"
                            >
                              🏦 View Bank <CheckCircle2 className="w-3 h-3" />
                            </button>
                          </td>
                        )}
                        <td className="p-3">
                          <span className={`inline-flex px-2 py-0.5 font-bold text-[10px] rounded-full uppercase tracking-wider ${
                            sub.status === 'Payment Done' ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400' :
                            sub.status === 'Trade Done' ? 'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-400' :
                            sub.status === 'Process' ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-855 dark:text-amber-400' :
                            sub.status === 'Reject' ? 'bg-red-105 dark:bg-red-950/40 text-rose-700 dark:text-rose-400' :
                            'bg-blue-105 dark:bg-blue-950/40 text-blue-750 dark:text-blue-350'
                          }`}>
                            {sub.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            {isPaymentRole ? (
                              // Payment Done option exclusively for Payment employee
                              <button
                                disabled={sub.status === 'Payment Done'}
                                onClick={() => handleStatusChange(sub.id, 'Payment Done')}
                                className={`px-2.5 py-1.5 font-extrabold text-[10px] rounded uppercase select-none transition-colors ${
                                  sub.status === 'Payment Done' 
                                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed' 
                                    : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer hover:scale-103'
                                }`}
                              >
                                {sub.status === 'Payment Done' ? 'Paid Done' : 'Disburse Payment'}
                              </button>
                            ) : (
                              // MIS Employees can change status but CANNOT execute "Payment Done" direct disbursement
                              <div className="flex gap-1.5">
                                <button
                                  onClick={() => handleStatusChange(sub.id, 'Process')}
                                  className="px-2 py-1 bg-yellow-500 text-slate-950 hover:bg-yellow-600 font-bold text-[9px] rounded uppercase uppercase tracking-wider"
                                >
                                  In Process
                                </button>
                                <button
                                  onClick={() => handleStatusChange(sub.id, 'Reject')}
                                  className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[9px] rounded uppercase uppercase tracking-wider"
                                >
                                  Reject
                                </button>
                                <button
                                  onClick={() => handleStatusChange(sub.id, 'Ready To Trade')}
                                  className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[9px] rounded uppercase uppercase tracking-wider"
                                >
                                  Ready to Trade
                                </button>
                                <button
                                  onClick={() => handleStatusChange(sub.id, 'Active')}
                                  className="px-2 py-1 bg-violet-650 hover:bg-violet-700 text-white font-bold text-[9px] rounded uppercase uppercase tracking-wider"
                                >
                                  Active
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination Controls */}
                {sortedAndFilteredSubmissions.length > 0 && (
                  <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold text-slate-600 dark:text-slate-300">
                    <div>
                      Page <span className="font-extrabold text-indigo-600 dark:text-indigo-400">{empSubPage}</span> of <span className="font-extrabold text-indigo-600 dark:text-indigo-400">{totalEmpSubPages}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        disabled={empSubPage === 1}
                        onClick={() => setEmpSubPage(1)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all uppercase text-[10px]"
                      >
                        « First
                      </button>
                      <button
                        type="button"
                        disabled={empSubPage === 1}
                        onClick={() => setEmpSubPage(empSubPage - 1)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all text-xs"
                      >
                        ‹ Prev
                      </button>

                      {Array.from({ length: totalEmpSubPages }, (_, i) => i + 1)
                        .filter(p => Math.abs(p - empSubPage) <= 2 || p === 1 || p === totalEmpSubPages)
                        .map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setEmpSubPage(p)}
                            className={`w-8 h-8 rounded-lg font-black text-xs transition-all cursor-pointer ${
                              p === empSubPage
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                            }`}
                          >
                            {p}
                          </button>
                        ))}

                      <button
                        type="button"
                        disabled={empSubPage === totalEmpSubPages}
                        onClick={() => setEmpSubPage(empSubPage + 1)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all text-xs"
                      >
                        Next ›
                      </button>
                      <button
                        type="button"
                        disabled={empSubPage === totalEmpSubPages}
                        onClick={() => setEmpSubPage(totalEmpSubPages)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all uppercase text-[10px]"
                      >
                        Last »
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

      </div>

      {/* Interactive Bank Details Modal */}
      {viewingBankDetails && (
        <div 
          id="publisher-bank-details-modal-emp" 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
          onClick={() => setViewingBankDetails(null)}
        >
          <div 
            className="relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40">
              <span className="font-extrabold text-slate-850 dark:text-slate-100 text-[11px] uppercase tracking-wider">🏦 Banking Ledger: {viewingBankDetails.id}</span>
              <button 
                onClick={() => setViewingBankDetails(null)}
                className="p-1 px-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-xl font-black text-slate-750 dark:text-slate-250 cursor-pointer text-[10px]"
              >
                ✕ Close
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6 space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="block text-[10px] uppercase tracking-widest font-mono text-slate-400">Account Owner</span>
                <h4 className="text-base font-extrabold mt-0.5 text-slate-900 dark:text-white">{viewingBankDetails.name}</h4>
              </div>

              {viewingBankDetails.bank && (viewingBankDetails.bank.accountNumber || viewingBankDetails.bank.upi) ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="block text-[9px] uppercase tracking-widest text-slate-400 font-bold">Holder Name</span>
                      <span className="text-xs font-bold text-slate-750 dark:text-slate-300">{viewingBankDetails.bank.holderName || viewingBankDetails.name}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase tracking-widest text-slate-400 font-bold">Account Number</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs font-bold text-slate-750 dark:text-slate-300 font-mono">{viewingBankDetails.bank.accountNumber || 'N/A'}</span>
                        {viewingBankDetails.bank.accountNumber && (
                          <button 
                            onClick={() => {
                              const txt = viewingBankDetails.bank.accountNumber;
                              const ta = document.createElement("textarea"); ta.value = txt; ta.style.position="fixed"; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
                              alert('Copied Account Number!');
                            }}
                            className="px-1.5 py-0.5 text-[8px] font-black bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded transition-colors"
                          >
                            Copy
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="block text-[9px] uppercase tracking-widest text-slate-400 font-bold">Bank IFSC Code</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs font-bold text-slate-750 dark:text-slate-300 font-mono uppercase">{viewingBankDetails.bank.ifsc || 'N/A'}</span>
                        {viewingBankDetails.bank.ifsc && (
                          <button 
                            onClick={() => {
                              const txt = viewingBankDetails.bank.ifsc;
                              const ta = document.createElement("textarea"); ta.value = txt; ta.style.position="fixed"; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
                              alert('Copied IFSC!');
                            }}
                            className="px-1.5 py-0.5 text-[8px] font-black bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded transition-colors"
                          >
                            Copy
                          </button>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase tracking-widest text-slate-400 font-bold">UPI ID Ledger</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs font-bold text-slate-750 dark:text-slate-300 font-mono">{viewingBankDetails.bank.upi || 'N/A'}</span>
                        {viewingBankDetails.bank.upi && (
                          <button 
                            onClick={() => {
                              const txt = viewingBankDetails.bank.upi;
                              const ta = document.createElement("textarea"); ta.value = txt; ta.style.position="fixed"; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
                              alert('Copied UPI ID!');
                            }}
                            className="px-1.5 py-0.5 text-[8px] font-black bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded transition-colors"
                          >
                            Copy
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="block text-[9px] uppercase tracking-widest text-slate-400 font-bold">Registered Phone</span>
                      <span className="text-xs font-bold text-slate-750 dark:text-slate-300 font-mono">{viewingBankDetails.bank.phone || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase tracking-widest text-slate-400 font-bold">Registered Email</span>
                      <span className="text-xs font-bold text-slate-750 dark:text-slate-300 font-mono break-all">{viewingBankDetails.bank.email || 'N/A'}</span>
                    </div>
                  </div>

                  {viewingBankDetails.bank.qrCode && (
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="block text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-2">Uploaded UPI QR Scan card</span>
                      <div className="flex justify-center bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                        <img 
                          src={viewingBankDetails.bank.qrCode} 
                          alt="Client QR code" 
                          className="w-40 h-40 rounded border border-slate-150 dark:border-slate-800 object-contain bg-white dark:bg-slate-900" 
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 text-slate-450 text-xs font-semibold space-y-2">
                  <p className="text-2xl">🏦</p>
                  <p className="text-slate-500 font-bold">No bank ledger coordinates configured.</p>
                  <p className="text-[10px] text-slate-400 max-w-xs mx-auto font-normal">This client has not filled out or saved their bank or UPI details inside their dashboard yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Interactive Image Preview Modal */}
      {previewImage && (
        <div 
          id="proof-image-preview-modal-emp" 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
          onClick={() => setPreviewImage(null)}
        >
          <div 
            className="relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-slate-150 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/40">
              <span className="font-extrabold text-slate-800 dark:text-slate-100 text-[11px] uppercase tracking-wider">Client UPI QR / Proof Card Preview</span>
              <div className="flex gap-2">
                {previewImage !== 'NO_QR' && (
                  <a 
                    href={previewImage} 
                    download={`proof-${Date.now()}.png`}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[10px] uppercase rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" /> Download
                  </a>
                )}
                <button 
                  onClick={() => setPreviewImage(null)}
                  className="p-1 px-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl font-black text-slate-750 dark:text-slate-250 cursor-pointer text-[10px]"
                >
                  ✕ Close
                </button>
              </div>
            </div>
            {/* Image Box */}
            <div className="p-4 bg-slate-950 flex items-center justify-center max-h-[72vh] min-h-[250px] overflow-auto">
              {previewImage === 'NO_QR' ? (
                <div className="text-center p-12 text-slate-400 space-y-3">
                  <span className="text-3xl">⚠️</span>
                  <p className="font-black text-sm text-rose-500">No UPI QR Code Found!</p>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    This client has not uploaded their UPI QR scanner image in the "Bank Update" section. Please ask them to upload it.
                  </p>
                </div>
              ) : (
                <img 
                  src={previewImage} 
                  alt="Client Bank QR Code" 
                  className="max-w-full max-h-[66vh] object-contain rounded-lg shadow-md border border-slate-700" 
                />
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
