import { BrokerProfile, Property } from "@/types";
import { defaultBroker, defaultProperties } from "./mock-data";

const STORAGE_KEYS = {
  BROKER: "imoblink_broker_profile",
  PROPERTIES: "imoblink_properties"
};

export function getBrokerProfile(): BrokerProfile {
  if (typeof window === "undefined") return defaultBroker;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BROKER);
    return data ? JSON.parse(data) : defaultBroker;
  } catch (e) {
    return defaultBroker;
  }
}

export function saveBrokerProfile(profile: BrokerProfile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.BROKER, JSON.stringify(profile));
}

export function getProperties(): Property[] {
  if (typeof window === "undefined") return defaultProperties;
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

export function saveProperty(property: Property): void {
  if (typeof window === "undefined") return;
  const list = getProperties();
  const index = list.findIndex(p => p.id === property.id);
  if (index >= 0) {
    list[index] = property;
  } else {
    list.unshift(property);
  }
  localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(list));
}

export function deleteProperty(id: string): void {
  if (typeof window === "undefined") return;
  const list = getProperties().filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(list));
}

export function getPropertyBySlug(slug: string): Property | undefined {
  const list = getProperties();
  return list.find(p => p.slug === slug || p.id === slug);
}

export function incrementPropertyView(id: string): void {
  if (typeof window === "undefined") return;
  const list = getProperties();
  const prop = list.find(p => p.id === id);
  if (prop) {
    prop.viewsCount = (prop.viewsCount || 0) + 1;
    localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(list));
  }
}
