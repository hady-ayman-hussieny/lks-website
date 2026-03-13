let slideIndex = 1;

// Define showSlides completely before calling it
function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  
  // Guard condition in case the slideshow elements don't exist on the page
  if (slides.length === 0) return;

  if (n !== undefined) {
    // Manual navigation
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
  } else {
    // Auto navigation
    slideIndex++;
    if (slideIndex > slides.length) {slideIndex = 1}
  }

  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    if (dots[i]) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
  }
  
  if (slides[slideIndex-1]) {
      slides[slideIndex-1].style.display = "block";
  }
  if (dots[slideIndex-1]) {
      dots[slideIndex-1].className += " active";
  }

  // If auto navigation, set the timeout
  if (n === undefined) {
    setTimeout(showSlides, 2000); 
  }
}

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

// Initialize the slideshow only if we are on a page with slides
document.addEventListener("DOMContentLoaded", () => {
    let slides = document.getElementsByClassName("mySlides");
    if (slides.length > 0) {
        // Start auto slideshow
        setTimeout(showSlides, 2000); 
        // Show first slide immediately
        slides[0].style.display = "block";
        let dots = document.getElementsByClassName("dot");
        if (dots.length > 0) dots[0].className += " active";
    }
});


/* ================================
   SHOPPING CART LOGIC
   ================================ */

// Initialize cart from localStorage or empty array
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Update Cart Badge globally across all pages
function updateCartBadge() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartIcons = document.querySelectorAll('.shop a');
    
    cartIcons.forEach(icon => {
        let badge = icon.querySelector('.cart-badge');
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'cart-badge';
            badge.style.position = 'absolute';
            badge.style.top = '-8px';
            badge.style.right = '-8px';
            badge.style.backgroundColor = '#e11d48'; // Noticeable red badge
            badge.style.color = '#fff';
            badge.style.borderRadius = '50%';
            badge.style.padding = '2px 6px';
            badge.style.fontSize = '11px';
            badge.style.fontWeight = 'bold';
            badge.style.lineHeight = '1';
            
            // Ensure the parent anchor supports absolute positioning
            icon.style.position = 'relative'; 
            icon.style.display = 'inline-block';
            icon.appendChild(badge);
        }
        
        if (totalItems > 0) {
            badge.innerText = totalItems;
            badge.style.display = 'block';
        } else {
            badge.style.display = 'none';
        }
    });
}

// Add Item to Cart
function addToCart(id, name, price, image) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        // Format the image path slightly so it works relative to the cart page later if needed,
        // though typically absolute pathing in localStorage is easier. 
        cart.push({ id, name, price, image, quantity: 1 });
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartBadge();
    
    // Quick user feedback
    alert(name + " was successfully added to your cart!");
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
    updateCartBadge();
    
    // Attach event listeners to Add to Cart buttons
    const addButtons = document.querySelectorAll('.cart i');
    
    addButtons.forEach(button => {
        // Wrap parent cart div in a cursor pointer style if it doesn't have one
        const cartContainer = button.closest('.cart');
        if (cartContainer) {
            cartContainer.style.cursor = 'pointer';
            
            cartContainer.addEventListener('click', (e) => {
                e.preventDefault();
                // Find the closest product card
                const proCard = e.target.closest('.pro');
                if (proCard) {
                    const id = proCard.getAttribute('data-id');
                    const name = proCard.querySelector('.des h5').innerText;
                    
                    // Cleanup price text to raw float
                    const priceText = proCard.querySelector('h4').innerText;
                    const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
                    
                    // Capture full image source
                    const image = proCard.querySelector('img').getAttribute('src');
                    
                    // We need full path to ensure it renders on the separate cart HTML page
                    // We can resolve it fully using the absolute property (src instead of getAttribute)
                    const absoluteImage = proCard.querySelector('img').src;
                    
                    if (id) {
                        addToCart(id, name, price, absoluteImage);
                    } else {
                        console.error('Missing data-id on product card');
                    }
                }
            });
        }
    });
});