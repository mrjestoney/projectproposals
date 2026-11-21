"use client";

import { createContext, useContext } from "react";

/** Everything the 3D parts need to know about the UI: mode, selection, explode, power, build and fix state. */
export const SceneCtx = createContext(null);
export const useScene = () => useContext(SceneCtx);
