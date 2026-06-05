document.addEventListener("DOMContentLoaded", () => {
  const boot = document.getElementById("boot");

  // 起動画面を消す
  if (boot) {
    setTimeout(() => {
      boot.classList.add("hide");
    }, 900);
  }

  // システム断片を順番に表示
  const fragments = document.querySelectorAll(".system-fragment");

  fragments.forEach((fragment, index) => {
    fragment.style.opacity = "0";
    fragment.style.transition = "opacity 0.7s ease";

    setTimeout(() => {
      fragment.style.opacity = "1";
    }, 1200 + index * 120);
  });

  // ファイルカードのホバー状態を記録
  const cards = document.querySelectorAll(".file-card");

  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.dataset.hovered = "true";
    });

    card.addEventListener("mouseleave", () => {
      card.dataset.hovered = "false";
    });

    // スマホ用：タップ時にも反応させる
    card.addEventListener("touchstart", () => {
      card.dataset.hovered = "true";
    }, { passive: true });

    card.addEventListener("touchend", () => {
      setTimeout(() => {
        card.dataset.hovered = "false";
      }, 300);
    });
  });
});
