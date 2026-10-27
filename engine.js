/**
 * ========================================================================
 * Document: engine.js
 * Description: Core application logic for the Space Theme Spin Wheel & Give Group.
 * Handles wheel calculations, canvas rendering, animation loops, DOM transitions,
 * group distribution logic with max-individual constraints, and internationalization (i18n).
 * ========================================================================
 */

/**
 * WheelEngine Class
 * Manages raw item inputs, slice calculation percentages, and binary indexing for the wheel.
 */
class WheelEngine {
  constructor() {
    this.rawText = "";
    this.customPercentages = {};
  }

  // Sets raw input string from the textarea
  setRawText(text) {
    this.rawText = text;
  }

  // Converts slice number to binary representation
  toBinary(n) {
    return (n >>> 0).toString(2);
  }

  // Splits raw text into valid non-empty item lines
  getLines() {
    return this.rawText
      .split("\n")
      .map(l => l.trim())
      .filter(l => l.length > 0);
  }

  // Calculates slice angles, weights, colors, and properties for canvas drawing
  getSlices() {
    const lines = this.getLines();
    const total = lines.length;
    const slices = [];

    if (total === 0) {
      slices.push({
        text: "",
        binary: "1",
        bg_color: "#ffffff",
        text_color: "#000000",
        start_angle: 0,
        end_angle: 2 * Math.PI,
        weight: 100
      });
    } else {
      const weights = lines.map(line => {
        const val = this.customPercentages[line];
        return (val !== undefined && !isNaN(val) && val >= 0) ? Number(val) : (100 / total);
      });

      const totalWeight = weights.reduce((sum, w) => sum + w, 0);
      let currentAngle = -Math.PI / 2;

      for (let i = 0; i < total; i++) {
        const weight = weights[i];
        const sliceFraction = totalWeight > 0 ? (weight / totalWeight) : (1 / total);
        const sliceAngle = sliceFraction * 2 * Math.PI;

        const startAngle = currentAngle;
        const endAngle = currentAngle + sliceAngle;
        currentAngle = endAngle;

        const bgColor = total === 1 ? "#ffffff" : (i % 2 === 0 ? "#ffffff" : "#000000");
        const textColor = total > 1 && i % 2 !== 0 ? "#ffffff" : "#000000";
        const binaryCode = this.toBinary(i + 1);

        slices.push({
          text: lines[i],
          binary: binaryCode,
          bg_color: bgColor,
          text_color: textColor,
          start_angle: startAngle,
          end_angle: endAngle,
          weight: Math.round(sliceFraction * 100)
        });
      }
    }

    return slices;
  }
}

