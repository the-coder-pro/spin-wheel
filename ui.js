class WheelEngine {
  constructor() {
    this.rawText = "";
  }

  setRawText(text) {
    this.rawText = text;
  }

  toBinary(n) {
    return (n >>> 0).toString(2);
  }

  getSlices() {
    const lines = this.rawText
      .split("\n")
      .map(l => l.trim())
      .filter(l => l.length > 0);

    const total = lines.length;
    const slices = [];

    if (total === 0) {
      slices.push({
        text: "",
        binary: "1",
        bg_color: "#ffffff",
        text_color: "#000000",
        start_angle: 0,
        end_angle: 2 * Math.PI
      });
    } else {
      const sliceAngle = (2 * Math.PI) / total;
      const halfPi = Math.PI / 2;

      for (let i = 0; i < total; i++) {
        const startAngle = i * sliceAngle - halfPi;
        const endAngle = (i + 1) * sliceAngle - halfPi;

        const bgColor = total === 1 ? "#ffffff" : (i % 2 === 0 ? "#ffffff" : "#000000");
        const textColor = total > 1 && i % 2 !== 0 ? "#ffffff" : "#000000";
        const binaryCode = this.toBinary(i + 1);

        slices.push({
          text: lines[i],
          binary: binaryCode,
          bg_color: bgColor,
          text_color: textColor,
          start_angle: startAngle,
          end_angle: endAngle
        });
      }
    }

    return slices;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const engine = new WheelEngine();

  const hamburger = document.getElementById("hamburger");
  const dropdown = document.getElementById("dropdown");
  const tabLinks = document.querySelectorAll(".tab-link");
  const goToMainBtn = document.getElementById("go-to-main");

  const modeSelect = document.getElementById("mode-select");
  const modeCardSpin = document.getElementById("mode-card-spin");
  const modeCardGroup = document.getElementById("mode-card-group");

  const canvas = document.getElementById("wheel-canvas");
  const ctx = canvas ? canvas.getContext("2d") : null;
  const wheelTextarea = document.getElementById("wheel-item-input");
  const startSpinBtn = document.getElementById("btn-start-spin");

  const resultModal = document.getElementById("result-modal");
  const resultTextDisplay = document.getElementById("result-text-display");
  const saveBtn = document.getElementById("btn-result-save");
  const closeBtn = document.getElementById("btn-result-close");

  const clickAudio = new Audio("https://cdn.freesound.org/previews/608/608617_11861866-lq.mp3");
  clickAudio.volume = 1.0;

  if (hamburger && dropdown) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("open");
      dropdown.classList.toggle("open");
    });
  }

  let isAnimating = false;

  function autoAdjustContainer() {
    const activePane = document.querySelector(".tab-pane.active");
    if (!activePane) return;
    activePane.scrollTop = 0;
  }

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
      autoAdjustContainer();

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

  if (modeSelect && modeCardSpin && modeCardGroup) {
    modeSelect.addEventListener("change", (e) => {
      const target = e.target;
      if (target.value === "spin-wheel") {
        modeCardSpin.style.display = "block";
        modeCardGroup.style.display = "none";
      } else {
        modeCardSpin.style.display = "none";
        modeCardGroup.style.display = "block";
      }
      autoAdjustContainer();
    });
  }

  let currentRotation = 0;
  let isSpinning = false;
  let currentSliceIndex = -1;
  let lastWinningText = "";

  function renderWheel(rotationAngle = 0) {
    if (!ctx || !canvas) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const fullRadius = width / 2 - 2;
    const innerOffset = 5; // Offset 5px ke dalam dari tepi outer canvas
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

      // Gambar garis outer border putih
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Gambar garis pemisah hitam antar sektor yang memiliki warna background sama
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
      const sliceAngle = (2 * Math.PI) / totalSlices;
      const activeIdx = Math.floor(normalizedAngle / sliceAngle) % totalSlices;

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
    }
  }

  if (wheelTextarea) {
    wheelTextarea.addEventListener("input", updateEngineText);
  }

  updateEngineText();

  if (startSpinBtn) {
    startSpinBtn.addEventListener("click", () => {
      if (isSpinning) return;
      const slices = engine.getSlices();
      if (slices.length === 0 || (slices.length === 1 && !slices[0].text)) return;

      isSpinning = true;
      currentSliceIndex = -1;

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
          const totalSlices = slices.length;
          
          const normalizedAngle = ((-currentRotation) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
          const sliceAngle = (2 * Math.PI) / totalSlices;
          const winningIdx = Math.floor(normalizedAngle / sliceAngle) % totalSlices;
          
          const winningSlice = slices[winningIdx];
          lastWinningText = winningSlice ? winningSlice.text : "Kosong";

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

  if (typeof lucide !== "undefined" && lucide.createIcons) {
    lucide.createIcons();
  }
});
