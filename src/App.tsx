import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button"
import {Skeleton} from "@/components/ui/skeleton";
import axios from "axios";

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

    useEffect(() => {
        axios
            .get<number[]>("https://hacker-news.firebaseio.com/v0/showstories.json?print=pretty")
            .then((response) => {
                const storyIds = response.data.slice(0, 10);
                setStories(storyIds.map((id) => ({id, data: null})));
                const storyDetailsPromises = storyIds.map(async (id) => {
                    const response = await axios
                        .get<Story>(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`);
                    setStories((prevStories) => prevStories.map((story) => story.id === id ? {
                                id,
                                data: response.data
                            } : story
                        )
                    );
                });
                return Promise.all(storyDetailsPromises);
            })
            .catch((error) => console.error(error));
    }, []);

    return (
        <div className="bg-background text-foreground">
            <div className="flex min-h-screen w-full flex-col">
                <div
                    className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
                    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                        Explore
                    </h1>
                    <div>
                        {stories.map((story) => (
                            <div key={story.id}>
                                {story.data ? (
                                    <Button variant="link">
                                        <a href={story.data.url} target="_blank" rel="noopener noreferrer">
                                            {story.data.title.replace(/^Show HN:\s*/, "")}
                                        </a>
                                    </Button>
                                ) : (
                                    <Skeleton className="h-6 w-full mb-4"/>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="text-muted-foreground text-xs">
                        Content from <a href="https://news.ycombinator.com">Hacker News</a>
                    </div>
                </div>
            </div>
        </div>
    )
        ;
}

export default App;
