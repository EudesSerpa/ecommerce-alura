/*
import { $ } from "../../utils/getElement.js";

const carousel = $(".carousel");
const btnPrevSlide = $(".carousel__control--previous");
const btnNextSlide = $(".carousel__control--next");

// Manage the slides
btnPrevSlide("click", btnPrevSlide);
btnNextSlide("click", btnNextSlide);

// Improve readable
carousel.addEventListener("mouseenter", suspendAnimation);
carousel.addEventListener("mouseleave", startAnimation);

carousel.addEventListener("focusin", ({ target }) => {
  if (!target.classList.contains("slide")) suspendAnimation();
});

carousel.addEventListener("focusout", ({ target }) => {
  if (!target.classList.contains("slide")) startAnimation();
});
*/

import { scrollend } from "https://cdn.jsdelivr.net/gh/argyleink/scrollyfills@latest/dist/scrollyfills.modern.js";

export default class Carousel {
  constructor(element) {
    this.current = undefined; // Set in #initializeState
    this.hasIntersected = new Set(); // Holds intersection results used on scrollend

    this.elements = {
      root: element,
      scroller: element.querySelector(".carousel__scroller"),
      slides: [...element.querySelectorAll(".carousel__slide")],
      animate: null, // Generated in #createanimationControl
      previous: null, // Generated in #createControl
      next: null,
      pagination: null, // Generated in #createPagination
    };

    // Aria
    this.elements.root.setAttribute("tabindex", -1);
    this.elements.root.setAttribute("aria-label", "Featured products");
    this.elements.root.setAttribute("aria-roledescription", "carousel");

    this.elements.scroller.setAttribute("role", "group");
    this.elements.scroller.setAttribute("aria-label", "Items Scroller");

    // Functionalities
    this.#createObservers();
    this.#createPagination();
    this.#createControls();
    this.#initializeState();
    this.#listen();
    this.#synchronize();
  }

  #createObservers() {
    this.carousel_observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          this.hasIntersected.add(entry);

