const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Swap the structural sections

// Extract "Customer Info"
const customerInfoStart = html.indexOf('<!-- 基本資料放在後面 -->');
const customerInfoEnd = html.indexOf('</aside>');
let customerInfoHTML = html.substring(customerInfoStart, customerInfoEnd);
html = html.substring(0, customerInfoStart) + html.substring(customerInfoEnd);

// Extract "Delivery" section from the right column
const deliveryStart = html.indexOf('<div class="space-y-6">');
const deliveryEnd = html.indexOf('<!-- Footer Area with Total and Submit -->');
let deliveryHTML = html.substring(deliveryStart, deliveryEnd);

// Note: deliveryHTML currently contains the top part of the right column (the div with space-y-6)
// We will move this deliveryHTML to the bottom of the aside (just before </aside>).
html = html.replace('</aside>', '\n        <!-- 取貨方式放在商品之後 -->\n        ' + deliveryHTML + '\n      </aside>');

// Put customerInfoHTML into the right column section where Delivery used to be
html = html.replace('<!-- Footer Area with Total and Submit -->', customerInfoHTML + '\n        <!-- Footer Area with Total and Submit -->');

// Adjust the width of columns to balance the height since left column will have more content
html = html.replace('class="w-full md:w-1/3 md:border-r', 'class="w-full md:w-1/2 lg:w-[55%] md:border-r');
html = html.replace('class="flex-1 p-6 md:p-8', 'class="w-full md:w-1/2 lg:w-[45%] p-6 md:p-8');

// 2. Add QGift product
const qGiftHTML = `
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <img src="images/Q.jpg" alt="杜拜巧克力Q球禮盒" class="w-12 h-12 rounded object-cover">
                <div class="flex flex-col">
                  <span class="text-base">杜拜巧克力 Q球禮盒</span>
                  <span class="text-sm opacity-60 font-sans">1盒6顆 $860元</span>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span id="qtyQGiftPieces" class="text-base text-[#8c7355] w-[40px] text-right font-medium">0 顆</span>
                <div class="flex items-center gap-1">
                  <select id="qtyQGift" class="w-16 bg-white border border-[#d1ccc4] px-2 py-1 text-center text-base focus:outline-none focus:border-[#8c7355]"></select>
                  <span class="text-base text-[#3d2b1f]">盒</span>
                </div>
              </div>
            </div>`;
// Insert right after Q product
html = html.replace('</div>\n            <div class="flex items-center justify-between">\n              <div class="flex items-center gap-4">\n                <img src="images/bas.jpg"', '</div>\n' + qGiftHTML + '\n            <div class="flex items-center justify-between">\n              <div class="flex items-center gap-4">\n                <img src="images/bas.jpg"');

// 3. Add mixed Warning message
const mixedWarningHTML = `
          <div id="mixedWarning" class="text-[#8c7355] text-sm mt-4 p-3 bg-[#fff9f0] border border-[#f3e6d5] rounded-sm" style="display: none;">
            ⚠️ 因Q球為冷凍，巴斯克為冷藏，若同時購買Q球(含禮盒)及巴斯克只能選擇面交，否則請填寫兩次訂單分別訂購
          </div>
`;
// Insert right before sub options container inside Delivery
html = html.replace('<!-- Sub options container -->', mixedWarningHTML + '\n          <!-- Sub options container -->');


// 4. Update JavaScript

// Add script config
html = html.replace('const priceQ = 270;', 'const priceQ = 270;\n      const priceQGift = 860;');
html = html.replace("const qtyBasqueInput = document.getElementById('qtyBasque');", "const qtyQGiftInput = document.getElementById('qtyQGift');\n      const qtyBasqueInput = document.getElementById('qtyBasque');");
html = html.replace('qtyQInput.add(new Option(i, i));', 'qtyQInput.add(new Option(i, i));\n        qtyQGiftInput.add(new Option(i, i));');

// Notice free shipping update
html = html.replace('🧆Q球13盒以上免運費，巴斯克4盒以上免運費。(限單一地址)', '🧆Q球系列(含禮盒)滿3500元即享冷凍免運，巴斯克單獨購買滿3500元即享冷藏免運。(限單一地址)');

fs.writeFileSync('index.html', html);
console.log('HTML and JS structurally updated.');
