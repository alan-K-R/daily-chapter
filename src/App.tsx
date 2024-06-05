import React, { useEffect, useState } from "react";
import "./App.css";
import { selectRandomChapter, fetchSearchResult } from "./utils";
import { Chapter, SearchResult } from "./Types";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [chapter, setChapter] = useState<Chapter>({ book: "", chapter: 0 });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    //@ts-ignore
    selectRandomChapter().then((chapter) => setChapter(chapter));
  }, []);

  const handleSearch = async () => {
    try {
      setLoading(true);

      // @ts-ignore
      const results: SearchResult[] = await fetchSearchResult(searchTerm);
      setSearchResults(results);
    } catch (error) {
      console.error("Error loading JSON file:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        {loading && <p>Loading...</p>}

        {
          <div className="container">
            <div className="chapter-container">
              {chapter.concatenatedText && (
                <div className="chapter-text">
                  <h2>
                    {chapter.book_name} Chapter {chapter.chapter}:
                  </h2>
                  <pre>
                    {chapter.concatenatedText.map((text: any, index: any) => (
                      <span key={index}>{text.trim()}</span>
                    ))}
                  </pre>
                </div>
              )}
            </div>
            <div className="sidemenu">
              <h2>Search Scripture</h2>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter search term"
              />
              <button onClick={handleSearch} disabled={loading}>
                Search
              </button>
              {searchTerm !== "" &&
              searchResults &&
              searchResults.length > 0 ? (
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
              ) : searchTerm !== "" ? (
                <p>No results found.</p>
              ) : null}
            </div>
          </div>
        }
      </header>
    </div>
  );
}

export default App;
