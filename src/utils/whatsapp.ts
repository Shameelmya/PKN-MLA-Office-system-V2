import { Task } from '../types';
import { formatWhatsAppNumber } from './formatters';

export const sendWhatsAppUpdate = (task: Task, updateText: string, updateLink?: string): void => {
  if (task.isSelfMode) return;
  const num = task.personalDetails?.whatsappNumber || task.personalDetails?.mobileNumber;
  const waNum = formatWhatsAppNumber(num);
  if (!waNum) {
    alert('No valid mobile number found for this citizen.');
    return;
  }
  let msg = `പ്രിയപ്പെട്ട ${task.personalDetails.name},\n\nRef: ${task.id}\nSubject : "${task.subject}" \nഎന്ന വിഷയവുമായി ബന്ധപ്പെട്ട പി.കെ നവാസ് എം എൽ എയുടെ ഓഫീസിൽ നിങ്ങൾ നൽകിയ അപേക്ഷയുടെ എറ്റവും പുതിയ അപ്ഡേറ്റ് ഇതാണ് :\n${updateText}`;
  if (updateLink) msg += `\n\nരേഖ: ${updateLink}`;
  msg += `\n\nസ്നേഹത്തോടെ,\nഎം.എൽ.എ ഓഫീസ്, താനൂർ.\nഫോൺ: 9037032002`;
  window.open(`https://wa.me/${waNum}?text=${encodeURIComponent(msg)}`, '_blank');
};
