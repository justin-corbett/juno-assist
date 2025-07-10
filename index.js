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



// Navigation
function initProgressNavigation() {
  // Cache the parent container
  let navProgress = document.querySelector('[data-progress-nav-list]');

  // Create or select the moving indicator
  let indicator = navProgress.querySelector('.progress-nav__indicator');
  if (!indicator) {
    indicator = document.createElement('div');
    indicator.className = 'progress-nav__indicator';
    navProgress.appendChild(indicator);
  }
  
  // Function to update the indicator based on the active nav link
  function updateIndicator(activeLink) {
    let parentWidth = navProgress.offsetWidth;
    let parentHeight = navProgress.offsetHeight;
    
    // Get the active link's position relative to the parent
    let parentRect = navProgress.getBoundingClientRect();
    let linkRect = activeLink.getBoundingClientRect();
    let linkPos = {
      left: linkRect.left - parentRect.left,
      top: linkRect.top - parentRect.top
    };
    
    let linkWidth = activeLink.offsetWidth;
    let linkHeight = activeLink.offsetHeight;
    
    // Calculate percentage values relative to parent dimensions
    let leftPercent = (linkPos.left / parentWidth) * 100;
    let topPercent = (linkPos.top / parentHeight) * 100;
    let widthPercent = (linkWidth / parentWidth) * 100;
    let heightPercent = (linkHeight / parentHeight) * 100;
       
    // Update the indicator with a smooth CSS transition (set in your CSS)
    indicator.style.left = leftPercent + '%';
    indicator.style.top = topPercent + '%';
    indicator.style.width = widthPercent + '%';
    indicator.style.height = heightPercent + '%';
  }
  
  // Get all anchor sections
  let progressAnchors = gsap.utils.toArray('[data-progress-nav-anchor]');

  progressAnchors.forEach((progressAnchor) => {
    let anchorID = progressAnchor.getAttribute('id');
    
    ScrollTrigger.create({
      trigger: progressAnchor,
      start: '0% 50%',
      end: '100% 50%',
      onEnter: () => {
        let activeLink = navProgress.querySelector('[data-progress-nav-target="#' + anchorID + '"]');
        activeLink.classList.add('is--active');
        // Remove 'is--active' class from sibling links
        let siblings = navProgress.querySelectorAll('[data-progress-nav-target]');
        siblings.forEach((sib) => {
          if (sib !== activeLink) {
            sib.classList.remove('is--active');
          }
        });
        updateIndicator(activeLink);
      },
      onEnterBack: () => {
        let activeLink = navProgress.querySelector('[data-progress-nav-target="#' + anchorID + '"]');
        activeLink.classList.add('is--active');
        // Remove 'is--active' class from sibling links
        let siblings = navProgress.querySelectorAll('[data-progress-nav-target]');
        siblings.forEach((sib) => {
          if (sib !== activeLink) {
            sib.classList.remove('is--active');
          }
        });
        updateIndicator(activeLink);
      }
    });
  });
}

// Initialize One Page Progress Navigation
document.addEventListener('DOMContentLoaded', () => {
  initProgressNavigation();
});


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


// Cards Pin – Facts
const root = document.querySelector('.section-cards')
const pinHeight = root.querySelector('.pin-height')
const container = root.querySelector('.pin-container')

ScrollTrigger.create({
    trigger: pinHeight, // We listen to pinHeight position
    start:'top top',
    end:'bottom bottom',
    pin: container, // We pin our container
    // No extra space is added around the pinned element
    pinSpacing: false,
    scrub: true // Progresses with the scroll
})

const cards = root.querySelectorAll('.pin-card')

gsap.set(cards, {
  yPercent: 50, // Translate by half the element’s height
  y: 0.5 * window.innerHeight, // Translate by half the screen’s height
})

const tl = gsap.timeline({
  scrollTrigger: {
      trigger: root, // Based on the root of our component  
      start: 'top top', // Starts when the top of root reaches the top of the viewport  
      end: 'bottom bottom', // Ends when the bottom of root reaches the bottom of the viewport  
      scrub: true, // Progresses with the scroll
  }
})

tl.to(cards, {
    yPercent: -50, // Translate by half the element’s height
    y: -0.5 * window.innerHeight, // Translate by half the screen’s height
    duration: 1,
    stagger: 0.12,
    ease: CustomEase.create("custom", "M0,0 C0,0 0.03,0.8 0.5,0.5 0.8,0.4 1,1 1,1"),
}, 'step') // The other 'step' tweens will start simultaneously in our timeline
tl.to(cards, {
    rotation: () => { return (Math.random() - 0.5) * 20 }, // Method to have a unique value per card
    stagger: 0.12,
    duration: 0.5, // Lasts half as long as the movement tween
    ease: 'power3.out', // Slows down towards the end of the rotation
}, 'step')
tl.to(cards, {
    rotation: 0,
    stagger: 0.12,
    duration: 0.5, // Lasts half as long as the movement tween
    ease: 'power3.in', // Slows down at the beginning of the rotation
}, 'step+=0.5') // Starts halfway through the movement tween




// Cards Pin – Features
const root2 = document.querySelector('.section-features')
const pinHeight2 = root2.querySelector('.pin-height')
const container2 = root2.querySelector('.pin-container')

