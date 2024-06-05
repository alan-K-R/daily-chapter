import { SearchResult } from './Types';
import bibleData from './kjv.json';
//@ts-ignore
const verses = bibleData.verses; 


export async function selectRandomChapter() {

    // Select a random book
    const randomVerse = verses[Math.floor(Math.random() * verses.length)];

    // Find the book object corresponding to the random book name
    const { book} = randomVerse;
 return groupAndConcatenateVerses(book, verses); 
}

function groupAndConcatenateVerses(bookNumber: number, verses: any[]): { book_name: string, chapter: string, concatenatedText: string[] } | null {
    // Filter verses that belong to the specified book number
    const versesOfBook = verses.filter(verse => verse.book === bookNumber);

    // If no verses are found for the given book number, return null
    if (versesOfBook.length === 0) {
        return null;
    }

    // Select a random chapter from the book
    const randomChapterIndex = Math.floor(Math.random() * versesOfBook.length);
    const randomChapter = versesOfBook[randomChapterIndex].chapter;

    // Filter verses for the random chapter
    const versesOfChapter = versesOfBook.filter(verse => verse.chapter === randomChapter);

    // Concatenate texts for the selected chapter
    const concatenatedText = versesOfChapter.map(verse => `${verse.verse}: ${verse.text} `);

    return { 
        book_name: versesOfBook[0].book_name, 
        chapter: randomChapter.toString(), 
        concatenatedText 
    };
}

export async function fetchSearchResult(searchTerm: string): Promise<SearchResult[]> {
    const searchTermLower = searchTerm.toLowerCase();
    const wordRegex = new RegExp(`\\b${searchTermLower}\\b`, "i");
    const sentenceRegex = new RegExp(
        `\\b${searchTermLower.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
        "i"
    );

    const searchResults: SearchResult[] = verses.reduce((acc: SearchResult[], book: any) => {
        const contentLower = book.text.toLowerCase();
        if (wordRegex.test(contentLower) || sentenceRegex.test(contentLower)) {
            acc.push({
                href: book.book_name,
                content: book.text,
            });
        }
        return acc;
    }, []);

    return searchResults;
}
