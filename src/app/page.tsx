"use client";

import { useState, Fragment, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
// import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import ImageLoader from "@/components/story/image";
import { useChatContext, ChatProvider, IUser } from "@/components/chat/context";
import ChatDialog from "@/components/chat/chat";
import CharacterProfile from "@/components/story/character";
import { JSONTree } from 'react-json-tree';


const AlertErrorBox = ({ error }: { error: string }) => {
  return error ? (
    <Alert variant="destructive">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  ) : <></>
}

interface IStepOneProps {
  premise: string;
  setPremise: (v: string) => void;
}

const StepOne = ({ premise, setPremise }: IStepOneProps) => {
  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Enter your story premise here..."
        onChange={(e) => setPremise(e.target.value)}
        rows={5}
        aria-label="Story premise input"
        value={premise}
      />
    </div>
  );
};

interface IStepPremiseDisplayProps {
  title: string;
  premise: string;
  setTitle: (v: string) => void;
  setNewPremise: (v: string) => void;
}
const StepPremiseDisplay = ({ title, premise, setTitle, setNewPremise }: IStepPremiseDisplayProps) => {
  return (
    <div className="space-y-4">
      <h5 className="font-bold">TITLE</h5>
      {/* <Input
        placeholder="Enter your story title..."
        onChange={(e) => setTitle(e.target.value)}
        aria-label="Story title input"
        value={title}
      /> */}
      <div className="w-full bg-background border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="p-3">
          <p className="text-sm">{title}</p>
        </div>
      </div>
      <h5>PREMISE</h5>
      {/* <Textarea
        placeholder="Enter your story premise here..."
        onChange={(e) => setNewPremise(e.target.value)}
        rows={5}
        aria-label="Story premise input"
        value={premise}
      /> */}
      <div className="w-full bg-background border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="p-3">
          <p className="text-sm">{premise}</p>
        </div>
      </div>
      <h5>COVER</h5>
      <ImageLoader prompt={premise} alt="" />
    </div>
  )
}

interface IStepPlanDisplayProps {
  story: any;
}

const StepPlanDisplay = ({ story }: IStepPlanDisplayProps) => {
  const { openChat, setUsers, users } = useChatContext();

  const handleChat = (user: IUser) => {
    openChat(user);
  }

  const requestGenerateImage = async (et: IUser) => {
    try {
      const response = await fetch(`/api/generate_image`, {
        method: "POST",
        body: JSON.stringify({ prompt: et.description })
      })
      if (!response.ok) {
        throw new Error(`Failed to generate entity ${et.name}`);
      }
      const data = await response.json();
      setUsers(users.map(u => {
        if (u.name === et.name) {
          return { ...u, avatar: data.result }
        }
        return { ...u }
      }))
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (story?.entities) {
      story.entities.forEach((et: IUser) => {
        requestGenerateImage(et)
      })
      setUsers(story.entities);
    }
  }, [story])
  return (
    <div className="space-y-4 container mx-auto">
      <h5>ENTITIES</h5>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {users.map((et: IUser, index: number) => <CharacterProfile key={index} name={et.name} bio={et.description} avatar={et.avatar} onChatClick={handleChat} />)}
      </div>
      <h5>DATA</h5>
      <JSONTree data={story} />
      <ChatDialog />
    </div>
  );
};

interface IStepStoryDisolayProps {
  story: string;
}
const StepStoryDisplay = ({ story }: IStepStoryDisolayProps) => {
  const lines = story.split('\n')
  return (
    <div className="prose space-y-4">
      <h5>FULL STORY</h5>
      <div className="w-full max-w-2xl mx-auto bg-background border border-border rounded-lg shadow-sm p-4 text-sm">
        {lines.map((line, index) => (
          <Fragment key={index}>
            {line}
            {index < lines.length - 1 && <br />}
          </Fragment>
        ))}
      </div>
    </div>
  )
};

// Main component
export default function StoryGenerator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [premise, setPremise] = useState("A young man named Alex wakes up one morning to find that he has the ability to read minds.");
  const [storyData, setStoryData] = useState();
  const [story, setStory] = useState("");
  const [title, setTitle] = useState("");
  const [newPremise, setNewPremise] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };
  const handleRequestPremise = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/premise", {
        method: "POST", body: JSON.stringify({
          premise,
        })
      });
      if (!response.ok) {
        throw new Error("Failed to execute premise command");
      }
      const data = await response.json();
      console.log("==1==data:", data)
      setTitle(data?.title);
      setNewPremise(data?.premise);
      setCurrentStep(currentStep + 1);
    } catch (err) {
      setError("An error occurred while executing the premise command");
      console.error(err);
    } finally {
      setIsLoading(false);
    }

  }
  const handleRequestPlan = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/plan", {
        method: "POST", body: JSON.stringify({
          title,
          premise,
        })
      });
      if (!response.ok) {
        throw new Error("Failed to execute plan command");
      }
      const data = await response.json();
      console.log("==2==data:", data)
      setStoryData(data);
      handleNext();
    } catch (err) {
      setError("An error occurred while executing the premise command");
      console.error(err);
    } finally {
      setIsLoading(false);
    }

  }
  const handleRequestStory = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/story", {
        method: "POST"
      });
      if (!response.ok) {
        throw new Error("Failed to execute premise command");
      }
      const data = await response.json();
      console.log("==3==data:", data.story)
      setStory(data?.story);
      handleNext();
    } catch (err) {
      setError("An error occurred while executing the premise command");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleClick = () => {
    switch (currentStep) {
      case 1:
        handleRequestPremise();
        break;
      case 2:
        handleRequestPlan();
        break;
      case 3:
        handleRequestStory();
        break;
      case 4:
        setCurrentStep(1);
        setStory("")
        setStoryData(undefined);
        setTitle("");
        setPremise("");
        setNewPremise("");
        break;
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-8 w-full max-w-2xl mx-auto" >
      <Progress
        value={(currentStep / 4) * 100}
        className="w-full"
        aria-label={`Step ${currentStep} of 4`}
      />
      <div className="space-y-4">
        <StepOne setPremise={setPremise} premise={premise} />
        {title && newPremise && 2 && <StepPremiseDisplay title={title} setTitle={setTitle} premise={newPremise} setNewPremise={setNewPremise} />}
        {storyData && <ChatProvider><StepPlanDisplay story={storyData} /></ChatProvider>}
        {story && <StepStoryDisplay story={story} />}
        <div className="text-center">
          <Button onClick={handleClick} disabled={isLoading || (currentStep === 1 && !premise)} >
            {isLoading ? "Executing..." : currentStep === 1 ? 'Start' : currentStep === 4 ? 'Restart' : 'Continue'}
          </Button>
        </div>
        <AlertErrorBox error={error} />
      </div>
    </div>
  );
}