ScrollTrigger.create({
    trigger: pinHeight2, // We listen to pinHeight position
    start:'top top',
    end:'bottom bottom',
    pin: container2, // We pin our container
    // No extra space is added around the pinned element
    pinSpacing: false,
    scrub: true // Progresses with the scroll
})

const cards2 = root2.querySelectorAll('.pin-card')

gsap.set(cards2, {
  yPercent: 50, // Translate by half the element’s height
  y: 0.5 * window.innerHeight, // Translate by half the screen’s height
})

const tl2 = gsap.timeline({
  scrollTrigger: {
      trigger: root2, // Based on the root of our component  
      start: 'top top', // Starts when the top of root reaches the top of the viewport  
      end: 'bottom bottom', // Ends when the bottom of root reaches the bottom of the viewport  
      scrub: true, // Progresses with the scroll
  }
})

tl2.to(cards2, {
    yPercent: -50, // Translate by half the element’s height
    y: -0.5 * window.innerHeight, // Translate by half the screen’s height
    duration: 1,
    stagger: 0.12,
    ease: CustomEase.create("custom", "M0,0 C0,0 0.03,0.8 0.5,0.5 0.8,0.4 1,1 1,1"),
}, 'step') // The other 'step' tweens will start simultaneously in our timeline
tl2.to(cards2, {
    rotation: () => { return (Math.random() - 0.5) * 20 }, // Method to have a unique value per card
    stagger: 0.12,
    duration: 0.5, // Lasts half as long as the movement tween
    ease: 'power3.out', // Slows down towards the end of the rotation
}, 'step')
tl2.to(cards2, {
    rotation: 0,
    stagger: 0.12,
    duration: 0.5, // Lasts half as long as the movement tween
    ease: 'power3.in', // Slows down at the beginning of the rotation
}, 'step+=0.5') // Starts halfway through the movement tween



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

function initCSSMarquee() {
  const pixelsPerSecond = 75; // Set the marquee speed (pixels per second)
  const marquees = document.querySelectorAll('[data-css-marquee]');
  
  // Duplicate each [data-css-marquee-list] element inside its container
  marquees.forEach(marquee => {
    marquee.querySelectorAll('[data-css-marquee-list]').forEach(list => {
      const duplicate = list.cloneNode(true);
      marquee.appendChild(duplicate);
    });
  });

  // Create an IntersectionObserver to check if the marquee container is in view
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.target.querySelectorAll('[data-css-marquee-list]').forEach(list => 
        list.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused'
      );
    });
  }, { threshold: 0 });
  
  // Calculate the width and set the animation duration accordingly
  marquees.forEach(marquee => {
    marquee.querySelectorAll('[data-css-marquee-list]').forEach(list => {
      list.style.animationDuration = (list.offsetWidth / pixelsPerSecond) + 's';
      list.style.animationPlayState = 'paused';
    });
    observer.observe(marquee);
  });
}

// Initialize CSS Marquee
document.addEventListener('DOMContentLoaded', function() {
  initCSSMarquee();
});

// Scrollbar
function initScrollProgressBar() {  

  const progressBar = document.querySelector('.progress-bar');
  const progressBarWrap = document.querySelector('.progress-bar-wrap');

  // Animate the progress bar as you scroll
  gsap.to(progressBar, {
    scaleX: 1,
    ease: 'none', // no ease, we control smoothness with the 'scrub' property
    scrollTrigger: {
      trigger: document.body, // Track the entire page
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5, // control the amount of time it takes for the bar to catch up with scroll position
    },
  });

  // Click listener to scroll to a specific position, feel free to remove if you dont want it!
  progressBarWrap.addEventListener('click', (event) => {
    const clickX = event.clientX;
    const progress = clickX / progressBarWrap.offsetWidth;
    const scrollPosition = progress * (document.body.scrollHeight - window.innerHeight);
  
    gsap.to(window, {
      scrollTo: scrollPosition,
      duration: 0.725,
      ease: 'power3.out',
    });
  });  
}

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

// Button Hover
$(".btn_wrap").each(function (index, btnWrap) {
  // Get child elements of the current button wrapper
  let bgPanel = $(btnWrap).children().eq(0);
  let fgPanel = $(btnWrap).children().eq(1);

  // Create a timeline for this button
  let tl = gsap.timeline({ paused: true, defaults: { duration: 0.1, ease: "none" } });
  tl.set(bgPanel, { opacity: 1 });
  tl.fromTo(fgPanel, { clipPath: "polygon(100% 0%, 100% 100%, 100% 100%, 0% 100%, 0% 0%)" }, { clipPath: "polygon(100% 0%, 100% 0%, 0% 100%, 0% 100%, 0% 0%)" });
  tl.fromTo(bgPanel, { clipPath: "polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%)" }, { clipPath: "polygon(100% 0%, 100% 100%, 0% 100%, 0% 100%, 100% 0%)" }, "<");
  tl.to(fgPanel, { clipPath: "polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%)" });
  tl.to(bgPanel, { clipPath: "polygon(100% 0%, 100% 100%, 0% 100%, 0% 0%, 0% 0%)" }, "<");

  // Attach hover events to the current button
  $(btnWrap).on("mouseenter", function () {
    tl.play();
  });

  $(btnWrap).on("mouseleave", function () {
    tl.reverse();
  });
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
            textCheckbox.style.color = '#fff'; // Change color to black
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