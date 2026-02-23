export const QUIZ_DATA = {
    '1': {
        id: '1',
        title: 'Am I in menopause?',
        questions: [
            {
                id: 'q1',
                text: 'How old are you?',
                options: [
                    { text: 'Under 40', score: 0 },
                    { text: '40 - 45', score: 1 },
                    { text: '46 - 55', score: 2 },
                    { text: 'Over 55', score: 3 }
                ]
            },
            {
                id: 'q2',
                text: 'How have your periods been recently?',
                options: [
                    { text: 'Regular, like always', score: 0 },
                    { text: 'Irregular (skipping or changing length)', score: 2 },
                    { text: 'I haven\'t had a period in exactly 12 months', score: 4 },
                    { text: 'It\'s been more than 12 months', score: 4 }
                ]
            },
            {
                id: 'q3',
                text: 'Are you experiencing hot flashes or night sweats?',
                options: [
                    { text: 'No', score: 0 },
                    { text: 'Occasionally', score: 1 },
                    { text: 'Yes, frequently', score: 2 }
                ]
            },
            {
                id: 'q4',
                text: 'Have you noticed any mood changes, like increased irritability or anxiety?',
                options: [
                    { text: 'Not really', score: 0 },
                    { text: 'Sometimes', score: 1 },
                    { text: 'Yes, noticeable changes', score: 1 }
                ]
            }
        ],
        results: [
            { min: 0, max: 2, title: 'Likely Premenopause', description: 'Based on your answers, you are likely in your normal reproductive years. If you are experiencing unusual symptoms, consult a doctor.' },
            { min: 3, max: 6, title: 'Likely Perimenopause', description: 'Your symptoms suggest you might be in perimenopause, the transition phase leading to menopause. Hormone fluctuations are common here.' },
            { min: 7, max: 20, title: 'Likely Menopause/Postmenopause', description: 'Your answers strongly align with menopause (12 months without a period) or postmenopause. Consider tracking symptoms closely and discussing them with your provider.' }
        ]
    },
    '2': {
        id: '2',
        title: 'Period quiz',
        questions: [
            {
                id: 'q1',
                text: 'What is the average length of a menstrual cycle?',
                options: [
                    { text: '14 days', score: 0 },
                    { text: '21 to 35 days', score: 1 },
                    { text: 'Exactly 28 days for everyone', score: 0 },
                    { text: '40 days', score: 0 }
                ]
            },
            {
                id: 'q2',
                text: 'Which hormone is primarily responsible for triggering ovulation?',
                options: [
                    { text: 'Estrogen', score: 0 },
                    { text: 'Progesterone', score: 0 },
                    { text: 'Luteinizing Hormone (LH)', score: 1 },
                    { text: 'Testosterone', score: 0 }
                ]
            },
            {
                id: 'q3',
                text: 'True or False: You can only get pregnant on the exact day of ovulation.',
                options: [
                    { text: 'True', score: 0 },
                    { text: 'False, sperm can live for up to 5 days', score: 1 }
                ]
            }
        ],
        results: [
            { min: 0, max: 1, title: 'Budding Expert', description: 'You know a little, but there is so much more to learn about your incredible cycle!' },
            { min: 2, max: 3, title: 'Cycle Scholar', description: 'Great job! You have a solid understanding of how the menstrual cycle works.' }
        ]
    },
    '3': {
        id: '3',
        title: 'PCOS quiz',
        questions: [
            {
                id: 'q1',
                text: 'What does PCOS stand for?',
                options: [
                    { text: 'Primary Cystic Ovary Syndrome', score: 0 },
                    { text: 'Polycystic Ovary Syndrome', score: 1 },
                    { text: 'Pre-Cycle Ovulation Symptoms', score: 0 }
                ]
            },
            {
                id: 'q2',
                text: 'Which of these is a common symptom of PCOS?',
                options: [
                    { text: 'Irregular or missing periods', score: 1 },
                    { text: 'Excess hair growth (hirsutism)', score: 1 },
                    { text: 'Acne', score: 1 },
                    { text: 'All of the above', score: 2 } // Weighted higher for knowing all
                ]
            },
            {
                id: 'q3',
                text: 'True or False: Everyone with PCOS has cysts on their ovaries.',
                options: [
                    { text: 'True', score: 0 },
                    { text: 'False', score: 1 } // False, you only need 2 of the 3 Rotterdam criteria
                ]
            }
        ],
        results: [
            { min: 0, max: 2, title: 'Learning about PCOS', description: 'PCOS is complex. Keep exploring resources to understand this common endocrine disorder.' },
            { min: 3, max: 4, title: 'PCOS Knowledge Pro', description: 'You know your stuff! You understand the key symptoms and nuances of PCOS.' }
        ]
    },
    '4': {
        id: '4',
        title: 'Birth control quiz',
        questions: [
            {
                id: 'q1',
                text: 'Which of these is considered a Long-Acting Reversible Contraceptive (LARC)?',
                options: [
                    { text: 'The Pill', score: 0 },
                    { text: 'Condoms', score: 0 },
                    { text: 'IUD (Intrauterine Device)', score: 1 },
                    { text: 'The Patch', score: 0 }
                ]
            },
            {
                id: 'q2',
                text: 'True or False: The pill protects against sexually transmitted infections (STIs).',
                options: [
                    { text: 'True', score: 0 },
                    { text: 'False', score: 1 }
                ]
            }
        ],
        results: [
            { min: 0, max: 1, title: 'Good Start', description: 'There are many methods available. Talk to your healthcare provider to find what works best for you and your lifecycle goals.' },
            { min: 2, max: 2, title: 'Contraception Whiz', description: 'Perfect score. You understand the fundamental differences between contraceptive types.' }
        ]
    }
};
