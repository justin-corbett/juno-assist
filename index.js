// Initialize GSAP
gsap.registerPlugin(ScrollTrigger, SplitText, Observer, ScrollToPlugin, Flip);

// Lenis smooth scroll
// Initialize a new Lenis instance for smooth scrolling
const lenis = new Lenis({
    prevent: (node) => node.id === 'modal',
})
  
// Synchronize Lenis scrolling with GSAP's ScrollTrigger plugin
lenis.on('scroll', ScrollTrigger.update);
  
// Add Lenis's requestAnimationFrame (raf) method to GSAP's ticker
// This ensures Lenis's smooth scroll animation updates on each GSAP tick
gsap.ticker.add((time) => {
    lenis.raf(time * 1000); // Convert time from seconds to milliseconds
});
  
// Disable lag smoothing in GSAP to prevent any delay in scroll animations
gsap.ticker.lagSmoothing(0);


// Loader
function initWelcomingWordsLoader() {  
    const loadingContainer = document.querySelector('[data-loading-container]');
    if (!loadingContainer) return; // Stop animation when no [data-loading-words] is found
    
    const loadingWords = loadingContainer.querySelector('[data-loading-words]');
    const wordsTarget = loadingWords.querySelector('[data-loading-words-target]');
    const words = loadingWords.getAttribute('data-loading-words').split(',').map(w => w.trim());
    
    const tl = gsap.timeline();
    
    tl.set(loadingWords, {
      yPercent: 50
    });
    
    tl.to(loadingWords, { 
      opacity: 1, 
      yPercent: 0, 
      duration: 1.5,
      ease: "Expo.easeOut"
    });
    
    words.forEach(word => {
      tl.call(() => {
        wordsTarget.textContent = word;
      }, null, '+=0.15');
    });
    
    tl.to(loadingWords, { 
      opacity: 0, 
      yPercent: -75, 
      duration: 0.8,
      ease: "Expo.easeIn"
    });
    
    tl.to(loadingContainer, { 
      autoAlpha: 0, 
      duration: 0.6,
      ease: "Power1.easeInOut"
    }, "+ -0.2");
  }
  
  // Initialize Welcoming Words Loader
  document.addEventListener('DOMContentLoaded', () => {
    initWelcomingWordsLoader();
  });




  // Split Text
  document.fonts.ready.then(() => {
    document.querySelectorAll("[data-split-rich_text]").forEach((text) => {
  
      const split = SplitText.create(text.children, {
        type: "lines",
        mask: "lines",
        lineClass: "line",
        autoSplit: true,
        
      });
  
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: text,
          start: "top bottom",
          end: "top 80%",
          toggleActions: "none play none reset",
        },
      });
      tl.from(split.lines, {
        yPercent: 110,
        delay: 0.2,
        duration: 0.8,
        stagger: { amount: 0.1 },
        ease:"expo.out",
      });
  
      gsap.set(text, { visibility: "visible" });
    });
  });
  
document.fonts.ready.then(() => {
    document.querySelectorAll("[data-word-reveal='true']").forEach((text) => {

        const split = SplitText.create(text, {
        type: "words, chars",
        mask: "words",
        wordsClass: "word",
        charsClass: "char",
        });

        const tl = gsap.timeline({
        scrollTrigger: {
            trigger: text,
            start: "top bottom",
            end: "top 80%",
            toggleActions: "none play none reset",
        },
        });
        tl.from(split.words, {
        yPercent: 110,
        delay: 0.2,
        duration: 0.8,
        stagger: { amount: 0.5 },
        });

        gsap.set(text, { visibility: "visible" });
    });
});

// Fixed Text Scroll
function initStickyTitleScroll() {
  const wraps = document.querySelectorAll('[data-sticky-title="wrap"]');
  
  wraps.forEach(wrap => {
    const headings = Array.from(wrap.querySelectorAll('[data-sticky-title="heading"]'));
    
    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: wrap,
        start: "top 40%",
        end: "bottom+=40% 60%",
        scrub: true,
      }
    });
    
    const revealDuration = 0.7,
          fadeOutDuration = 0.7,
          overlapOffset = 0;
    
    headings.forEach((heading, index) => {
      // Save original heading content for screen readers
      heading.setAttribute("aria-label", heading.textContent);
      
      const split = new SplitText(heading, { type: "words,chars" });
      
      // Hide all the separate words from screenreader
      split.words.forEach(word => word.setAttribute("aria-hidden", "true"));
      
      // Reset visibility on the 'stacked' headings
      gsap.set(heading, { visibility: "visible" });
      
      const headingTl = gsap.timeline();
      headingTl.from(split.chars, {
        autoAlpha: 0,
        stagger: { amount: revealDuration, from: "start" },
        duration: revealDuration
      });
      
      // Animate fade-out for every heading except the last one.
      if (index < headings.length - 1) {
        headingTl.to(split.chars, {
          autoAlpha: 0,
          stagger: { amount: fadeOutDuration, from: "end" },
          duration: fadeOutDuration
        });
      }
      
      // Overlap the start of fade-in of the new heading a little bit
      if (index === 0) {
        masterTl.add(headingTl);
      } else {
        masterTl.add(headingTl, `-=${overlapOffset}`);
      }
    });
  });
}