// Event listener triggered when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  const engine = new WheelEngine();

  // Localization Dictionary for English (en) and Indonesian (id)
  const translations = {
    id: {
      "app-title": "SPIN WHEEL",
      "nav-home": "Home",
      "nav-main": "main",
      "nav-setting": "setting",
      "welcome-title": "Selamat Datang",
      "welcome-desc": "Selamat datang di https://spinwheel-spc.netlify.app/. Silakan jelajahi setiap sudut antarmuka ini dengan santai dan nikmati pengalaman eksplorasi interaktif yang telah kami siapkan khusus untuk Anda.",
      "feature-title": "Fitur Unggulan",
      "feature-desc": "Aplikasi ini dilengkapi dengan dua fitur utama yang sangat interaktif: Spin Wheel untuk melakukan undian atau gacha acak dengan roda berputar yang dapat disesuaikan persentasenya, serta Give Group untuk membagikan dan mengacak daftar item ke dalam berbagai card grup secara otomatis dan merata.",
      "btn-start-wheel": "Mulai Spin Wheel",
      "mode-select-label": "MODE SPIN WHEEL",
      "opt-spin": "spin wheel",
      "opt-group": "give group",
      "spinning-text": "SPINNING...",
      "placeholder-wheel-label": "judul spin wheel",
      "placeholder-wheel-items": "test 1\ntest 2",
      "btn-spin-action": "SPIN WHEEL",
      "group-input-title": "GIVE GROUP INPUT",
      "trigger-label": "NAMA JUDUL",
      "placeholder-trigger": "Masukkan nama judul...",
      "items-label": "DAFTAR DATA ISI",
      "placeholder-group-items": "test 1\ntest 2\ntest 3",
      "btn-group-action": "GIVE GROUP",
      "setting-title": "System Configuration",
      "setting-star-label": "Aktifkan Bintang Jatuh",
      "setting-lang-label": "BAHASA / LANGUAGE",
      "github-card-title": "Open Source Project",
      "github-card-desc": "Proyek ini bersifat open source. Anda dapat melihat, mempelajari, atau berkontribusi pada kode sumber melalui repositori GitHub kami di bawah ini:",
      "github-btn": "Kunjungi GitHub Repository",
      "result-title": "Hasil Terpilih",
      "btn-save": "SAVE",
      "btn-close": "CLOSE",
      "wheel-setting-title": "WHEEL SETTINGS",
      "hide-roll-label": "Hide Roll Cover Wheel",
      "group-setting-title": "GROUP SETTINGS",
      "card-count-label": "JUMLAH CARD OUTPUT",
      "max-individu-label": "MAX INDIVIDU PER CARD",
      "btn-apply-close": "APPLY & CLOSE",
      "percentage-setting-title": "WHEEL PERCENTAGE SETTINGS",
      "percentage-desc": "Masukkan persentase (0 - 100). Nilai lain akan otomatis disesuaikan agar pas 100%.",
      "btn-apply": "APPLY",
      "btn-reset": "RESET",
      "placeholder-empty": "",
      "placeholder-empty-short": ""
    },
    en: {
      "app-title": "SPIN WHEEL",
      "nav-home": "Home",
      "nav-main": "main",
      "nav-setting": "setting",
      "welcome-title": "Welcome",
      "welcome-desc": "Welcome to https://spinwheel-spc.vercel.app/. Please explore every corner of this interface smoothly and enjoy the interactive exploration experience we have prepared for you.",
      "feature-title": "Core Features",
      "feature-desc": "This app features two highly interactive tools: Spin Wheel for random gacha draws with adjustable slice percentages, and Give Group to shuffle and distribute item lists evenly across multiple group cards automatically.",
      "btn-start-wheel": "Start Spin Wheel",
      "mode-select-label": "SPIN WHEEL MODE",
      "opt-spin": "spin wheel",
      "opt-group": "give group",
      "spinning-text": "SPINNING...",
      "placeholder-wheel-label": "spin wheel title",
      "placeholder-wheel-items": "test 1\ntest 2",
      "btn-spin-action": "SPIN WHEEL",
      "group-input-title": "GIVE GROUP INPUT",
      "trigger-label": "TITLE NAME",
      "placeholder-trigger": "Enter title name...",
      "items-label": "ITEMS DATA LIST",
      "placeholder-group-items": "test 1\ntest 2\ntest 3",
      "btn-group-action": "GIVE GROUP",
      "setting-title": "System Configuration",
      "setting-star-label": "Enable Shooting Stars",
      "setting-lang-label": "LANGUAGE / BAHASA",
      "github-card-title": "Open Source Project",
      "github-card-desc": "This project is open source. You can view, learn from, or contribute to the source code through our GitHub repository below:",
      "github-btn": "Visit GitHub Repository",
      "result-title": "Selected Result",
      "btn-save": "SAVE",
      "btn-close": "CLOSE",
      "wheel-setting-title": "WHEEL SETTINGS",
      "hide-roll-label": "Hide Roll Cover Wheel",
      "group-setting-title": "GROUP SETTINGS",
      "card-count-label": "OUTPUT CARD COUNT",
      "max-individu-label": "MAX INDIVIDUALS PER CARD",
      "btn-apply-close": "APPLY & CLOSE",
      "percentage-setting-title": "WHEEL PERCENTAGE SETTINGS",
      "percentage-desc": "Enter percentage (0 - 100). Other values will automatically adjust to total 100%.",
      "btn-apply": "APPLY",
      "btn-reset": "RESET",
      "placeholder-empty": "",
      "placeholder-empty-short": ""
    }
  };

  let currentLang = "en"; // Default language set to English

  // Function to apply translation dictionary to DOM elements
  function applyLanguage(lang) {
    currentLang = lang;
    const dict = translations[lang] || translations["en"];

    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (dict[key] !== undefined) {
        el.textContent = dict[key];
      }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (dict[key] !== undefined) {
        el.setAttribute("placeholder", dict[key]);
      }
    });
  }

  // Language selector event listener
  const languageSelect = document.getElementById("language-select");
  if (languageSelect) {
    languageSelect.value = currentLang;
    languageSelect.addEventListener("change", (e) => {
      applyLanguage(e.target.value);
    });
  }

  applyLanguage(currentLang);

  // Shooting star animation toggle control
  const checkboxShootingStar = document.getElementById("checkbox-shooting-star");
  const shootingStars = document.querySelectorAll("[data-star]");
  if (checkboxShootingStar) {
    checkboxShootingStar.addEventListener("change", (e) => {
      const isChecked = e.target.checked;
      shootingStars.forEach(star => {
        star.style.display = isChecked ? "block" : "none";
      });
    });
  }

  // DOM Elements Selection for Navigation and Tabs
  const hamburger = document.getElementById("hamburger");
  const dropdown = document.getElementById("dropdown");
  const tabLinks = document.querySelectorAll(".tab-link");
  const goToMainBtn = document.getElementById("go-to-main");

  // Mode Selector Elements
  const modeSelect = document.getElementById("mode-select");
  const modeCardSpin = document.getElementById("mode-card-spin");
  const modeCardGroupContainer = document.getElementById("mode-card-group-container");

  // Spin Wheel Canvas & Input Elements
  const canvas = document.getElementById("wheel-canvas");
  const ctx = canvas ? canvas.getContext("2d") : null;
  const wheelTextarea = document.getElementById("wheel-item-input");
  const startSpinBtn = document.getElementById("btn-start-spin");
  const resetWheelBtn = document.getElementById("btn-reset-wheel");

  const wheelCardTitleInput = document.getElementById("wheel-card-title-input");
  const wheelDynamicHeader = document.getElementById("wheel-dynamic-header");
  const wheelDynamicLabelText = document.getElementById("wheel-dynamic-label-text");
  const wheelWrapper = document.querySelector(".wheel-wrapper");

  // Give Group Elements
  const groupMasterContainer = document.getElementById("group-master-container");
  const groupTriggerInput = document.getElementById("group-trigger-input");
  const groupItemInput = document.getElementById("group-item-input");
  const giveGroupActionBtn = document.getElementById("btn-give-group-action");

  // Give Group Settings Modal Elements
  const groupGearBtn = document.getElementById("btn-group-gear");
  const groupSettingModal = document.getElementById("group-setting-modal");
  const groupSettingCloseBtn = document.getElementById("btn-group-setting-close");
  const inputGroupCardCount = document.getElementById("input-group-card-count");
  const inputMaxIndividu = document.getElementById("input-max-individu");

  // Spin Wheel Settings Modal Elements
  const spinGearBtn = document.getElementById("btn-spin-gear");
  const settingModal = document.getElementById("setting-modal");
  const settingCloseBtn = document.getElementById("btn-setting-close");
  const hideRollCheckbox = document.getElementById("checkbox-hide-roll");
  const hideRollOverlay = document.getElementById("hide-roll-overlay");

  // Percentage Modal Elements
  const percentageModal = document.getElementById("percentage-modal");
  const percentageCloseBtn = document.getElementById("btn-percentage-close");
  const percentageSaveBtn = document.getElementById("btn-percentage-save");
  const percentageResetBtn = document.getElementById("btn-percentage-reset");
  const percentageListContainer = document.getElementById("percentage-list-container");

  // Result Modal Elements
  const resultModal = document.getElementById("result-modal");
  const resultTextDisplay = document.getElementById("result-text-display");
  const saveBtn = document.getElementById("btn-result-save");
  const closeBtn = document.getElementById("btn-result-close");

  // Audio click effect for wheel rotation ticks
  const clickAudio = new Audio("https://cdn.freesound.org/previews/608/608617_11861866-lq.mp3");
  clickAudio.volume = 1.0;

  // Hamburger Menu Toggle Handler
  if (hamburger && dropdown) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("open");
      dropdown.classList.toggle("open");
    });
  }

  let isAnimating = false;

  // Resets scroll bounds for active panes
  function updateScrollBounds() {
    const activePane = document.querySelector(".tab-pane.active");
    if (!activePane) return;
    activePane.scrollTop = 0;
  }

  // Smooth Tab Switching Animation with Fade Overlay
  function switchTab(targetId, targetLink) {
    if (isAnimating) return;
    const currentPane = document.querySelector(".tab-pane.active");
    const targetPane = document.getElementById(targetId);

    if (!currentPane || !targetPane || currentPane === targetPane) return;

    isAnimating = true;

    tabLinks.forEach(l => l.classList.remove("active"));
    if (targetLink) {
      targetLink.classList.add("active");
    } else {
      const matchingLink = document.querySelector(`.tab-link[data-target="${targetId}"]`);
      if (matchingLink) matchingLink.classList.add("active");
    }

    const overlay = document.createElement("div");
    overlay.className = "fade-overlay";
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.classList.add("solid");
    });

    setTimeout(() => {
      currentPane.classList.remove("active");
      targetPane.classList.add("active");

      overlay.classList.remove("solid");
      updateScrollBounds();

      setTimeout(() => {
        overlay.remove();
        isAnimating = false;
      }, 300);
    }, 300);
  }

  tabLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("data-target");
      if (targetId) {
        switchTab(targetId, link);
      }
      if (hamburger && dropdown) {
        hamburger.classList.remove("open");
        dropdown.classList.remove("open");
      }
    });
  });

  if (goToMainBtn) {
    goToMainBtn.addEventListener("click", () => {
      const mainLink = document.querySelector('.tab-link[data-target="content-main"]');
      switchTab("content-main", mainLink);
    });
  }

  // Mode Selector Change Handler (Spin Wheel vs Give Group)
  if (modeSelect && modeCardSpin && modeCardGroupContainer) {
    modeSelect.addEventListener("change", (e) => {
      const target = e.target;
      if (target.value === "spin-wheel") {
        modeCardSpin.style.display = "block";
        modeCardGroupContainer.style.display = "none";
      } else {
        modeCardSpin.style.display = "none";
        modeCardGroupContainer.style.display = "flex";
      }
      updateScrollBounds();
    });
  }

  // Dynamic Wheel Title Header Input Handler
  if (wheelCardTitleInput && wheelDynamicHeader && wheelDynamicLabelText && modeCardSpin && wheelWrapper) {
    wheelCardTitleInput.addEventListener("input", (e) => {
      const val = e.target.value.trim();
      if (val !== "") {
        wheelDynamicLabelText.textContent = val;
        wheelDynamicHeader.classList.add("show");
        modeCardSpin.classList.add("has-active-title");
        wheelWrapper.classList.add("has-title");
      } else {
        wheelDynamicHeader.classList.remove("show");
        modeCardSpin.classList.remove("has-active-title");
        wheelWrapper.classList.remove("has-title");
      }
      updateScrollBounds();
    });
  }

  // Renders dynamic group output cards based on configured count
  function renderGroupCards(count) {
    if (!groupMasterContainer) return;
    groupMasterContainer.innerHTML = "";

    const triggerVal = groupTriggerInput ? groupTriggerInput.value.trim() : "";
    const dict = translations[currentLang] || translations["en"];
    const placeholderText = dict["placeholder-empty"] || "";

    for (let i = 1; i <= count; i++) {
      const card = document.createElement("div");
      card.className = "group-output-card";

      const header = document.createElement("div");
      header.className = "group-output-header";

      const numSpan = document.createElement("span");
      numSpan.className = "group-box-number";
      numSpan.textContent = i;

      const triggerSpan = document.createElement("span");
      triggerSpan.className = "group-box-trigger-label output-trigger-label";
      triggerSpan.textContent = triggerVal;

      header.appendChild(numSpan);
      header.appendChild(triggerSpan);

      const content = document.createElement("div");
      content.className = "group-output-content";
      content.id = `group-output-${i}`;
      content.innerHTML = `<span class="group-placeholder-text" data-i18n="placeholder-empty">${placeholderText}</span>`;

      card.appendChild(header);
      card.appendChild(content);

      groupMasterContainer.appendChild(card);
    }
  }

  renderGroupCards(2);

  // Updates trigger labels across output cards in real-time
  if (groupTriggerInput) {
    groupTriggerInput.addEventListener("input", (e) => {
      const val = e.target.value.trim();
      const triggerLabels = document.querySelectorAll(".output-trigger-label");
      triggerLabels.forEach(lbl => {
        lbl.textContent = val;
      });
    });
  }

  if (groupGearBtn && groupSettingModal) {
    groupGearBtn.addEventListener("click", () => {
      groupSettingModal.classList.add("show");
    });
  }

  if (groupSettingCloseBtn && groupSettingModal && inputGroupCardCount) {
    groupSettingCloseBtn.addEventListener("click", () => {
      let count = parseInt(inputGroupCardCount.value, 10);
      if (isNaN(count) || count < 1) count = 1;
      if (count > 20) count = 20;
      inputGroupCardCount.value = count;

      renderGroupCards(count);
      groupSettingModal.classList.remove("show");
      updateScrollBounds();
    });
  }

  // Give Group Action Handler: Enforces min items per card before proceeding, distributes excess randomly
  if (giveGroupActionBtn && groupItemInput) {
    giveGroupActionBtn.addEventListener("click", (e) => {
      e.preventDefault();
      
      const raw = groupItemInput.value;
      const lines = raw.split("\n").map(l => l.trim()).filter(l => l.length > 0);

      const outputContainers = document.querySelectorAll(".group-output-content");
      const cardCount = outputContainers.length;

      if (cardCount === 0) {
        alert("Tidak ada card output yang aktif!");
        return;
      }

      if (lines.length === 0) {
        alert("Masukkan daftar item terlebih dahulu!");
        return;
      }

      let maxIndividu = inputMaxIndividu ? parseInt(inputMaxIndividu.value, 10) : 3;
      if (isNaN(maxIndividu) || maxIndividu < 1) maxIndividu = 3;

      // Fisher-Yates Shuffle algorithm for randomness
      for (let i = lines.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [lines[i], lines[j]] = [lines[j], lines[i]];
      }

      const groupedItems = Array.from({ length: cardCount }, () => []);
      let itemIndex = 0;

      // Rule 1: Fill each card up to maxIndividu capacity sequentially
      for (let c = 0; c < cardCount; c++) {
        while (groupedItems[c].length < maxIndividu && itemIndex < lines.length) {
          groupedItems[c].push(lines[itemIndex]);
          itemIndex++;
        }
      }

      // Rule 2: Distribute remaining excess items randomly across full cards
      while (itemIndex < lines.length) {
        const randomCardIdx = Math.floor(Math.random() * cardCount);
        groupedItems[randomCardIdx].push(lines[itemIndex]);
        itemIndex++;
      }

      const dict = translations[currentLang] || translations["en"];
      const emptyText = dict["placeholder-empty-short"] || "";

      outputContainers.forEach((container, idx) => {
        container.innerHTML = "";
        const items = groupedItems[idx];

        if (!items || items.length === 0) {
          container.innerHTML = `<span class="group-placeholder-text" data-i18n="placeholder-empty-short">${emptyText}</span>`;
        } else {
          items.forEach(item => {
            const div = document.createElement("div");
            div.className = "group-output-item";
            div.textContent = item;
            container.appendChild(div);
          });
        }
      });

      updateScrollBounds();
    });
  }

  if (spinGearBtn && settingModal) {
    spinGearBtn.addEventListener("click", () => {
      settingModal.classList.add("show");
    });
  }

  if (settingCloseBtn && settingModal) {
    settingCloseBtn.addEventListener("click", () => {
      settingModal.classList.remove("show");
    });
  }

  if (canvas && percentageModal) {
    canvas.addEventListener("click", () => {
      if (isSpinning) return;
      const lines = engine.getLines();
      if (lines.length === 0) return;

      populatePercentageModal();
      percentageModal.classList.add("show");
    });
  }

  // Populates percentage adjustment modal list
  function populatePercentageModal() {
    percentageListContainer.innerHTML = "";
    const currentSlices = engine.getSlices();

    currentSlices.forEach(slice => {
      if (!slice.text) return;
      const row = document.createElement("div");
      row.className = "percentage-row";

      const nameSpan = document.createElement("span");
      nameSpan.className = "percentage-item-name";
      nameSpan.textContent = slice.text;

      const input = document.createElement("input");
      input.type = "text";
      input.className = "percentage-input";
      input.value = engine.customPercentages[slice.text] !== undefined ? engine.customPercentages[slice.text] : slice.weight;
      input.setAttribute("data-item", slice.text);

      input.addEventListener("input", (e) => {
        let val = e.target.value.replace(/,/g, '.').replace(/[^0-9.]/g, "");
        const parts = val.split('.');
        if (parts.length > 2) {
          val = parts[0] + '.' + parts.slice(1).join('');
        }

        if (val !== "" && val !== ".") {
          let num = parseFloat(val);
          if (num > 100) num = 100;
          if (num < 0) num = 0;
          val = num.toString();
        }
        e.target.value = val;

        autoBalancePercentages(input);
      });

      row.appendChild(nameSpan);
      row.appendChild(input);
      percentageListContainer.appendChild(row);
    });
  }

  // Auto-balances percentage weights to total 100%
  function autoBalancePercentages(changedInput) {
    const inputs = percentageListContainer.querySelectorAll(".percentage-input");
    if (inputs.length <= 1) return;

    let changedVal = parseFloat(changedInput.value);
    if (isNaN(changedVal)) changedVal = 0;
    if (changedVal > 100) changedVal = 100;
    if (changedVal < 0) changedVal = 0;

    let remainingSum = 100 - changedVal;
    if (remainingSum < 0) remainingSum = 0;

    const otherInputs = Array.from(inputs).filter(inp => inp !== changedInput);
    
    let currentOthersSum = otherInputs.reduce((sum, inp) => {
      let v = parseFloat(inp.value);
      return sum + (isNaN(v) ? 0 : v);
    }, 0);

    otherInputs.forEach(inp => {
      let v = parseFloat(inp.value);
      if (isNaN(v)) v = 0;
      let newVal = 0;
      if (currentOthersSum > 0) {
        newVal = (v / currentOthersSum) * remainingSum;
      } else {
        newVal = remainingSum / otherInputs.length;
      }
      inp.value = Number(newVal.toFixed(2));
    });
  }

  if (percentageCloseBtn && percentageModal) {
    percentageCloseBtn.addEventListener("click", () => {
      percentageModal.classList.remove("show");
    });
  }

  if (percentageResetBtn) {
    percentageResetBtn.addEventListener("click", () => {
      engine.customPercentages = {};
      populatePercentageModal();
    });
  }

  if (percentageSaveBtn && percentageModal) {
    percentageSaveBtn.addEventListener("click", () => {
      const inputs = percentageListContainer.querySelectorAll(".percentage-input");
      inputs.forEach(input => {
        const item = input.getAttribute("data-item");
        let val = parseFloat(input.value.replace(/,/g, '.'));
        if (isNaN(val) || val < 0) val = 0;
        if (val > 100) val = 100;
        engine.customPercentages[item] = val;
      });

      percentageModal.classList.remove("show");
      renderWheel(currentRotation);
    });
  }

  let currentRotation = 0;
  let isSpinning = false;
  let currentSliceIndex = -1;
  let lastWinningText = "";

  // Renders the interactive wheel onto the HTML5 Canvas
  function renderWheel(rotationAngle = 0) {
    if (!ctx || !canvas) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const fullRadius = width / 2 - 2;
    const innerOffset = 5;
    const drawRadius = fullRadius - innerOffset;

    ctx.clearRect(0, 0, width, height);

    const slices = engine.getSlices();
    const totalSlices = slices.length;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotationAngle);
    ctx.translate(-centerX, -centerY);

    slices.forEach((slice, i) => {
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, drawRadius, slice.start_angle, slice.end_angle);
      ctx.closePath();

      ctx.fillStyle = slice.bg_color;
      ctx.fill();

      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();

      const nextSlice = slices[(i + 1) % totalSlices];
      if (totalSlices > 1 && nextSlice.bg_color === slice.bg_color) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        const lineX = centerX + drawRadius * Math.cos(slice.end_angle);
        const lineY = centerY + drawRadius * Math.sin(slice.end_angle);
        ctx.lineTo(lineX, lineY);
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      }

      if (slice.text) {
        const midAngle = (slice.start_angle + slice.end_angle) / 2;
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(midAngle);

        let maxAllowedWidth = drawRadius - 35;
        let fontSize = 14;
        ctx.font = `bold ${fontSize}px 'Space Grotesk', sans-serif`;
        let textWidth = ctx.measureText(slice.text).width;

        if (textWidth > maxAllowedWidth) {
          fontSize = Math.max(8, Math.floor(14 * (maxAllowedWidth / textWidth)));
          ctx.font = `bold ${fontSize}px 'Space Grotesk', sans-serif`;
        }

        ctx.textAlign = "right";
        ctx.fillStyle = slice.text_color;
        ctx.fillText(slice.text, drawRadius - 15, 4);
        ctx.restore();
      }
    });

    const dotRadius = 18;
    ctx.beginPath();
    ctx.arc(centerX, centerY, dotRadius, 0, 2 * Math.PI);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.restore();

    if (totalSlices > 0) {
      const normalizedAngle = ((-rotationAngle) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
      
      let activeIdx = 0;
      for (let i = 0; i < totalSlices; i++) {
        const s = slices[i];
        let sa = (s.start_angle + Math.PI/2) % (2*Math.PI);
        if (sa < 0) sa += 2*Math.PI;
        let ea = (s.end_angle + Math.PI/2) % (2*Math.PI);
        if (ea < 0) ea += 2*Math.PI;

        if (sa > ea) {
          if (normalizedAngle >= sa || normalizedAngle < ea) {
            activeIdx = i;
            break;
          }
        } else {
          if (normalizedAngle >= sa && normalizedAngle < ea) {
            activeIdx = i;
            break;
          }
        }
      }

      if (activeIdx !== currentSliceIndex) {
        if (currentSliceIndex !== -1 && isSpinning) {
          clickAudio.currentTime = 0;
          clickAudio.play().catch(() => {});
        }
        currentSliceIndex = activeIdx;
      }
    }
  }

  function updateEngineText() {
    if (wheelTextarea) {
      const val = wheelTextarea.value;
      engine.setRawText(val);
      renderWheel(currentRotation);
      updateScrollBounds();
    }
  }

  if (wheelTextarea) {
    wheelTextarea.addEventListener("input", updateEngineText);
  }

  updateEngineText();

  if (resetWheelBtn) {
    resetWheelBtn.addEventListener("click", () => {
      if (isSpinning) return;
      if (wheelTextarea) {
        wheelTextarea.value = "";
      }
      engine.customPercentages = {};
      currentRotation = 0;
      currentSliceIndex = -1;
      updateEngineText();
    });
  }

  // Spin Wheel Action Handler with physics animation and deceleration
  if (startSpinBtn) {
    startSpinBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (isSpinning) return;
      const slices = engine.getSlices();
      if (slices.length === 0 || (slices.length === 1 && !slices[0].text)) return;

      isSpinning = true;
      currentSliceIndex = -1;

      const hideRollActive = hideRollCheckbox && hideRollCheckbox.checked;
      if (hideRollActive && hideRollOverlay) {
        hideRollOverlay.classList.add("show");
      }

      let speed = 1.6 + Math.random() * 0.9;
      const deceleration = 0.985;
      const minSpeed = 0.0005;

      function animateSpin() {
        if (speed > minSpeed) {
          currentRotation += speed;
          speed *= deceleration;
          renderWheel(currentRotation);
          requestAnimationFrame(animateSpin);
        } else {
          isSpinning = false;
          const slicesArr = engine.getSlices();
          const totalSlices = slicesArr.length;
          
          const normalizedAngle = ((-currentRotation) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
          
          let winningIdx = 0;
          for (let i = 0; i < totalSlices; i++) {
            const s = slicesArr[i];
            let sa = (s.start_angle + Math.PI/2) % (2*Math.PI);
            if (sa < 0) sa += 2*Math.PI;
            let ea = (s.end_angle + Math.PI/2) % (2*Math.PI);
            if (ea < 0) ea += 2*Math.PI;

            if (sa > ea) {
              if (normalizedAngle >= sa || normalizedAngle < ea) {
                winningIdx = i;
                break;
              }
            } else {
              if (normalizedAngle >= sa && normalizedAngle < ea) {
                winningIdx = i;
                break;
              }
            }
          }
          
          const winningSlice = slicesArr[winningIdx];
          lastWinningText = winningSlice ? winningSlice.text : "Kosong";

          if (hideRollActive && hideRollOverlay) {
            hideRollOverlay.classList.remove("show");
          }

          if (resultTextDisplay && resultModal) {
            resultTextDisplay.textContent = lastWinningText;
            resultModal.classList.add("show");
          }
        }
      }

      animateSpin();
    });
  }

  function handleCloseResult() {
    if (resultModal) {
      resultModal.classList.remove("show");
    }
  }

  if (saveBtn) {
    saveBtn.addEventListener("click", handleCloseResult);
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      handleCloseResult();
      if (wheelTextarea && lastWinningText) {
        const lines = wheelTextarea.value.split("\n").map(l => l.trim()).filter(l => l.length > 0);
        const filteredLines = lines.filter(item => item !== lastWinningText);
        wheelTextarea.value = filteredLines.join("\n");
        updateEngineText();
      }
    });
  }


  // ========================================================================
  // Arrow Key Scroll Handling - Exit input on arrow keys and scroll
  // When user presses ↑↓←→ inside any input/textarea, blur and scroll
  // ========================================================================
  function setupArrowKeyScroll() {
    const inputs = document.querySelectorAll('input, textarea');
    const scrollContainer = document.querySelector('.main-content');

    inputs.forEach(inputEl => {
      inputEl.addEventListener('keydown', (e) => {
        const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
        if (!arrowKeys.includes(e.key)) return;

        // Exit from input
        e.preventDefault();
        inputEl.blur();

        // Scroll amount
        const scrollAmount = 100;
        const target = scrollContainer || window;
        const isWindowScroll = (target === window);

        if (e.key === 'ArrowUp') {
          if (isWindowScroll) {
            window.scrollBy({ top: -scrollAmount, behavior: 'smooth' });
          } else {
            target.scrollBy({ top: -scrollAmount, behavior: 'smooth' });
          }
        } else if (e.key === 'ArrowDown') {
          if (isWindowScroll) {
            window.scrollBy({ top: scrollAmount, behavior: 'smooth' });
          } else {
            target.scrollBy({ top: scrollAmount, behavior: 'smooth' });
          }
        } else if (e.key === 'ArrowLeft') {
          if (isWindowScroll) {
            window.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
          } else {
            target.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
          }
        } else if (e.key === 'ArrowRight') {
          if (isWindowScroll) {
            window.scrollBy({ left: scrollAmount, behavior: 'smooth' });
          } else {
            target.scrollBy({ left: scrollAmount, behavior: 'smooth' });
          }
        }
      });
    });
  }

  setupArrowKeyScroll();


  // Initialize Lucide icons
  if (typeof lucide !== "undefined" && lucide.createIcons) {
    lucide.createIcons();
  }
});
