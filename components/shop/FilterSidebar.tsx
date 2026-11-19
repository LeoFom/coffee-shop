import {
  PRODUCT_CATEGORIES,
  ROAST_TYPES,
} from '@/lib/data/products.data';
import type { CategoryType, RoastType } from '@/types/products.types';

interface FilterSidebarProps {
  selectedCategories: CategoryType[];
  setSelectedCategories: (val: CategoryType[]) => void;
  selectedRoasts: RoastType[];
  setSelectedRoasts: (val: RoastType[]) => void;
  onlyMemberPerks: boolean;
  setOnlyMemberPerks: (val: boolean) => void;
}

export default function FilterSidebar({
  selectedCategories,
  setSelectedCategories,
  selectedRoasts,
  setSelectedRoasts,
  onlyMemberPerks,
  setOnlyMemberPerks,
}: FilterSidebarProps) {
  const handleCategoryToggle = (category: CategoryType) => {
    setSelectedCategories(
      selectedCategories.includes(category)
        ? selectedCategories.filter((item) => item !== category)
        : [...selectedCategories, category]
    );
  };

  const handleRoastToggle = (roast: RoastType) => {
    setSelectedRoasts(
      selectedRoasts.includes(roast)
        ? selectedRoasts.filter((item) => item !== roast)
        : [...selectedRoasts, roast]
    );
  };

  return (
    <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
      <div>
        <h4 className="font-serif font-bold text-brand-brown text-lg mb-4">Categories</h4>
        <div className="space-y-3">
          {PRODUCT_CATEGORIES.map((category) => (
            <label key={category} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryToggle(category)}
                className="w-5 h-5 rounded border-brand-brown/20 text-brand-brown focus:ring-brand-brown cursor-pointer"
              />
              <span className="text-brand-text group-hover:text-brand-brown transition-colors">
                {category}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-serif font-bold text-brand-brown text-lg mb-4">Roast Level</h4>
        <div className="space-y-3">
          {ROAST_TYPES.map((roast) => (
            <label key={roast} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedRoasts.includes(roast)}
                onChange={() => handleRoastToggle(roast)}
                className="w-5 h-5 rounded border-brand-brown/20 text-brand-brown focus:ring-brand-brown cursor-pointer"
              />
              <span className="text-brand-text group-hover:text-brand-brown transition-colors">
                {roast}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="pt-6 border-t border-brand-brown/10">
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={onlyMemberPerks}
            onChange={(e) => setOnlyMemberPerks(e.target.checked)}
            className="w-5 h-5 rounded border-brand-brown/20 text-brand-brown focus:ring-brand-brown cursor-pointer"
          />
          <span className="font-bold text-brand-brown">Member Perks Only</span>
        </label>
      </div>
    </aside>
  );
}
