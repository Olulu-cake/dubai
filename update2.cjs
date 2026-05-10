const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Update JS functions

// 1. updateDeliveryOptions
const updateDeliveryStr = `function updateDeliveryOptions() {
        const q = parseInt(qtyQInput.value) || 0;
        const qGift = parseInt(qtyQGiftInput.value) || 0;
        const totalQ = q + qGift;
        const basque = parseInt(qtyBasqueInput.value) || 0;

        const methodCLabel = document.getElementById('methodCLabel');
        const methodDLabel = document.getElementById('methodDLabel');
        const methodELabel = document.getElementById('methodELabel');
        const radioC = document.querySelector('input[value="C"]');
        const radioD = document.querySelector('input[value="D"]');
        const radioE = document.querySelector('input[value="E"]');
        const mixedWarning = document.getElementById('mixedWarning');

        if (totalQ > 0 && basque === 0) {
          // 只有Q球，不顯示宅配到府(冷藏)
          methodCLabel.style.display = 'none';
          radioC.disabled = true;
          methodDLabel.style.display = 'block';
          radioD.disabled = false;
          methodELabel.style.display = 'block';
          radioE.disabled = false;
          mixedWarning.style.display = 'none';
        } else if (basque > 0 && totalQ === 0) {
          // 只有巴斯克，不顯示7-11店到店(冷凍) 和 宅配到府(冷凍)
          methodCLabel.style.display = 'block';
          radioC.disabled = false;
          methodDLabel.style.display = 'none';
          radioD.disabled = true;
          methodELabel.style.display = 'none';
          radioE.disabled = true;
          mixedWarning.style.display = 'none';
        } else if (totalQ > 0 && basque > 0) {
          // 兩者皆有，都不顯示 (只能自取)
          methodCLabel.style.display = 'none';
          radioC.disabled = true;
          methodDLabel.style.display = 'none';
          radioD.disabled = true;
          methodELabel.style.display = 'none';
          radioE.disabled = true;
          mixedWarning.style.display = 'block';
        } else {
          // 都為 0 (初始狀態)
          methodCLabel.style.display = 'block';
          radioC.disabled = false;
          methodDLabel.style.display = 'block';
          radioD.disabled = false;
          methodELabel.style.display = 'block';
          radioE.disabled = false;
          mixedWarning.style.display = 'none';
        }

        // 若當前選中的被隱藏，取消選中，隱藏次選單，並移除必填，並重新計算運費
        const checkedRadio = document.querySelector('input[name="pickupMethod"]:checked');
        if (checkedRadio) {
          if ((checkedRadio.value === 'C' && radioC.disabled) ||
              (checkedRadio.value === 'D' && radioD.disabled) ||
              (checkedRadio.value === 'E' && radioE.disabled)) {
            checkedRadio.checked = false;
            subPickups.forEach(el => {
              el.style.display = 'none';
              const inputs = el.querySelectorAll('input, select');
              inputs.forEach(input => input.removeAttribute('required'));
            });
          }
        }
      }`;

