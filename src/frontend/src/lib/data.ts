
import { Manga, Chapter } from "@/types";

export const GENRES = [
    "Action", "Adventure", "Comedy", "Drama", "Ecchi", "Fantasy", "Horror", "Mystery", "Romance", "Sci-Fi", "Slice of Life", "Sports", "Supernatural", "Thriller", "Yaoi", "Yuri", "Others"
];

function generateChapters(count: number): Chapter[] {
    return Array.from({ length: count }, (_, i) => ({
        id: `chap-${i + 1}`,
        title: `Chapter ${i + 1}`,
        slug: (i + 1).toString(),
        number: i + 1,
        pages: Array.from({ length: 5 }, (_, p) => `/mock/page${p + 1}.jpg`), // Assuming mock images later
        createdAt: new Date(Date.now() - (count - i) * 86400000).toISOString(),
    })).reverse();
}

export const MOCK_MANGA_LIST: Manga[] = [
    {
        id: "1",
        title: "Solo Leveling",
        slug: "solo-leveling",
        cover: "https://placehold.co/300x450/png?text=Solo+Leveling",
        description: "In a world where hunters, humans who possess magical abilities, must battle deadly monsters to protect the human race from certain annihilation, a notoriously weak hunter named Sung Jinwoo finds himself in a seemingly endless struggle for survival.",
        genres: ["Action", "Adventure", "Fantasy"],
        rating: 4.9,
        status: "Completed",
        chapters: generateChapters(10),
    },
    {
        id: "2",
        title: "One Piece",
        slug: "one-piece",
        cover: "https://placehold.co/300x450/png?text=One+Piece",
        description: "Monkey D. Luffy refuses to let anyone or anything stand in the way of his quest to become the king of all pirates.",
        genres: ["Action", "Adventure", "Comedy"],
        rating: 4.8,
        status: "Ongoing",
        chapters: generateChapters(5),
    },
    {
        id: "3",
        title: "Naruto",
        slug: "naruto",
        cover: "https://placehold.co/300x450/png?text=Naruto",
        description: "Naruto Uzumaki, a mischievous adolescent ninja, struggles as he searches for recognition and dreams of becoming the Hokage, the village's leader and strongest ninja.",
        genres: ["Action", "Adventure", "Fantasy"],
        rating: 4.7,
        status: "Completed",
        chapters: generateChapters(3),
    },
    {
        id: "4",
        title: "Attack on Titan",
        slug: "attack-on-titan",
        cover: "https://placehold.co/300x450/png?text=AoT",
        description: "After his hometown is destroyed and his mother is killed, young Eren Yeager vows to cleanse the earth of the giant humanoid Titans that have brought humanity to the brink of extinction.",
        genres: ["Action", "Drama", "Fantasy", "Horror"],
        rating: 4.9,
        status: "Completed",
        chapters: generateChapters(20),
    },
    {
        id: "5",
        title: "Demon Slayer",
        slug: "demon-slayer",
        cover: "https://placehold.co/300x450/png?text=Demon+Slayer",
        description: "A family is attacked by demons and only two members survive - Tanjiro and his sister Nezuko, who is turning into a demon slowly. Tanjiro sets out to become a demon slayer to avenge his family and cure his sister.",
        genres: ["Action", "Demons", "Historical", "Shounen", "Supernatural"],
        rating: 4.8,
        status: "Completed",
        chapters: generateChapters(15),
    },
    {
        id: "6",
        title: "Bleach",
        slug: "bleach",
        cover: "https://placehold.co/300x450/png?text=Bleach",
        description: "High school student Ichigo Kurosaki, who has the ability to see ghosts, gains soul reaper powers from Rukia Kuchiki and sets out to save the world from 'Hollows'.",
        genres: ["Action", "Adventure", "Supernatural"],
        rating: 4.5,
        status: "Completed",
        chapters: generateChapters(12),
    },
    {
        id: "7",
        title: "Boku no Hero Academia",
        slug: "my-hero-academia",
        cover: "https://placehold.co/300x450/png?text=My+Hero+Academia",
        description: "A superhero-loving boy without any powers is determined to enroll in a prestigious hero academy and learn what it really means to be a hero.",
        genres: ["Action", "School", "Shounen", "Superpower"],
        rating: 4.6,
        status: "Ongoing",
        chapters: generateChapters(8),
    }
];

export function getMangaBySlug(slug: string): Manga | undefined {
    return MOCK_MANGA_LIST.find((m) => m.slug === slug);
}

export function getLatestManga(): Manga[] {
    return MOCK_MANGA_LIST.slice(0, 4);
}

export function getPopularManga(): Manga[] {
    return MOCK_MANGA_LIST.sort((a, b) => b.rating - a.rating).slice(0, 4);
}
