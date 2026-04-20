import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import {
    defaultNavConfig, loadCustomizations, saveCustomizations, clearCustomizations,
    iconMap, type NavCustomization,
} from '../../config/navConfig';
import { cn } from '../../lib/utils';
import { Save, RotateCcw, Eye, EyeOff, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';

type RoleTab = 'admin' | 'manager' | 'worker';

export default function ButtonCustomizer() {
    const [activeTab, setActiveTab] = useState<RoleTab>('admin');
    const [customs, setCustoms] = useState<NavCustomization>(loadCustomizations());
    const [saved, setSaved] = useState(false);

    const items = defaultNavConfig[activeTab];
    const iconNames = Object.keys(iconMap);

    const getVal = (id: string, field: keyof NavCustomization[string]) => {
        return customs[id]?.[field as keyof typeof customs[typeof id]];
    };

    const setField = (id: string, field: string, value: any) => {
        setCustoms(prev => ({
            ...prev,
            [id]: { ...prev[id], [field]: value },
        }));
    };

    const getOrder = (id: string, defaultOrder: number) => {
        const v = customs[id]?.order;
        return v !== undefined ? v : defaultOrder;
    };

    const getVisible = (id: string) => {
        const v = customs[id]?.visible;
        return v !== undefined ? v : true;
    };

    const moveItem = (id: string, direction: 'up' | 'down') => {
        const sorted = [...items].sort((a, b) => getOrder(a.id, a.order) - getOrder(b.id, b.order));
        const idx = sorted.findIndex(i => i.id === id);
        const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (swapIdx < 0 || swapIdx >= sorted.length) return;

        const newCustoms = { ...customs };
        const thisId = sorted[idx].id;
        const swapId = sorted[swapIdx].id;
        newCustoms[thisId] = { ...newCustoms[thisId], order: getOrder(swapId, sorted[swapIdx].order) };
        newCustoms[swapId] = { ...newCustoms[swapId], order: getOrder(thisId, sorted[idx].order) };
        setCustoms(newCustoms);
    };

    const handleSave = () => {
        saveCustomizations(customs);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleReset = () => {
        clearCustomizations();
        setCustoms({});
    };

    const sortedItems = [...items].sort((a, b) => getOrder(a.id, a.order) - getOrder(b.id, b.order));

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            <Sidebar role="admin" />
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Customize Navigation</h1>
                        <p className="text-gray-500 text-sm mt-1">Rename, reorder, re-icon, or hide navigation buttons for each role.</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={handleReset} className="flex items-center gap-2 border border-gray-300 text-gray-600 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                            <RotateCcw className="w-4 h-4" /> Reset All
                        </button>
                        <button onClick={handleSave} className={cn(
                            "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors",
                            saved ? "bg-green-500 text-white" : "bg-indigo-600 text-white hover:bg-indigo-700"
                        )}>
                            <Save className="w-4 h-4" /> {saved ? 'Saved!' : 'Save Layout'}
                        </button>
                    </div>
                </div>

                {/* Role Tabs */}
                <div className="flex border-b border-gray-200 mb-6 space-x-8">
                    {(['admin', 'manager', 'worker'] as const).map(role => (
                        <button key={role} onClick={() => setActiveTab(role)} className={cn(
                            'pb-4 font-medium text-sm transition-colors border-b-2 capitalize',
                            activeTab === role ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                        )}>
                            {role}
                        </button>
                    ))}
                </div>

                {/* Items List */}
                <div className="max-w-3xl space-y-3">
                    {sortedItems.map((item, idx) => {
                        const Icon = (customs[item.id]?.iconName && iconMap[customs[item.id]!.iconName!]) || item.icon;
                        const visible = getVisible(item.id);
                        return (
                            <div key={item.id} className={cn(
                                'bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 transition-opacity',
                                !visible && 'opacity-50'
                            )}>
                                {/* Reorder */}
                                <div className="flex flex-col gap-0.5">
                                    <button onClick={() => moveItem(item.id, 'up')} disabled={idx === 0} className="p-0.5 hover:bg-gray-100 rounded text-gray-400 disabled:opacity-30"><ChevronUp className="w-4 h-4" /></button>
                                    <GripVertical className="w-4 h-4 text-gray-300" />
                                    <button onClick={() => moveItem(item.id, 'down')} disabled={idx === sortedItems.length - 1} className="p-0.5 hover:bg-gray-100 rounded text-gray-400 disabled:opacity-30"><ChevronDown className="w-4 h-4" /></button>
                                </div>

                                {/* Icon preview */}
                                <div className="p-2 bg-gray-100 rounded-lg"><Icon className="w-5 h-5 text-gray-600" /></div>

                                {/* Label */}
                                <input
                                    type="text"
                                    value={(getVal(item.id, 'label') as string) ?? item.label}
                                    onChange={e => setField(item.id, 'label', e.target.value)}
                                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />

                                {/* Icon Picker */}
                                <select
                                    value={(getVal(item.id, 'iconName') as string) ?? ''}
                                    onChange={e => setField(item.id, 'iconName', e.target.value || undefined)}
                                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white w-36"
                                >
                                    <option value="">Default Icon</option>
                                    {iconNames.map(name => <option key={name} value={name}>{name}</option>)}
                                </select>

                                {/* Visibility */}
                                <button onClick={() => setField(item.id, 'visible', !visible)} className={cn('p-2 rounded-lg transition-colors', visible ? 'text-indigo-600 hover:bg-indigo-50' : 'text-gray-300 hover:bg-gray-100')}>
                                    {visible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                </button>
                            </div>
                        );
                    })}
                </div>

                <p className="text-xs text-gray-400 mt-6 max-w-3xl">
                    Changes are saved to this browser's local storage. Click "Save Layout" to persist. The sidebar and bottom nav will update immediately on the next page load.
                </p>
            </main>
        </div>
    );
}
