const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// The messed up part starts from `function updateDeliveryOptions() {` to `let pickupTime = "";`
// Let's rewrite updateDeliveryOptions completely and calculateTotal completely to ensure safety.

const correctUpdateDelivery = `function updateDeliveryOptions() {
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

// We will find where `function updateDeliveryOptions()` starts and where `submitBtn.disabled = true;` starts. That chunk got mangled.
// Wait, the form submit listener was:
// `orderForm.addEventListener('submit', async function(e) {`
html = html.replace(/function updateDeliveryOptions\(\) \{[\s\S]*?submitBtn\.disabled = true;/m, correctUpdateDelivery + '\n\n      // 處理計算總價與運費\n      function calculateTotal() {\n        updateDeliveryOptions();\n        \n        const q = parseInt(qtyQInput.value) || 0;\n        const qGift = parseInt(qtyQGiftInput.value) || 0;\n        const basque = parseInt(qtyBasqueInput.value) || 0;\n\n        // 更新 Q球 顆數\n        const qtyQPieces = document.getElementById("qtyQPieces");\n        if (qtyQPieces) {\n          qtyQPieces.textContent = (q * 2) + " 顆";\n        }\n        const qtyQGiftPieces = document.getElementById("qtyQGiftPieces");\n        if (qtyQGiftPieces) {\n          qtyQGiftPieces.textContent = (qGift * 6) + " 顆";\n        }\n\n        const totalQPrice = (q * priceQ) + (qGift * priceQGift);\n        const totalBasquePrice = basque * priceBasque;\n        const subtotal = totalQPrice + totalBasquePrice;\n        \n        let selectedMethod = "";\n        const checkedRadio = document.querySelector(\'input[name="pickupMethod"]:checked\');\n        if (checkedRadio) {\n          selectedMethod = checkedRadio.value;\n        }\n\n        let fee = 0;\n        // 等效Q球盒數 (用來粗略判斷未達免運時的運費級距，1盒禮盒約等於3盒Q球大小)\n        const equivalentQBoxes = q + (qGift * 3);\n\n        // 運費計算邏輯\n        if (selectedMethod === "C") { // 宅配到府(冷藏)\n          if (totalBasquePrice >= 3500) {\n            fee += 0;\n          } else if (basque > 0) {\n            if (basque <= 2) fee += 170;\n            else fee += 250;\n          }\n        } else if (selectedMethod === "D") { // 7-11店到店(冷凍)\n          if (totalQPrice >= 3500) {\n            fee += 0;\n          } else if (totalQPrice > 0) {\n            if (equivalentQBoxes <= 12) fee += 140;\n            else fee += 250; // 防呆增加\n          }\n        } else if (selectedMethod === "E") { // 宅配到府(冷凍)\n          if (totalQPrice >= 3500) {\n            fee += 0;\n          } else if (totalQPrice > 0) {\n            if (equivalentQBoxes <= 6) fee += 170;\n            else fee += 250;\n          }\n        }\n\n        const total = subtotal + fee;\n\n        // UI 顯示更新\n        subtotalDisplay.textContent = "NT$ " + subtotal.toLocaleString();\n        \n        if (fee > 0 || (subtotal > 0 && (selectedMethod === "C" || selectedMethod === "D" || selectedMethod === "E"))) {\n          // 有選擇寄送方式且有購買數量時顯示運費，0 元代表達免運門檻\n          shippingRow.style.display = "flex";\n          shippingFeeDisplay.textContent = fee === 0 ? "免運費" : "+ NT$ " + fee.toLocaleString();\n          if (fee === 0) {\n             shippingFeeDisplay.classList.add("text-green-600", "font-bold");\n          } else {\n             shippingFeeDisplay.classList.remove("text-green-600", "font-bold");\n          }\n        } else {\n          shippingRow.style.display = "none";\n        }\n\n        totalPriceDisplay.textContent = "NT$ " + total.toLocaleString();\n\n        return { subtotal, fee, total };\n      }\n\n      qtyQInput.addEventListener("input", calculateTotal);\n      qtyQInput.addEventListener("change", calculateTotal);\n      qtyQGiftInput.addEventListener("input", calculateTotal);\n      qtyQGiftInput.addEventListener("change", calculateTotal);\n      qtyBasqueInput.addEventListener("input", calculateTotal);\n      qtyBasqueInput.addEventListener("change", calculateTotal);\n\n      // 處理單選顯示不同欄位\n      function handlePickupChange(e) {\n        // 先將所有次級菜單藏起來，並移除必填\n        subPickups.forEach(el => {\n          el.style.display = "none";\n          const inputs = el.querySelectorAll("input, select");\n          inputs.forEach(input => input.removeAttribute("required"));\n        });\n\n        const selectedVal = e.target.value;\n        const selectedSub = document.getElementById("sub-" + selectedVal);\n        \n        if (selectedSub) {\n          // 針對不同區塊套用正確的 display 排列方式\n          if (selectedVal === "A" || selectedVal === "B") {\n            selectedSub.style.display = "flex";\n          } else {\n            selectedSub.style.display = "block";\n          }\n          // 將顯示出來的項目加上必填屬性 (排除 checkbox)\n          const inputs = selectedSub.querySelectorAll(\'input:not([type="checkbox"]), select\');\n          inputs.forEach(input => input.setAttribute("required", "true"));\n        }\n        \n        // 變更取貨方式時，重新計算運費\n        calculateTotal();\n      }\n\n      radioButtons.forEach(radio => {\n        radio.addEventListener("change", handlePickupChange);\n      });\n\n      // 處理表單發送\n      orderForm.addEventListener("submit", async function(e) {\n        e.preventDefault();\n\n        const q = parseInt(qtyQInput.value) || 0;\n        const qGift = parseInt(qtyQGiftInput.value) || 0;\n        const basque = parseInt(qtyBasqueInput.value) || 0;\n        const { subtotal, fee, total } = calculateTotal();\n\n        // 簡單驗證至少選擇一樣商品\n        if (q === 0 && qGift === 0 && basque === 0) {\n          alert("請至少選擇一項商品數量！");\n          return;\n        }\n\n        submitBtn.disabled = true;');

fs.writeFileSync('index.html', html);
console.log('Fixed mangle!');
