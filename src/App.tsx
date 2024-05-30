import React, { useEffect, useState } from 'react';
import './App.css';
import bibleData from './kjv.json';  // Import the local JSON file
import { selectRandomChapter } from './utils';
import { Chapter } from './Types';

interface SearchResult {
  href: string;
  content: string;
}

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [chapter, setChapter] = useState<Chapter>({book: '', chapter: 0 });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    //@ts-ignore
    selectRandomChapter(bibleData.verses).then((chapter) => setChapter(chapter));
  }, []);

  const handleSearch = async () => {
    try {
      setLoading(true);

      // @ts-ignore
      const results: SearchResult[] = bibleData.verses
        .map((book: any) => ({
          href: book.book_name,
          content: book.text,
        }))
        .filter((result: SearchResult) => {
          const searchTermLowerCase = searchTerm.toLowerCase();
          const contentLowerCase = result.content.toLowerCase();

          // Create a regular expression to match either whole word or whole sentence
          const wordRegex = new RegExp(`\\b${searchTermLowerCase}\\b`, 'i');
          const sentenceRegex = new RegExp(`\\b${searchTermLowerCase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');

          // Use the test method to check if the content contains the whole word or the whole sentence
          return wordRegex.test(contentLowerCase) || sentenceRegex.test(contentLowerCase);
        });

      setSearchResults(results);
    } catch (error) {
      console.error('Error loading JSON file:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        {/* <h1>Bible Search</h1> */}
        {/* <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter search term"
        />
        <button onClick={handleSearch} disabled={loading}>
          Search
        </button> */}

        {loading && <p>Loading...</p>}

        {searchTerm !== '' && searchResults.length > 0 ? (
          <div>
            <h2>Search Results:</h2>
            <ul>
              {searchResults.map((result, index) => (
                <li key={index}>
                  <strong>{result.href}</strong>: {result.content}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="chapter-container">
             <h2>{chapter.book_name} Chapter {chapter.chapter}:</h2>
             {chapter.concatenatedText && (
          <div className="chapter-text">
            <pre>
                {chapter.concatenatedText.map((text: any, index: any) => (
                    <span key={index}>{text}</span>
                ))}
            </pre>
        </div>
        )}
             </div>

        )}
      </header>
    </div>
  );
}

export default App;
