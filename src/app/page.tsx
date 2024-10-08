"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronRight } from "lucide-react";

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
    </div>
  )
}

interface IEditorProps {
  onUpdate: (key: any, value: string | number) => void;
  data: any;
  path?: string[];
}

// Recursive component for nested JSON editing
const NestedJsonEditor = ({ data, onUpdate, path = [] }: IEditorProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleUpdate = (key: any, value: string | number) => {
    onUpdate([...path, key], value);
  };

  if (typeof data !== "object" || data === null) {
    return (
      <Input
        value={data}
        onChange={(e) => onUpdate(path, e.target.value)}
        className="w-full"
        aria-label={`Value for ${path.join(".")}`}
      />
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          aria-label={`Toggle ${path.join(".")} expansion`}
        >
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </Button>
        {path.length > 0 && (
          <span className="font-medium">{path[path.length - 1]}:</span>
        )}
      </div>
      {isExpanded && (
        <div className="pl-4 border-l border-gray-200">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="flex items-center space-x-2 mb-2">
              <span className="w-1/3 font-medium">{key}:</span>
              <NestedJsonEditor
                data={value}
                onUpdate={handleUpdate}
                path={[...path, key]}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface IStepPlanDisplayProps {
  story: any;
  onNext: (data?: any) => void;
}

const StepPlanDisplay = ({ onNext, story }: IStepPlanDisplayProps) => {
  const [data, setData] = useState(story);

  const handleUpdate = (path: any, value: string | number) => {
    const newData = JSON.parse(JSON.stringify(data));
    let current = newData;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    setData(newData);
  };

  return (
    <div className="space-y-4">
      <NestedJsonEditor data={data} onUpdate={handleUpdate} />
      <Button onClick={() => onNext(data)}>Continue</Button>
    </div>
  );
};

// Step 3: Story Display
interface IStepThreeProps {
  story: string;
}
const StepThree = ({ story }: IStepThreeProps) => (
  <div className="prose">
    <h2>Generated Story</h2>
    <p>{story}</p>
  </div>
);

// Main component
export default function StoryGenerator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [premise, setPremise] = useState("A young man named Alex wakes up one morning to find that he has the ability to read minds.");
  const [storyData, setStoryData] = useState({});
  const [story, setStory] = useState({});
  const [title, setTitle] = useState("");
  const [newPremise, setNewPremise] = useState("");

  const handleNext = (data?: any) => {
    if (currentStep === 1) {
      setTitle(data?.title);
      setNewPremise(data?.premise);
    } else if (currentStep === 2) {
      setStory(data);
    }
    setCurrentStep(currentStep + 1);
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <Progress
        value={(currentStep / 3) * 100}
        className="w-full"
        aria-label={`Step ${currentStep} of 3`}
      />

      <div className="space-y-4">
        {currentStep === 1 && (
          <StepOne onNext={handleNext} setPremise={setPremise} premise={premise} />
        )}
        {currentStep === 2 && <StepPremiseDisplay onNext={handleNext} title={title} setTitle={setTitle} premise={newPremise} setNewPremise={setNewPremise} />}
        {currentStep === 3 && <StepPlanDisplay onNext={handleNext} story={story} />}
        {/* {currentStep === 3 && <StepThree story={story} />} */}
      </div>
    </div>
  );
}
