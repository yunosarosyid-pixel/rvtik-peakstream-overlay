import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Plus, Trash2, Mountain, Save, Compass } from 'lucide-react';
import { TripPackage } from '../types';

interface TripEditorModalProps {
  isOpen: boolean;
  trips: TripPackage[];
  onSaveTrips: (trips: TripPackage[]) => void;
  onClose: () => void;
}

export const TripEditorModal: React.FC<TripEditorModalProps> = ({
  isOpen,
  trips,
  onSaveTrips,
  onClose,
}) => {
  const [editingTrip, setEditingTrip] = useState<TripPackage | null>(
    trips[0] || null
  );

  const [formState, setFormState] = useState<TripPackage>(
    trips[0] || {
      id: `trip-${Date.now()}`,
      mountainName: 'Gunung Baru',
      subtitle: 'Petualangan Mengagumkan',
      route: 'Jalur Pendakian',
      elevationMdpl: 3000,
      tripDates: '1 - 3 Bulan Depan',
      duration: '3D2N',
      meetingPoint: 'Basecamp Pendakian',
      originalPrice: 850000,
      promoPrice: 700000,
      availableSlots: 5,
      totalSlots: 15,
      isReady: true,
      imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      badgeTag: 'READY',
      highlights: ['Sunrise spektakuler', 'Pemandangan alam terbuka'],
      includes: ['Tenda dome kapasitas 4', 'Makan 3x', 'Porter tim', 'Simaksi'],
      excludes: ['Transportasi ke MP', 'Perlengkapan pribadi', 'Sleeping bag'],
    }
  );

  const handleSelectTripToEdit = (t: TripPackage) => {
    setEditingTrip(t);
    setFormState({ ...t });
  };

  const handleAddNewTrip = () => {
    const newId = `trip-${Date.now()}`;
    const newTrip: TripPackage = {
      id: newId,
      mountainName: 'Gunung Sindoro',
      subtitle: 'Lautan Awan & Kawah Eksotis',
      route: 'Jalur Kledung',
      elevationMdpl: 3153,
      tripDates: '17 - 19 Oktober 2026',
      duration: '3D2N',
      meetingPoint: 'Basecamp Kledung, Temanggung',
      originalPrice: 800000,
      promoPrice: 650000,
      availableSlots: 6,
      totalSlots: 15,
      isReady: true,
      imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
      badgeTag: 'READY',
      highlights: ['Kawah aktif Sindoro', 'Golden Sunrise memukau', 'Sabana bunga edelweiss'],
      includes: ['Tenda dome kap 4', 'Makan selama pendakian', 'Porter logistik', 'Tiket simaksi'],
      excludes: ['Ojek pos 1', 'Sleeping bag pribadi', 'Jaket gunung'],
    };

    const updated = [...trips, newTrip];
    onSaveTrips(updated);
    setEditingTrip(newTrip);
    setFormState(newTrip);
  };

  const handleDeleteTrip = (id: string) => {
    if (trips.length <= 1) {
      alert('Minimal harus ada 1 jadwal trip dalam daftar.');
      return;
    }
    const updated = trips.filter((t) => t.id !== id);
    onSaveTrips(updated);
    setEditingTrip(updated[0]);
    setFormState(updated[0]);
  };

  const handleToggleReady = (id: string) => {
    const updated = trips.map((t) => (t.id === id ? { ...t, isReady: !t.isReady } : t));
    onSaveTrips(updated);
    if (editingTrip && editingTrip.id === id) {
      setFormState((prev) => ({ ...prev, isReady: !prev.isReady }));
    }
  };

  const handleSaveForm = () => {
    const updated = trips.map((t) => (t.id === formState.id ? formState : t));
    onSaveTrips(updated);
    alert(`Perubahan paket "${formState.mountainName}" berhasil disimpan!`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-sm overflow-y-auto select-none">
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-4xl bg-[#171614] border border-stone-800 rounded-2xl p-4 sm:p-5 text-[#f4efe6] shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-800">
          <div>
            <h2 className="text-base sm:text-lg font-bold font-['Outfit'] text-[#f4efe6] flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#7de39b]" />
              Kelola Jadwal & Paket Open Trip
            </h2>
            <p className="text-[11px] text-stone-400 mt-0.5">
              Atur status <b>READY</b> agar gunung muncul sebagai tombol instan di remote stream deck.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#24211d] hover:bg-stone-700 text-stone-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 py-3 overflow-y-auto flex-1 pr-1">
          {/* Left Column: Trip List */}
          <div className="md:col-span-4 space-y-2 border-r border-stone-800/80 pr-2">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider">
                Daftar Gunung ({trips.length})
              </span>
              <button
                onClick={handleAddNewTrip}
                className="text-[11px] bg-[#1e3324] hover:bg-[#284631] text-[#7de39b] border border-[#2d5236] font-mono font-bold px-2 py-0.5 rounded flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3 h-3" />
                Tambah
              </button>
            </div>

            <div className="space-y-1.5 max-h-[55vh] overflow-y-auto pr-1">
              {trips.map((t) => {
                const isSelected = editingTrip?.id === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => handleSelectTripToEdit(t)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-[#1b2b1e] border-[#448053] shadow'
                        : 'bg-[#1a1816] border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#f5ebd9] truncate font-['Outfit']">
                          {t.mountainName}
                        </span>
                        <span className="text-[9px] text-[#7de39b] font-mono">
                          {t.elevationMdpl}m
                        </span>
                      </div>
                      <span className="text-[10px] text-stone-400 font-mono block truncate">
                        Rp {t.promoPrice.toLocaleString('id-ID')} • Sisa {t.availableSlots} slot
                      </span>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        title={t.isReady ? 'Jadikan Non-Aktif' : 'Aktifkan Ready'}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleReady(t.id);
                        }}
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded transition-colors ${
                          t.isReady
                            ? 'bg-[#27462e] text-[#7de39b] border border-[#3e6f4a]'
                            : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
                        }`}
                      >
                        {t.isReady ? 'READY' : 'OFF'}
                      </button>
                      <button
                        title="Hapus"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTrip(t.id);
                        }}
                        className="p-1 text-stone-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Edit Form */}
          <div className="md:col-span-8 space-y-3">
            <div className="flex items-center justify-between bg-[#1f1d1a] p-2.5 rounded-xl border border-stone-800">
              <span className="text-xs font-bold text-[#f5ebd9] font-['Outfit']">
                Edit Data: {formState.mountainName}
              </span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formState.isReady}
                  onChange={(e) => setFormState({ ...formState, isReady: e.target.checked })}
                  className="w-3.5 h-3.5 accent-[#7de39b] rounded"
                />
                <span className="text-[11px] font-mono font-bold text-[#7de39b]">
                  {formState.isReady ? 'Status: READY (Tampil di Live)' : 'Status: OFF'}
                </span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] text-stone-400 font-mono block mb-1">
                  Nama Gunung
                </label>
                <input
                  type="text"
                  value={formState.mountainName}
                  onChange={(e) => setFormState({ ...formState, mountainName: e.target.value })}
                  className="w-full bg-[#12110f] border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-[#f5ebd9] focus:outline-none focus:border-[#7de39b]"
                />
              </div>

              <div>
                <label className="text-[10px] text-stone-400 font-mono block mb-1">
                  Ketinggian (MDPL)
                </label>
                <input
                  type="number"
                  value={formState.elevationMdpl}
                  onChange={(e) =>
                    setFormState({ ...formState, elevationMdpl: Number(e.target.value) })
                  }
                  className="w-full bg-[#12110f] border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-[#f5ebd9] font-mono focus:outline-none focus:border-[#7de39b]"
                />
              </div>

              <div className="col-span-2">
                <label className="text-[10px] text-stone-400 font-mono block mb-1">
                  Subtitle Menarik
                </label>
                <input
                  type="text"
                  value={formState.subtitle}
                  onChange={(e) => setFormState({ ...formState, subtitle: e.target.value })}
                  className="w-full bg-[#12110f] border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-[#f5ebd9] focus:outline-none focus:border-[#7de39b]"
                />
              </div>

              <div>
                <label className="text-[10px] text-stone-400 font-mono block mb-1">
                  Rute & Jalur Pendakian
                </label>
                <input
                  type="text"
                  value={formState.route}
                  onChange={(e) => setFormState({ ...formState, route: e.target.value })}
                  className="w-full bg-[#12110f] border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-[#f5ebd9] focus:outline-none focus:border-[#7de39b]"
                />
              </div>

              <div>
                <label className="text-[10px] text-stone-400 font-mono block mb-1">
                  Tanggal Trip
                </label>
                <input
                  type="text"
                  value={formState.tripDates}
                  onChange={(e) => setFormState({ ...formState, tripDates: e.target.value })}
                  className="w-full bg-[#12110f] border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-[#f5ebd9] focus:outline-none focus:border-[#7de39b]"
                />
              </div>

              <div>
                <label className="text-[10px] text-stone-400 font-mono block mb-1">
                  Harga Asli Coret (Rp)
                </label>
                <input
                  type="number"
                  value={formState.originalPrice}
                  onChange={(e) =>
                    setFormState({ ...formState, originalPrice: Number(e.target.value) })
                  }
                  className="w-full bg-[#12110f] border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-stone-400 font-mono focus:outline-none focus:border-[#7de39b]"
                />
              </div>

              <div>
                <label className="text-[10px] text-stone-400 font-mono block mb-1">
                  Harga Promo Live (Rp)
                </label>
                <input
                  type="number"
                  value={formState.promoPrice}
                  onChange={(e) =>
                    setFormState({ ...formState, promoPrice: Number(e.target.value) })
                  }
                  className="w-full bg-[#12110f] border border-[#3e6f4a] rounded-lg px-2.5 py-1.5 text-xs text-[#7de39b] font-mono font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-stone-400 font-mono block mb-1">
                  Sisa Kuota Slot
                </label>
                <input
                  type="number"
                  value={formState.availableSlots}
                  onChange={(e) =>
                    setFormState({ ...formState, availableSlots: Number(e.target.value) })
                  }
                  className="w-full bg-[#12110f] border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-[#f5ebd9] font-mono focus:outline-none focus:border-[#7de39b]"
                />
              </div>

              <div>
                <label className="text-[10px] text-stone-400 font-mono block mb-1">
                  Total Kapasitas Kuota
                </label>
                <input
                  type="number"
                  value={formState.totalSlots}
                  onChange={(e) =>
                    setFormState({ ...formState, totalSlots: Number(e.target.value) })
                  }
                  className="w-full bg-[#12110f] border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-[#f5ebd9] font-mono focus:outline-none focus:border-[#7de39b]"
                />
              </div>

              <div className="col-span-2">
                <label className="text-[10px] text-stone-400 font-mono block mb-1">
                  URL Foto Latar Belakang Gunung
                </label>
                <input
                  type="text"
                  value={formState.imageUrl}
                  onChange={(e) => setFormState({ ...formState, imageUrl: e.target.value })}
                  className="w-full bg-[#12110f] border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-stone-300 font-mono focus:outline-none focus:border-[#7de39b]"
                />
              </div>

              <div className="col-span-2">
                <label className="text-[10px] text-stone-400 font-mono block mb-1">
                  Fasilitas INCLUDE (Pisahkan dengan tanda koma)
                </label>
                <textarea
                  rows={2}
                  value={formState.includes.join(', ')}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      includes: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  className="w-full bg-[#12110f] border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-stone-300 focus:outline-none focus:border-[#7de39b]"
                />
              </div>

              <div className="col-span-2">
                <label className="text-[10px] text-stone-400 font-mono block mb-1">
                  Fasilitas EXCLUDE (Pisahkan dengan tanda koma)
                </label>
                <textarea
                  rows={2}
                  value={formState.excludes.join(', ')}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      excludes: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  className="w-full bg-[#12110f] border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-stone-300 focus:outline-none focus:border-[#7de39b]"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleSaveForm}
                className="bg-[#223d29] hover:bg-[#2b4c34] text-[#f4efe6] text-xs font-mono font-bold px-4 py-2 rounded-lg border border-[#3e6f4a] shadow flex items-center gap-1.5 transition-colors"
              >
                <Save className="w-3.5 h-3.5 text-[#7de39b]" />
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
