import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    axios
      .get(
        "https://hacker-news.firebaseio.com/v0/showstories.json?print=pretty"
      )
      .then((response) => {
        const storyIds = response.data.slice(0, 10);
        const storyDetailsPromises = storyIds.map((id) =>
          axios.get(
            `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`
          )
        );
        return Promise.all(storyDetailsPromises);
      })
      .then((responses) => {
        const storyDetails = responses.map((response) => response.data);
        setStories(storyDetails);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <>
      <div className="container">
        <h1 className="font-bold">Cool New Stuff from HN</h1>
        <ul>
          {stories.map((story) => (
            <li key={story.id}>
              <a href={story.url} target="_blank" rel="noopener noreferrer">
                {story.title.replace(/^Show HN:\s*/, "")}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
