(() => {
  "use strict";

  /* =====================================================
     ELEMENTS
  ===================================================== */

  const wishButton = document.querySelector("#wishButton");
  const stopButton = document.querySelector("#stopButton");
  const birthdayAudio = document.querySelector("#birthdayAudio");
  const wishHint = document.querySelector("#wishHint");
  const confettiLayer = document.querySelector("#confettiLayer");

  const lightbox = document.querySelector("#lightbox");
  const lightboxImage = document.querySelector("#lightboxImage");
  const lightboxCaption = document.querySelector("#lightboxCaption");
  const lightboxClose = document.querySelector("#lightboxClose");

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  let confettiInterval = null;


  /* =====================================================
     SCROLL REVEAL ANIMATION
  ===================================================== */

  const revealElements = document.querySelectorAll(
    ".hero, .birthday-scene, .scrapbook, .memory-card, .memory-note, .site-footer"
  );

  if ("IntersectionObserver" in window && !reducedMotion) {

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            entry.target.classList.add("is-visible");

            currentObserver.unobserve(entry.target);
          }

        });

      },
      {
        threshold: 0.12
      }
    );

    revealElements.forEach((element) => {

      element.classList.add("reveal");

      observer.observe(element);

    });

  }


  /* =====================================================
     BIRTHDAY WISH + CONFETTI + MUSIC (Updated)
  ===================================================== */

  const confettiColors = [
    "#e98da6",
    "#f4d69b",
    "#c9b6df",
    "#fffaf4",
    "#b6c9ad",
    "#f2b8c4"
  ];

  function startWishAndMusic() {
    if (!wishButton) return;

    const buttonLabel = wishButton.querySelector(".button-label");
    if (buttonLabel) {
      buttonLabel.textContent = "Wish in progress... ♡";
    }

    wishButton.disabled = true;
    wishButton.setAttribute(
      "aria-label",
      "Your birthday wish and music have started"
    );

    if (stopButton) {
      stopButton.style.display = "inline-flex";
    }

    if (wishHint) {
      wishHint.textContent =
        "လှပတဲ့ အရာမှန်သမျှနဲ့ ပျော်ရွှင်မှုတွေ အားလုံး အချစ်ကလေးဆီ ရောက်ရှိလာပါစေ။ 🌸♡";
    }

    // သီချင်း အလိုအလျောက် စတင်ဖွင့်ရန်
    if (birthdayAudio) {
      birthdayAudio.currentTime = 0;
      birthdayAudio.play().catch(err => {
        console.log("Audio autoplay restricted by browser:", err);
      });
    }

    if (reducedMotion || !confettiLayer) return;

    function createConfettiBatch() {
      const fragment = document.createDocumentFragment();

      for (let i = 0; i < 25; i++) {

        const piece = document.createElement("i");

        piece.className = "confetti";

        piece.style.left = `${Math.random() * 100}%`;

        piece.style.backgroundColor =
          confettiColors[
            Math.floor(Math.random() * confettiColors.length)
          ];

        piece.style.borderRadius =
          Math.random() > 0.5 ? "50%" : "2px";

        piece.style.setProperty(
          "--fall-time",
          `${2.2 + Math.random() * 2.4}s`
        );

        piece.style.setProperty(
          "--drift",
          `${Math.random() * 180 - 90}px`
        );

        piece.style.animationDelay =
          `${Math.random() * 0.2}s`;

        fragment.appendChild(piece);

      }

      confettiLayer.appendChild(fragment);

      window.setTimeout(() => {
        if (confettiLayer.children.length > 150) {
          for (let j = 0; j < 25; j++) {
            if (confettiLayer.firstChild) {
              confettiLayer.removeChild(confettiLayer.firstChild);
            }
          }
        }
      }, 5000);
    }

    // ပထမတစ်ကျော့ချက်ချင်းစလုပ်ပြီး Stop မနှိပ်မချင်း အဆက်မပြတ်ကျနေစေရန်
    createConfettiBatch();
    confettiInterval = window.setInterval(createConfettiBatch, 1500);
  }

  function stopWishAndMusic() {
    // Confetti ကျခြင်းကို ရပ်တန့်ရန်
    if (confettiInterval) {
      window.clearInterval(confettiInterval);
      confettiInterval = null;
    }
    if (confettiLayer) {
      confettiLayer.replaceChildren();
    }

    // သီချင်းရပ်ရန်
    if (birthdayAudio) {
      birthdayAudio.pause();
      birthdayAudio.currentTime = 0;
    }

    // ခလုတ်များကို မူလအခြေအနေသို့ ပြန်ပြောင်းရန်
    if (wishButton) {
      wishButton.disabled = false;
      const buttonLabel = wishButton.querySelector(".button-label");
      if (buttonLabel) {
        buttonLabel.textContent = "Make a wish";
      }
    }

    if (stopButton) {
      stopButton.style.display = "none";
    }

    if (wishHint) {
      wishHint.textContent = "အလိုချင်ဆုံး ဆုတစ်ခုကို တောင်းပြီးရင် နှိပ်လိုက်တော့နော်။ 🎂✨";
    }
  }

  wishButton?.addEventListener("click", startWishAndMusic);
  stopButton?.addEventListener("click", stopWishAndMusic);


  /* =====================================================
     PHOTO LIGHTBOX
  ===================================================== */

  const memoryCards = document.querySelectorAll(".memory-card");

  memoryCards.forEach((card) => {

    const button = card.querySelector(".photo-button");
    const image = card.querySelector("img");
    const caption = card.querySelector("figcaption");

    if (!button || !image || !lightbox) return;

    button.addEventListener("click", () => {

      lightboxImage.src =
        image.currentSrc || image.src;

      lightboxImage.alt =
        image.alt || "Birthday memory";

      lightboxCaption.textContent =
        caption ? caption.textContent.trim() : "";

      if (typeof lightbox.showModal === "function") {

        lightbox.showModal();

      } else {

        lightbox.setAttribute("open", "");

      }

    });

  });


  /* =====================================================
     CLOSE LIGHTBOX
  ===================================================== */

  function closeLightbox() {

    if (!lightbox) return;

    if (typeof lightbox.close === "function" && lightbox.open) {

      lightbox.close();

    } else {

      lightbox.removeAttribute("open");

    }

    if (lightboxImage) {

      lightboxImage.removeAttribute("src");

    }

  }

  lightboxClose?.addEventListener(
    "click",
    closeLightbox
  );

  lightbox?.addEventListener("click", (event) => {

    if (event.target === lightbox) {

      closeLightbox();

    }

  });

  lightbox?.addEventListener("close", () => {

    lightboxImage?.removeAttribute("src");

  });

  document.addEventListener("keydown", (event) => {

    if (event.key === "Escape" && lightbox?.open) {

      closeLightbox();

    }

  });


  /* =====================================================
     IMAGE ERROR HANDLING
  ===================================================== */

  document.querySelectorAll(".memory-card img").forEach((image) => {

    image.addEventListener("error", () => {

      image.alt = "Photo could not be loaded";

      image.classList.add("image-error");

    });

  });


  /* =====================================================
     CURRENT YEAR FOOTER
  ===================================================== */

  const footerDate = document.querySelector(".site-footer span:nth-child(2)");

  if (footerDate) {

    footerDate.textContent = "7 · 12 · 2026";

  }


  /* =====================================================
     CONSOLE MESSAGE
  ===================================================== */

  console.log(
    "%c Happy Birthday ShoonLaeLaeOo! ♡ ",
    "background:#f6dce0;color:#a94f70;font-size:16px;padding:10px;border-radius:8px;"
  );

})();