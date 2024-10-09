"use client";

import { useState, Fragment } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
// import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ChevronDown, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ImageLoader from "@/components/story/image";

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
      <h5>TITLE</h5>
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

interface JSONViewerProps {
  data: any
  level?: number
}

const JSONViewer = ({ data, level = 0 }: JSONViewerProps) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const renderValue = (value: any): JSX.Element => {
    if (typeof value === 'string') {
      return <span className="text-green-600">"{value}"</span>
    } else if (typeof value === 'number') {
      return <span className="text-blue-600">{value}</span>
    } else if (typeof value === 'boolean') {
      return <span className="text-purple-600">{value.toString()}</span>
    } else if (value === null) {
      return <span className="text-gray-500">null</span>
    } else if (Array.isArray(value) || typeof value === 'object') {
      return <JSONViewer data={value} level={level + 1} />
    }
    return <span>{String(value)}</span>
  }

  if (Array.isArray(data)) {
    return (
      <div className="ml-4">
        <span className="cursor-pointer" onClick={toggleExpand} aria-expanded={isExpanded}>
          {isExpanded ? <ChevronDown className="inline" size={16} /> : <ChevronRight className="inline" size={16} />}
          Array[{data.length}]
        </span>
        {isExpanded && (
          <div className="ml-4">
            {data.map((item, index) => (
              <div key={index} className="my-1">
                <span className="text-gray-500">{index}: </span>
                {renderValue(item)}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  } else if (typeof data === 'object' && data !== null) {
    return (
      <div className="ml-4">
        <span className="cursor-pointer" onClick={toggleExpand} aria-expanded={isExpanded}>
          {isExpanded ? <ChevronDown className="inline" size={16} /> : <ChevronRight className="inline" size={16} />}
          Object
        </span>
        {isExpanded && (
          <div className="ml-4">
            {Object.entries(data).map(([key, value]) => (
              <div key={key} className="my-1">
                <span className="text-gray-500">{key}: </span>
                {renderValue(value)}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return <span>{renderValue(data)}</span>
}

interface CharacterProfileProps {
  name: string
  bio: string
  avatarUrl?: string;
  onChatClick?: () => void;
}

const CharacterProfile = ({ avatarUrl, name, bio, onChatClick }: CharacterProfileProps) => {
  return (
    // <div className="w-full bg-background border border-border rounded-lg shadow-sm overflow-hidden">
    //   <div className="p-3">
    //     <h2 className="text-lg font-semibold text-foreground mb-1">{name}</h2>
    //     <p className="text-sm text-muted-foreground">{bio}</p>
    //   </div>
    // </div>
    <div className="flex items-start space-x-4 p-4 bg-background border border-border rounded-lg shadow-sm">
      <Avatar className="w-16 h-16">
        <AvatarImage src={avatarUrl} alt={name} />
        <AvatarFallback>{name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-foreground">{name}</h2>
          <Button size="sm" onClick={onChatClick}>Chat</Button>
        </div>
        <p className="text-sm text-muted-foreground">{bio}</p>
      </div>
    </div>
  )
}

type EntityType = {
  name: string;
  description: string;
}

interface IStepPlanDisplayProps {
  story: any;
}

const StepPlanDisplay = ({ story }: IStepPlanDisplayProps) => {
  return (
    <div className="space-y-4">
      <h5>ENTITIES</h5>
      {story?.entities?.map((et: EntityType) => <div className="py-1" key={et.name}><CharacterProfile name={et.name} bio={et.description} /></div>)}
      <h5>DATA</h5>
      <JSONViewer data={story} />
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
        {storyData && <StepPlanDisplay story={storyData} />}
        {story && <StepStoryDisplay story={story} />}
        <div className="text-center">
          <Button onClick={handleClick} disabled={isLoading} >
            {isLoading ? "Executing..." : currentStep === 1 ? 'Start' : currentStep === 4 ? 'Restart' : 'Continue'}
          </Button>
        </div>
        <AlertErrorBox error={error} />
      </div>
    </div>
  );
}
