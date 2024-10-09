"use client";

import { useState, Fragment } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ChevronDown, ChevronRight } from "lucide-react";

const AlertErrorBox = ({ error }: { error: string }) => {
  return error ? (
    <Alert variant="destructive">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  ) : <></>
}

interface IStepOneProps {
  onNext: (v?: any) => void;
  premise: string;
  setPremise: (v: string) => void;
}

const StepOne = ({ onNext, premise, setPremise }: IStepOneProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerateClick = async () => {
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
      console.log("==data:", data)
      // setPwdResult(data.result);
      onNext(data);
    } catch (err) {
      setError("An error occurred while executing the premise command");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Enter your story premise here..."
        onChange={(e) => setPremise(e.target.value)}
        rows={5}
        aria-label="Story premise input"
        value={premise}
      />
      <Button onClick={handleGenerateClick} disabled={isLoading}>
        {isLoading ? "Executing..." : "Generate"}
      </Button>
      <AlertErrorBox error={error} />
    </div>
  );
};

interface IStepPremiseDisplayProps {
  title: string;
  premise: string;
  setTitle: (v: string) => void;
  setNewPremise: (v: string) => void;
  onNext: (v: any) => void;
}
const StepPremiseDisplay = ({ title, premise, setTitle, setNewPremise, onNext }: IStepPremiseDisplayProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerateClick = async () => {
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
      console.log("==data:", data)
      onNext(data);
    } catch (err) {
      setError("An error occurred while executing the premise command");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <h5>TITLE</h5>
      <Input
        placeholder="Enter your story title..."
        onChange={(e) => setTitle(e.target.value)}
        aria-label="Story title input"
        value={title}
      />
      <h5>PREMISE</h5>
      <Textarea
        placeholder="Enter your story premise here..."
        onChange={(e) => setNewPremise(e.target.value)}
        rows={5}
        aria-label="Story premise input"
        value={premise}
      />
      <Button onClick={handleGenerateClick} disabled={isLoading}>
        {isLoading ? 'Executing...' : 'Generate'}
      </Button>
      <AlertErrorBox error={error} />
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
}

const CharacterProfile = ({ name, bio }: CharacterProfileProps) => {
  return (
    <div className="w-full bg-background border border-border rounded-lg shadow-sm overflow-hidden">
      <div className="p-3">
        <h2 className="text-lg font-semibold text-foreground mb-1">{name}</h2>
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
  onNext: (data?: any) => void;
}

const StepPlanDisplay = ({ onNext, story }: IStepPlanDisplayProps) => {
  const [data, setData] = useState(story);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerateClick = async () => {
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
      console.log("==data:", data.story)
      // setPwdResult(data.result);
      onNext(data?.story);
    } catch (err) {
      setError("An error occurred while executing the premise command");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {data?.entities?.map((et: EntityType) => <div className="py-1"><CharacterProfile name={et.name} bio={et.description} /></div>)}
      <JSONViewer data={data} />
      <Button onClick={handleGenerateClick} disabled={isLoading}>
        {isLoading ? "Executing..." : "Continue"}
      </Button>
      <AlertErrorBox error={error} />
    </div>
  );
};

interface IStepStoryDisolayProps {
  title: string;
  story: string;
}
const StepStoryDisplay = ({ title, story }: IStepStoryDisolayProps) => {
  const lines = story.split('\n')
  return (
    <div className="prose">
      <h2>{title}</h2>
      <div className="w-full max-w-2xl mx-auto bg-background border border-border rounded-lg shadow-sm p-4">
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
  const [storyData, setStoryData] = useState({});
  const [story, setStory] = useState("");
  const [title, setTitle] = useState("");
  const [newPremise, setNewPremise] = useState("");

  const handleNext = (data?: any) => {
    if (currentStep === 1) {
      setTitle(data?.title);
      setNewPremise(data?.premise);
    } else if (currentStep === 2) {
      setStoryData(data);
    } else if (currentStep === 3) {
      setStory(data);
    }
    setCurrentStep(currentStep + 1);
  };

  return (
    <div className="container mx-auto p-4 space-y-8 w-full max-w-2xl mx-auto" >
      <Progress
        value={(currentStep / 4) * 100}
        className="w-full"
        aria-label={`Step ${currentStep} of 3`}
      />

      <div className="space-y-4">
        {currentStep === 1 && (
          <StepOne onNext={handleNext} setPremise={setPremise} premise={premise} />
        )}
        {currentStep === 2 && <StepPremiseDisplay onNext={handleNext} title={title} setTitle={setTitle} premise={newPremise} setNewPremise={setNewPremise} />}
        {currentStep === 3 && <StepPlanDisplay onNext={handleNext} story={storyData} />}
        {currentStep === 4 && <StepStoryDisplay story={story} title={title} />}
      </div>
    </div>
  );
}
