import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getStoriesFeed, getMyStories } from "../lib/api";
import StoryCircle, { AddStoryButton } from "./StoryCircle";
import StoryViewer from "./StoryViewer";

const StoriesBar = () => {
  const [selectedStoryGroup, setSelectedStoryGroup] = useState(null);
  const [showViewer, setShowViewer] = useState(false);

  const { data: storiesFeed = [], isLoading: loadingFeed } = useQuery({
    queryKey: ["stories", "feed"],
    queryFn: getStoriesFeed,
  });

  const { data: myStories = [], isLoading: loadingMyStories } = useQuery({
    queryKey: ["stories", "my-stories"],
    queryFn: getMyStories,
  });

  const handleStoryClick = (storyGroup) => {
    setSelectedStoryGroup(storyGroup);
    setShowViewer(true);
  };

  const handleCloseViewer = () => {
    setShowViewer(false);
    setSelectedStoryGroup(null);
  };

  if (loadingFeed || loadingMyStories) {
    return (
      <div className="bg-base-100 rounded-2xl p-4 mb-6">
        <div className="flex gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-base-200 animate-pulse" />
              <div className="w-12 h-3 bg-base-200 rounded mt-2 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const hasStories = storiesFeed.length > 0 || myStories.length > 0;

  if (!hasStories) {
    return (
      <div className="bg-base-100 rounded-2xl p-6 mb-6 text-center">
        <h3 className="text-lg font-semibold mb-2">No Stories Yet</h3>
        <p className="text-base-content opacity-70 mb-4">
          Be the first to share what's on your mind!
        </p>
        <AddStoryButton />
      </div>
    );
  }

  return (
    <>
      <div className="bg-base-100 rounded-2xl p-4 mb-6 shadow-sm border border-base-300">
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {/* Add story button */}
          <AddStoryButton />
          
          {/* Friends' stories */}
          {storiesFeed.map((storyGroup, index) => (
            <StoryCircle
              key={storyGroup.author._id}
              story={storyGroup}
              onClick={() => handleStoryClick(storyGroup)}
            />
          ))}
          
          {/* Own stories */}
          {myStories.length > 0 && (
            <StoryCircle
              story={{
                author: { fullName: "You", profilePic: "" },
                stories: myStories.map(story => ({ ...story, isOwn: true })),
                hasUnviewed: false,
              }}
              onClick={() => handleStoryClick({
                author: { fullName: "You", profilePic: "" },
                stories: myStories.map(story => ({ ...story, isOwn: true })),
              })}
            />
          )}
        </div>
      </div>

      {/* Story Viewer Modal */}
      {showViewer && selectedStoryGroup && (
        <StoryViewer
          stories={selectedStoryGroup.stories}
          onClose={handleCloseViewer}
        />
      )}
    </>
  );
};

export default StoriesBar;
