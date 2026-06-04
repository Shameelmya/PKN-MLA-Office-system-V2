import { Task, User } from '../../types';
import { formatDate, formatTime, formatMalayalamDate } from '../../utils/formatters';

// 1. Print Acknowledge Slip
interface PrintAcknowledgeSlipProps {
  task: Task;
}

export function PrintAcknowledgeSlip({ task }: PrintAcknowledgeSlipProps) {
  return (
    <div 
      className="w-full bg-white text-black font-sans relative" 
      style={{ 
        backgroundImage: "url('/letterpad.jpg')", 
        backgroundSize: '100% 100%', 
        backgroundRepeat: 'no-repeat', 
        minHeight: '1123px', 
        width: '794px', 
        boxSizing: 'border-box', 
        paddingTop: '230px', 
        paddingBottom: '50px', 
        paddingLeft: '100px', 
        paddingRight: '100px', 
        margin: '0 auto' 
      }}
    >
      <div className="relative z-10 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-8 text-sm font-medium">
          <div>
            <p className="font-bold text-black mb-1">To,</p>
            <p className="text-black">{task.personalDetails.name}</p>
            {task.personalDetails.houseName && <p>{task.personalDetails.houseName}</p>}
            <p>{[task.personalDetails.place, task.personalDetails.localBody].filter(Boolean).join(', ')}</p>
            {!task.isSelfMode && <p>Phone: {task.personalDetails.mobileNumber}</p>}
          </div>
          <div className="text-right">
            <p style={{ fontFamily: "'Noto Serif Malayalam', serif" }}><span className="font-bold text-gray-600">തിയ്യതി:</span> {formatMalayalamDate(task.createdAt)}</p>
            <p><span className="font-bold text-gray-600">Ref ID:</span> <span className="font-black">{task.id}</span></p>
          </div>
        </div>
        <div className="mb-8 text-base font-semibold" style={{ fontFamily: "'Noto Serif Malayalam', serif" }}>
          <span className="font-bold text-black mr-2">വിഷയം:</span> {task.subject}
        </div>
        <div className="mb-12 text-[15px] leading-loose text-black font-medium text-justify" style={{ fontFamily: "'Noto Serif Malayalam', serif" }}>
           ബഹു. {task.personalDetails.name.toUpperCase()}, <br/><br/>
           {formatMalayalamDate(task.createdAt)} തിയ്യതിയിൽ മേൽപ്പറഞ്ഞ വിഷയത്തിൽ താങ്കൾ നൽകിയ അപേക്ഷ / പരാതി സ്വീകരിച്ച് ഔദ്യോഗികമായി രേഖപ്പെടുത്തിയിട്ടുണ്ട്. <br/><br/>
           എം.എൽ.എ ഓഫീസുമായി ബന്ധപ്പെട്ടതിന് നന്ദി.
        </div>
        <div className="mt-12 text-right">
          <p className="font-medium text-black mb-2" style={{ fontFamily: "'Noto Serif Malayalam', serif" }}>സ്നേഹത്തോടെ,</p>
          <div className="mt-8 text-right">
            <p className="font-bold text-black uppercase text-sm" style={{ fontFamily: "'Noto Serif Malayalam', serif" }}>എം.എൽ.എ ഓഫീസ്</p>
            <p className="text-xs text-gray-600">Phone: 9037032002</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. Print Completion Letter
interface PrintCompletionLetterProps {
  task: Task;
}

export function PrintCompletionLetter({ task }: PrintCompletionLetterProps) {
  const livesign = "/sign.png";
  const isVerified = task.isSignedByMLA;
  return (
    <div 
      className="w-full bg-white text-black font-sans relative flex flex-col overflow-hidden z-0" 
      style={{ 
        backgroundImage: "url('/letterpad.jpg')", 
        backgroundSize: '100% 100%', 
        backgroundRepeat: 'no-repeat', 
        minHeight: '1123px', 
        width: '794px', 
        boxSizing: 'border-box', 
        paddingTop: '230px', 
        paddingBottom: '50px', 
        paddingLeft: '100px', 
        paddingRight: '100px', 
        margin: '0 auto' 
      }}
    >
      {!isVerified && (
        <div className="absolute inset-0 z-[0] flex items-center justify-center pointer-events-none opacity-20">
          <div className="transform -rotate-45 text-red-500 font-black tracking-widest border-8 border-red-500 p-8 rounded-3xl" style={{ fontSize: '100px' }}>
            NOT VERIFIED
          </div>
        </div>
      )}
      <div className="relative z-10 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-8 text-sm font-medium">
          <div>
            <p className="font-bold text-black mb-1">To,</p>
            <p className="text-black">{task.personalDetails.name}</p>
            {task.personalDetails.houseName && <p>{task.personalDetails.houseName}</p>}
            <p>{[task.personalDetails.place, task.personalDetails.localBody].filter(Boolean).join(', ')}</p>
            {!task.isSelfMode && <p>Phone: {task.personalDetails.mobileNumber}</p>}
          </div>
          <div className="text-right">
            <p style={{ fontFamily: "'Noto Serif Malayalam', serif" }}><span className="font-bold text-gray-600">തിയ്യതി:</span> {formatMalayalamDate(new Date().toISOString())}</p>
            <p><span className="font-bold text-gray-600">Ref ID:</span> <span className="font-black">{task.id}</span></p>
          </div>
        </div>
        <div className="mb-8 text-base font-semibold" style={{ fontFamily: "'Noto Serif Malayalam', serif" }}>
          <span className="font-bold text-black mr-2">വിഷയം:</span> {task.subject}
        </div>
        <div className="mb-12 text-[15px] leading-loose text-black font-medium text-justify" style={{ fontFamily: "'Noto Serif Malayalam', serif" }}>
           ബഹു. {task.personalDetails.name.toUpperCase()}, <br/><br/>
           {formatMalayalamDate(task.createdAt)} തിയ്യതിയിൽ മേൽ വിഷയവുമായി ബന്ധപ്പെട്ട് നിങ്ങൾ നൽകിയ അപേക്ഷ/പരാതി വിജയകരമായി പരിഹരിച്ച വിവരം സന്തോഷപൂർവം പങ്കുവെക്കുന്നു. <br/><br/>
           കൂടുതൽ വിവരങ്ങൾക്കോ സഹായങ്ങൾക്കോ എപ്പോൾ വേണമെങ്കിലും ഞങ്ങളെ ബന്ധപ്പെടാവുന്നതാണ്.
        </div>
        <div className="mt-8 text-right">
          <p className="font-medium text-black mb-2" style={{ fontFamily: "'Noto Serif Malayalam', serif" }}>സ്നേഹത്തോടെ,</p>
          {isVerified ? (
            <div className="my-4 flex flex-col items-end">
              <img 
                src={livesign} 
                alt="MLA Signature" 
                className="h-16 mb-2" 
                onError={(e) => { 
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none'; 
                  if (target.nextSibling) {
                    (target.nextSibling as HTMLElement).style.display = 'block'; 
                  }
                }} 
              />
              <div 
                className="hidden font-[cursive] text-3xl text-blue-900 mb-2 italic" 
                style={{ fontFamily: "'Brush Script MT', cursive" }}
              >
                P.K Navas
              </div>
            </div>
          ) : (
            <div className="my-4 h-16 flex justify-end items-end">
              <span className="text-gray-400 italic text-sm">(Draft Copy - Signature Pending)</span>
            </div>
          )}
          <div className="mt-4 border-t border-slate-100 pt-2 inline-block text-right">
            <p className="font-bold text-black text-sm" style={{ fontFamily: "'Noto Serif Malayalam', serif" }}>പി.കെ നവാസ്</p>
            <p className="text-xs text-gray-600 mb-1">Member of Legislative Assembly (MLA)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. Print Task Details Report
interface PrintTaskDetailsReportProps {
  task: Task;
  users: User[];
}

export function PrintTaskDetailsReport({ task, users }: PrintTaskDetailsReportProps) {
  return (
    <div className="w-full bg-white text-black font-sans p-10 box-border text-[12px]">
      <div className="text-center border-b-2 border-black pb-4 mb-6">
        <h1 className="text-2xl font-bold uppercase tracking-widest mb-1 text-black">PK Navas MLA Office</h1>
        <h2 className="text-lg font-semibold text-gray-700 uppercase tracking-widest">Detailed Task Report</h2>
      </div>
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-300">
        <div className="w-1/2">
          <p className="text-[10px] font-bold text-gray-500 uppercase">Task ID</p>
          <p className="text-xl font-bold text-black">{task.id}</p>
        </div>
        <div className="w-1/2 text-right">
          <p className="text-[10px] font-bold text-gray-500 uppercase">Current Status</p>
          <p className="text-lg font-bold uppercase text-black">{task.status}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-sm font-bold uppercase text-black border-b border-gray-400 pb-1 mb-2">
            {task.isSelfMode ? 'Application Info' : 'Citizen Info'}
          </h3>
          <p className="mb-1"><strong>Name:</strong> {task.personalDetails.name} {task.personalDetails.gender && `(${task.personalDetails.gender})`}</p>
          {!task.isSelfMode && <p className="mb-1"><strong>Mobile:</strong> {task.personalDetails.mobileNumber}</p>}
          {task.personalDetails.whatsappNumber && !task.isSelfMode && <p className="mb-1"><strong>WhatsApp:</strong> {task.personalDetails.whatsappNumber}</p>}
          <p className="mb-1"><strong>Address:</strong> {[task.personalDetails.houseName, task.personalDetails.place, task.personalDetails.postOffice, task.personalDetails.localBody].filter(Boolean).join(', ')}</p>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase text-black border-b border-gray-400 pb-1 mb-2">Task Meta</h3>
          <p className="mb-1"><strong>Category:</strong> {task.category}</p>
          <p className="mb-1"><strong>Type:</strong> {task.types.join(', ')}</p>
          <p className="mb-1"><strong>Created:</strong> {formatDate(task.createdAt)} {formatTime(task.createdAt)}</p>
          <p className="mb-1"><strong>Assigned To:</strong> {task.assignedTo.map(id => users.find(u => u.id === id)?.name || id).join(', ')}</p>
        </div>
      </div>
      <div className="mb-6 break-inside-avoid">
        <h3 className="text-sm font-bold uppercase text-black border-b border-gray-400 pb-1 mb-2">Subject & Details</h3>
        <p className="font-bold text-base mb-2 text-black">{task.subject}</p>
        {task.description && <p className="text-gray-800 whitespace-pre-wrap">{task.description}</p>}
        {task.attachment && <p className="text-gray-700 font-bold mt-2 italic">Note: Document attached in system ({task.attachment.name})</p>}
        {task.attachments && task.attachments.length > 0 && <p className="text-gray-700 font-bold mt-2 italic">Note: {task.attachments.length} Document(s) attached in system.</p>}
      </div>
      <div className="break-inside-avoid">
        <h3 className="text-sm font-bold uppercase text-black border-b border-gray-400 pb-1 mb-2">Timeline & Updates</h3>
        <div className="space-y-2 mt-3">
          {task.timeline.map((item, idx) => (
            <div key={idx} className="flex gap-4 pb-2 border-b border-gray-100 last:border-0">
              <div className="w-32 shrink-0 text-[10px] font-bold text-gray-600">
                {formatDate(item.time)}<br/>{formatTime(item.time)}
              </div>
              <div className="text-gray-800">
                <span className="font-bold text-black">{item.by}:</span> {item.text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 4. Print Master Report
export interface ReportConfig {
  range: string;
  customStart?: string;
  customEnd?: string;
  officer?: User;
}

interface PrintMasterReportProps {
  config: ReportConfig;
  tasks: Task[];
  users: User[];
  categories: string[];
}

export function PrintMasterReport({ config, tasks, users, categories }: PrintMasterReportProps) {
  let filteredTasks = tasks.filter(t => t.taskType !== 'direct');
  const now = new Date();
  if (config.range === '1week') {
    const start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    filteredTasks = filteredTasks.filter(t => new Date(t.createdAt) >= start);
  } else if (config.range === '1month') {
    const start = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    filteredTasks = filteredTasks.filter(t => new Date(t.createdAt) >= start);
  } else if (config.range === '6months') {
    const start = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
    filteredTasks = filteredTasks.filter(t => new Date(t.createdAt) >= start);
  } else if (config.range === 'custom' && config.customStart && config.customEnd) {
    const start = new Date(config.customStart);
    const end = new Date(config.customEnd);
    end.setHours(23, 59, 59, 999);
    filteredTasks = filteredTasks.filter(t => new Date(t.createdAt) >= start && new Date(t.createdAt) <= end);
  }

  const total = filteredTasks.length;
  const comp = filteredTasks.filter(t => t.status === 'Completed').length;
  const pend = filteredTasks.filter(t => t.status === 'Pending').length;
  const inprog = filteredTasks.filter(t => t.status === 'In Progress').length;
  const draft = filteredTasks.filter(t => t.status === 'Draft').length;
  const unsolv = filteredTasks.filter(t => t.status === 'Unsolved').length;
  const sortedCategories = [...categories].sort((a, b) => a.localeCompare(b));

  return (
    <div className="w-full bg-white text-black font-sans p-10 box-border text-[12px]">
      <div className="text-center border-b-2 border-black pb-4 mb-6">
        <h1 className="text-2xl font-bold uppercase tracking-widest mb-1 text-black">PK Navas MLA Office</h1>
        <h2 className="text-xl font-bold text-gray-800 uppercase tracking-widest">Master Performance Report</h2>
        <p className="mt-2 text-sm text-gray-600 font-bold">
          Period: {config.range === 'all' ? 'All Time' : config.range === '1week' ? 'Last 7 Days' : config.range === '1month' ? 'Last 30 Days' : config.range === '6months' ? 'Last 6 Months' : `${formatDate(config.customStart)} to ${formatDate(config.customEnd)}`}
        </p>
      </div>
      <div className="grid grid-cols-6 gap-2 mb-8 text-center border-b border-gray-300 pb-6">
        <div>
          <p className="text-[10px] font-bold uppercase text-gray-600 mb-1">Total</p>
          <p className="text-2xl font-bold text-black">{total}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase text-gray-600 mb-1">Completed</p>
          <p className="text-2xl font-bold text-black">{comp}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase text-gray-600 mb-1">Drafts</p>
          <p className="text-2xl font-bold text-black">{draft}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase text-gray-600 mb-1">In Progress</p>
          <p className="text-2xl font-bold text-black">{inprog}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase text-gray-600 mb-1">Pending</p>
          <p className="text-2xl font-bold text-black">{pend}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase text-gray-600 mb-1">Unsolved</p>
          <p className="text-2xl font-bold text-black">{unsolv}</p>
        </div>
      </div>
      <h3 className="text-sm font-bold uppercase text-black border-b border-gray-400 pb-1 mb-3">Category Breakdown</h3>
      <table className="w-full border-collapse mb-8">
        <thead>
          <tr className="border-b-2 border-black">
            <th className="py-2 text-left font-bold text-black">Category</th>
            <th className="py-2 text-center font-bold text-black">Total</th>
            <th className="py-2 text-center font-bold text-black">Completed</th>
            <th className="py-2 text-center font-bold text-black">Pending</th>
          </tr>
        </thead>
        <tbody>
          {sortedCategories.map(cat => {
            const catTasks = filteredTasks.filter(t => t.category === cat);
            if (catTasks.length === 0) return null;
            return (
              <tr key={cat} className="break-inside-avoid border-b border-gray-350">
                <td className="py-2 text-black text-left">{cat}</td>
                <td className="py-2 text-center text-black">{catTasks.length}</td>
                <td className="py-2 text-center text-black">{catTasks.filter(t => t.status === 'Completed').length}</td>
                <td className="py-2 text-center text-black">{catTasks.filter(t => t.status === 'Pending').length}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <h3 className="text-sm font-bold uppercase text-black border-b border-gray-400 pb-1 mb-3 break-inside-avoid">Officer Workload</h3>
      <table className="w-full border-collapse break-inside-avoid">
        <thead>
          <tr className="border-b-2 border-black">
            <th className="py-2 text-left font-bold text-black">Officer Name</th>
            <th className="py-2 text-center font-bold text-black">Assigned</th>
            <th className="py-2 text-center font-bold text-black">Completed By Them</th>
          </tr>
        </thead>
        <tbody>
          {users
            .filter(u => u.role !== 'admin')
            .map(u => {
              const assigned = filteredTasks.filter(t => t.assignedTo.includes(u.id));
              const done = assigned.filter(t => t.officerStatuses && t.officerStatuses[u.id] === 'Completed');
              return (
                <tr key={u.id} className="border-b border-gray-300">
                  <td className="py-2 text-black text-left">{u.name}</td>
                  <td className="py-2 text-center text-black">{assigned.length}</td>
                  <td className="py-2 text-center text-black">{done.length}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

// 5. Print Officer Report
interface PrintOfficerReportProps {
  config: ReportConfig;
  tasks: Task[];
}

export function PrintOfficerReport({ config, tasks }: PrintOfficerReportProps) {
  const officer = config.officer as User;
  let filteredTasks = tasks.filter(t => t.assignedTo.includes(officer.id));
  const now = new Date();
  if (config.range === '1week') {
    const start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    filteredTasks = filteredTasks.filter(t => new Date(t.createdAt) >= start);
  } else if (config.range === '1month') {
    const start = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    filteredTasks = filteredTasks.filter(t => new Date(t.createdAt) >= start);
  } else if (config.range === '6months') {
    const start = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
    filteredTasks = filteredTasks.filter(t => new Date(t.createdAt) >= start);
  } else if (config.range === 'custom' && config.customStart && config.customEnd) {
    const start = new Date(config.customStart);
    const end = new Date(config.customEnd);
    end.setHours(23, 59, 59, 999);
    filteredTasks = filteredTasks.filter(t => new Date(t.createdAt) >= start && new Date(t.createdAt) <= end);
  }

  const total = filteredTasks.length;
  const comp = filteredTasks.filter(t => t.officerStatuses[officer.id] === 'Completed').length;
  const inprog = filteredTasks.filter(
    t => t.officerStatuses[officer.id] === 'In Progress' || t.officerStatuses[officer.id] === 'Received'
  ).length;
  const pend = total - comp - inprog;

  return (
    <div className="w-full bg-white text-black font-sans p-10 box-border text-[12px]">
      <div className="text-center border-b-2 border-black pb-4 mb-6">
        <h1 className="text-2xl font-bold uppercase tracking-widest mb-1 text-black">PK Navas MLA Office</h1>
        <h2 className="text-lg font-semibold text-gray-700 uppercase tracking-widest">Officer Performance Report</h2>
        <h3 className="text-xl font-bold mt-1 text-black">{officer.name}</h3>
        <p className="mt-1 text-sm text-gray-600 font-bold">
          Period: {config.range === 'all' ? 'All Time' : config.range === '1week' ? 'Last 7 Days' : config.range === '1month' ? 'Last 30 Days' : config.range === '6months' ? 'Last 6 Months' : `${formatDate(config.customStart)} to ${formatDate(config.customEnd)}`}
        </p>
      </div>
      <div className="grid grid-cols-4 gap-2 mb-8 text-center border-b border-gray-300 pb-6">
        <div>
          <p className="text-[10px] font-bold uppercase text-gray-600 mb-1">Assigned</p>
          <p className="text-2xl font-bold text-black">{total}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase text-gray-600 mb-1">Completed</p>
          <p className="text-2xl font-bold text-black">{comp}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase text-gray-600 mb-1">In Progress</p>
          <p className="text-2xl font-bold text-black">{inprog}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase text-gray-600 mb-1">Pending</p>
          <p className="text-2xl font-bold text-black">{pend}</p>
        </div>
      </div>
      <h3 className="text-sm font-bold uppercase text-black border-b border-gray-400 pb-1 mb-3">Detailed Task List</h3>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-black">
            <th className="py-2 text-left font-bold text-black">Ref ID & Date</th>
            <th className="py-2 text-left font-bold text-black">Subject & Citizen</th>
            <th className="py-2 text-center font-bold text-black">Category</th>
            <th className="py-2 text-center font-bold text-black">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map(t => (
            <tr key={t.id} className="break-inside-avoid border-b border-gray-300">
              <td className="py-2 align-top text-left">
                <span className="text-black font-bold block">{t.id}</span>
                <span className="text-gray-600 text-[10px] block mt-1">{formatDate(t.createdAt)}</span>
              </td>
              <td className="py-2 align-top text-left">
                <span className="text-black font-bold block mb-1">{t.subject}</span>
                <span className="text-gray-700">{t.personalDetails?.name}</span>
              </td>
              <td className="py-2 text-center align-top text-black">{t.category}</td>
              <td className="py-2 text-center align-top text-black">{t.officerStatuses[officer.id] || 'Pending'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// 6. Print Citizen Directory
interface PrintCitizenDirectoryProps {
  citizens: any[];
}

export function PrintCitizenDirectory({ citizens }: PrintCitizenDirectoryProps) {
  return (
    <div className="w-full bg-white text-black font-sans p-10 box-border text-[12px]">
      <div className="text-center border-b-2 border-black pb-4 mb-6">
        <h1 className="text-2xl font-bold uppercase tracking-widest mb-1 text-black">PK Navas MLA Office</h1>
        <h2 className="text-lg font-bold text-gray-700 uppercase tracking-widest">Citizen Directory & Visit Log</h2>
        <p className="mt-1 text-xs text-gray-600 font-bold">Generated: {new Date().toLocaleString('en-IN')}</p>
      </div>
      <table className="w-full border-collapse text-[11px]">
        <thead>
          <tr className="border-b-2 border-black text-black">
            <th className="py-2 text-left font-bold">Name & Designation</th>
            <th className="py-2 text-left font-bold">Contact</th>
            <th className="py-2 text-left font-bold">Location</th>
            <th className="py-2 text-center font-bold">Visits</th>
          </tr>
        </thead>
        <tbody>
          {citizens.map((c, i) => (
            <tr key={i} className="break-inside-avoid border-b border-gray-300">
              <td className="py-2 align-top text-left">
                <span className="block font-bold text-black">{c.name} {c.gender && `(${c.gender})`}</span>
                {c.designation && <span className="text-[9px] text-gray-600 uppercase block mt-1">{c.designation}</span>}
              </td>
              <td className="py-2 align-top text-left">
                <span className="block text-black">{c.mobileNumber}</span>
                {c.whatsappNumber && <span className="text-gray-600 text-[10px] block mt-1">WA: {c.whatsappNumber}</span>}
              </td>
              <td className="py-2 align-top text-left text-black">
                <span className="block mb-1">{c.place || '-'}, PO: {c.postOffice || '-'}, PIN: {c.pinCode || '-'}, {c.localBody || c.panchayat || '-'}</span>
                <span className="text-[10px] text-gray-600">{c.houseName}</span>
              </td>
              <td className="py-2 text-center align-top font-bold text-black">
                <span className="bg-slate-100 px-2 py-0.5 rounded">{c.visits}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