// Initialize Sticky Title Scroll Effect
document.addEventListener("DOMContentLoaded", () => {
  initStickyTitleScroll();
});


// Image Scale

// For each image-wrap on the page...
gsap.utils.toArray(".image-wrap").forEach(wrap => {
  // find the .image-full inside it
  const img = wrap.querySelector(".image-full");
  if (!img) return;

  // create a tween: scale from 1 → 0
  gsap.fromTo(
    img,
    { scale: 1.4 },
    {
      scale: 1,
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: wrap,
        start: "top bottom",    // when the top of wrap hits the bottom of viewport
        end: "bottom top",      // when the bottom of wrap hits the top of viewport
        scrub: true,            // tie the tween progress to scroll progress
        markers: false,       
      }
    }
  );
});

// Marquee
function initCSSMarquee(defaultPixelsPerSecond = 35) {
  const marquees = document.querySelectorAll('[data-css-marquee]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.target
        .querySelectorAll('[data-css-marquee-list]')
        .forEach(list => {
          list.style.animationPlayState = entry.isIntersecting 
            ? 'running' 
            : 'paused';
        });
    });
  }, { threshold: 0 });

  marquees.forEach(marquee => {
    // read speed, or fall back to the default
    const speedAttr = marquee.getAttribute('data-speed');
    const pixelsPerSecond = speedAttr 
      ? parseFloat(speedAttr) 
      : defaultPixelsPerSecond;

    // duplicate lists
    marquee.querySelectorAll('[data-css-marquee-list]').forEach(list => {
      const duplicate = list.cloneNode(true);
      marquee.appendChild(duplicate);
    });

    // set duration based on width / speed
    marquee.querySelectorAll('[data-css-marquee-list]').forEach(list => {
      const duration = list.offsetWidth / pixelsPerSecond;
      list.style.animationDuration = duration + 's';
      list.style.animationPlayState = 'paused';
    });

    observer.observe(marquee);
  });
}

// run once on DOM ready
document.addEventListener('DOMContentLoaded', initCSSMarquee);



// Initialize CSS Marquee
document.addEventListener('DOMContentLoaded', function() {
  initCSSMarquee();
});

// Scrollbar
function initScrollProgressBar() {  

  const progressBar = document.querySelector('.progress-bar');

  // Animate the progress bar as you scroll
  gsap.to(progressBar, {
    height: "100%",
    ease: 'none', // no ease, we control smoothness with the 'scrub' property
    scrollTrigger: {
      trigger: document.body, // Track the entire page
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5, // control the amount of time it takes for the bar to catch up with scroll position
    },
  });
};
  


// Initialize Scroll Progress Bar
document.addEventListener('DOMContentLoaded', () => {
  initScrollProgressBar();
});



// GSAP Flip
function initFlipOnScroll() {
  let wrapperElements = document.querySelectorAll("[data-flip-element='wrapper']");
  let targetEl = document.querySelector("[data-flip-element='target']");

  let tl;
  function flipTimeline() {
    if (tl) {
      tl.kill();
      gsap.set(targetEl, { clearProps: "all" });
    }
    
    // Use the first and last wrapper elements for the scroll trigger.
    tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapperElements[0],
        start: "center 25%",
        endTrigger: wrapperElements[wrapperElements.length - 1],
        end: "center center",
        scrub: 0.25,
        markers: false,
      }
    });
    
    // Loop through each wrapper element.
    wrapperElements.forEach(function(element, index) {
      let nextIndex = index + 1;
      if (nextIndex < wrapperElements.length) {
        let nextWrapperEl = wrapperElements[nextIndex];
        // Calculate vertical center positions relative to the document.
        let nextRect = nextWrapperEl.getBoundingClientRect();
        let thisRect = element.getBoundingClientRect();
        let nextDistance = nextRect.top + window.pageYOffset + nextWrapperEl.offsetHeight / 2;
        let thisDistance = thisRect.top + window.pageYOffset + element.offsetHeight / 2;
        let offset = nextDistance - thisDistance;
        // Add the Flip.fit tween to the timeline.
        tl.add(
          Flip.fit(targetEl, nextWrapperEl, {
            duration: offset,
            ease: "power1.inOut"
          })
        );
      }
    });
  }

  flipTimeline();

  let resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      flipTimeline();
    }, 100);
  });
}

// Initialize Scaling Elements on Scroll (GSAP Flip)
document.addEventListener('DOMContentLoaded', function() {
  initFlipOnScroll();
});