html = html.replace(/function updateDeliveryOptions\(\) \{[\s\S]*?(?=function calculateTotal\(\))/m, updateDeliveryStr + '\n\n      ');

// 2. calculateTotal
const calcTotalStr = `function calculateTotal() {
        updateDeliveryOptions();
        
        const q = parseInt(qtyQInput.value) || 0;
        const qGift = parseInt(qtyQGiftInput.value) || 0;
        const basque = parseInt(qtyBasqueInput.value) || 0;

        // 更新 Q球 顆數
        const qtyQPieces = document.getElementById('qtyQPieces');
        if (qtyQPieces) {
          qtyQPieces.textContent = (q * 2) + ' 顆';
        }
        const qtyQGiftPieces = document.getElementById('qtyQGiftPieces');
        if (qtyQGiftPieces) {
          qtyQGiftPieces.textContent = (qGift * 6) + ' 顆';
        }

        const totalQPrice = (q * priceQ) + (qGift * priceQGift);
        const totalBasquePrice = basque * priceBasque;
        const subtotal = totalQPrice + totalBasquePrice;
        
        let selectedMethod = '';
        const checkedRadio = document.querySelector('input[name="pickupMethod"]:checked');
        if (checkedRadio) {
          selectedMethod = checkedRadio.value;
        }

        let fee = 0;
        // 等效Q球盒數 (用來粗略判斷未達免運時的運費級距，1盒禮盒約等於3盒Q球大小)
        const equivalentQBoxes = q + (qGift * 3);

        // 運費計算邏輯
        if (selectedMethod === 'C') { // 宅配到府(冷藏)
          if (totalBasquePrice >= 3500) {
            fee += 0;
          } else if (basque > 0) {
            if (basque <= 2) fee += 170;
            else fee += 250;
          }
        } else if (selectedMethod === 'D') { // 7-11店到店(冷凍)
          if (totalQPrice >= 3500) {
            fee += 0;
          } else if (totalQPrice > 0) {
            if (equivalentQBoxes <= 12) fee += 140;
            else fee += 250; // 防呆增加
          }
        } else if (selectedMethod === 'E') { // 宅配到府(冷凍)
          if (totalQPrice >= 3500) {
            fee += 0;
          } else if (totalQPrice > 0) {
            if (equivalentQBoxes <= 6) fee += 170;
            else fee += 250;
          }
        }

        const total = subtotal + fee;

        // UI 顯示更新
        subtotalDisplay.textContent = 'NT$ ' + subtotal.toLocaleString();
        
        if (fee > 0 || (subtotal > 0 && (selectedMethod === 'C' || selectedMethod === 'D' || selectedMethod === 'E'))) {
          // 有選擇寄送方式且有購買數量時顯示運費，0 元代表達免運門檻
          shippingRow.style.display = 'flex';
          shippingFeeDisplay.textContent = fee === 0 ? '免運費' : '+ NT$ ' + fee.toLocaleString();
          if (fee === 0) {
             shippingFeeDisplay.classList.add('text-green-600', 'font-bold');
          } else {
             shippingFeeDisplay.classList.remove('text-green-600', 'font-bold');
          }
        } else {
          shippingRow.style.display = 'none';
        }

        totalPriceDisplay.textContent = 'NT$ ' + total.toLocaleString();

        return { subtotal, fee, total };
      }`;

html = html.replace(/function calculateTotal\(\) \{[\s\S]*?(?=qtyQInput.addEventListener)/m, calcTotalStr + '\n\n      ');

// 3. Event listeners addition
html = html.replace("qtyQInput.addEventListener('change', calculateTotal);", "qtyQInput.addEventListener('change', calculateTotal);\n      qtyQGiftInput.addEventListener('input', calculateTotal);\n      qtyQGiftInput.addEventListener('change', calculateTotal);");

// 4. Form Submission Variables
const formDataExtract = `const q = parseInt(qtyQInput.value) || 0;
        const qGift = parseInt(qtyQGiftInput.value) || 0;
        const basque = parseInt(qtyBasqueInput.value) || 0;
        const { subtotal, fee, total } = calculateTotal();

        // 簡單驗證至少選擇一樣商品
        if (q === 0 && qGift === 0 && basque === 0) {
          alert("請至少選擇一項商品數量！");
          return;
        }`;

html = html.replace(/const q = parseInt\(qtyQInput\.value\) \|\| 0;[\s\S]*?return;\n        \}/m, formDataExtract);

// Update formData object
html = html.replace('qtyQ: q,', 'qtyQ: q,\n          qtyQGift: qGift,');

// Modify successMessage to include QGift
let newProductsStr = 'let productsStr = "";\n        if (q > 0) productsStr += `杜拜巧克力 Q球: ${q} 盒\\n`;\n        if (qGift > 0) productsStr += `杜拜巧克力 Q球禮盒: ${qGift} 盒\\n`;\n        if (basque > 0) productsStr += `杜拜巧克力巴斯克: ${basque} 盒\\n`;';
html = html.replace(/let productsStr \= ""\;[\s\S]*?杜拜巧克力巴斯克\: \$\{basque\} 盒\\n\`\;/, newProductsStr);

fs.writeFileSync('index.html', html);
console.log('Update 2 done!');
