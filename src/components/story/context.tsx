'use client'

import React, { createContext, useContext, useReducer, ReactNode } from 'react'

type OutlineNode = {
    id: string
    text: string
    scene: string
    entities: string[]
    children: OutlineNode[]
}

type PlanType = {
    premise: { title: string; premise: string };
    setting: string;
    entities: {
        name: string;
        description: string;
    }[];
    outline: OutlineNode
}

interface IStory {
    currentStep: number;
    userPremise: string;
    title: string;
    premise: string;
    fullStory: string;
    plan?: PlanType;
}

export enum ACTIONS {
    ADD_STEP = "add_step",
    REVERT_STEP = 'revert_step',
    SET_USER_PREMISE = 'set_user_premise',
    SET_PREMISE = "set_premise",
    SET_PLAN = "set_plan",
    SET_FULL_STORY = "set_full_story",
}

interface IAction {
    type: ACTIONS;
    payload?: any;
}


const INIT_STATE: IStory = {
    currentStep: 1,
    userPremise: "",
    title: "",
    premise: "",
    fullStory: "",
}


const reducer = (state: IStory, action: IAction): IStory => {
    switch (action.type) {
        case ACTIONS.ADD_STEP:
            return { ...state, currentStep: state.currentStep + 1 };
        case ACTIONS.REVERT_STEP:
            return { ...INIT_STATE };
        case ACTIONS.SET_USER_PREMISE:
            return { ...state, userPremise: action.payload }
        case ACTIONS.SET_PREMISE:
            return { ...state, title: action.payload.title, premise: action.payload.premise };
        case ACTIONS.SET_PLAN:
            return { ...state, plan: action.payload };
        case ACTIONS.SET_FULL_STORY:
            return { ...state, fullStory: action.payload };
        default:
            throw new Error(`Unknown type: ${action.type}`);
    }
}

const StoryContext = createContext<{ state: IStory; dispatch: React.Dispatch<IAction>; }>({
    state: INIT_STATE,
    dispatch: () => null,
})

export function StoryProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(reducer, INIT_STATE);
    return (
        <StoryContext.Provider value={{ state, dispatch }}>
            {children}
        </StoryContext.Provider>
    )
}

export function useStoryContext() {
    const context = useContext(StoryContext)
    if (context === undefined) {
        throw new Error('useChatContext must be used within a ChatProvider')
    }
    return context
}