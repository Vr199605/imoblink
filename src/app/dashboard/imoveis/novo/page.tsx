'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Property, PropertyType, PropertyPurpose } from '@/types';
import { getBrokerProfile, saveProperty, getProperties } from '@/lib/storage';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { generateSlug } from '@/lib/utils';
import { ArrowLeft, Save, Plus, X, Upload, Loader2 } from 'lucide-react';

export default function NewPropertyPage() {
  const router = useRouter();
  const broker = getBrokerProfile();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<PropertyType>('apartamento');
  const [purpose, setPurpose] = useState<PropertyPurpose>('venda');
  const [price, setPrice] = useState<number>(500000);
  const [condoFee, setCondoFee] = useState<number>(0);
  const [iptu, setIptu] = useState<number>(0);
  const [bedrooms, setBedrooms] = useState<number>(2);
  const [suites, setSuites] = useState<number>(1);
  const [bathrooms, setBathrooms] = useState<number>(2);
  const [garageSpots, setGarageSpots] = useState<number>(1);
  const [areaM2, setAreaM2] = useState<number>(85);
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState(broker.city || 'São Paulo');
  const [state, setState] = useState(broker.state || 'SP');
  const [featured, setFeatured] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([
    'Varanda Gourmet',
    'Piscina',
    'Academia',
    'Segurança 24h'
  ]);

  const [imageInput, setImageInput] = useState('');
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200'
  ]);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const addImage = () => {
    if (imageInput.trim()) {
      setImages([...images, imageInput.trim()]);
      setImageInput('');
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  };

  const uploadPropertyPhoto = async (file: File): Promise<string> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const ext = file.name.split('.').pop() || 'jpg';
        const path = `${broker.slug || 'imoveis'}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage.from('property-images').upload(path, file);
        if (!error) {
          const { data } = supabase.storage.from('property-images').getPublicUrl(path);
          if (data?.publicUrl) return data.publicUrl;
        }
      } catch (e) {
        console.warn('Supabase storage upload failed, using local fallback:', e);
      }
    }
    return readFileAsDataUrl(file);
  };

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (files.length === 0) return;

    const invalid = files.find((f) => !f.type.startsWith('image/'));
    if (invalid) {
      setUploadError('Selecione apenas arquivos de imagem (JPG, PNG, WEBP...).');
      return;
    }

    setUploadError('');
    setUploadingPhotos(true);
    try {
      const uploaded = await Promise.all(files.map(uploadPropertyPhoto));
      setImages((prev) => [...prev, ...uploaded]);
    } catch (e) {
      setUploadError('Não foi possível carregar uma ou mais fotos. Tente novamente.');
    } finally {
      setUploadingPhotos(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !neighborhood.trim()) {
      alert('Por favor preencha o título e o bairro do imóvel.');
      return;
    }

    const existing = getProperties();
    const nextCodeNumber = existing.length + 101;
    const generatedSlug = `${generateSlug(title)}-${Math.floor(100 + Math.random() * 900)}`;

    const newProperty: Property = {
      id: `prop-${Date.now()}`,
      slug: generatedSlug,
      brokerSlug: broker.slug,
      title,
      description,
      type,
      purpose,
      status: 'disponivel',
      price: Number(price),
      condoFee: condoFee > 0 ? Number(condoFee) : undefined,
      iptu: iptu > 0 ? Number(iptu) : undefined,
      bedrooms: Number(bedrooms),
      suites: Number(suites),
      bathrooms: Number(bathrooms),
      garageSpots: Number(garageSpots),
      areaM2: Number(areaM2),
      neighborhood,
      city,
      state,
      tags,
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200'],
      featured,
      code: `IB-${nextCodeNumber}`,
      createdAt: new Date().toISOString(),
      viewsCount: 0,
      leadsCount: 0,
      videoUrl: videoUrl.trim() || undefined
    };

    saveProperty(newProperty);
    router.push('/dashboard');
  };

  return (
    <>
      <Header />

      <main className="flex-1 bg-slate-50/50 py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar aos Imóveis</span>
            </Link>

            <h1 className="text-xl font-black text-slate-900">Cadastrar Novo Imóvel</h1>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100">
                1. Informações Básicas
              </h3>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                  Título do Imóvel (Chamativo)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Apartamento de Luxo reformado com Varanda Gourmet nos Jardins"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                    Tipo de Imóvel
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as PropertyType)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold uppercase"
                  >
                    <option value="apartamento">Apartamento</option>
                    <option value="casa">Casa</option>
                    <option value="cobertura">Cobertura</option>
                    <option value="terreno">Terreno / Lote</option>
                    <option value="comercial">Comercial</option>
                    <option value="chacara">Chácara / Sítio</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                    Finalidade
                  </label>
                  <select
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value as PropertyPurpose)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold uppercase"
                  >
                    <option value="venda">Venda</option>
                    <option value="aluguel">Aluguel</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                    Preço (R$)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-black text-emerald-700"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                    Condom²nio Mensal (R$ opcional)
                  </label>
                  <input
                    type="number"
                    value={condoFee}
                    onChange={(e) => setCondoFee(Number(e.target.value))}
                    placeholder="0"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                    IPTU Anual (R$ opcional)
                  </label>
                  <input
                    type="number"
                    value={iptu}
                    onChange={(e) => setIptu(Number(e.target.value))}
                    placeholder="0"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100">
                2. Localização e Dimensões
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                    Bairro
                  </label>
                  <input
                    type="text"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    placeholder="Ex: Moema"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                    Estado (UF)
                  </label>
                  <input
                    type="text"
                    maxLength={2}
                    value={state}
                    onChange={(e) => setState(e.target.value.toUpperCase())}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase text-slate-600 block mb-1">Área (m²)</label>
                  <input
                    type="number"
                    value={areaM2}
                    onChange={(e) => setAreaM2(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-2.5 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-slate-600 block mb-1">Quartos</label>
                  <input
                    type="number"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-2.5 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-slate-600 block mb-1">Suítes</label>
                  <input
                    type="number"
                    value={suites}
                    onChange={(e) => setSuites(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-2.5 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-slate-600 block mb-1">Banheiros</label>
                  <input
                    type="number"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-2.5 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-slate-600 block mb-1">Vagas</label>
                  <input
                    type="number"
                    value={garageSpots}
                    onChange={(e) => setGarageSpots(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-2.5 font-bold"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100">
                3. Descrição e Diferenciais
              </h3>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                  Descrição Completa do Imóvel
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Destaque as qualidades do imóvel, acabamentos e diferenciais..."
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                  Tags de Destaque / Lazer
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Adicionar diferencial (ex: Vista Mar, Churrasqueira)..."
                    className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
                  >
                    Adicionar
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg"
                    >
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="hover:text-rose-600">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100">
                4. Fotos do Imóvel
              </h3>

              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFilesSelected}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhotos}
                  className="w-full flex items-center justify-center gap-2 px-4 py-4 border-2 border-dashed border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/50 text-slate-600 hover:text-emerald-700 rounded-xl text-xs font-bold transition-colors disabled:opacity-60"
                >
                  {uploadingPhotos ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Enviando fotos...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Selecionar Fotos do Dispositivo</span>
                    </>
                  )}
                </button>
                {uploadError && (
                  <p className="text-xs font-semibold text-rose-600 mt-1.5">{uploadError}</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">ou cole uma URL</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <div className="flex gap-2">
                <input
                  type="url"
                  value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                  placeholder="Cole a URL da foto (ex: https://images.unsplash.com/...)"
                  className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addImage();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addImage}
                  className="px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Adicionar Foto</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 group border border-slate-200">
                    <img src={img} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1.5 right-1.5 p-1 bg-rose-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 bg-black/60 text-white text-[10px] rounded font-mono">
                      #{idx + 1}
                    </span>
                  </div>
                ))}
              </div>

              {/* Vídeo / Tour Virtual */}
              <div className="pt-4 border-t border-slate-100">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  Tour em Vídeo do Imóvel (YouTube ou Reels)
                </label>
                <p className="text-[11px] text-slate-400 mb-2">
                  Cole o link do vídeo do YouTube ou Reels. Um player de alta resolução será exibido automaticamente na página do imóvel.
                </p>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="Ex: https://www.youtube.com/watch?v=ScMzIvxBSi4"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 accent-emerald-600"
                />
                <span className="text-xs font-bold text-slate-700">Destacar este imóvel no topo do catálogo</span>
              </label>

              <button
                type="submit"
                className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Publicar Imóvel</span>
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
}
