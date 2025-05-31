// Application data
const poolData = [
    {range: "601-1200", candidates: 816, level: "Excellent", color: "success"},
    {range: "501-600", candidates: 19782, level: "Very Good", color: "success"},
    {range: "491-500", candidates: 8924, level: "Good", color: "warning"},
    {range: "481-490", candidates: 8618, level: "Competitive", color: "warning"},
    {range: "471-480", candidates: 8000, level: "Competitive", color: "warning"},
    {range: "461-470", candidates: 11557, level: "Moderate", color: "info"},
    {range: "451-460", candidates: 9600, level: "Moderate", color: "info"},
    {range: "441-450", candidates: 11822, level: "Low", color: "error"},
    {range: "431-440", candidates: 12429, level: "Low", color: "error"},
    {range: "421-430", candidates: 12072, level: "Very Low", color: "error"},
    {range: "411-420", candidates: 13014, level: "Very Low", color: "error"},
    {range: "401-410", candidates: 15465, level: "Very Low", color: "error"},
    {range: "351-400", candidates: 53479, level: "Very Low", color: "error"},
    {range: "301-350", candidates: 22799, level: "Very Low", color: "error"},
    {range: "0-300", candidates: 8563, level: "Very Low", color: "error"}
];

const drawsData = [
    {draw: 331, date: "Jan 7", type: "PNP", itas: 471, crs: 793},
    {draw: 332, date: "Jan 8", type: "CEC", itas: 1350, crs: 542},
    {draw: 333, date: "Jan 23", type: "CEC", itas: 4000, crs: 527},
    {draw: 334, date: "Feb 4", type: "PNP", itas: 455, crs: 802},
    {draw: 335, date: "Feb 5", type: "CEC", itas: 4000, crs: 521},
    {draw: 336, date: "Feb 17", type: "PNP", itas: 646, crs: 750},
    {draw: 337, date: "Feb 19", type: "French", itas: 6500, crs: 428},
    {draw: 338, date: "Mar 3", type: "PNP", itas: 725, crs: 667},
    {draw: 339, date: "Mar 6", type: "French", itas: 4500, crs: 410},
    {draw: 340, date: "Mar 17", type: "PNP", itas: 536, crs: 736},
    {draw: 341, date: "Mar 21", type: "French", itas: 7500, crs: 379},
    {draw: 342, date: "Apr 14", type: "PNP", itas: 825, crs: 764},
    {draw: 343, date: "Apr 28", type: "PNP", itas: 421, crs: 727},
    {draw: 344, date: "May 1", type: "Education", itas: 1000, crs: 479},
    {draw: 345, date: "May 2", type: "Healthcare", itas: 500, crs: 510},
    {draw: 346, date: "May 12", type: "PNP", itas: 511, crs: 706},
    {draw: 347, date: "May 13", type: "CEC", itas: 500, crs: 547}
];

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    populatePoolTable();
    populateDrawsTimeline();
    generateImprovementTips();
});

