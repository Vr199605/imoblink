import { BrokerProfile, Property } from '@/types';
import { defaultBroker, defaultProperties } from './mock-data';
import { supabase, isSupabaseConfigured } from './supabase/client';

const STORAGE_KEYS = {
  BROKER: 'imoblink_broker_profile',
  PROPERTIES: 'imoblink_properties'
};

// ==========================================
// OPERAÇÕES DE PERFIL DO CORRETOR
// ==========================================

export async function getBrokerProfileAsync(slug?: string): Promise<BrokerProfile> {
  if (isSupabaseConfigured && supabase) {
    try {
      if (slug) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('slug', slug)
          .single();
        if (data && !error) {
          return {
            id: data.id,
            slug: data.slug,
            name: data.name,
            creci: data.creci,
            phone: data.phone,
            email: data.email,
            avatarUrl: data.avatar_url,
            bio: data.bio,
            instagram: data.instagram,
            city: data.city,
            state: data.state,
            viewsTotal: 0,
            leadsTotal: 0
          };
        }
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          if (data && !error) {
            return {
              id: data.id,
              slug: data.slug,
              name: data.name,
              creci: data.creci,
              phone: data.phone,
              email: data.email,
              avatarUrl: data.avatar_url,
              bio: data.bio,
              instagram: data.instagram,
              city: data.city,
              state: data.state,
              viewsTotal: 0,
              leadsTotal: 0
            };
          }
        }
      }
    } catch (e) {
      console.warn('Supabase profile fetch error, using local fallback:', e);
    }
  }

  return getBrokerProfile();
}

export function getBrokerProfile(): BrokerProfile {
  if (typeof window === 'undefined') return defaultBroker;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BROKER);
    return data ? JSON.parse(data) : defaultBroker;
  } catch (e) {
    return defaultBroker;
  }
}

export async function saveBrokerProfileAsync(profile: BrokerProfile): Promise<void> {
  saveBrokerProfile(profile);
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('profiles').upsert({
          id: user.id,
          name: profile.name,
          slug: profile.slug,
          creci: profile.creci,
          phone: profile.phone,
          email: profile.email || user.email,
          avatar_url: profile.avatarUrl,
          bio: profile.bio,
          instagram: profile.instagram,
          city: profile.city,
          state: profile.state
        });
      }
    } catch (e) {
      console.error('Error saving profile to Supabase:', e);
    }
  }
}

export function saveBrokerProfile(profile: BrokerProfile): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.BROKER, JSON.stringify(profile));
}

// ==========================================
// OPERAÇÕES DE IMÓVEIS
// ==========================================

export async function getPropertiesAsync(brokerSlug?: string): Promise<Property[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('properties').select('*');
      if (brokerSlug) {
        query = query.eq('broker_slug', brokerSlug);
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          query = query.eq('broker_id', user.id);
        }
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (data && !error && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          slug: d.slug,
          brokerSlug: d.broker_slug,
          title: d.title,
          description: d.description,
          type: d.type,
          purpose: d.purpose,
          status: d.status,
          price: Number(d.price),
          condoFee: d.condo_fee ? Number(d.condo_fee) : undefined,
          iptu: d.iptu ? Number(d.iptu) : undefined,
          bedrooms: d.bedrooms,
          suites: d.suites,
          bathrooms: d.bathrooms,
          garageSpots: d.garage_spots,
          areaM2: Number(d.area_m2),
          neighborhood: d.neighborhood,
          city: d.city,
          state: d.state,
          addressApprox: d.address_approx,
          tags: d.tags || [],
          images: d.images || [],
          featured: d.featured,
          code: d.code,
          createdAt: d.created_at,
          viewsCount: d.views_count
        }));
      }
    } catch (e) {
      console.warn('Supabase properties fetch error, using local fallback:', e);
    }
  }

  return getProperties();
}

export function getProperties(): Property[] {
  if (typeof window === 'undefined') return defaultProperties;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROPERTIES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(defaultProperties));
      return defaultProperties;
    }
    return JSON.parse(data);
  } catch (e) {
    return defaultProperties;
  }
}

export async function savePropertyAsync(property: Property): Promise<void> {
  saveProperty(property);
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('properties').upsert({
          broker_id: user.id,
          broker_slug: property.brokerSlug,
          slug: property.slug,
          code: property.code,
          title: property.title,
          description: property.description,
          type: property.type,
          purpose: property.purpose,
          status: property.status,
          price: property.price,
          condo_fee: property.condoFee || 0,
          iptu: property.iptu || 0,
          bedrooms: property.bedrooms,
          suites: property.suites,
          bathrooms: property.bathrooms,
          garage_spots: property.garageSpots,
          area_m2: property.areaM2,
          neighborhood: property.neighborhood,
          city: property.city,
          state: property.state,
          tags: property.tags,
          images: property.images,
          featured: property.featured || false
        });
      }
    } catch (e) {
      console.error('Error saving property to Supabase:', e);
    }
  }
}

export function saveProperty(property: Property): void {
  if (typeof window === 'undefined') return;
  const list = getProperties();
  const index = list.findIndex(p => p.id === property.id);
  if (index >= 0) {
    list[index] = property;
  } else {
    list.unshift(property);
  }
  localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(list));
}

export async function deletePropertyAsync(id: string): Promise<void> {
  deleteProperty(id);
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('properties').delete().eq('id', id);
    } catch (e) {
      console.error('Error deleting property in Supabase:', e);
    }
  }
}

export function deleteProperty(id: string): void {
  if (typeof window === 'undefined') return;
  const list = getProperties().filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(list));
}

export async function getPropertyBySlugAsync(slug: string): Promise<Property | undefined> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .or(`slug.eq.${slug},id.eq.${slug}`)
        .single();
      if (data && !error) {
        return {
          id: data.id,
          slug: data.slug,
          brokerSlug: data.broker_slug,
          title: data.title,
          description: data.description,
          type: data.type,
          purpose: data.purpose,
          status: data.status,
          price: Number(data.price),
          condoFee: data.condo_fee ? Number(data.condo_fee) : undefined,
          iptu: data.iptu ? Number(data.iptu) : undefined,
          bedrooms: data.bedrooms,
          suites: data.suites,
          bathrooms: data.bathrooms,
          garageSpots: data.garage_spots,
          areaM2: Number(data.area_m2),
          neighborhood: data.neighborhood,
          city: data.city,
          state: data.state,
          addressApprox: data.address_approx,
          tags: data.tags || [],
          images: data.images || [],
          featured: data.featured,
          code: data.code,
          createdAt: data.created_at,
          viewsCount: data.views_count
        };
      }
    } catch (e) {
      console.warn('Supabase single property error, using local fallback:', e);
    }
  }
  return getPropertyBySlug(slug);
}

export function getPropertyBySlug(slug: string): Property | undefined {
  const list = getProperties();
  return list.find(p => p.slug === slug || p.id === slug);
}

export function incrementPropertyView(id: string): void {
  if (typeof window === 'undefined') return;
  const list = getProperties();
  const prop = list.find(p => p.id === id);
  if (prop) {
    prop.viewsCount = (prop.viewsCount || 0) + 1;
    localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(list));
  }
}
