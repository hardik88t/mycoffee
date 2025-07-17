// Coffee filtering functionality
document.addEventListener('DOMContentLoaded', function() {
    initCoffeeFilter();
    initOriginMap();
});

function initCoffeeFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const coffeeItems = document.querySelectorAll('.coffee-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => {
                btn.classList.remove('active', 'bg-coffee-600', 'text-white');
                btn.classList.add('bg-white', 'text-coffee-600');
            });
            
            button.classList.add('active', 'bg-coffee-600', 'text-white');
            button.classList.remove('bg-white', 'text-coffee-600');
            
            // Filter coffee items
            filterCoffeeItems(filter, coffeeItems);
        });
    });
}

function filterCoffeeItems(filter, items) {
    items.forEach(item => {
        const categories = item.getAttribute('data-category');
        const shouldShow = filter === 'all' || categories.includes(filter);
        
        if (shouldShow) {
            item.style.display = 'block';
            item.classList.add('animate-in');
        } else {
            item.style.display = 'none';
            item.classList.remove('animate-in');
        }
    });
}

function initOriginMap() {
    const originRegions = document.querySelectorAll('.origin-region');
    
    originRegions.forEach(region => {
        region.addEventListener('click', () => {
            const regionName = region.getAttribute('data-region');
            highlightRegion(region, regionName);
        });
        
        region.addEventListener('mouseenter', () => {
            region.style.transform = 'translateY(-4px)';
        });
        
        region.addEventListener('mouseleave', () => {
            region.style.transform = 'translateY(0)';
        });
    });
}

function highlightRegion(regionElement, regionName) {
    // Remove previous highlights
    document.querySelectorAll('.origin-region').forEach(region => {
        region.classList.remove('ring-4', 'ring-gold');
    });
    
    // Highlight selected region
    regionElement.classList.add('ring-4', 'ring-gold');
    
    // Show region details (could expand to show modal or detailed info)
    console.log(`Selected region: ${regionName}`);
    
    // Optional: Filter coffee by region
    // filterByOrigin(regionName);
}

function filterByOrigin(origin) {
    const coffeeItems = document.querySelectorAll('.coffee-item');
    
    coffeeItems.forEach(item => {
        const itemText = item.textContent.toLowerCase();
        const shouldShow = itemText.includes(origin.toLowerCase());
        
        if (shouldShow) {
            item.style.display = 'block';
            item.classList.add('animate-in');
        } else {
            item.style.display = 'none';
            item.classList.remove('animate-in');
        }
    });
}
