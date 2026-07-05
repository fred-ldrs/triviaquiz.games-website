/**
 * cocktailorcolor.js
 * ─────────────────────────────────────────────────────────────────
 * Module for the "Cocktail or Color?" quiz category.
 *
 * Public API
 *   getCocktailPool()   → string[]
 *   getColorPool()      → string[]
 *   generateQuiz(count) → QuizItem[]   (random, no repeats)
 *   generatePairedQuiz()→ QuizItem[]   (fixed pairs, random side)
 *
 * QuizItem: { name: string, type: "cocktail" | "color" }
 *
 * No external dependencies — pure ES-module.
 */

// ─────────────────────────────────────────────────────────────────
// Pool A – Real cocktails whose names read like colour names
// Pattern: [Adjective/Colour word] + [Noun]
// ─────────────────────────────────────────────────────────────────
const COCKTAIL_POOL = [
    "Blue Lagoon",      // Blue curaçao, vodka, lemonade
    "Pink Lady",        // Gin, grenadine, egg white, apple brandy
    "Golden Dream",     // Galliano, triple sec, OJ, cream
    "Black Russian",    // Vodka, coffee liqueur
    "White Russian",    // Vodka, coffee liqueur, cream
    "Red Snapper",      // Gin-based Bloody Mary variant
    "Silver Fizz",      // Gin, lemon, egg white, soda
    "Green Ghost",      // Chartreuse, gin, lime
    "Yellow Bird",      // Rum, Galliano, triple sec, lime
    "Black Velvet",     // Stout, champagne
    "Blue Hawaiian",    // Rum, blue curaçao, pineapple, coconut
    "White Lady",       // Gin, triple sec, lemon juice
    "Golden Cadillac",  // Galliano, white crème de cacao, cream
    "Blue Moon",        // Gin, violet liqueur, lemon
    "Pink Flamingo",    // Rum, grenadine, pineapple, lime
    "Silver Bullet",    // Gin or vodka, kümmel
    "Golden Gate",      // Rum, gin, orange, cream, anise
    "Brown Derby",      // Bourbon, grapefruit juice, honey
    "Red Lion",         // Grand Marnier, gin, orange, lemon
    "Purple Rain",      // Vodka, blue curaçao, cranberry, grenadine
];

// ─────────────────────────────────────────────────────────────────
// Pool B – Real colour names in the same Adjective + Noun pattern
// ─────────────────────────────────────────────────────────────────
const COLOR_POOL = [
    "Midnight Blue",
    "Rose Gold",
    "Cobalt Blue",
    "Dusty Rose",
    "Electric Blue",
    "Forest Green",
    "Burnt Orange",
    "Sage Green",
    "Champagne Gold",
    "Charcoal Gray",
    "Coral Red",
    "Emerald Green",
    "Pearl White",
    "Scarlet Red",
    "Silver Gray",
    "Amber Gold",
    "Royal Blue",
    "Warm Beige",
    "Deep Purple",
    "Golden Brown",
];

// ─────────────────────────────────────────────────────────────────
// Fixed pairs – each cocktail is thematically linked to a colour.
// Used by generatePairedQuiz().
// ─────────────────────────────────────────────────────────────────
const PAIRS = [
    { cocktail: "Blue Lagoon",   color: "Cobalt Blue"    },
    { cocktail: "Pink Lady",     color: "Dusty Rose"     },
    { cocktail: "Golden Dream",  color: "Champagne Gold" },
    { cocktail: "Black Russian", color: "Charcoal Gray"  },
    { cocktail: "White Russian", color: "Pearl White"    },
    { cocktail: "Red Snapper",   color: "Scarlet Red"    },
    { cocktail: "Silver Fizz",   color: "Silver Gray"    },
    { cocktail: "Green Ghost",   color: "Forest Green"   },
    { cocktail: "Yellow Bird",   color: "Amber Gold"     },
    { cocktail: "Purple Rain",   color: "Deep Purple"    },
];

// ─────────────────────────────────────────────────────────────────
// Internal utility
// ─────────────────────────────────────────────────────────────────

