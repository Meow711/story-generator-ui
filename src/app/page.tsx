"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronRight } from "lucide-react";

interface IStepOneProps {
  onNext: () => void;
  setPremise: (v: string) => void;
}

const StepOne = ({ onNext, setPremise }: IStepOneProps) => (
  <div className="space-y-4">
    <Textarea
      placeholder="Enter your story premise here..."
      onChange={(e) => setPremise(e.target.value)}
      rows={5}
      aria-label="Story premise input"
    />
    <Button onClick={onNext}>Generate</Button>
  </div>
);

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

// Step 2: Editable Nested JSON
interface IStepTowProps {
  onNext: (data?: any) => void;
}

const StepTwo = ({ onNext }: IStepTowProps) => {
  const [data, setData] = useState({
    character: {
      name: "John Doe",
      age: "30",
      traits: ["brave", "intelligent"],
    },
    setting: {
      place: "New York City",
      time: "Present day",
    },
    plot: {
      conflict: "Man vs. Society",
      resolution: "Pending",
    },
  });

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
  const [premise, setPremise] = useState("");
  const [storyData, setStoryData] = useState({});
  const [story, setStory] = useState("");

  const handleNext = (data?: any) => {
    if (currentStep === 1) {
      // Here you would typically call an API to generate the initial story structure
      setStoryData({
        character: { name: "John Doe", age: "30" },
        setting: { place: "New York City" },
        plot: { conflict: "Man vs. Society" },
      });
    } else if (currentStep === 2) {
      setStoryData(data);
      // Here you would call an API to generate the story based on the edited data
      setStory(
        `Once upon a time, ${data.character.name}, aged ${data.character.age}, found themselves in ${data.setting.place}. They faced a ${data.plot.conflict} conflict...`
      );
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
          <StepOne onNext={handleNext} setPremise={setPremise} />
        )}
        {currentStep === 2 && <StepTwo onNext={handleNext} />}
        {currentStep === 3 && <StepThree story={story} />}
      </div>
    </div>
  );
}
