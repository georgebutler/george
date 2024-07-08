import { useEffect, useState } from "react";
import axios from "axios";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Skeleton } from "@/components/ui/skeleton";

interface Story {
  id: number;
  title: string;
  url: string;
  text: string;
}

interface StorySummary {
  id: number;
  data: Story | null;
}

function App() {
  const [stories, setStories] = useState<StorySummary[]>([]);
  const [, setLoadingIds] = useState<number[]>([]);

  useEffect(() => {
    axios
      .get<number[]>("https://hacker-news.firebaseio.com/v0/showstories.json?print=pretty")
      .then((response) => {
        const storyIds = response.data.slice(0, 10);
        setStories(storyIds.map((id) => ({ id, data: null })));
        const storyDetailsPromises = storyIds.map((id) => {
          setLoadingIds((prev) => [...prev, id]);
          return axios
            .get<Story>(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`)
            .then((response) => {
              setStories((prevStories) =>
                prevStories.map((story) =>
                  story.id === id ? { id, data: response.data } : story
                )
              );
              setLoadingIds((prev) => prev.filter((loadingId) => loadingId !== id));
            });
        });
        return Promise.all(storyDetailsPromises);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="container bg-background text-foreground">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Cool New Stuff from HN</h1>
      <ul>
        {stories.map((story) => (
          <li key={story.id}>
            {story.data ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <a href={story.data.url} target="_blank" rel="noopener noreferrer">
                      {story.data.title.replace(/^Show HN:\s*/, "")}
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="truncate break-words">{story.data.text}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <Skeleton className="h-6 w-full mb-4" />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
