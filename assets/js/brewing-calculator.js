// Brewing Calculator functionality
document.addEventListener('DOMContentLoaded', function() {
    initBrewingCalculator();
});

function initBrewingCalculator() {
    const coffeeAmountInput = document.getElementById('coffee-amount');
    const brewMethodSelect = document.getElementById('brew-method');
    const coffeeResult = document.getElementById('coffee-result');
    const waterResult = document.getElementById('water-result');
    const timeResult = document.getElementById('time-result');
    
    // Brewing ratios and times for different methods
    const brewingData = {
        'pour-over': { ratio: 15, time: '3-4 minutes', temp: '195-205°F' },
        'french-press': { ratio: 12, time: '4 minutes', temp: '200°F' },
        'espresso': { ratio: 2, time: '25-30 seconds', temp: '200°F' },
        'cold-brew': { ratio: 8, time: '12-24 hours', temp: 'Room temp' },
        'aeropress': { ratio: 14, time: '1-2 minutes', temp: '175-185°F' },
        'chemex': { ratio: 16, time: '4-6 minutes', temp: '200°F' }
    };
    
    function updateCalculation() {
        const coffeeAmount = parseFloat(coffeeAmountInput.value) || 20;
        const brewMethod = brewMethodSelect.value;
        const data = brewingData[brewMethod];
        
        if (data) {
            const waterAmount = Math.round(coffeeAmount * data.ratio);
            
            coffeeResult.textContent = `${coffeeAmount}g`;
            waterResult.textContent = `${waterAmount}ml`;
            timeResult.textContent = data.time;
        }
    }
    
    // Event listeners
    coffeeAmountInput.addEventListener('input', updateCalculation);
    brewMethodSelect.addEventListener('change', updateCalculation);
    
    // Initial calculation
    updateCalculation();
}

// Brewing guide modal functionality
function showBrewingGuide(method) {
    const guides = {
        'pour-over': {
            title: 'Pour Over Brewing Guide',
            steps: [
                'Heat water to 195-205°F (90-96°C)',
                'Rinse filter with hot water to remove papery taste',
                'Add 20g of medium-fine ground coffee',
                'Start timer and pour 40ml water for 30-second bloom',
                'Pour remaining water in slow, circular motions',
                'Total brew time should be 3-4 minutes',
                'Enjoy your clean, bright cup!'
            ]
        },
        'french-press': {
            title: 'French Press Brewing Guide',
            steps: [
                'Heat water to 200°F (93°C)',
                'Add 30g of coarse ground coffee to press',
                'Pour 360ml hot water over grounds',
                'Stir gently and place lid (don\'t press yet)',
                'Wait 4 minutes for extraction',
                'Press plunger down slowly and steadily',
                'Serve immediately to avoid over-extraction'
            ]
        },
        'espresso': {
            title: 'Espresso Brewing Guide',
            steps: [
                'Use 18-20g of finely ground coffee',
                'Distribute and tamp evenly with 30lbs pressure',
                'Lock portafilter into machine',
                'Start extraction immediately',
                'Aim for 25-30 second extraction time',
                'Target 36-40ml output (1:2 ratio)',
                'Adjust grind size if timing is off'
            ]
        },
        'aeropress': {
            title: 'AeroPress Brewing Guide',
            steps: [
                'Insert filter and rinse with hot water',
                'Add 15g of medium-fine ground coffee',
                'Pour 210ml water at 175-185°F',
                'Stir for 10 seconds',
                'Insert plunger and wait 1 minute',
                'Press down slowly over 30 seconds',
                'Dilute with hot water if desired'
            ]
        },
        'cold-brew': {
            title: 'Cold Brew Brewing Guide',
            steps: [
                'Use 100g of coarse ground coffee',
                'Add 800ml room temperature water',
                'Stir to ensure all grounds are wet',
                'Cover and steep for 12-24 hours',
                'Strain through fine mesh or filter',
                'Dilute concentrate 1:1 with water or milk',
                'Serve over ice and enjoy!'
            ]
        },
        'chemex': {
            title: 'Chemex Brewing Guide',
            steps: [
                'Place Chemex filter with triple fold toward spout',
                'Rinse filter with hot water and empty',
                'Add 30g of medium-coarse ground coffee',
                'Pour 60ml water for 30-second bloom',
                'Continue pouring in slow, circular motions',
                'Maintain steady drip rate',
                'Total brew time: 4-6 minutes'
            ]
        }
    };
    
    const guide = guides[method];
    if (!guide) return;
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.onclick = (e) => {
        if (e.target === modal) closeModal();
    };
    
    const modalContent = document.createElement('div');
    modalContent.className = 'bg-white rounded-lg max-w-md w-full max-h-96 overflow-y-auto';
    
    modalContent.innerHTML = `
        <div class="p-6">
            <div class="flex justify-between items-center mb-4">
                <h3 class="font-heading text-xl font-semibold text-coffee-900">${guide.title}</h3>
                <button onclick="closeModal()" class="text-coffee-600 hover:text-coffee-800 text-2xl">&times;</button>
            </div>
            <ol class="space-y-3">
                ${guide.steps.map((step, index) => `
                    <li class="flex items-start space-x-3">
                        <span class="flex-shrink-0 w-6 h-6 bg-gold text-coffee-900 rounded-full flex items-center justify-center text-sm font-semibold">${index + 1}</span>
                        <span class="text-coffee-700">${step}</span>
                    </li>
                `).join('')}
            </ol>
            <div class="mt-6 text-center">
                <button onclick="closeModal()" class="btn btn-primary">Got it!</button>
            </div>
        </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.querySelector('.fixed.inset-0');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

// Grind size guide
const grindSizes = {
    'extra-coarse': 'Cold brew, cowboy coffee',
    'coarse': 'French press, percolator',
    'medium-coarse': 'Chemex, Clever dripper',
    'medium': 'Drip coffee makers, siphon',
    'medium-fine': 'Pour over, AeroPress',
    'fine': 'Espresso, Moka pot',
    'extra-fine': 'Turkish coffee'
};

// Water temperature guide
const waterTemps = {
    'light-roast': '205°F (96°C)',
    'medium-roast': '200°F (93°C)',
    'dark-roast': '195°F (90°C)',
    'cold-brew': 'Room temperature'
};

// Export functions for global use
window.showBrewingGuide = showBrewingGuide;
window.closeModal = closeModal;
