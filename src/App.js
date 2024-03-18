import { useEffect, useState } from "react";
import { jobs as jobsArray } from "./data";
export default function App() {
  return (
    <div>
      <Header />
      <Main jobs={jobsArray} />
    </div>
  );
}

function Header() {
  return (
    <header>
      <picture>
        <source
          media="(max-width: 767px)"
          srcSet="images/bg-header-mobile.svg"
        />
        <source
          media="(min-width: 768px)"
          srcSet="images/bg-header-desktop.svg"
        />
        <img
          className="header"
          src="images/bg-header-desktop.svg"
          alt="bg Header"
        />
      </picture>
    </header>
  );
}

function Main({ jobs }) {
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

  return (
    <main className="container main">
      <Search
        searchArray={searchedTags}
        onClear={handleClear}
        onRemoveTag={handleRemoveTag}
      />
      {searchedJobs.map((job) => (
        <Job job={job} key={job.id} onAddTag={handleAddSearchTag} />
      ))}
    </main>
  );
}

function Search({ searchArray, onClear, onRemoveTag }) {
  if (searchArray.length) {
    return (
      <div className="search-bar">
        <ul>
          {searchArray.map((tag) => (
            <Tag tag={tag} key={tag} onRemoveTag={onRemoveTag} />
          ))}
        </ul>
        <div onClick={onClear} className="clear">
          Clear
        </div>
      </div>
    );
  } else {
    return;
  }
}

function Tag({ tag, onRemoveTag }) {
  return (
    <li className="tag">
      <span>{tag}</span>
      <img
        src="/images/icon-remove.svg"
        alt="remove"
        className="remove"
        onClick={() => onRemoveTag(tag)}
      />
    </li>
  );
}

function Job({ job, onAddTag }) {
  return (
    <div className={`job ${job.featured ? "job-featured" : ""} `}>
      <img className="job-logo" src={job.logo} alt="logo" />
      <Details job={job} />
      <Tags
        role={job.role}
        level={job.level}
        lang={job.languages}
        tools={job.tools}
        onAddTag={onAddTag}
      />
    </div>
  );
}

function Details({ job }) {
  return (
    <div className="details">
      <div>
        <span className="company">{job.company}</span>
        {job.new && <span className="new">NEW!</span>}
        {job.featured && <span className="featured">FEATURED</span>}
      </div>

      <div className="position">{job.position}</div>
      <div>
        <span>{job.postedAt}</span>
        <span>&middot;</span>
        <span>{job.contract}</span>
        <span>&middot;</span>
        <span>{job.location}</span>
      </div>
    </div>
  );
}

function Tags({ role, level, lang, tools, onAddTag }) {
  const total = lang.concat(...tools);

  return (
    <ul className="tags">
      <li onClick={() => onAddTag(role)}>{role}</li>
      <li onClick={() => onAddTag(level)}>{level}</li>
      {total.map((t) => (
        <li
          onClick={() => {
            onAddTag(t);
          }}
        >
          {t}
        </li>
      ))}
    </ul>
  );
}
