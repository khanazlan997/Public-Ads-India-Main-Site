import { supabase } from './supabase';

const getTableName = (col: string) => {
  if (col === 'advertiserInquiries') return 'advertiser_inquiries';
  if (col === 'activity_logs') return 'activity_logs';
  if (col === 'bank_details') return 'bank_details';
  if (col === 'payment_emails') return 'payment_emails';
  return col;
};

export async function sbSetDoc(collectionName: string, id: string, data: any) {
  const table = getTableName(collectionName);
  const { error } = await supabase.from(table).upsert({ id, ...data });
  if (error) console.warn(`Supabase upsert error (${table}):`, error.message);
}

export async function sbUpdateDoc(collectionName: string, id: string, data: any) {
  const table = getTableName(collectionName);
  const { error } = await supabase.from(table).update(data).eq('id', id);
  if (error) console.warn(`Supabase update error (${table}):`, error.message);
}

export async function sbDeleteDoc(collectionName: string, id: string) {
  const table = getTableName(collectionName);
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) console.warn(`Supabase delete error (${table}):`, error.message);
}

export async function sbGetDocs(collectionName: string) {
  const table = getTableName(collectionName);
  const { data, error } = await supabase.from(table).select('*');
  if (error) {
    console.warn(`Supabase getDocs error (${table}):`, error.message);
    return [];
  }
  return data || [];
}

export async function sbGetDoc(collectionName: string, id: string) {
  const table = getTableName(collectionName);
  const { data, error } = await supabase.from(table).select('*').eq('id', id).single();
  if (error) return null;
  return data;
}

export function sbOnSnapshot(collectionName: string, callback: (docs: any[]) => void) {
  const table = getTableName(collectionName);
  
  sbGetDocs(collectionName).then(callback);

  const channel = supabase
    .channel(`public:${table}`)
    .on('postgres_changes', { event: '*', schema: 'public', table }, () => {
      sbGetDocs(collectionName).then(callback);
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
