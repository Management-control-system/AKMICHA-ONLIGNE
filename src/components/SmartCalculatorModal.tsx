import React, { useState } from 'react';
import {
  X,
  Ruler,
  Scissors,
  Sparkles,
  Check,
  ArrowRight,
  Calculator,
  Shirt,
  Layers,
  Home,
  CheckCircle2,
} from 'lucide-react';
import { FabricCategory } from '../types';

interface SmartCalculatorModalProps {
  onClose: () => void;
  onApplyCalculatedMeters: (meters: number, recommendedCategory: FabricCategory) => void;
}

type ProjectType = 'thobe' | 'abaya' | 'dress' | 'suit' | 'curtains' | 'upholstery';

export const SmartCalculatorModal: React.FC<SmartCalculatorModalProps> = ({
  onClose,
  onApplyCalculatedMeters,
}) => {
  const [project, setProject] = useState<ProjectType>('thobe');

  // Thobe state
  const [thobeHeight, setThobeHeight] = useState<number>(175);
  const [thobeBody, setThobeBody] = useState<'slim' | 'medium' | 'broad'>('medium');
  const [thobeExtraSleeves, setThobeExtraSleeves] = useState<boolean>(false);

  // Abaya state
  const [abayaStyle, setAbayaStyle] = useState<'classic' | 'butterfly' | 'double_layer'>('classic');
  const [includeSheila, setIncludeSheila] = useState<boolean>(true);

  // Dress state
  const [dressLength, setDressLength] = useState<'midi' | 'maxi' | 'ballgown'>('maxi');
  const [dressSleeves, setDressSleeves] = useState<'sleeveless' | 'long_flare'>('long_flare');

  // Curtains state
  const [curtainWidthCm, setCurtainWidthCm] = useState<number>(200);
  const [curtainHeightCm, setCurtainHeightCm] = useState<number>(260);
  const [curtainPleatFactor, setCurtainPleatFactor] = useState<number>(2.0); // 2x fullness

  // Calculate recommendation
  let calculatedMeters = 3.5;
  let recommendedCategory: FabricCategory = 'cotton';
  let calculationDetailsAr = '';

  if (project === 'thobe') {
    recommendedCategory = 'cotton';
    let base = 3.5;
    if (thobeHeight > 182) base += 0.5;
    if (thobeBody === 'broad') base += 0.5;
    if (thobeExtraSleeves) base += 0.25;
    calculatedMeters = Number(base.toFixed(2));
    calculationDetailsAr = `بناءً على طولك (${thobeHeight} سم) والبنية (${
      thobeBody === 'slim' ? 'رشيق' : thobeBody === 'medium' ? 'متوسط' : 'عريض وممتلئ'
    })، تحتاج إلى طاقة ثوب تبلغ ${calculatedMeters} متر لضمان كفاية القماش للصدر، الياقة، الكبك والجيوب.`;
  } else if (project === 'abaya') {
    recommendedCategory = 'crepe';
    let base = abayaStyle === 'classic' ? 2.5 : abayaStyle === 'butterfly' ? 3.5 : 4.0;
    if (includeSheila) base += 1.0;
    calculatedMeters = Number(base.toFixed(2));
    calculationDetailsAr = `لتفصيل عباية (${
      abayaStyle === 'classic'
        ? 'قصة كلاسيك عادية'
        : abayaStyle === 'butterfly'
        ? 'بشت / فراشة كلوش واسع'
        : 'عباية طبقتين دوبل'
    })${includeSheila ? ' مع طرحة متناسقة 1 متر' : ''}، يوصى بقص ${calculatedMeters} متر.`;
  } else if (project === 'dress') {
    recommendedCategory = 'silk';
    let base = dressLength === 'midi' ? 2.5 : dressLength === 'maxi' ? 3.5 : 5.0;
    if (dressSleeves === 'long_flare') base += 1.0;
    calculatedMeters = Number(base.toFixed(2));
    calculationDetailsAr = `لفستان (${
      dressLength === 'midi' ? 'ميدي متوسط' : dressLength === 'maxi' ? 'ماكسي طويل' : 'سهرة ملكي مع ذيل واسع'
    }) بأكمام واسعة، يتطلب التصميم ${calculatedMeters} متر.`;
  } else if (project === 'suit') {
    recommendedCategory = 'wool_cashmere';
    calculatedMeters = 3.5;
    calculationDetailsAr =
      'لبدلة رجالية رسمية كاملة (جاكيت بليزر + بنطلون كلاسيكي) من الصوف والكشمير، يحتاج الخياط لـ 3.5 متر بعرض طاقة 150 سم.';
  } else if (project === 'curtains') {
    recommendedCategory = 'curtains_upholstery';
    const totalFabricWidthNeededCm = curtainWidthCm * curtainPleatFactor;
    // Assuming standard curtain width 280cm (double width) or standard 140cm
    const strips = Math.ceil(totalFabricWidthNeededCm / 280);
    const metersPerStrip = (curtainHeightCm + 30) / 100; // 30cm for top & bottom hems
    calculatedMeters = Number((strips * metersPerStrip).toFixed(2));
    if (calculatedMeters < 2) calculatedMeters = 2.5;
    calculationDetailsAr = `لستارة نافذة بعرض ${curtainWidthCm} سم وارتفاع ${curtainHeightCm} سم مع تكسير كسرات فخمة (${curtainPleatFactor}x)، تحتاج إلى ${calculatedMeters} متر من القماش ذو العرض المزدوج (280 سم).`;
  } else {
    recommendedCategory = 'velvet';
    calculatedMeters = 6.0;
    calculationDetailsAr =
      'لتنجيد كنب 3 مقاعد مع كراسي جانبية ووسائد، يتطلب العمل تقريباً 6 إلى 8 أمتار من قماش المخمل أو الكتان الثقيل.';
  }

  const handleApply = () => {
    onApplyCalculatedMeters(calculatedMeters, recommendedCategory);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="relative bg-[#fcfbf9] rounded-3xl border border-[#ded5c5] shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1b2a22] flex items-center justify-center text-[#d8af56]">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#1b2a22] font-['Cairo']">
                حاسبة قياس الأمتار الذكية
              </h2>
              <p className="text-xs text-stone-500">
                احسب بدقة كم متراً من القماش تحتاج لتفصيل مشروعك قبل الطلب
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Project Selector Tabs */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-800 block">
            1. حدد نوع المشروع المراد تفصيله:
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {[
              { id: 'thobe', label: 'ثوب رجالي', icon: '✂️' },
              { id: 'abaya', label: 'عباية نسائية', icon: '🧕' },
              { id: 'dress', label: 'فستان سهرة', icon: '👗' },
              { id: 'suit', label: 'بدلة رسمية', icon: '👔' },
              { id: 'curtains', label: 'ستائر نوافذ', icon: '🪟' },
              { id: 'upholstery', label: 'تنجيد ومفروشات', icon: '🛋️' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setProject(p.id as ProjectType)}
                className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                  project === p.id
                    ? 'bg-[#1b2a22] text-[#d8af56] border-[#1b2a22] shadow-xs'
                    : 'bg-white text-stone-700 hover:bg-stone-50 border-stone-200'
                }`}
              >
                <span className="text-base">{p.icon}</span>
                <span className="text-[11px] font-bold">{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Project Form Fields */}
        <div className="bg-[#f7f4ee] p-4 sm:p-5 rounded-2xl border border-[#ded5c5] space-y-4">
          <span className="text-xs font-black text-stone-900 block">
            2. خصائص وتفاصيل المقاس:
          </span>

          {project === 'thobe' && (
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-stone-700">
                  <span>طول الشخص:</span>
                  <span className="font-mono text-[#966b24]">{thobeHeight} سم</span>
                </div>
                <input
                  type="range"
                  min={140}
                  max={205}
                  value={thobeHeight}
                  onChange={(e) => setThobeHeight(Number(e.target.value))}
                  className="w-full accent-[#c6923b] cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-stone-700 block">بنية الجسم:</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'slim', label: 'نحيف / رشيق' },
                    { id: 'medium', label: 'متوسط قياسي' },
                    { id: 'broad', label: 'عريض / ممتلئ' },
                  ].map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setThobeBody(b.id as any)}
                      className={`py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        thobeBody === b.id
                          ? 'bg-[#c6923b] text-stone-950 border-[#c6923b]'
                          : 'bg-white text-stone-700 border-stone-200'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={thobeExtraSleeves}
                  onChange={(e) => setThobeExtraSleeves(e.target.checked)}
                  className="accent-[#1b2a22] rounded"
                />
                <span className="text-xs text-stone-700 font-medium">
                  طلب أكمام كبك مزدوجة أو ياقة دبل عريضة (+ 0.25م)
                </span>
              </label>
            </div>
          )}

          {project === 'abaya' && (
            <div className="space-y-3">
              <div className="space-y-1">
                <span className="text-xs font-bold text-stone-700 block">موديل وقصة العباية:</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'classic', label: 'قصة كلاسيكية مستقيمة (A-Line)' },
                    { id: 'butterfly', label: 'فراشة / بشت كلوش واسع' },
                    { id: 'double_layer', label: 'دوبل فيس / طبقتين' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setAbayaStyle(s.id as any)}
                      className={`p-2 rounded-lg text-xs font-bold border text-center transition-all ${
                        abayaStyle === s.id
                          ? 'bg-[#c6923b] text-stone-950 border-[#c6923b]'
                          : 'bg-white text-stone-700 border-stone-200'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={includeSheila}
                  onChange={(e) => setIncludeSheila(e.target.checked)}
                  className="accent-[#1b2a22] rounded"
                />
                <span className="text-xs text-stone-700 font-medium">
                  إضافة قماش كافي لطرحة متناسقة (+ 1.0 متر)
                </span>
              </label>
            </div>
          )}

          {project === 'curtains' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    عرض النافذة (سم):
                  </label>
                  <input
                    type="number"
                    value={curtainWidthCm}
                    onChange={(e) => setCurtainWidthCm(Number(e.target.value))}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs font-bold font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    ارتفاع النافذة (سم):
                  </label>
                  <input
                    type="number"
                    value={curtainHeightCm}
                    onChange={(e) => setCurtainHeightCm(Number(e.target.value))}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs font-bold font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  كثافة التكسير والكسرات:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: 1.5, label: 'خفيفة (1.5x)' },
                    { val: 2.0, label: 'قياسية ملكية (2.0x)' },
                    { val: 2.5, label: 'كثيفة فاخرة (2.5x)' },
                  ].map((pl) => (
                    <button
                      key={pl.val}
                      onClick={() => setCurtainPleatFactor(pl.val)}
                      className={`py-1.5 rounded-lg text-xs font-bold border ${
                        curtainPleatFactor === pl.val
                          ? 'bg-[#c6923b] text-stone-950 border-[#c6923b]'
                          : 'bg-white text-stone-700 border-stone-200'
                      }`}
                    >
                      {pl.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {project === 'dress' && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-stone-700 block">طول وتصميم الفستان:</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'midi', label: 'ميدي (تحت الركبة)' },
                  { id: 'maxi', label: 'ماكسي طويل لكعب القدم' },
                  { id: 'ballgown', label: 'سهرة كلوش مع ذيل' },
                ].map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDressLength(d.id as any)}
                    className={`p-2 rounded-lg text-xs font-bold border ${
                      dressLength === d.id
                        ? 'bg-[#c6923b] text-stone-950 border-[#c6923b]'
                        : 'bg-white text-stone-700 border-stone-200'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Output Result Card */}
        <div className="bg-[#1b2a22] text-[#f4efe6] p-5 rounded-2xl border border-[#d8af56]/30 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#d8af56]" />
              <span className="text-xs text-[#d8af56] font-bold">النتيجة الموصى بها من خبراء القص:</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#d8af56] font-mono">
              {calculatedMeters} متر
            </div>
          </div>

          <p className="text-xs text-stone-300 leading-relaxed font-normal">
            {calculationDetailsAr}
          </p>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-3">
            <span className="text-[11px] text-stone-400">
              * ننصح دوماً بإضافة 0.25 متر إضافي لضمان راحة يد الخياط أثناء القص.
            </span>

            <button
              onClick={handleApply}
              className="px-4 py-2.5 rounded-xl bg-[#c6923b] hover:bg-[#b58331] text-stone-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 whitespace-nowrap"
            >
              <span>اعتماد هذا الطول والبحث عن القماش</span>
              <ArrowRight className="w-4 h-4 transform rotate-180" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
