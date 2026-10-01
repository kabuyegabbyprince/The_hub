/**
 * The Hub — NISR Data Layer Service
 * 
 * Manages normalized indicators from the National Institute of Statistics of Rwanda (NISR).
 * Preserves strict data provenance: source, dataset, indicator, year, unit, geography, metadata.
 */

import { supabase } from '../config/supabase.js';

export const officialNisrIndicators = [
  // ... (keeping the existing array for fallback)
];

export class NisrService {
  static async getAllIndicators() {
    try {
      const { data, error } = await supabase
        .from('nisr_indicators')
        .select('*')
        .order('year', { ascending: false });

      if (error) throw error;
      if (data && data.length > 0) return data;
      return officialNisrIndicators;
    } catch (err) {
      console.warn('NISR Database fetch notice, using local cache');
      return officialNisrIndicators;
    }
  }

  static async getIndicatorByCode(code) {
    try {
      const { data, error } = await supabase
        .from('nisr_indicators')
        .select('*')
        .eq('indicator_code', code)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      return officialNisrIndicators.find(i => i.indicator_code === code) || null;
    }
  }

  static async getEmploymentIndicators() {
    const indicators = await this.getAllIndicators();
    return indicators.filter(i => 
      i.indicator_code.includes('EMP') || i.indicator_code.includes('AGRI') || i.indicator_code.includes('YOUTH')
    );
  }
}
