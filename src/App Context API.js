import { useEffect } from "react";
import { useJobs, JobProvider } from "./JobContext";
export default function App() {
  return (
    <JobProvider>
      <Header />
      <Main />
    </JobProvider>
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

function Main() {
  const { setJobs, searchedJobs } = useJobs();

  useEffect(
    function () {
      async function fetchData() {
        try {
          const res = await fetch("http://localhost:9000/jobs");
          if (!res.ok) {
            throw new Error("Something is wrong !");
          }
          const data = await res.json();
          setJobs(data);
        } catch (err) {
          console.log(err);
        }
      }
      fetchData();
    },
    [setJobs]
  );

  return (
    <main className="container main">
      <Search />
      {searchedJobs.map((job) => (
        <Job job={job} key={job.id} />
      ))}
    </main>
  );
}

function Search() {
  const { searchArray, onClear } = useJobs();

  if (searchArray.length) {
    return (
      <div className="search-bar">
        <ul>
          {searchArray.map((tag) => (
            <Tag tag={tag} key={tag} />
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

function Tag({ tag }) {
  const { onRemoveTag } = useJobs();
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

function Job({ job }) {
  return (
    <div className={`job ${job.featured ? "job-featured" : ""} `}>
      <img className="job-logo" src={job.logo} alt="logo" />
      <Details job={job} />
      <Tags job={job} />
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

function Tags({ job }) {
  const total = job.languages.concat(...job.tools);
  const { onAddTag } = useJobs();
  return (
    <ul className="tags">
      <li onClick={() => onAddTag(job.role)}>{job.role}</li>
      <li onClick={() => onAddTag(job.level)}>{job.level}</li>
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
