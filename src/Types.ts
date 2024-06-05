export interface Verse {
    verse: number;
    text: string;
    book_name: string;
    book: number;
}

export interface Chapter {
    book: string;
    book_name?: string;
    chapter: number;
    verses?: Verse[];
    concatenatedText?: string[]
}

export interface SearchResult {
    href: string;
    content: string;
  }

// ===========EXTERNAL API TYPES=============

export interface Book {
    name: string;
    chapters: number;
  }