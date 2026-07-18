type Option = { value: string; label: string };
type Props = { label: string; value: string; placeholder: string; options: Option[]; onChange: (value: string) => void; onAdd: () => void };

export function SelectField({ label, value, placeholder, options, onChange, onAdd }: Props) {
  return <label className="block text-sm font-semibold text-slate-700">{label}
    <div className="mt-1.5 flex gap-2"><div className="relative min-w-0 flex-1"><select required value={value} onChange={(event) => onChange(event.target.value)} className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-3 py-3 pr-9 text-sm text-slate-800 shadow-sm outline-none transition hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"><option value="">{placeholder}</option>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select><span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500">⌄</span></div><button type="button" onClick={onAdd} className="rounded-xl bg-slate-100 px-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200" aria-label={`Add ${label.toLowerCase()}`}>+</button></div>
  </label>;
}
