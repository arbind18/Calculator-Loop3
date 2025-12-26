/0258// Pet Age Calculator - Ultra Advanced Script
// Initialize AOS
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });
});

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Load saved theme
const savedTheme = localStorage.getItem('petCalcTheme') || 'light';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('petCalcTheme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// Pet Icon Selection
const petIcons = document.querySelectorAll('.pet-icon-item');
const petTypeSelect = document.getElementById('petType');

petIcons.forEach(icon => {
    icon.addEventListener('click', () => {
        const petType = icon.getAttribute('data-pet');
        petTypeSelect.value = petType;
        
        petIcons.forEach(i => i.classList.remove('active'));
        icon.classList.add('active');
        
        updateBreedOptions(petType);
    });
});

// Breed Options Data
const breedOptions = {
    dog: [
        { value: 'small', label: '🐕 Small Breed (under 20 lbs) - Chihuahua, Pomeranian, Yorkshire Terrier' },
        { value: 'medium', label: '🐕 Medium Breed (21-50 lbs) - Beagle, Cocker Spaniel, Bulldog' },
        { value: 'large', label: '🐕 Large Breed (51-100 lbs) - Labrador, Golden Retriever, German Shepherd' },
        { value: 'giant', label: '🐕 Giant Breed (100+ lbs) - Great Dane, Mastiff, Saint Bernard' }
    ],
    cat: [
        { value: 'standard', label: '🐈 Standard Cat - Most domestic cats' },
        { value: 'siamese', label: '🐈 Siamese - 15-20 years lifespan' },
        { value: 'persian', label: '🐈 Persian - 12-17 years lifespan' },
        { value: 'mainecoon', label: '🐈 Maine Coon - 12-15 years lifespan' },
        { value: 'ragdoll', label: '🐈 Ragdoll - 15-20 years lifespan' }
    ]
};

// Update Breed Options
petTypeSelect.addEventListener('change', (e) => {
    updateBreedOptions(e.target.value);
});

function updateBreedOptions(petType) {
    const breedGroup = document.getElementById('breedGroup');
    const breedSelect = document.getElementById('breed');
    
    breedSelect.innerHTML = '<option value="">Select Breed/Size</option>';
    
    if (breedOptions[petType]) {
        breedGroup.style.display = 'block';
        breedOptions[petType].forEach(breed => {
            const option = document.createElement('option');
            option.value = breed.value;
            option.textContent = breed.label;
            breedSelect.appendChild(option);
        });
    } else {
        breedGroup.style.display = 'none';
    }
}

// Form Submission
const petForm = document.getElementById('petForm');
petForm.addEventListener('submit', (e) => {
    e.preventDefault();
    calculatePetAge();
});

// Pet Age Calculation Logic
function calculatePetAge() {
    const petType = document.getElementById('petType').value;
    const breed = document.getElementById('breed').value;
    const petName = document.getElementById('petName').value || 'Your Pet';
    const years = parseInt(document.getElementById('years').value) || 0;
    const months = parseInt(document.getElementById('months').value) || 0;
    const gender = document.getElementById('gender').value;
    
    if (!petType) {
        alert('Please select a pet type!');
        return;
    }
    
    const totalMonths = (years * 12) + months;
    const ageInYears = years + (months / 12);
    
    // Calculate human age based on pet type and breed
    const humanAge = calculateHumanAge(petType, breed, ageInYears);
    const lifeStageInfo = getLifeStage(petType, ageInYears);
    const lifeExpectancyInfo = getLifeExpectancy(petType, breed);
    const petEmoji = getPetEmoji(petType);
    
    // Update UI
    displayResults(petName, humanAge, petEmoji, totalMonths, years, months, lifeStageInfo, lifeExpectancyInfo, petType, gender);
    
    // Scroll to results
    document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function calculateHumanAge(petType, breed, ageInYears) {
    let humanAge = 0;
    
    switch(petType) {
        case 'dog':
            humanAge = calculateDogAge(breed, ageInYears);
            break;
        case 'cat':
            humanAge = calculateCatAge(ageInYears);
            break;
        case 'rabbit':
            // First year = 21 human years, each additional year = 6 human years
            humanAge = ageInYears <= 1 ? ageInYears * 21 : 21 + ((ageInYears - 1) * 6);
            break;
        case 'hamster':
            // 1 hamster year = 25 human years
            humanAge = ageInYears * 25;
            break;
        case 'bird':
            // Varies by species, using average parrot formula
            // First 2 years = 12 human years each, then 4 human years annually
            if (ageInYears <= 2) {
                humanAge = ageInYears * 12;
            } else {
                humanAge = 24 + ((ageInYears - 2) * 4);
            }
            break;
        case 'fish':
            // Goldfish formula: 1 year = 5 human years
            humanAge = ageInYears * 5;
            break;
        case 'turtle':
            // Slow aging: 1 year = 2 human years
            humanAge = ageInYears * 2;
            break;
        case 'horse':
            // First 3 years equal human age, then 2.5x annually
            if (ageInYears <= 3) {
                humanAge = ageInYears;
            } else {
                humanAge = 3 + ((ageInYears - 3) * 2.5);
            }
            break;
        default:
            humanAge = ageInYears * 7; // Fallback
    }
    
    return Math.round(humanAge * 10) / 10;
}

function calculateDogAge(breed, ageInYears) {
    // Advanced breed-specific formula
    let humanAge = 0;
    
    // First year aging (rapid growth)
    if (ageInYears <= 1) {
        switch(breed) {
            case 'small':
                humanAge = ageInYears * 15;
                break;
            case 'medium':
                humanAge = ageInYears * 15;
                break;
            case 'large':
                humanAge = ageInYears * 14;
                break;
            case 'giant':
                humanAge = ageInYears * 12;
                break;
            default:
                humanAge = ageInYears * 15;
        }
    }
    // Second year aging
    else if (ageInYears <= 2) {
        const firstYear = breed === 'giant' ? 12 : (breed === 'large' ? 14 : 15);
        const secondYearFactor = breed === 'small' ? 9 : (breed === 'medium' ? 9 : (breed === 'large' ? 10 : 11));
        humanAge = firstYear + ((ageInYears - 1) * secondYearFactor);
    }
    // Subsequent years
    else {
        const firstYear = breed === 'giant' ? 12 : (breed === 'large' ? 14 : 15);
        const secondYearFactor = breed === 'small' ? 9 : (breed === 'medium' ? 9 : (breed === 'large' ? 10 : 11));
        const subsequentFactor = breed === 'small' ? 4 : (breed === 'medium' ? 5 : (breed === 'large' ? 6 : 7));
        
        humanAge = firstYear + secondYearFactor + ((ageInYears - 2) * subsequentFactor);
    }
    
    return humanAge;
}

function calculateCatAge(ageInYears) {
    // Cat aging formula
    if (ageInYears <= 1) {
        return ageInYears * 15;
    } else if (ageInYears <= 2) {
        return 15 + ((ageInYears - 1) * 9);
    } else {
        return 24 + ((ageInYears - 2) * 4);
    }
}

function getLifeStage(petType, ageInYears) {
    let stage, description, progress;
    
    if (petType === 'dog' || petType === 'cat') {
        if (ageInYears < 1) {
            stage = petType === 'dog' ? 'Puppy' : 'Kitten';
            description = 'Rapid growth and development phase';
            progress = Math.min((ageInYears / 1) * 100, 100);
        } else if (ageInYears < 2) {
            stage = 'Junior';
            description = 'Adolescent with high energy and curiosity';
            progress = Math.min(((ageInYears - 1) / 1) * 100, 100);
        } else if (ageInYears < 7) {
            stage = 'Prime Adult';
            description = 'Peak health and vitality period';
            progress = Math.min(((ageInYears - 2) / 5) * 100, 100);
        } else if (ageInYears < 11) {
            stage = 'Mature Adult';
            description = 'Middle age with stable temperament';
            progress = Math.min(((ageInYears - 7) / 4) * 100, 100);
        } else {
            stage = 'Senior';
            description = 'Golden years requiring special care';
            progress = Math.min(((ageInYears - 11) / 5) * 100, 100);
        }
    } else {
        // Generic for other pets
        stage = ageInYears < 1 ? 'Young' : (ageInYears < 3 ? 'Adult' : 'Senior');
        description = 'Based on typical lifespan';
        progress = 50;
    }
    
    return { stage, description, progress };
}

function getLifeExpectancy(petType, breed) {
    let minAge, maxAge, remaining;
    
    switch(petType) {
        case 'dog':
            switch(breed) {
                case 'small':
                    minAge = 14; maxAge = 18;
                    break;
                case 'medium':
                    minAge = 10; maxAge = 14;
                    break;
                case 'large':
                    minAge = 8; maxAge = 12;
                    break;
                case 'giant':
                    minAge = 7; maxAge = 10;
                    break;
                default:
                    minAge = 10; maxAge = 13;
            }
            break;
        case 'cat':
            minAge = 12; maxAge = 18;
            break;
        case 'rabbit':
            minAge = 8; maxAge = 12;
            break;
        case 'hamster':
            minAge = 2; maxAge = 3;
            break;
        case 'bird':
            minAge = 10; maxAge = 30;
            break;
        case 'fish':
            minAge = 5; maxAge = 20;
            break;
        case 'turtle':
            minAge = 20; maxAge = 50;
            break;
        case 'horse':
            minAge = 25; maxAge = 30;
            break;
        default:
            minAge = 10; maxAge = 15;
    }
    
    const years = parseInt(document.getElementById('years').value) || 0;
    const avgLife = (minAge + maxAge) / 2;
    remaining = Math.max(0, avgLife - years);
    
    return {
        range: `${minAge}-${maxAge} years`,
        remaining: remaining > 0 ? `${Math.floor(remaining)}-${Math.ceil(remaining) + 2} years` : 'N/A'
    };
}

function getPetEmoji(petType) {
    const emojiMap = {
        dog: '🐕',
        cat: '🐈',
        rabbit: '🐰',
        hamster: '🐹',
        bird: '🦜',
        fish: '🐠',
        turtle: '🐢',
        horse: '🐴'
    };
    return emojiMap[petType] || '🐾';
}

function displayResults(petName, humanAge, emoji, totalMonths, years, months, lifeStageInfo, lifeExpectancyInfo, petType, gender) {
    // Show result section
    document.getElementById('resultSection').style.display = 'block';
    
    // Pet emoji and name
    document.getElementById('petEmoji').textContent = emoji;
    document.getElementById('petNameDisplay').textContent = petName;
    
    // Human age display
    document.getElementById('humanAgeDisplay').textContent = `${humanAge} Years Old`;
    document.getElementById('ageSubtitle').textContent = 'In Human Years';
    
    // Life stage
    document.getElementById('lifeStage').textContent = lifeStageInfo.stage;
    document.getElementById('lifeStageDesc').textContent = lifeStageInfo.description;
    document.getElementById('lifeStageFill').style.width = `${lifeStageInfo.progress}%`;
    
    // Life expectancy
    document.getElementById('lifeExpectancy').textContent = lifeExpectancyInfo.range;
    document.getElementById('remainingLife').textContent = `Estimated remaining: ${lifeExpectancyInfo.remaining}`;
    
    // Age breakdown
    const totalWeeks = Math.floor(totalMonths * 4.33);
    const totalDays = Math.floor(totalMonths * 30.44);
    
    document.getElementById('totalMonths').textContent = totalMonths;
    document.getElementById('totalWeeks').textContent = totalWeeks;
    document.getElementById('totalDays').textContent = totalDays.toLocaleString();
    
    // Next birthday
    const nextBirthday = 365 - (totalDays % 365);
    document.getElementById('nextBirthdayDays').textContent = nextBirthday;
    
    // Health status
    updateHealthStatus(years, petType);
    
    // Health milestones
    updateHealthMilestones(years, months, petType);
    
    // Vaccination schedule.6
    updateVaccinationSchedule(years, months, petType);
    
    // Care tips
    updateCareTips(lifeStageInfo.stage, petType);
    
    // Store data for sharing
    window.petData = {
        name: petName,
        type: petType,
        age: years,
        months: months,
        humanAge: humanAge,
        emoji: emoji
    };
}

function updateHealthStatus(years, petType) {
    const healthBadge = document.getElementById('healthBadge');
    const healthAdvice = document.getElementById('healthAdvice');
    
    if (years < 2) {
        healthBadge.className = 'badge badge-success';
        healthBadge.textContent = 'Growing Strong';
        healthAdvice.textContent = 'Focus on vaccinations and nutrition';
    } else if (years < 7) {
        healthBadge.className = 'badge badge-success';
        healthBadge.textContent = 'Excellent';
        healthAdvice.textContent = 'Maintain regular checkups';
    } else if (years < 11) {
        healthBadge.className = 'badge badge-warning';
        healthBadge.textContent = 'Monitor Health';
        healthAdvice.textContent = 'Increase vet visit frequency';
    } else {
        healthBadge.className = 'badge badge-danger';
        healthBadge.textContent = 'Senior Care Needed';
        healthAdvice.textContent = 'Biannual exams recommended';
    }
}

function updateHealthMilestones(years, months, petType) {
    const timeline = document.getElementById('milestonesTimeline');
    timeline.innerHTML = '';
    
    const milestones = [
        { age: 0.2, label: '8 Weeks - First Vet Visit', icon: '🏥' },
        { age: 0.4, label: '16 Weeks - Full Vaccinations', icon: '💉' },
        { age: 0.5, label: '6 Months - Spay/Neuter Consultation', icon: '⚕️' },
        { age: 1, label: '1 Year - First Annual Checkup', icon: '📋' },
        { age: 3, label: '3 Years - Dental Cleaning', icon: '🦷' },
        { age: 7, label: '7 Years - Senior Wellness Exam', icon: '👴' }
    ];
    
    const currentAge = years + (months / 12);
    
    milestones.forEach(milestone => {
        const item = document.createElement('div');
        item.className = currentAge >= milestone.age ? 'timeline-item completed' : 'timeline-item upcoming';
        item.innerHTML = `<strong>${milestone.icon} ${milestone.label}</strong>`;
        timeline.appendChild(item);
    });
}

function updateVaccinationSchedule(years, months, petType) {
    const timeline = document.getElementById('vaccinationTimeline');
    timeline.innerHTML = '';
    
    let vaccines = [];
    
    if (petType === 'dog') {
        vaccines = [
            { age: 0.15, label: '6-8 Weeks - DHPP (Distemper, Parvo)' },
            { age: 0.25, label: '10-12 Weeks - DHPP Booster' },
            { age: 0.33, label: '14-16 Weeks - DHPP + Rabies' },
            { age: 1, label: '1 Year - Annual Boosters' },
            { age: 3, label: '3 Years - Rabies Booster' }
        ];
    } else if (petType === 'cat') {
        vaccines = [
            { age: 0.15, label: '6-8 Weeks - FVRCP' },
            { age: 0.25, label: '10-12 Weeks - FVRCP + FeLV' },
            { age: 0.33, label: '14-16 Weeks - FVRCP + Rabies' },
            { age: 1, label: '1 Year - Annual Boosters' },
            { age: 3, label: '3 Years - Rabies Booster' }
        ];
    } else {
        vaccines = [
            { age: 0.25, label: 'Consult Vet for Specific Vaccines' },
            { age: 1, label: 'Annual Health Checkup' }
        ];
    }
    
    const currentAge = years + (months / 12);
    
    vaccines.forEach(vaccine => {
        const item = document.createElement('div');
        item.className = currentAge >= vaccine.age ? 'timeline-item completed' : 'timeline-item upcoming';
        item.innerHTML = `<strong>${vaccine.label}</strong>`;
        timeline.appendChild(item);
    });
}

function updateCareTips(lifeStage, petType) {
    const careTips = document.getElementById('careTips');
    careTips.innerHTML = '';
    
    let tips = [];
    
    if (lifeStage.includes('Puppy') || lifeStage.includes('Kitten') || lifeStage === 'Junior') {
        tips = [
            '🍖 Feed high-protein, growth-formula food 3-4 times daily',
            '🎓 Begin socialization and basic training immediately',
            '💉 Complete all vaccination series on schedule',
            '🏃 Provide plenty of playtime and mental stimulation',
            '🦷 Start dental hygiene routine early'
        ];
    } else if (lifeStage.includes('Adult')) {
        tips = [
            '🥗 Feed quality adult maintenance diet twice daily',
            '🏋️ Maintain regular exercise routine (30-60 minutes)',
            '📅 Annual vet checkups with bloodwork',
            '🦴 Provide dental chews and toys',
            '🧠 Continue mental stimulation with puzzle toys'
        ];
    } else {
        tips = [
            '🍽️ Switch to senior diet with joint support',
            '🚶 Gentle, low-impact exercise daily',
            '🏥 Biannual vet visits with comprehensive bloodwork',
            '🛏️ Provide orthopedic bedding for comfort',
            '💊 Consider supplements (glucosamine, omega-3)',
            '❤️ Monitor for signs of pain or cognitive decline'
        ];
    }
    
    tips.forEach(tip => {
        const li = document.createElement('li');
        li.textContent = tip;
        careTips.appendChild(li);
    });
}

// Share Functions
document.getElementById('shareWhatsApp').addEventListener('click', () => {
    const data = window.petData;
    const text = `My ${data.type} ${data.name} is ${data.age} years ${data.months} months old - that's ${data.humanAge} in human years! ${data.emoji} Calculate your pet's age at CalculatorLoop.com`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
});

document.getElementById('shareTwitter').addEventListener('click', () => {
    const data = window.petData;
    const text = `My ${data.type} ${data.name} is ${data.humanAge} years old in human years! ${data.emoji} #PetAge #PetCalculator`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
});

document.getElementById('shareFacebook').addEventListener('click', () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
});

document.getElementById('downloadPDF').addEventListener('click', () => {
    const data = window.petData;
    alert(`PDF Download Feature Coming Soon!\n\nYour ${data.type}'s details:\nName: ${data.name}\nAge: ${data.age} years ${data.months} months\nHuman Age: ${data.humanAge} years`);
});

// FAQ Toggle
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const isActive = faqItem.classList.contains('active');
                                                           
        // Open clicked item if it wasn't active
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });

    +
    +
'});1470\';[p]