          // toggle --in-view class if intersecting or not
          entry.target.classList.toggle("--in-view", entry.isIntersecting);
        });
      },
      {
        root: this.elements.scroller,
        threshold: 0.6,
      }
    );

    // Clean removed carousel
    this.mutation_observer = new MutationObserver((mutationList) => {
      mutationList
        .filter((node) => node.removedNodes.length > 0)
        .forEach((mutation) => {
          [...mutation.removedNodes]
            .filter(
              (node) => node.querySelector(".carousel") === this.elements.root
            )
            .forEach((_removedElement) => {
              this.#unlisten();
            });
        });
    });
  }

  #createPagination() {
    const navList = document.createElement("nav");
    navList.className = "carousel__pagination";

    this.elements.pagination = navList;
    this.elements.root.appendChild(navList);
  }

  #createMarker({ target, targetIndex }) {
    targetIndex++; // user facing index shouldnt start at 0

    const marker = document.createElement("button");
    const slideImage = target.querySelector(".carousel__image");
    const slideTitle = target.querySelector(".carousel__image-title");
    const descText = `Item ${targetIndex}: ${
      slideImage?.alt || slideTitle?.innerText
    }`;

    marker.textContent = targetIndex;
    marker.className = "carousel__pagination-control";
    marker.role = "tab";
    marker.title = descText;
    marker.setAttribute("aria-label", descText);
    marker.setAttribute("aria-setsize", this.elements.slides.length);
    marker.setAttribute("aria-posinset", targetIndex);
    marker.setAttribute("aria-controls", `carousel__slide-${targetIndex}`);

    return marker;
  }

  #handlePaginate(e) {
    if (e.target.tagName !== "BUTTON") return;

    e.target.setAttribute("aria-selected", true);
    const item = this.elements.slides[this.#getElementIndex(e.target)];

    this.goToElement({ scrollport: this.elements.scroller, element: item });
  }

  #createControls() {
    const controlTypes = ["previous", "next"];

    const controlList = document.createElement("ul");
    controlList.className = "carousel__controls";

    controlTypes.forEach((type) => {
      const controlItem = document.createElement("li");
      controlItem.className = `carousel__control-container carousel__control--${type}`;
      const btn = this.#createControl({ type });

      controlItem.appendChild(btn);
      controlList.appendChild(controlItem);

      this.elements[type] = btn;
    });

    this.elements.root.insertAdjacentElement("afterbegin", controlList);
  }

  #createControl({ type }) {
    const control = document.createElement("button");
    const capitilizedText = type.charAt(0).toUpperCase() + type.slice(1);
    const userFacingText = `${capitilizedText} Item`;

    control.className = `carousel__control btn--${type}`;
    control.title = userFacingText;
    control.setAttribute("aria-label", userFacingText);
    // control.setAttribute("aria-controls", "carousel__scroller");

    const svg = this.#createSVG();
    svg.appendChild(this.#createArrowPath({ type }));

    control.appendChild(svg);
    return control;
  }

  #createSVG() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("viewBox", "0 0 20 20");
    svg.setAttribute("fill", "currentColor");

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("fill-rule", "evenodd");
    path.setAttribute("clip-rule", "evenodd");

    return svg;
  }

  #createArrowPath({ type }) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("fill-rule", "evenodd");
    path.setAttribute("clip-rule", "evenodd");

    const previousPath =
      "M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z";
    const nextPath =
      "M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z";

    path.setAttribute("d", type === "next" ? nextPath : previousPath);

    return path;
  }

  goNext() {
    const next = this.current.nextElementSibling;

    if (this.current === next) return;

    if (next) {
      this.goToElement({
        scrollport: this.elements.scroller,
        element: next,
      });
      this.current = next;
    } else {
      console.log("at the end");
    }
  }

  goPrevious() {
    const previous = this.current.previousElementSibling;

    if (this.current === previous) return;

    if (previous) {
      this.goToElement({
        scrollport: this.elements.scroller,
        element: previous,
      });
      this.current = previous;
    } else {
      console.log("at the beginning");
    }
  }

  goToElement({ scrollport, element }) {
    const dir = this.#documentDirection();

    const delta = Math.abs(scrollport.offsetLeft - element.offsetLeft);
    const scrollerPadding = parseInt(
      getComputedStyle(scrollport)["padding-left"]
    );

    const pos =
      scrollport.clientWidth / 2 > delta
        ? delta - scrollerPadding
        : delta + scrollerPadding;

    scrollport.scrollTo(dir === "ltr" ? pos : pos * -1, 0);
  }

  #initializeState() {
    const startIndex = this.elements.root.hasAttribute("carousel-start")
      ? this.elements.root.getAttribute("carousel-start") - 1
      : 0;

    this.current = this.elements.slides[startIndex];
    this.#handleScrollStart();

    // each slide target needs a marker for pagination
    this.elements.slides.forEach((slide, index) => {
      this.hasIntersected.add({
        isIntersecting: index === startIndex,
        target: slide,
      });

      this.elements.pagination.appendChild(
        this.#createMarker({ target: slide, targetIndex: index })
      );

      slide.setAttribute("id", `carousel__slide-${index + 1}`);
      slide.setAttribute(
        "aria-label",
        `${index + 1} of ${this.elements.slides.length}`
      );
      slide.setAttribute("aria-roledescription", "item");
    });
  }

  #handleScrollStart() {
    if (this.elements.root.hasAttribute("carousel-start")) {
      const itemIndex = this.elements.root.getAttribute("carousel-start");
      const startElement = this.elements.slides[itemIndex - 1];

      this.elements.slides.forEach(
        (slide) => (slide.style.scrollSnapAlign = "unset")
      );

      startElement.style.scrollSnapAlign = null;
      startElement.style.animation = "carousel-scrollstart 1ms";

      startElement.addEventListener(
        "animationend",
        () => {
          startElement.animation = null;
          this.elements.slides.forEach(
            (slide) => (slide.style.scrollSnapAlign = null)
          );
        },
        { once: true }
      );
    }
  }

  #listen() {
    // observe children intersection
    for (const item of this.elements.slides) {
      this.carousel_observer.observe(item);
    }

    // watch document for removal of this carousel node
    this.mutation_observer.observe(document, {
      childList: true,
      subtree: true,
    });

    // scrollend listener for sync
    this.elements.scroller.addEventListener(
      "scrollend",
      this.#synchronize.bind(this)
    );
    this.elements.next.addEventListener("click", this.goNext.bind(this));
    this.elements.previous.addEventListener(
      "click",
      this.goPrevious.bind(this)
    );
    this.elements.pagination.addEventListener(
      "click",
      this.#handlePaginate.bind(this)
    );
    this.elements.root.addEventListener(
      "keydown",
      this.#handleKeydown.bind(this)
    );
  }

  #unlisten() {
    for (const item of this.elements.slides) {
      this.carousel_observer.unobserve(item);
    }

    this.mutation_observer.disconnect();

    this.elements.scroller.removeEventListener("scrollend", this.#synchronize);
    this.elements.next.removeEventListener("click", this.goNext);
    this.elements.previous.removeEventListener("click", this.goPrevious);
    this.elements.pagination.removeEventListener("click", this.#handlePaginate);
    this.elements.root.removeEventListener("keydown", this.#handleKeydown);
  }

  #synchronize() {
    for (const entry of this.hasIntersected) {
      // toggle inert when it's not intersecting
      entry.target.toggleAttribute("inert", !entry.isIntersecting);

      // toggle aria-selected on pagination dots
      const dot =
        this.elements.pagination.children[this.#getElementIndex(entry.target)];

      dot.setAttribute("aria-selected", entry.isIntersecting);
      dot.setAttribute("tabindex", !entry.isIntersecting ? "-1" : "0");

      // stash the intersecting slide element
      if (entry.isIntersecting) {
        this.current = entry.target;
        this.goToElement({
          scrollport: this.elements.pagination,
          element: dot,
        });
      }
    }

    this.#updateControls();
    this.hasIntersected.clear();
  }

  #updateControls() {
    const { lastElementChild: last, firstElementChild: first } =
      this.elements.scroller;

    const isAtEnd = this.current === last;
    const isAtStart = this.current === first;

    this.elements.next.removeAttribute("disabled");
    this.elements.previous.removeAttribute("disabled");

    // before we possibly disable a button
    // shift the focus to the complimentary button
    if (document.activeElement === this.elements.next && isAtEnd)
      this.elements.previous.focus();
    else if (document.activeElement === this.elements.previous && isAtStart)
      this.elements.next.focus();

    this.elements.next.toggleAttribute("disabled", isAtEnd);
    this.elements.previous.toggleAttribute("disabled", isAtStart);
  }

  #handleKeydown(e) {
    const dir = this.#documentDirection();
    const idx = this.#getElementIndex(e.target);

    if (e.key === "ArrowRight") {
      e.preventDefault();

      const next_offset = dir === "ltr" ? 1 : -1;
      const next_control =
        dir === "ltr" ? this.elements.next : this.elements.previous;

      if (e.target.closest(".carousel__pagination"))
        this.elements.pagination.children[idx + next_offset]?.focus();
      else {
        if (document.activeElement === next_control)
          this.#keypressAnimation(next_control);

        next_control.focus();
      }

      dir === "ltr" ? this.goNext() : this.goPrevious();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();

      const previous_offset = dir === "ltr" ? -1 : 1;
      const previous_control =
        dir === "ltr" ? this.elements.previous : this.elements.next;

      if (e.target.closest(".carousel__pagination"))
        this.elements.pagination.children[idx + previous_offset]?.focus();
      else {
        if (document.activeElement === previous_control)
          this.#keypressAnimation(previous_control);

        previous_control.focus();
      }

      dir === "ltr" ? this.goPrevious() : this.goNext();
    }
  }

  #keypressAnimation(element) {
    element.style.animation =
      "carousel__control-keypress 145ms cubic-bezier(.25,0,.4,1)";
    element.addEventListener(
      "animationend",
      () => {
        element.style.animation = null;
      },
      { once: true }
    );
  }

  #getElementIndex(element) {
    let index = 0;
    while ((element = element.previousElementSibling)) index++;
    return index;
  }

  #documentDirection() {
    return document.firstElementChild.getAttribute("dir") || "ltr";
  }
}