/** Fisher-Yates in-place shuffle. Returns the array for chaining. */
function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// ─────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────

/**
 * Returns a fresh copy of the 20-item cocktail pool.
 * @returns {string[]}
 */
export function getCocktailPool() {
    return [...COCKTAIL_POOL];
}

/**
 * Returns a fresh copy of the 20-item colour pool.
 * @returns {string[]}
 */
export function getColorPool() {
    return [...COLOR_POOL];
}

/**
 * Generates a randomised quiz list of `count` items without repetition.
 * Items are drawn from both pools combined (40 entries total).
 *
 * @param {number} [count=20] - Number of questions (max 40).
 * @returns {{ name: string, type: "cocktail"|"color" }[]}
 *
 * @example
 * generateQuiz(5);
 * // [
 * //   { name: "Blue Lagoon",   type: "cocktail" },
 * //   { name: "Midnight Blue", type: "color"    },
 * //   { name: "Pink Lady",     type: "cocktail" },
 * //   { name: "Cobalt Blue",   type: "color"    },
 * //   { name: "Golden Dream",  type: "cocktail" },
 * // ]
 */
export function generateQuiz(count = 20) {
    const combined = [
        ...COCKTAIL_POOL.map(name => ({ name, type: 'cocktail' })),
        ...COLOR_POOL.map(name  => ({ name, type: 'color'    })),
    ];
    shuffle(combined);
    return combined.slice(0, Math.min(count, combined.length));
}

/**
 * Generates a quiz using fixed Cocktail ↔ Colour pairs.
 * For each of the 10 pairs one side is chosen at random (50 / 50).
 * The resulting list is shuffled so pair order is unpredictable.
 * No repeated entries — each name appears at most once.
 *
 * @returns {{ name: string, type: "cocktail"|"color" }[]}  (10 items)
 *
 * @example
 * generatePairedQuiz();
 * // [
 * //   { name: "Cobalt Blue",    type: "color"    },  ← from pair 1
 * //   { name: "Golden Dream",   type: "cocktail" },  ← from pair 3
 * //   { name: "Silver Gray",    type: "color"    },  ← from pair 7
 * //   ...
 * // ]
 */
export function generatePairedQuiz() {
    const items = PAIRS.map(pair => {
        const useCocktail = Math.random() < 0.5;
        return useCocktail
            ? { name: pair.cocktail, type: /** @type {"cocktail"} */ ("cocktail") }
            : { name: pair.color,    type: /** @type {"color"}    */ ("color")    };
    });
    return shuffle(items);
}

// ─────────────────────────────────────────────────────────────────
// Example output (20 questions via generateQuiz)
// Run in browser console: import('./js/cocktailorcolor.js').then(m => console.table(m.generateQuiz()))
//
// Sample run:
// ┌──────┬──────────────────┬───────────┐
// │  #   │ name             │ type      │
// ├──────┼──────────────────┼───────────┤
// │  1   │ Blue Lagoon      │ cocktail  │
// │  2   │ Midnight Blue    │ color     │
// │  3   │ Pink Lady        │ cocktail  │
// │  4   │ Cobalt Blue      │ color     │
// │  5   │ Golden Dream     │ cocktail  │
// │  6   │ Champagne Gold   │ color     │
// │  7   │ Black Russian    │ cocktail  │
// │  8   │ Charcoal Gray    │ color     │
// │  9   │ White Russian    │ cocktail  │
// │ 10   │ Pearl White      │ color     │
// │ 11   │ Red Snapper      │ cocktail  │
// │ 12   │ Scarlet Red      │ color     │
// │ 13   │ Silver Fizz      │ cocktail  │
// │ 14   │ Silver Gray      │ color     │
// │ 15   │ Green Ghost      │ cocktail  │
// │ 16   │ Forest Green     │ color     │
// │ 17   │ Yellow Bird      │ cocktail  │
// │ 18   │ Amber Gold       │ color     │
// │ 19   │ Purple Rain      │ cocktail  │
// │ 20   │ Deep Purple      │ color     │
// └──────┴──────────────────┴───────────┘
// ─────────────────────────────────────────────────────────────────
