import { useState, FormEvent } from 'react';
import { AlertCircle, User, Instagram, Phone, ShoppingBag, Truck, MapPin, Store, Check, Info } from 'lucide-react';

export default function App() {
  // 基本資料
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [ig, setIg] = useState('');

  // 購買數量
  const [qtyQ, setQtyQ] = useState<number>(0);
  const [qtyBasque, setQtyBasque] = useState<number>(0);

  // 取貨方式與細節
  const [pickupMethod, setPickupMethod] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [shippingBatch, setShippingBatch] = useState('');
  const [address, setAddress] = useState('');
  const [storeInfo, setStoreInfo] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Google Apps Script 接收網址 (留空讓您後續填入)
  const scriptURL = ''; 

  // 商品單價
  const priceQ = 270;
  const priceBasque = 880;
  
  // 計算總價
  const totalPrice = (qtyQ * priceQ) + (qtyBasque * priceBasque);

  // 處理取貨方式變更時的重置動作
  const handlePickupMethodChange = (method: string) => {
    setPickupMethod(method);
    setPickupTime('');
    setShippingBatch('');
    setAddress('');
    setStoreInfo('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (qtyQ === 0 && qtyBasque === 0) {
      alert("請至少選擇一項商品數量！");
      return;
    }

    setIsSubmitting(true);

    const formData = {
      name,
      phone,
      ig,
      qtyQ,
      qtyBasque,
      pickupMethod,
      pickupTime,
      shippingBatch,
      address,
      storeInfo,
      totalPrice,
      submittedAt: new Date().toISOString()
    };

    try {
      if (!scriptURL) {
        // 若尚未填寫 scriptURL，這裡做一個模擬測試，方便預覽 UI
        console.log("模擬送出資料:", formData);
        await new Promise(resolve => setTimeout(resolve, 1500));
        alert('【測試模式】尚未設定 API 網址，已能在開發者工具查看 Payload。\n\n🎉 訂購成功！請截圖私訊 IG 進行確認。');
      } else {
        // 實際打 API
        const response = await fetch(scriptURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // 某些 Google Apps Script 需要 mode: "no-cors"
          body: JSON.stringify(formData)
        });
        
        if (!response.ok && response.type !== 'opaque') {
          throw new Error('Network response was not ok');
        }
        
        alert('訂購成功！請截圖私訊 IG 進行確認');
      }
      
      // 成功後可視需求清空表單
      // window.location.reload(); 
    } catch (error) {
      console.error('Submission Error:', error);
      alert('送出失敗，請稍後再試或直接聯絡我們。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#fdfbf7] text-[#3d2b1f] overflow-hidden" style={{ fontFamily: "'Georgia', serif" }}>
      
      {/* Header */}
      <header className="h-20 flex items-center justify-between px-6 md:px-10 border-b border-[#e5e1da] bg-white shrink-0">
        <div className="flex flex-col">
          <h1 className="text-xl md:text-2xl font-light tracking-[0.2em] uppercase">Dubai Chocolate</h1>
          <p className="text-[10px] md:text-xs tracking-widest uppercase opacity-60">Artisanal Dessert Pre-order</p>
        </div>
        <div className="text-[10px] md:text-[11px] tracking-widest uppercase font-semibold text-[#8c7355] text-right">
          Limited Edition 2024
        </div>
      </header>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col md:flex-row overflow-auto md:overflow-hidden">
        
        {/* Sidebar / Left Column */}
        <aside className="w-full md:w-1/3 md:border-r border-[#e5e1da] p-6 md:p-8 flex flex-col gap-6 md:overflow-y-auto shrink-0">
          
          <div className="bg-[#fff9f0] border border-[#f3e6d5] p-4 rounded-sm">
            <p className="text-xs leading-relaxed italic text-[#8c7355]">
              ⚠️ 注意事項：Q球為冷凍、巴斯克為冷藏，不同溫層若需宅配/店到店，請分開填寫表單。
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xs font-bold tracking-widest uppercase border-b border-[#3d2b1f] pb-1">基本資料 Basic Info</h2>
            <div className="grid gap-4">
              <div className="flex flex-col">
                <label className="text-[10px] uppercase tracking-wider mb-1" htmlFor="name">姓名 Name *</label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-transparent border border-[#d1ccc4] px-3 py-2 text-sm focus:outline-none focus:border-[#8c7355] transition-colors"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-[10px] uppercase tracking-wider mb-1" htmlFor="phone">聯絡電話 Phone *</label>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-transparent border border-[#d1ccc4] px-3 py-2 text-sm focus:outline-none focus:border-[#8c7355] transition-colors"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-[10px] uppercase tracking-wider mb-1" htmlFor="ig">IG 帳號 Instagram *</label>
                <input
                  id="ig"
                  type="text"
                  required
                  value={ig}
                  onChange={(e) => setIg(e.target.value)}
                  className="bg-transparent border border-[#d1ccc4] px-3 py-2 text-sm focus:outline-none focus:border-[#8c7355] transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xs font-bold tracking-widest uppercase border-b border-[#3d2b1f] pb-1">商品選擇 Products</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm">杜拜巧克力 Q球</span>
                  <span className="text-[10px] opacity-60 font-sans">1盒2顆 $270</span>
                </div>
                <input
                  type="number"
                  id="qtyQ"
                  min="0"
                  max="20"
                  value={qtyQ}
                  onChange={(e) => setQtyQ(Number(e.target.value))}
                  className="w-16 bg-white border border-[#d1ccc4] px-2 py-1 text-center text-sm focus:outline-none focus:border-[#8c7355]"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm">杜拜巧克力巴斯克</span>
                  <span className="text-[10px] opacity-60 font-sans">5吋 $880</span>
                </div>
                <input
                  type="number"
                  id="qtyBasque"
                  min="0"
                  max="10"
                  value={qtyBasque}
                  onChange={(e) => setQtyBasque(Number(e.target.value))}
                  className="w-16 bg-white border border-[#d1ccc4] px-2 py-1 text-center text-sm focus:outline-none focus:border-[#8c7355]"
                />
              </div>
            </div>
          </div>

        </aside>

        {/* Main Content / Right Column */}
        <section className="flex-1 p-6 md:p-8 flex flex-col justify-between md:overflow-y-auto">
          <div className="space-y-6">
            <h2 className="text-xs font-bold tracking-widest uppercase border-b border-[#3d2b1f] pb-1 mb-6">取貨方式 Delivery</h2>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'A', label: '苗栗竹南自取' },
                { id: 'B', label: '台北士林自取' },
                { id: 'C', label: '宅配到府' },
                { id: 'D', label: '7-11 冷凍店到店' }
              ].map((opt) => (
                <label key={opt.id} className="cursor-pointer relative">
                  <input
                    type="radio"
                    name="pickupMethod"
                    value={opt.id}
                    required
                    checked={pickupMethod === opt.id}
                    onChange={(e) => handlePickupMethodChange(e.target.value)}
                    className="absolute opacity-0 w-0 h-0 peer"
                  />
                  <div className="h-full flex items-center justify-center border border-[#d1ccc4] p-4 text-center peer-checked:border-[#8c7355] peer-checked:bg-[#fcf8f2] transition-all">
                    <span className="text-sm block">{opt.label}</span>
                  </div>
                </label>
              ))}
            </div>

            {/* Sub options container */}
            <div className="mt-8 space-y-4 min-h-[120px]">
              
              {pickupMethod === 'A' && (
                <div className="flex flex-col animate-in fade-in duration-300">
                  <label className="text-[10px] uppercase tracking-wider mb-2">選擇自取時段 <span className="text-red-500">*</span></label>
                  <select
                    required
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="bg-white border border-[#d1ccc4] px-3 py-2 text-sm focus:outline-none focus:border-[#8c7355]"
                  >
                    <option value="" disabled>-- 點擊選擇時段 --</option>
                    <option value="5/10 15:00-15:30">5/10 15:00-15:30</option>
                    <option value="5/10 17:30-18:00">5/10 17:30-18:00</option>
                    <option value="5/14 15:00-15:30">5/14 15:00-15:30</option>
                  </select>
                </div>
              )}

              {pickupMethod === 'B' && (
                <div className="flex flex-col animate-in fade-in duration-300">
                  <label className="text-[10px] uppercase tracking-wider mb-2">選擇自取時段 <span className="text-red-500">*</span></label>
                  <select
                    required
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="bg-white border border-[#d1ccc4] px-3 py-2 text-sm focus:outline-none focus:border-[#8c7355]"
                  >
                    <option value="" disabled>-- 點擊選擇時段 --</option>
                    <option value="5/29 15:00-15:30">5/29 15:00-15:30</option>
                    <option value="5/29 17:30-18:00">5/29 17:30-18:00</option>
                  </select>
                </div>
              )}

              {pickupMethod === 'C' && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase tracking-wider mb-2">出貨梯次 <span className="text-red-500">*</span></label>
                    <select
                      required
                      value={shippingBatch}
                      onChange={(e) => setShippingBatch(e.target.value)}
                      className="bg-white border border-[#d1ccc4] px-3 py-2 text-sm focus:outline-none focus:border-[#8c7355]"
                    >
                      <option value="" disabled>-- 點擊選擇梯次 --</option>
                      <option value="5/12-13">5/12-13</option>
                      <option value="5/25-27">5/25-27</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase tracking-wider mb-2">收件地址 Address <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="bg-white border border-[#d1ccc4] px-3 py-2 text-sm focus:outline-none focus:border-[#8c7355]"
                    />
                  </div>
                </div>
              )}

              {pickupMethod === 'D' && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase tracking-wider mb-2">出貨梯次 <span className="text-red-500">*</span></label>
                    <select
                      required
                      value={shippingBatch}
                      onChange={(e) => setShippingBatch(e.target.value)}
                      className="bg-white border border-[#d1ccc4] px-3 py-2 text-sm focus:outline-none focus:border-[#8c7355]"
                    >
                      <option value="" disabled>-- 點擊選擇梯次 --</option>
                      <option value="5/12-13">5/12-13</option>
                      <option value="5/25-27">5/25-27</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase tracking-wider mb-2">7-11 門市名稱與店號 <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={storeInfo}
                      onChange={(e) => setStoreInfo(e.target.value)}
                      placeholder="例如：台北欣美門市 (123456)"
                      className="bg-white border border-[#d1ccc4] px-3 py-2 text-sm focus:outline-none focus:border-[#8c7355] placeholder:text-[#d1ccc4]"
                    />
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Footer Area with Total and Submit */}
          <div className="mt-12 pt-6 border-t border-[#e5e1da]">
            <div className="flex justify-between items-end mb-6">
              <span className="text-sm tracking-widest uppercase">總計 Total</span>
              <div className="text-right">
                <span className="text-[10px] opacity-60 block mb-1 tracking-widest uppercase text-[#8c7355]">Shipping fee excluded</span>
                <span className="text-2xl">NT$ {totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#3d2b1f] text-white py-4 uppercase tracking-[0.3em] text-xs font-bold hover:bg-[#5a402e] transition-colors disabled:opacity-70 flex justify-center items-center"
            >
              {isSubmitting ? '處理中 PROCESSING...' : '確認送出訂單 CONFIRM ORDER'}
            </button>
            <div className="text-center mt-6">
              <p className="text-[10px] uppercase tracking-widest opacity-40">
                © {new Date().getFullYear()} Dubai Chocolate Desserts
              </p>
            </div>
          </div>
        </section>
      </form>
    </div>
  );
}
