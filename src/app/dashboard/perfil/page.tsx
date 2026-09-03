'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BrokerProfile } from '@/types';
import { getBrokerProfile, saveBrokerProfile } from '@/lib/storage';
import { generateSlug } from '@/lib/utils';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { 
  ArrowLeft, 
  Save, 
  CheckCircle2, 
  User, 
  ShieldCheck, 
  Phone, 
  Mail, 
  Instagram, 
  MapPin, 
  Camera, 
  Upload, 
  Link as LinkIcon, 
  AlertCircle 
} from 'lucide-react';

export default function ProfileSettingsPage() {
  const router = useRouter();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<BrokerProfile | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    async function loadProfile() {
      if (isSupabaseConfigured && supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data: dbProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (dbProfile) {
            setProfile({
              id: dbProfile.id,
              slug: dbProfile.slug,
              name: dbProfile.name,
              creci: dbProfile.creci,
              phone: dbProfile.phone,
              email: dbProfile.email,
              avatarUrl: dbProfile.avatar_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
              bio: dbProfile.bio || '',
              instagram: dbProfile.instagram || '',
              city: dbProfile.city || 'São Paulo',
              state: dbProfile.state || 'SP'
            });
            return;
          }
        }
      }
      setProfile(getBrokerProfile());
    }

    loadProfile();
  }, []);

  if (!profile) return null;

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Por favor, selecione um arquivo de imagem válido (JPG, PNG ou WEBP).');
      return;
    }

    setUploadError('');
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 500;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setProfile((prev) => prev ? { ...prev, avatarUrl: compressedDataUrl } : null);
        }
      };

      if (event.target?.result) {
        img.src = event.target.result as string;
      }
    };

    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);

    const updatedProfile: BrokerProfile = {
      ...profile,
      slug: profile.slug || generateSlug(profile.name)
    };

    try {
      saveBrokerProfile(updatedProfile);
      setProfile(updatedProfile);

      if (isSupabaseConfigured && supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          await supabase
            .from('profiles')
            .update({
              name: updatedProfile.name,
              creci: updatedProfile.creci,
              phone: updatedProfile.phone,
              avatar_url: updatedProfile.avatarUrl,
              bio: updatedProfile.bio,
              instagram: updatedProfile.instagram,
              city: updatedProfile.city,
              state: updatedProfile.state
            })
            .eq('id', session.user.id);
        }
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Erro ao salvar perfil:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Header />

      <main className="flex-1 bg-slate-50/50 py-8 md:py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar ao Painel</span>
            </Link>

            <h1 className="text-xl font-black text-slate-900">Configurações de Perfil</h1>
          </div>

          {savedSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Perfil e foto atualizados com sucesso!</span>
            </div>
          )}

          {uploadError && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>{uploadError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            
            {/* Foto de Perfil com Upload Direto */}
            <div className="pb-6 border-b border-slate-100">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-3">
                Foto do Perfil Profissional
              </label>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="relative group shrink-0">
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-emerald-500 shadow-md bg-slate-100"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/40 text-white rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity text-[11px] font-bold"
                  >
                    <Camera className="w-5 h-5" />
                    <span>Trocar</span>
                  </button>
                </div>

                <div className="flex-1 space-y-2.5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      onChange={handleAvatarFileUpload}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-95"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Escolher Foto do Computador / Celular</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowUrlInput(!showUrlInput)}
                      className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                    >
                      <LinkIcon className="w-3.5 h-3.5" />
                      <span>{showUrlInput ? 'Ocultar Link' : 'Colar Link'}</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-500">
                    Selecione uma foto sua de frente. O sistema ajusta automaticamente o tamanho e a nitidez.
                  </p>

                  {showUrlInput && (
                    <div className="pt-2 animate-in fade-in">
                      <input
                        type="url"
                        value={profile.avatarUrl}
                        onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })}
                        placeholder="https://suafoto.com/avatar.jpg"
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                  Nome Completo
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                  Número de Registro CRECI
                </label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={profile.creci}
                    onChange={(e) => setProfile({ ...profile, creci: e.target.value })}
                    placeholder="Ex: 123.456-F"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                  WhatsApp (com DDD)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="Ex: 5511999999999"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    required
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Formato: 55 + DDD + Número (ex: 5511998765432)</p>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                  Instagram
                </label>
                <div className="relative">
                  <Instagram className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={profile.instagram || ''}
                    onChange={(e) => setProfile({ ...profile, instagram: e.target.value })}
                    placeholder="@seuperfil"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                  Cidade de Atuação
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={profile.city}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                  Estado (UF)
                </label>
                <input
                  type="text"
                  maxLength={2}
                  value={profile.state}
                  onChange={(e) => setProfile({ ...profile, state: e.target.value.toUpperCase() })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  required
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                Biografia Profissional / Apresentação
              </label>
              <textarea
                rows={3}
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="Conte um pouco sobre sua experiência, especialidades e regiões de atendimento..."
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Alterações</span>
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
}
