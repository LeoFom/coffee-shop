import { useCallback } from 'react';
import { CheckoutFormState, DeliveryMethod, NPCityData, NPWarehouse } from '@/types/checkout.types';
import SearchableSelect, { SearchableOption } from './SearchableSelect';

interface Props {
  data: CheckoutFormState['delivery'];
  onChange: (data: CheckoutFormState['delivery']) => void;
  errors?: { city?: string; warehouse?: string; address?: string };
}

const DELIVERY_OPTIONS: { value: DeliveryMethod; label: string }[] = [
  { value: 'np_warehouse', label: 'Нова Пошта — відділення' },
  { value: 'np_postomat', label: 'Нова Пошта — поштомат' },
  { value: 'courier', label: 'Кур\'єром' },
];

function asList<T>(data: unknown, keys: string[] = []): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === 'object') {
    for (const key of keys) {
      const value = (data as Record<string, unknown>)[key];
      if (Array.isArray(value)) return value as T[];
    }
  }
  return [];
}

function toCityOption(city: NPCityData): SearchableOption {
  const regionParts = [
    city.Region ? `${city.Region} ${city.RegionTypesCode || 'р-н'}`.trim() : '',
    city.Area ? `${city.Area} ${city.ParentRegionCode || 'обл.'}`.trim() : '',
  ].filter(Boolean);

  return {
    ref: city.Ref,
    cityRef: city.DeliveryCity,
    label: `${city.SettlementTypeCode ?? ''} ${city.MainDescription}`.trim(),
    sublabel: regionParts.join(', ') || city.Present,
  };
}

async function fetchCities(query: string): Promise<SearchableOption[]> {
  const res = await fetch(`/api/nova-poshta/cities?query=${encodeURIComponent(query)}`);
  if (!res.ok) return [];

  return asList<NPCityData>(await res.json(), ['settlements', 'cities', 'data']).map(toCityOption);
}

type RawWarehouse = NPWarehouse & {
  Ref?: string;
  Number?: string;
  Description?: string;
  ShortAddress?: string;
  CategoryOfWarehouse?: string;
};

function toWarehouse(raw: RawWarehouse): NPWarehouse {
  return {
    ref: raw.ref ?? raw.Ref ?? '',
    number: raw.number ?? raw.Number ?? '',
    name: raw.name ?? raw.Description ?? '',
    shortAddress: raw.shortAddress ?? raw.ShortAddress,
    categoryOfWarehouse: raw.categoryOfWarehouse ?? raw.CategoryOfWarehouse,
  };
}

export default function DeliverySection({ data, onChange, errors }: Props) {
  const isNovaPoshta = data.method === 'np_warehouse' || data.method === 'np_postomat';
  const cityRef = data.city?.cityRef || data.city?.ref;

  const fetchWarehouses = useCallback(
    async (query: string) => {
      if (!cityRef) return [];

      const params = new URLSearchParams({ cityRef });
      if (query) params.set('query', query);

      const res = await fetch(`/api/nova-poshta/warehouses?${params.toString()}`);
      if (!res.ok) return [];

      let warehouses = asList<RawWarehouse>(await res.json(), ['warehouses', 'data']).map(toWarehouse);

      if (data.method === 'np_postomat') {
        warehouses = warehouses.filter((w) => w.categoryOfWarehouse === 'Postomat');
      } else {
        warehouses = warehouses.filter((w) => w.categoryOfWarehouse !== 'Postomat');
      }

      const normalizedQuery = query.trim().toLowerCase();
      if (normalizedQuery) {
        warehouses = warehouses.filter(
          (w) =>
            w.name.toLowerCase().includes(normalizedQuery) ||
            w.number.includes(normalizedQuery) ||
            w.shortAddress?.toLowerCase().includes(normalizedQuery),
        );
      }

      return warehouses.map((w) => ({
        ref: w.ref,
        label: w.name,
        sublabel: w.shortAddress,
      }));
    },
    [cityRef, data.method],
  );

  return (
    <section className="border border-brand-brown/10 rounded-2xl bg-white p-6 md:p-8">
      <h2 className="text-xl font-serif font-bold text-brand-brown mb-6">Доставка</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {DELIVERY_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() =>
              onChange({ ...data, method: option.value, city: null, warehouse: null, address: '' })
            }
            className={`rounded-xl px-4 py-3 text-sm font-medium border transition-colors text-left ${
              data.method === option.value
                ? 'border-brand-brown bg-brand-brown text-white'
                : 'border-brand-brown/15 text-brand-brown hover:bg-brand-bg'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {isNovaPoshta && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-brand-muted mb-1.5">Місто *</label>
            <SearchableSelect
              placeholder="Почніть вводити назву міста"
              value={
                data.city
                  ? {
                      ref: data.city.ref,
                      cityRef: data.city.cityRef,
                      label: data.city.shortName ?? data.city.name,
                    }
                  : null
              }
              onSelect={(option) =>
                onChange({
                  ...data,
                  city: option
                    ? {
                        ref: option.ref ?? '',
                        cityRef: option.cityRef ?? option.ref ?? '',
                        name: option.label ?? '',
                        shortName: option.label,
                        area: option.sublabel,
                      }
                    : null,
                  warehouse: null,
                })
              }
              fetchOptions={fetchCities}
            />
            {errors?.city && <p className="text-xs text-error mt-1">{errors.city}</p>}
          </div>

          <div>
            <label className="block text-xs text-brand-muted mb-1.5">
              {data.method === 'np_postomat' ? 'Поштомат *' : 'Відділення *'}
            </label>
            <SearchableSelect
              placeholder={data.city ? 'Оберіть відділення' : 'Спочатку оберіть місто'}
              disabled={!data.city}
              value={
                data.warehouse ? { ref: data.warehouse.ref, label: data.warehouse.name } : null
              }
              onSelect={(option) =>
                onChange({
                  ...data,
                  warehouse: option
                    ? {
                        ref: option.ref ?? '',
                        number: '',
                        name: option.label ?? '',
                        shortAddress: option.sublabel,
                      }
                    : null,
                })
              }
              fetchOptions={fetchWarehouses}
              minChars={0}
            />
            {errors?.warehouse && <p className="text-xs text-error mt-1">{errors.warehouse}</p>}
          </div>
        </div>
      )}

      {data.method === 'courier' && (
        <div>
          <label className="block text-xs text-brand-muted mb-1.5">Адреса доставки *</label>
          <input
            type="text"
            placeholder="Вулиця, будинок, квартира"
            value={data.address}
            onChange={(e) => onChange({ ...data, address: e.target.value })}
            className="w-full border border-brand-brown/15 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-brown/40 transition-colors"
          />
          {errors?.address && <p className="text-xs text-error mt-1">{errors.address}</p>}
        </div>
      )}
    </section>
  );
}
