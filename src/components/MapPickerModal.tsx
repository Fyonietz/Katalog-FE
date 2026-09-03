// src/components/MapPickerModal.tsx
import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import { getAddressFromLatLng, createAlamat, updateAlamat, type AlamatGetResponse } from "../services/alamatService";
import { showModal } from "../lib/showModal";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface MapPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  editData?: AlamatGetResponse | null; // Data untuk Edit
  onSuccess: () => void;
}

const DEFAULT_CENTER: [number, number] = [-0.2246, 100.6319]; // Payakumbuh

function MapClickHandler({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
  useMapEvents({ click(e) { onSelect(e.latlng.lat, e.latlng.lng); } });
  return null;
}

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

// FIX BUG UI PETA: Memaksa peta menyesuaikan ukuran saat modal terbuka
function MapFixer() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 250);
  }, [map]);
  return null;
}

export default function MapPickerModal({ isOpen, onClose, userId, editData, onSuccess }: MapPickerModalProps) {
  const [position, setPosition] = useState<[number, number]>(DEFAULT_CENTER);

  const [alamatContent, setAlamatContent] = useState<string>("");
  const [noTelepon, setNoTelepon] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      if (editData) {
        // Mode Edit: Isi form dengan data lama
        setNoTelepon(editData.noTelepon || "");
        setAlamatContent(editData.content || "");
      } else {
        // Mode Tambah: Reset form & ambil lokasi default
        setNoTelepon("");
        handlePositionChange(DEFAULT_CENTER[0], DEFAULT_CENTER[1]);
      }
    }
  }, [isOpen, editData]);

  const handlePositionChange = async (lat: number, lng: number) => {
    setPosition([lat, lng]);
    setLoading(true);
    const text = await getAddressFromLatLng(lat, lng);
    setAlamatContent(text);
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!alamatContent.trim() || !noTelepon.trim()) {
      showModal("Harap lengkapi nomor telepon dan alamat!");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        IdUser: userId,
        noTelepon: noTelepon,
        content: alamatContent,
      };

      if (editData && editData.id) {
        // Panggil PATCH Update
        await updateAlamat(editData.id, payload);
        showModal("Alamat berhasil diperbarui!");
      } else {
        // Panggil POST Create
        await createAlamat(payload);
        showModal("Alamat berhasil ditambahkan!");
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Gagal simpan alamat:", err);
      showModal("Terjadi kesalahan saat menyimpan alamat.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <div>
            <h3 className="font-extrabold text-[#1B2A6B] text-base">
              {editData ? "Edit Lokasi Alamat" : "Pilih Lokasi Alamat"}
            </h3>
            <p className="text-xs text-gray-500">Geser & klik peta untuk pinpoint lokasi akurat.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold text-sm">✕</button>
        </div>

        {/* Leaflet Map Area */}
        <div className="relative h-64 w-full bg-gray-100 shrink-0 z-0">
          <MapContainer center={position} zoom={15} style={{ height: "100%", width: "100%", zIndex: 10 }}>
            <TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ChangeView center={position} />
            <Marker position={position} />
            <MapClickHandler onSelect={handlePositionChange} />
            <MapFixer /> {/* <- Menjalankan fix invalidateSize() */}
          </MapContainer>
        </div>

        {/* Form Area */}
        <div className="p-4 space-y-4 bg-white border-t overflow-y-auto">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Nomor Telepon Penerima <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              value={noTelepon}
              onChange={(e) => setNoTelepon(e.target.value)}
              placeholder="Contoh: 081234567890"
              className="w-full p-2.5 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#2E9DF7]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Detail Alamat (Otomatis dari Peta) {loading && <span className="text-blue-500">Mendeteksi...</span>}
            </label>
            <textarea
              rows={3}
              required
              value={alamatContent}
              onChange={(e) => setAlamatContent(e.target.value)}
              placeholder="Contoh: Jl. Muchtar Latief..."
              className="w-full p-3 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#2E9DF7]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
            <button onClick={onClose} className="px-4 py-2 border rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50">
              Batal
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || loading || !alamatContent || !noTelepon}
              className="px-5 py-2 bg-[#1B2A6B] text-white rounded-xl text-xs font-bold hover:bg-[#111A42] disabled:opacity-50"
            >
              {submitting ? "Menyimpan..." : "Simpan Alamat"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
