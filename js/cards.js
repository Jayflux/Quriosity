// 21 Questions - Card Physics & Gesture Interaction Engine
// Handles touch/pointer dragging, 3D flip, stack layering, and spring physics.

import { sounds } from "./audio.js";

export class CardStackController {
  constructor(containerEl, options = {}) {
    this.container = containerEl;
    this.options = {
      onSwipeNext: () => {},
      onSwipePrev: () => {},
      onFlip: () => {},
      ...options
    };

    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.activeCardEl = null;
    this.isFlipped = false;
    this.canSwipe = true;

    this.bindGlobalKeyboard();
  }

  setupTopCard(cardEl) {
    if (!cardEl) return;
    this.activeCardEl = cardEl;
    this.isFlipped = false;

    // Remove old listeners
    cardEl.onpointerdown = (e) => this.onPointerDown(e);
  }

  onPointerDown(e) {
    if (!this.canSwipe || !this.activeCardEl) return;
    // Don't drag if clicking interactive buttons inside card
    if (e.target.closest("button") || e.target.closest(".no-drag")) return;

    this.isDragging = true;
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.currentX = 0;
    this.currentY = 0;

    this.activeCardEl.style.transition = "none";
    this.activeCardEl.setPointerCapture(e.pointerId);

    const onPointerMove = (moveEvent) => {
      if (!this.isDragging) return;
      this.currentX = moveEvent.clientX - this.startX;
      this.currentY = moveEvent.clientY - this.startY;

      const rotation = this.currentX * 0.08;
      const opacityBadgeRight = Math.min(Math.max(this.currentX / 80, 0), 1);
      const opacityBadgeLeft = Math.min(Math.max(-this.currentX / 80, 0), 1);

      this.activeCardEl.style.transform = `translate3d(${this.currentX}px, ${this.currentY * 0.4}px, 0) rotate(${rotation}deg)`;

      // Update swipe indicator badges if present
      const passBadge = this.activeCardEl.querySelector(".badge-pass");
      const nextBadge = this.activeCardEl.querySelector(".badge-next");
      if (passBadge) passBadge.style.opacity = opacityBadgeLeft;
      if (nextBadge) nextBadge.style.opacity = opacityBadgeRight;
    };

    const onPointerUp = (upEvent) => {
      if (!this.isDragging) return;
      this.isDragging = false;
      this.activeCardEl.releasePointerCapture(upEvent.pointerId);
      this.activeCardEl.removeEventListener("pointermove", onPointerMove);
      this.activeCardEl.removeEventListener("pointerup", onPointerUp);
      this.activeCardEl.removeEventListener("pointercancel", onPointerUp);

      const distance = Math.hypot(this.currentX, this.currentY);
      const threshold = 90;

      if (distance < 10) {
        // Simple tap -> Flip card
        this.flipCard();
        return;
      }

      if (this.currentX > threshold) {
        // Swiped Right -> Next Card
        this.animateOut("right");
      } else if (this.currentX < -threshold) {
        // Swiped Left -> Skip / Next Card
        this.animateOut("left");
      } else {
        // Reset card back to center
        this.resetCardPosition();
      }
    };

    this.activeCardEl.addEventListener("pointermove", onPointerMove);
    this.activeCardEl.addEventListener("pointerup", onPointerUp);
    this.activeCardEl.addEventListener("pointercancel", onPointerUp);
  }

  flipCard() {
    if (!this.activeCardEl) return;
    this.isFlipped = !this.isFlipped;
    sounds.playCardFlip();
    sounds.haptic(20);

    const inner = this.activeCardEl.querySelector(".card-inner");
    if (inner) {
      inner.classList.toggle("is-flipped", this.isFlipped);
    }
    this.options.onFlip(this.isFlipped);
  }

  animateOut(direction = "right") {
    if (!this.activeCardEl || !this.canSwipe) return;
    this.canSwipe = false;

    sounds.playCardSwipe();
    sounds.haptic(25);

    const flyDistance = window.innerWidth * 1.2;
    const targetX = direction === "right" ? flyDistance : -flyDistance;
    const targetRot = direction === "right" ? 35 : -35;

    this.activeCardEl.style.transition = "transform 0.35s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.3s ease";
    this.activeCardEl.style.transform = `translate3d(${targetX}px, 40px, 0) rotate(${targetRot}deg)`;
    this.activeCardEl.style.opacity = "0";

    setTimeout(() => {
      this.options.onSwipeNext(direction);
      this.canSwipe = true;
    }, 280);
  }

  animatePrev() {
    if (!this.canSwipe) return;
    this.canSwipe = false;
    sounds.playTap();
    this.options.onSwipePrev();
    this.canSwipe = true;
  }

  resetCardPosition() {
    if (!this.activeCardEl) return;
    this.activeCardEl.style.transition = "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
    this.activeCardEl.style.transform = "translate3d(0, 0, 0) rotate(0deg)";

    const passBadge = this.activeCardEl.querySelector(".badge-pass");
    const nextBadge = this.activeCardEl.querySelector(".badge-next");
    if (passBadge) passBadge.style.opacity = "0";
    if (nextBadge) nextBadge.style.opacity = "0";
  }

  bindGlobalKeyboard() {
    window.addEventListener("keydown", (e) => {
      // Don't trigger if user is typing in an input or textarea
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

      if (e.code === "ArrowRight" || e.code === "KeyD") {
        this.animateOut("right");
      } else if (e.code === "ArrowLeft" || e.code === "KeyA") {
        this.animateOut("left");
      } else if (e.code === "Space" || e.code === "KeyF") {
        e.preventDefault();
        this.flipCard();
      } else if (e.code === "ArrowUp" || e.code === "KeyW") {
        e.preventDefault();
        this.animatePrev();
      }
    });
  }
}
