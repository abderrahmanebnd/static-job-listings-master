import { useState, useContext, createContext } from "react";

// 1) CREATE A CONTEXT
const JobContext = createContext();

function JobProvider({ children }) {
  const [jobs, setJobs] = useState([]);
  const [searchedTags, setSearchedTags] = useState([]);

  const searchedJobs = searchedTags.length
    ? jobs.filter((job) => {
        const tags = job.languages.concat(...job.tools, job.level, job.role);
        return searchedTags.every((searchedTag) => tags.includes(searchedTag));
      })
    : jobs;

  function handleAddSearchTag(tag) {
    if (!searchedTags.includes(tag))
      setSearchedTags((searchedTags) => [...searchedTags, tag]);
    else setSearchedTags(searchedTags);
  }

  function handleClear() {
    setSearchedTags([]);
  }

  function handleRemoveTag(tagName) {
    setSearchedTags(searchedTags.filter((tag) => tag !== tagName));
  }

  const value = {
    jobs,
    searchedJobs,
    setJobs,
    searchArray: searchedTags,
    setSearchedTags,
    onAddTag: handleAddSearchTag,
    onRemoveTag: handleRemoveTag,
    onClear: handleClear,
  };

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
}
function useJobs() {
  const context = useContext(JobContext);
  if (context === undefined)
    throw new Error("PostContext was used outside of the PostProvider");
  return context;
}

export { JobProvider, useJobs };
