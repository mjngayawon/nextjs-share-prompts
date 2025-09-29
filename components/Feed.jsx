"use client";

import { useState, useEffect } from "react";

import PromptCard from "./PromptCard";

const PromptCardList = ({ data, title, handleTagClick }) => {
  if (data?.length > 0) {
    return (
      <div className="mt-16 prompt_layout">
        {data.map((post) => (
          <PromptCard
            key={post._id}
            post={post}
            handleTagClick={handleTagClick}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-16 prompt_layout">
      <h1>{title}</h1>
    </div>
  );
};

const Feed = () => {
  const [searchText, setSearchText] = useState("");
  const [posts, setPosts] = useState([]);
  const [searchedResults, setSearchedResults] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("api/prompt");
      const data = await response.json();

      setPosts(data);
    };

    fetchPosts();
  }, []);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);

    clearTimeout(searchTimeout);

    setSearchTimeout(
      setTimeout(() => {
        const searchResults = posts.filter(
          (item) =>
            item.creator.username
              .toLowerCase()
              .includes(searchText.toLowerCase()) ||
            item.prompt.toLowerCase().includes(searchText.toLowerCase()) ||
            item.tag.toLowerCase().includes(searchText.toLowerCase())
        );

        setSearchedResults(searchResults);
      }, 500)
    );
  };

  const handleTagClick = (tagName) => {
    setSearchText(tagName);

    const searchResults = posts.filter(
      (item) => item.tag.toLowerCase() === tagName.toLowerCase()
    );

    setSearchedResults(searchResults);
  };

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>
      {searchText ? (
        <PromptCardList
          data={searchedResults}
          title="No search results found"
          handleTagClick={handleTagClick}
        />
      ) : (
        <PromptCardList data={posts} title="" handleTagClick={handleTagClick} />
      )}
    </section>
  );
};

export default Feed;