// Tab Navigation
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// Populate Pool Distribution Table
function populatePoolTable() {
    const tableBody = document.getElementById('pool-table-body');
    let cumulative = 0;
    
    poolData.forEach(item => {
        cumulative += item.candidates;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${item.range}</strong></td>
            <td>${item.candidates.toLocaleString()}</td>
            <td>${cumulative.toLocaleString()}</td>
            <td><span class="status status--${item.color}">${item.level}</span></td>
        `;
        tableBody.appendChild(row);
    });
}

// Populate Draws Timeline
function populateDrawsTimeline() {
    const timeline = document.getElementById('draws-timeline');
    
    drawsData.forEach(draw => {
        const drawItem = document.createElement('div');
        drawItem.className = 'draw-item';
        drawItem.innerHTML = `
            <div class="draw-info">
                <div class="draw-date">${draw.date}, 2025</div>
                <div class="draw-details">
                    <span class="draw-number">Draw #${draw.draw}</span>
                    <span class="draw-type ${draw.type.toLowerCase()}">${draw.type}</span>
                    <span><strong>${draw.itas}</strong> ITAs</span>
                    <span><strong>${draw.crs}</strong> CRS</span>
                </div>
            </div>
        `;
        timeline.appendChild(drawItem);
    });
}

// Enhanced Chances Calculator
function calculateChances() {
    const crsScore = parseInt(document.getElementById('crs-score').value);
    const profileType = document.getElementById('profile-type').value;
    const language = document.getElementById('language').value;
    const experience = document.getElementById('experience').value;
    
    if (!crsScore || crsScore < 0 || crsScore > 1200) {
        alert('Please enter a valid CRS score between 0 and 1200');
        return;
    }
    
    const results = analyzeChances(crsScore, profileType, language, experience);
    displayResults(results);
}

function analyzeChances(crsScore, profileType, language, experience) {
    const results = {
        overall: calculateOverallChances(crsScore, profileType),
        drawTypes: calculateDrawTypeChances(crsScore, profileType, language),
        waitingTime: estimateWaitingTime(crsScore, profileType),
        recommendations: generateRecommendations(crsScore, profileType, language, experience),
        competitionAnalysis: analyzeCompetition(crsScore),
        scoreImprovement: suggestScoreImprovements(crsScore, profileType, language, experience)
    };
    
    return results;
}

function calculateOverallChances(crsScore, profileType) {
    let baseChance = 0;
    
    // Adjusted base chances for more optimism
    if (crsScore >= 550) baseChance = 100; // Previously 600
    else if (crsScore >= 500) baseChance = 95; // Previously 550
    else if (crsScore >= 480) baseChance = 90; // Previously 500
    else if (crsScore >= 460) baseChance = 85; // Previously 470
    else if (crsScore >= 440) baseChance = 75; // Previously 450
    else if (crsScore >= 400) baseChance = 60; // Previously 50
    else if (crsScore >= 370) baseChance = 40; // Previously 350 -> 5
    else if (crsScore >= 350) baseChance = 20; // New tier
    else baseChance = 5; // Previously 1
    
    // Slightly more generous profile type adjustments
    const adjustments = {
        'cec': 1.15,        // Previously 1.2
        'french': 1.3,      // Previously 1.4 (kept high as it's impactful)
        'pnp': 1.6,         // Previously 1.8 (PNP is very strong, but adjusting base makes this reasonable)
        'healthcare': 1.25, // Previously 1.3
        'education': 1.1,   // Kept same
        'general': 1.0
    };
    
    return Math.min(100, Math.round(baseChance * adjustments[profileType])); // Max 100%
}

function calculateDrawTypeChances(crsScore, profileType, language) {
    const drawTypes = {
        CEC: 0,
        French: 0,
        PNP: 0,
        Healthcare: 0,
        Education: 0
    };
    
    // CEC chances - more optimistic
    if (profileType === 'cec' || profileType === 'general') {
        if (crsScore >= 520) drawTypes.CEC = 90;       // Prev 550
        else if (crsScore >= 500) drawTypes.CEC = 80;  // Prev 530
        else if (crsScore >= 480) drawTypes.CEC = 65;  // Prev 510
        else if (crsScore >= 460) drawTypes.CEC = 45;  // Prev 490
        else if (crsScore >= 440) drawTypes.CEC = 25;  // Prev 470
        else drawTypes.CEC = 10;                       // Prev 5
    }
    
    // French chances - more optimistic
    if (language === 'french' || language === 'both') {
        if (crsScore >= 430) drawTypes.French = 95;     // Prev 450
        else if (crsScore >= 400) drawTypes.French = 88; // Prev 420
        else if (crsScore >= 380) drawTypes.French = 78; // Prev 400
        else if (crsScore >= 360) drawTypes.French = 65; // Prev 380
        else if (crsScore >= 340) drawTypes.French = 45; // Prev 350
        else drawTypes.French = 25;                      // Prev 20
    }
    
    // PNP chances - slightly adjusted (PNP is inherently high CRS)
    if (profileType === 'pnp') {
        if (crsScore >= 680) drawTypes.PNP = 95;       // Prev 700
        else if (crsScore >= 630) drawTypes.PNP = 85;  // Prev 650
        else if (crsScore >= 580) drawTypes.PNP = 70;  // Prev 600
        else drawTypes.PNP = 40;                       // Prev 30
    }
    
    // Healthcare chances - more optimistic
    if (profileType === 'healthcare') {
        if (crsScore >= 500) drawTypes.Healthcare = 90; // Prev 520
        else if (crsScore >= 480) drawTypes.Healthcare = 78; // Prev 500
        else if (crsScore >= 460) drawTypes.Healthcare = 65; // Prev 480
        else drawTypes.Healthcare = 45;                      // Prev 40
    }
    
    // Education chances - more optimistic
    if (profileType === 'education') {
        if (crsScore >= 470) drawTypes.Education = 85; // Prev 490
        else if (crsScore >= 450) drawTypes.Education = 75; // Prev 470
        else if (crsScore >= 430) drawTypes.Education = 60; // Prev 450
        else drawTypes.Education = 40;                      // Prev 35
    }
    
    return drawTypes;
}

function estimateWaitingTime(crsScore, profileType) {
    let months = 0;
    
    if (crsScore >= 600) months = 1;
    else if (crsScore >= 550) months = 2;
    else if (crsScore >= 500) months = 4;
    else if (crsScore >= 470) months = 8;
    else if (crsScore >= 450) months = 12;
    else if (crsScore >= 400) months = 18;
    else months = 24;
    
    // Adjust for profile type
    if (profileType === 'french') months = Math.max(1, Math.round(months * 0.6));
    else if (profileType === 'pnp') months = Math.max(1, Math.round(months * 0.4));
    else if (profileType === 'healthcare') months = Math.max(1, Math.round(months * 0.7));
    else if (profileType === 'education') months = Math.max(1, Math.round(months * 0.8));
    
    return months;
}

function generateRecommendations(crsScore, profileType, language, experience) {
    const recommendations = [];
    
    if (crsScore < 470) {
        recommendations.push({
            priority: 'High',
            action: 'Improve Language Scores',
            impact: '+30-50 CRS points',
            description: 'Focus on achieving CLB 9+ in all language abilities'
        });
        
        if (language !== 'both') {
            recommendations.push({
                priority: 'High',
                action: 'Learn French',
                impact: '+25-50 CRS points',
                description: 'French language skills significantly boost CRS scores'
            });
        }
        
        if (profileType !== 'pnp') {
            recommendations.push({
                priority: 'Medium',
                action: 'Consider PNP',
                impact: '+600 CRS points',
                description: 'Provincial Nomination guarantees invitation'
            });
        }
    }
    
    if (experience === '0-1') {
        recommendations.push({
            priority: 'Medium',
            action: 'Gain More Experience',
            impact: '+15-25 CRS points',
            description: 'Additional work experience increases CRS score'
        });
    }
    
    recommendations.push({
        priority: 'Low',
        action: 'Pursue Additional Education',
        impact: '+5-30 CRS points',
        description: 'Higher education credentials can boost your score'
    });
    
    return recommendations;
}

function analyzeCompetition(crsScore) {
    let rank = 0;
    let betterThanPercent = 0;
    
    for (const range of poolData) {
        const [min, max] = range.range.split('-').map(x => x === '1200' ? 1200 : parseInt(x));
        if (crsScore >= min && crsScore <= max) {
            betterThanPercent = Math.round((rank / 244282) * 100);
            break;
        }
        rank += range.candidates;
    }
    
    return {
        rank: rank + 1,
        betterThan: betterThanPercent,
        totalCandidates: 244282
    };
}

function suggestScoreImprovements(crsScore, profileType, language, experience) {
    const improvements = [];
    
    if (language !== 'both') {
        improvements.push({
            category: 'Language',
            suggestion: 'Learn French as second language',
            points: '+25-50 points',
            timeline: '6-12 months'
        });
    }
    
    improvements.push({
        category: 'Language',
        suggestion: 'Improve English to CLB 9+',
        points: '+6-24 points',
        timeline: '3-6 months'
    });
    
    if (experience !== '6+') {
        improvements.push({
            category: 'Experience',
            suggestion: 'Gain additional work experience',
            points: '+15-25 points',
            timeline: '1-3 years'
        });
    }
    
    improvements.push({
        category: 'Education',
        suggestion: 'Pursue additional credentials',
        points: '+5-30 points',
        timeline: '1-2 years'
    });
    
    if (profileType !== 'pnp') {
        improvements.push({
            category: 'PNP',
            suggestion: 'Apply for Provincial Nomination',
            points: '+600 points',
            timeline: '6-12 months'
        });
    }
    
    return improvements;
}

function displayResults(results) {
    const container = document.getElementById('results-container');
    
    const probabilityClass = results.overall >= 70 ? 'probability-high' : 
                           results.overall >= 40 ? 'probability-medium' : 'probability-low';
    
    container.innerHTML = `
        <div class="results-item">
            <h4>Overall Invitation Probability</h4>
            <div class="probability-score ${probabilityClass}">${results.overall}%</div>
            <div class="waiting-time">Estimated waiting time: ${results.waitingTime} month(s)</div>
        </div>
        
        <div class="results-item">
            <h4>Competition Analysis</h4>
            <p>You rank better than <strong>${results.competitionAnalysis.betterThan}%</strong> of candidates</p>
            <p>Approximate pool position: <strong>#${results.competitionAnalysis.rank.toLocaleString()}</strong></p>
        </div>
        
        <div class="results-item">
            <h4>Draw Type Probabilities</h4>
            ${Object.entries(results.drawTypes).map(([type, chance]) => {
                if (chance > 0) {
                    const chanceClass = chance >= 70 ? 'probability-high' : 
                                      chance >= 40 ? 'probability-medium' : 'probability-low';
                    return `<p><strong>${type}:</strong> <span class="${chanceClass}">${chance}%</span></p>`;
                }
                return '';
            }).join('')}
        </div>
        
        ${results.recommendations.length > 0 ? `
        <div class="recommendation">
            <h4>🎯 Top Recommendations</h4>
            ${results.recommendations.slice(0, 3).map(rec => `
                <div style="margin-bottom: 12px;">
                    <strong>${rec.action}</strong> (${rec.priority} Priority)<br>
                    <span style="color: var(--color-success);">${rec.impact}</span><br>
                    <small>${rec.description}</small>
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        <div class="recommendation">
            <h4>📈 Score Improvement Plan</h4>
            ${results.scoreImprovement.slice(0, 3).map(imp => `
                <div style="margin-bottom: 12px;">
                    <strong>${imp.suggestion}</strong><br>
                    <span style="color: var(--color-primary);">${imp.points}</span> • 
                    <span style="color: var(--color-text-secondary);">${imp.timeline}</span>
                </div>
            `).join('')}
        </div>
    `;
}

// Generate Improvement Tips
function generateImprovementTips() {
    const tipsContainer = document.getElementById('improvement-tips');
    
    const tips = [
        {
            title: 'Master English/French',
            points: '+50 CRS',
            description: 'Achieve CLB 9+ in all four language abilities for maximum points'
        },
        {
            title: 'Learn Second Language',
            points: '+25-50 CRS',
            description: 'French proficiency can significantly boost your score and open French-specific draws'
        },
        {
            title: 'Gain Canadian Experience',
            points: '+40 CRS',
            description: 'One year of skilled work experience in Canada provides substantial points'
        },
        {
            title: 'Pursue Higher Education',
            points: '+30 CRS',
            description: 'Advanced degrees (Masters/PhD) increase your education points'
        },
        {
            title: 'Get Job Offer (LMIA)',
            points: '+50-200 CRS',
            description: 'Valid job offer with LMIA provides significant points boost'
        },
        {
            title: 'Apply for PNP',
            points: '+600 CRS',
            description: 'Provincial nomination virtually guarantees invitation to apply'
        },
        {
            title: 'Arrange Employment',
            points: '+15 CRS',
            description: 'Having arranged employment in Canada provides additional points'
        }
    ];
    
    tipsContainer.innerHTML = tips.map(tip => `
        <div class="tip-item">
            <h4>${tip.title}</h4>
            <div class="tip-points">${tip.points}</div>
            <p>${tip.description}</p>
        </div>
    `).join('');
}

// Utility functions
function formatNumber(num) {
    return num.toLocaleString();
}

function getDrawTypeColor(type) {
    const colors = {
        'CEC': '#21808D',
        'PNP': '#A84B2F',
        'French': '#32B8C6',
        'Healthcare': '#C0152F',
        'Education': '#626C71'
    };
    return colors[type] || '#626C71';
}