import { useState } from 'react';
import { MountainTrip } from '../types';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  ToggleLeft,
  ToggleRight,
  MapPin,
  Flame,
  Check,
  RotateCcw
} from 'lucide-react';
import { INITIAL_MOUNTAINS } from '../data/initialMountains';

interface MountainManagerModalProps {
  mountains: MountainTrip[];
  onSaveMountains: (updated: MountainTrip[]) => void;
  onClose: () => void;
}

export function MountainManagerModal({
  mountains,
  onSaveMountains,
  onClose,
}: MountainManagerModalProps) {
  const [list, setList] = useState<MountainTrip[]>(mountains);
  const [editingId, setEditingId] = useState<string | null>(null);

  // New mountain form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<MountainTrip>>({
    name: '',
    elevation: 3000,
    route: '',
    date: '',
    duration: '2 Hari 1 Malam',
    price: 550000,
    normalPrice: 700000,
    slotsAvailable: 6,
    totalSlots: 12,
    isReady: true,
    level: 'Pemula',
    imageUrl:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    basecampLocation: '',
    tags: ['Sunrise Camp', 'Ramah Pemula'],
    includes: [
      'Simaksi & Asuransi Pendakian',
      'Tenda Dome kelompok (isi 3)',
      'Makan 3x selama di gunung',
      'Guide & Porter Tim',
      'Peralatan Masak & Makan',
      'P3K Standar & Dokumentasi',
    ],
    excludes: [
      'Transportasi ke basecamp',
      'Sleeping bag & perlengkapan pribadi',
      'Jajan pribadi',
    ],
  });

  const handleToggleReady = (id: string) => {
    const updated = list.map(m => (m.id === id ? { ...m, isReady: !m.isReady } : m));
    setList(updated);
    onSaveMountains(updated);
  };

  const handleDelete = (id: string) => {
    if (list.length <= 1) {
      alert('Minimal harus ada 1 data gunung!');
      return;
    }
    const updated = list.filter(m => m.id !== id);
    setList(updated);
    onSaveMountains(updated);
  };

  const handleResetDefault = () => {
    if (confirm('Kembalikan semua daftar gunung ke data awal bawaan?')) {
      setList(INITIAL_MOUNTAINS);
      onSaveMountains(INITIAL_MOUNTAINS);
    }
  };

  const handleCreateNew = () => {
    if (!formData.name?.trim()) {
      alert('Nama gunung harus diisi!');
      return;
    }

    const newTrip: MountainTrip = {
      id: 'trip_' + Date.now(),
      name: formData.name || 'Gunung Baru',
      elevation: Number(formData.elevation) || 3000,
      route: formData.route || 'Via Basecamp Utama',
      date: formData.date || 'TBA 2026',
      duration: formData.duration || '2 Hari 1 Malam',
      price: Number(formData.price) || 500000,
      normalPrice: Number(formData.normalPrice) || 650000,
      slotsAvailable: Number(formData.slotsAvailable) || 5,
      totalSlots: Number(formData.totalSlots) || 12,
      isReady: formData.isReady ?? true,
      level: (formData.level as any) || 'Pemula',
      imageUrl:
        formData.imageUrl ||
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
      basecampLocation: formData.basecampLocation || 'Basecamp Pendakian',
      tags: formData.tags || ['Open Trip Seru'],
      includes: formData.includes || ['Tenda & Simaksi'],
      excludes: formData.excludes || ['Perlengkapan pribadi'],
    };

    const updated = [...list, newTrip];
    setList(updated);
    onSaveMountains(updated);
    setShowAddForm(false);
    setFormData({
      name: '',
      elevation: 3000,
      route: '',
      date: '',
      duration: '2 Hari 1 Malam',
      price: 550000,
      normalPrice: 700000,
      slotsAvailable: 6,
      totalSlots: 12,
      isReady: true,
      level: 'Pemula',
      imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
      basecampLocation: '',
      tags: ['Sunrise Camp'],
      includes: ['Tenda Dome', 'Simaksi', 'Makan'],
      excludes: ['Perlengkapan pribadi'],
    });
  };

  return (
    <div
      id="mountain-manager-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        id="mountain-manager-dialog"
        className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-3xl p-5 md:p-7 text-white shadow-2xl flex flex-col max-h-[90vh] my-auto"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              Kelola Daftar Gunung & Open Trip
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Atur gunung yang berstatus "Ready" untuk tampil di tombol cepat siaran
            </p>
          </div>
          <button
            onClick={onClose}
            id="btn-close-mountain-manager"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between py-3 border-b border-slate-800">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            id="btn-toggle-add-mountain-form"
            className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? 'Tutup Form Tambah' : 'Tambah Gunung Baru'}</span>
          </button>

          <button
            onClick={handleResetDefault}
            id="btn-reset-mountains-default"
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Data Default</span>
          </button>
        </div>

        {/* Form Tambah Gunung Baru */}
        {showAddForm && (
          <div className="p-4 bg-slate-800/80 rounded-2xl border border-amber-400/40 my-3 space-y-3">
            <h3 className="text-sm font-extrabold text-amber-400 uppercase">
              Form Tambah Open Trip Gunung
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Nama Gunung:</label>
                <input
                  type="text"
                  placeholder="Misal: Gunung Slamet"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Ketinggian (MDPL):</label>
                <input
                  type="number"
                  placeholder="3428"
                  value={formData.elevation}
                  onChange={e => setFormData({ ...formData, elevation: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Jalur / Rute:</label>
                <input
                  type="text"
                  placeholder="Via Bambangan"
                  value={formData.route}
                  onChange={e => setFormData({ ...formData, route: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Jadwal Tanggal:</label>
                <input
                  type="text"
                  placeholder="15 - 17 Nov 2026"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Harga Promo (Rp):</label>
                <input
                  type="number"
                  placeholder="650000"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Harga Normal (Rp):</label>
                <input
                  type="number"
                  placeholder="850000"
                  value={formData.normalPrice}
                  onChange={e => setFormData({ ...formData, normalPrice: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Sisa Slot:</label>
                <input
                  type="number"
                  value={formData.slotsAvailable}
                  onChange={e => setFormData({ ...formData, slotsAvailable: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Total Kuota Slot:</label>
                <input
                  type="number"
                  value={formData.totalSlots}
                  onChange={e => setFormData({ ...formData, totalSlots: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Tingkat Kesulitan:</label>
                <select
                  value={formData.level}
                  onChange={e => setFormData({ ...formData, level: e.target.value as any })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="Pemula">Pemula</option>
                  <option value="Sedang">Sedang</option>
                  <option value="Tantangan">Tantangan</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleCreateNew}
              id="btn-submit-new-mountain"
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow transition"
            >
              Simpan & Masukkan ke Database Siaran
            </button>
          </div>
        )}

        {/* Daftar List Gunung */}
        <div className="flex-1 overflow-y-auto space-y-2.5 py-3 pr-1">
          {list.map(mountain => (
            <div
              key={mountain.id}
              className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition ${
                mountain.isReady
                  ? 'bg-slate-800/80 border-slate-700'
                  : 'bg-slate-900/50 border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={mountain.imageUrl}
                  alt={mountain.name}
                  className="w-12 h-12 rounded-xl object-cover border border-white/10 flex-shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-sm text-white truncate">
                      {mountain.name}
                    </h4>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 font-bold">
                      {mountain.elevation} MDPL
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {mountain.route} • {mountain.date}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] mt-1">
                    <span className="text-amber-400 font-bold">
                      Rp {mountain.price.toLocaleString('id-ID')}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-300">
                      Sisa: <strong className="text-red-400">{mountain.slotsAvailable}</strong>/{mountain.totalSlots} Slot
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Status Toggle Ready / Off */}
                <button
                  onClick={() => handleToggleReady(mountain.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition ${
                    mountain.isReady
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                  title="Klik untuk mengubah status Ready untuk siaran"
                >
                  {mountain.isReady ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Ready</span>
                    </>
                  ) : (
                    <span>Off (Arsip)</span>
                  )}
                </button>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(mountain.id)}
                  className="p-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 transition"
                  title="Hapus gunung ini"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow transition"
          >
            Selesai & Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