// Contact Form – Checkbox Label Colour Change On Selected
// Select all checkboxes with the class '.checkbox'
document.querySelectorAll('.radio_field').forEach(component => {
  // Select the .w-checkbox-input element within each component
  const checkboxInput = component.querySelector('.w-form-formradioinput');
  const textCheckbox = component.querySelector('.radio_label');

  if (checkboxInput && textCheckbox) {
    // Create a MutationObserver to watch for class changes
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === 'class') {
          // Check if the class 'w--redirected-checked' is present
          if (checkboxInput.classList.contains('w--redirected-checked')) {
            textCheckbox.style.color = '#301b1b'; // Change color to black
          } else {
            textCheckbox.style.color = ''; // Reset color
          }
        }
      });
    });

    // Observe class attribute changes on the checkbox input
    observer.observe(checkboxInput, { attributes: true });
  }
});

// All Pages – Form Submit Button Text Update On Submit
document.addEventListener('DOMContentLoaded', function () {
  // Add an event listener for form submission
  document.querySelectorAll('.form.is-contact').forEach(form => {
    form.addEventListener('submit', function (e) {
      // Find all elements inside the form with the class 'text-button'
      const textButtons = form.querySelectorAll('.text-button');

      // Update the text content of each '.text-button' element
      textButtons.forEach(button => {
        button.textContent = 'Please wait...';
      });

      // Optional: Revert the text if submission takes too long
      setTimeout(() => {
        textButtons.forEach(button => {
          button.textContent = 'Submit'; // Adjust text as needed
        });
      }, 5000); // Adjust delay as needed
    });
  });
});

// Contact form custom success message
// when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
  // declare constant selectors
  const FORM_SELECTOR = '[fs-contact="form"]';
  const NAME_INPUT_SELECTOR = '[fs-contact="name-input"]';
  const MESSAGE_SELECTOR = '[fs-contact="custom-message"]';
  const form = document.querySelector(FORM_SELECTOR);

  // early return
  if (!form) return;
  const nameInput = form.querySelector(NAME_INPUT_SELECTOR);
  const messageDiv = document.querySelector(MESSAGE_SELECTOR);

  if (!nameInput || !messageDiv) return;

  // when form is submitted
  nameInput.addEventListener('input', function () {
    const nameValue = nameInput.value;

    if (nameValue && nameValue !== '') {
      messageDiv.innerText = `Thanks ${nameValue}! We will get back to you within 1-2 business days.`;
    } else {
      messageDiv.innerText = 'Thanks, we have received your message and will get back to you.';
    }
  });
});

// Subscribe form – fields change
$(".field").on("focusin", function () {
  $(this).siblings(".field_label").removeClass("large");
});
$(".field").on("focusout", function () {
  if ($(this).val().length == 0) {
    $(this).siblings(".field_label").addClass("large");
  }
});

// Letter animate effect
gsap.to('.centred-title', {
    yPercent: 100, // Moves the letter down by 100% of its height
    ease: 'power1.inOut', // Non-linear motion
    scrollTrigger: {
        trigger: '.centred-title-block', // Listens to the list position
        start: '33.33% bottom',
        end: '100% 80%',
        scrub: 1 // Progresses with the scroll, takes 1s to update
    },
    stagger: {
        each: 0.05,
        from: 'random' // Randomizes the animation order of letters
    }
})

// Buttons
function initButtonCharacterStagger() {
  const offsetIncrement = 0.01; // Transition offset increment in seconds
  const buttons = document.querySelectorAll('[data-button-animate-chars]');

  buttons.forEach(button => {
    const text = button.textContent; // Get the button's text content
    button.innerHTML = ''; // Clear the original content

    [...text].forEach((char, index) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.transitionDelay = `${index * offsetIncrement}s`;

      // Handle spaces explicitly
      if (char === ' ') {
        span.style.whiteSpace = 'pre'; // Preserve space width
      }

      button.appendChild(span);

      // 2) On each .submit_button hover, toggle the “animate” class on its sibling
      document.querySelectorAll('.submit_button').forEach(submit => {
        // find the sibling element
        const sibling = submit.nextElementSibling && submit.nextElementSibling.classList.contains('btn-animate-chars')
          ? submit.nextElementSibling
          : null;

        if (!sibling) return;

        submit.addEventListener('mouseenter', () => sibling.classList.add('animate'));
        submit.addEventListener('mouseleave', () => sibling.classList.remove('animate'));
      });
    });
  });
}

// Initialize Button Character Stagger Animation
document.addEventListener('DOMContentLoaded', () => {
  initButtonCharacterStagger();
});

// Remove section path from URL
document.addEventListener('DOMContentLoaded', function() {
    // Check if there's a hash in the URL
    if (window.location.hash) {
        // Get the target element
        const targetId = window.location.hash.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            // Scroll to the target element
            targetElement.scrollIntoView({behavior: 'smooth'});

            // Remove the hash after a short delay (to allow scrolling to complete)
            setTimeout(function() {
                history.pushState("", document.title, window.location.pathname + window.location.search);
            }, 100);
        }
    }

    // Add click event listeners to all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({behavior: 'smooth'});

                // Remove the hash after a short delay (to allow scrolling to complete)
                setTimeout(function() {
                    history.pushState("", document.title, window.location.pathname + window.location.search);
                }, 100);
            }
        });
    });
});